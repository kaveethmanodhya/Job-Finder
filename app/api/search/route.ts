import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import axios from 'axios';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';
import { LRUCache } from 'lru-cache';

// Rate Limiter: 20 requests per minute per IP
const rateLimit = new LRUCache({
  max: 500, // store up to 500 IPs
  ttl: 60 * 1000, // 1 minute
});

// Zod Validation Schema
const searchSchema = z.object({
  q: z.string().max(100, "Search query too long").optional(),
  location: z.string().max(100, "Location query too long").optional(),
  category: z.string().max(50, "Category too long").optional(),
  country: z.string().max(50, "Country too long").optional(),
  exp: z.string().max(50, "Experience level too long").optional(),
});

export async function GET(request: Request) {
  // ── 0. Rate Limiting ───────────────────────────────────────────────────────
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const tokenCount = (rateLimit.get(ip) as number) || 0;

  if (tokenCount >= 20) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  }
  rateLimit.set(ip, tokenCount + 1);

  // ── 1. Input Validation & Parameter Extraction ─────────────────────────────
  const { searchParams } = new URL(request.url);
  const parseResult = searchSchema.safeParse({
    q: searchParams.get('q') || undefined,
    location: searchParams.get('location') || undefined,
    category: searchParams.get('category') || undefined,
    country: searchParams.get('country') || undefined,
    exp: searchParams.get('exp') || undefined,
  });

  if (!parseResult.success) {
    return NextResponse.json({ error: 'Invalid search parameters', details: parseResult.error.format() }, { status: 400 });
  }

  const query = parseResult.data.q || '';
  const location = parseResult.data.location || '';
  const category = parseResult.data.category || '';
  const country = parseResult.data.country || '';
  const exp = parseResult.data.exp || '';

  // If literally nothing is provided, return empty array immediately
  if (!query && !location && !category && !country && !exp) {
    return NextResponse.json({ candidates: [] });
  }

  // ── 2. Internal PostgreSQL candidates (with Neon cold-start retry) ───────────
  let internalCandidates: any[] = [];
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const where: any = {};
      const AND: any[] = [];

      // Combine text query logic
      const combinedQuery = [query, location].filter(Boolean).join(' ');
      if (combinedQuery) {
        const terms = combinedQuery.split(' ').filter(Boolean);
        for (const term of terms) {
          AND.push({
            OR: [
              { fullName: { contains: term, mode: 'insensitive' } },
              { jobTitle: { contains: term, mode: 'insensitive' } },
              { headline: { contains: term, mode: 'insensitive' } },
              { location: { contains: term, mode: 'insensitive' } },
              { country: { contains: term, mode: 'insensitive' } },
              { category: { contains: term, mode: 'insensitive' } }
            ]
          });
        }
      }

      // Add exact filter matching if valid filters are selected
      if (category && category !== 'All') {
        AND.push({ category: category });
      }
      if (country && country !== 'All Countries') {
        AND.push({ country: country });
      }
      if (exp && exp !== 'All') {
        AND.push({ experienceLevel: exp });
      }

      if (AND.length > 0) {
        where.AND = AND;
      }

      const rows = await prisma.candidate.findMany({ 
        where, 
        take: 20,
        orderBy: { createdAt: 'desc' }
      });
      
      internalCandidates = rows.map((c) => ({
        id: c.id,
        fullName: c.fullName,
        headline: c.headline || c.jobTitle || 'Professional',
        bio: c.bio || '',
        skills: c.skills || [],
        location: c.country ? `${c.location ? c.location + ', ' : ''}${c.country}` : (c.location || 'Unknown'),
        sourceUrl: c.profileUrl || c.sourceUrl || '#',
        isExternal: false,
        // UI uses isExternal to toggle badges, but we could explicitly pass isVerified: true for internals
      }));
      
      break; // success — exit retry loop
    } catch (err: any) {
      const isRetryable = err?.message?.includes("Can't reach") || err?.message?.includes('connection pool');
      if (isRetryable && attempt < 3) {
        console.warn(`[Search] DB cold-start (attempt ${attempt}/3), retrying in 1.5s...`);
        await sleep(1500);
      } else {
        console.error('[Search] Prisma error (giving up):', err?.message);
        break; // break loop on non-retryable error
      }
    }
  }

  // ── 3. External LinkedIn profiles via Serper.dev Google Search API ──────────
  let externalCandidates: any[] = [];
  const serperKey = process.env.SERPER_API_KEY;

  if (serperKey) {
    try {
      // Build a hyper-specific external search string
      const scraperQueryParts = [];
      if (query) scraperQueryParts.push(query);
      if (category && category !== 'All') scraperQueryParts.push(category);
      if (exp && exp !== 'All') scraperQueryParts.push(exp);
      if (country && country !== 'All Countries') scraperQueryParts.push(country);
      else if (location) scraperQueryParts.push(location);

      const scraperSearchStr = scraperQueryParts.join(' ').trim();
      // If we don't have enough to make a good query, use a generic fallback (though unlikely to happen)
      const serperQ = scraperSearchStr ? `${scraperSearchStr} site:linkedin.com/in/` : `site:linkedin.com/in/`;

      const { data } = await axios.post(
        'https://google.serper.dev/search',
        {
          q: serperQ,
          num: 12, // slightly higher to ensure we get a good amount after filtering
          gl: 'us',
          hl: 'en',
        },
        {
          headers: {
            'X-API-KEY': serperKey,
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }
      );

      const results: any[] = data?.organic ?? [];
      results.forEach((result: any, i: number) => {
        const href: string = result.link ?? '';
        // Strict domain checking
        if (!href.includes('linkedin.com/in/') || href.includes('/dir/')) return;

        // Parse "Name - Headline | LinkedIn" title format securely
        const rawTitle: string = result.title ?? '';
        const cleanTitle = rawTitle
          .replace(/(\s*\|\s*LinkedIn)/gi, '')
          .replace(/(\s*-\s*LinkedIn)/gi, '')
          .trim();
        
        const titleParts = cleanTitle.split(' - ');
        const fullName = titleParts[0]?.trim() || 'External Candidate';
        const headline = titleParts.slice(1).join(' - ').trim() || 'LinkedIn Profile';
        const snippet: string = result.snippet ?? '';

        // Formulate location display prioritizing country
        const locationDisplay = country && country !== 'All Countries' 
          ? country 
          : (location || 'Public Signal');

        externalCandidates.push({
          id: `ext_${i}_${Date.now()}`,
          fullName: DOMPurify.sanitize(fullName),
          headline: DOMPurify.sanitize(headline),
          bio: DOMPurify.sanitize(snippet || 'View their full profile on LinkedIn.'),
          skills: category && category !== 'All' ? [category] : [],
          location: DOMPurify.sanitize(locationDisplay),
          sourceUrl: href,
          isExternal: true,
        });
      });

      console.log(`[Search] Serper returned ${externalCandidates.length} LinkedIn profiles for: "${serperQ}"`);
    } catch (error: any) {
      console.error('[Search] Serper API error:', error.message);
    }
  } else {
    console.warn('[Search] SERPER_API_KEY not set — skipping external candidate search.');
  }

  // ── 4. Unified Response ─────────────────────────────────────────────────────
  // Interleave or just concatenate them (internals first, then externals)
  return NextResponse.json({
    candidates: [...internalCandidates, ...externalCandidates],
  });
}
