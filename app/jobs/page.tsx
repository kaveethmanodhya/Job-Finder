import prisma from "@/lib/prisma";
import { Search, MapPin, Briefcase, ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    location?: string;
  }>;
}

export default async function JobsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const location = resolvedParams.location || "";

  const where: any = { isActive: true };
  const AND: any[] = [];

  if (query) {
    AND.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { companyName: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    });
  }
  
  if (location) {
    AND.push({
      OR: [
        { location: { contains: location, mode: "insensitive" } },
        { country: { contains: location, mode: "insensitive" } },
      ],
    });
  }

  if (AND.length > 0) {
    where.AND = AND;
  }

  let jobs: any[] = [];
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      jobs = await prisma.job.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { company: true },
      });
      break;
    } catch (err: any) {
      const isRetryable = err?.message?.includes("Can't reach") || err?.message?.includes('connection pool');
      if (isRetryable && attempt < 3) {
        console.warn(`[Jobs] DB cold-start (attempt ${attempt}/3), retrying in 1.5s...`);
        await sleep(1500);
      } else {
        console.error('[Jobs] Prisma error:', err?.message);
        break; // break loop on non-retryable error or out of retries
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-[#08050f] text-white overflow-x-hidden pt-28 pb-20">
      {/* Background Glows */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-900/15 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.3em] uppercase text-emerald-400/70 mb-3 font-mono">Job Board</p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
            Discover your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">opportunity.</span>
          </h1>
          <p className="text-[#8B93A7] max-w-lg mx-auto text-sm leading-relaxed">
            Browse open roles posted by top companies looking for signal-matched talent.
          </p>
        </div>

        {/* Native Form Search Bar */}
        <form
          action="/jobs"
          method="GET"
          className="w-full max-w-3xl mx-auto mb-12 bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col md:flex-row gap-2 backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Job title or company..."
              className="w-full bg-transparent pl-9 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none"
            />
          </div>
          <div className="w-px bg-white/10 hidden md:block" />
          <div className="md:w-44 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            <input
              type="text"
              name="location"
              defaultValue={location}
              placeholder="Location..."
              className="w-full bg-transparent pl-9 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-all duration-200 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </form>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-[#8B93A7]">
            <span className="text-emerald-400 font-semibold">{jobs.length}</span> {jobs.length === 1 ? "job" : "jobs"} found
            {query && <span> for "<span className="text-white/70">{query}</span>"</span>}
          </p>
          {(query || location) && (
            <Link 
              href="/jobs"
              className="text-xs font-semibold text-emerald-400 hover:text-white transition-colors"
            >
              Clear Search
            </Link>
          )}
        </div>

        {/* Jobs Grid */}
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="group relative flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]"
              >
                {/* Hover Glow */}
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-emerald-600/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <Briefcase className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-[15px] leading-tight">{job.title}</h3>
                      <p className="text-emerald-400/80 text-[11px] font-mono mt-0.5">{job.companyName}</p>
                    </div>
                  </div>
                </div>

                <div className="relative space-y-2 mb-6 text-xs text-[#8B93A7]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-white/40" />
                    <span>{job.location}{job.country ? `, ${job.country}` : ""}</span>
                  </div>
                  {job.salaryRange && (
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 font-mono text-[10px] uppercase">PAY</span>
                      <span className="text-white/70">{job.salaryRange}</span>
                    </div>
                  )}
                  {job.experienceLevel && (
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 font-mono text-[10px] uppercase">EXP</span>
                      <span className="bg-white/5 px-2 py-0.5 rounded-md border border-white/10 text-white/70">{job.experienceLevel}</span>
                    </div>
                  )}
                </div>

                <div className="relative mt-auto pt-4 border-t border-white/10">
                  <Link
                    href={`#apply-${job.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-emerald-500/40 text-emerald-300 text-sm font-medium hover:bg-emerald-500/10 hover:border-emerald-400/60 hover:text-white transition-all duration-200"
                  >
                    Apply Now
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <Briefcase className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No jobs found</h3>
            <p className="text-[#8B93A7] text-sm max-w-sm">
              We couldn't find any roles matching your exact criteria. Try removing some filters or check back later.
            </p>
            {(query || location) && (
              <Link 
                href="/jobs"
                className="mt-6 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white font-medium transition-colors"
              >
                Clear Search
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
