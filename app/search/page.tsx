'use client';

import React, { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Search, MapPin, Loader2, AlertCircle, SlidersHorizontal,
  ChevronDown, Sparkles, CheckCircle2, X, ChevronRight,
} from 'lucide-react';
import CandidateCard from '@/components/CandidateCard';

// ── Constants ──────────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Tech', 'Design', 'Marketing', 'Finance', 'Healthcare', 'Sales', 'Education', 'Engineering', 'Other'];
const EXP_LEVELS = ['All', 'Entry', 'Mid', 'Senior', 'Expert'];
const COUNTRIES = [
  'All Countries', 'United States', 'United Kingdom', 'India', 'Canada', 'Australia',
  'Germany', 'France', 'Singapore', 'UAE', 'Sri Lanka', 'Netherlands', 'Brazil',
  'Pakistan', 'Philippines', 'Other',
];

interface Candidate {
  id: string;
  fullName: string;
  headline: string;
  bio?: string;
  skills: string[];
  location: string;
  sourceUrl: string;
  isExternal: boolean;
}

// ── Custom Dropdown ────────────────────────────────────────────────────────────
function FilterDropdown({
  label, value, options, onChange, icon,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayValue = value || label;
  const isActive = value && value !== 'All' && value !== 'All Countries';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-200 w-full ${isActive
            ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-300'
            : 'bg-white/[0.04] border-white/10 text-white/60 hover:bg-white/[0.07] hover:border-white/20 hover:text-white'
          }`}
      >
        {icon && <span className="text-white/40">{icon}</span>}
        <span className="flex-1 text-left truncate">{isActive ? value : label}</span>
        <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1.5 left-0 min-w-full w-44 bg-[#15102a] border border-white/10 rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="max-h-52 overflow-y-auto py-1 scrollbar-thin">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt === 'All' || opt === 'All Countries' ? '' : opt);
                  setOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${(opt === 'All' || opt === 'All Countries' ? '' : opt) === value
                    ? 'bg-emerald-600/30 text-emerald-300'
                    : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Recommended strip ──────────────────────────────────────────────────────────
function RecommendedStrip({ userCategory, userCountry, userExpLevel }: {
  userCategory?: string; userCountry?: string; userExpLevel?: string;
}) {
  const [recs, setRecs] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userCategory && !userCountry && !userExpLevel) { setLoading(false); return; }
    const params = new URLSearchParams();
    if (userCategory) params.set('q', userCategory);
    if (userCountry) params.set('location', userCountry);
    fetch(`/api/search?${params}`)
      .then((r) => r.json())
      .then((d) => setRecs((d.candidates || []).slice(0, 8)))
      .catch(() => setRecs([]))
      .finally(() => setLoading(false));
  }, [userCategory, userCountry, userExpLevel]);

  if (!userCategory && !userCountry) return null;
  if (!loading && recs.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <h2 className="text-sm font-semibold text-white">Recommended for You</h2>
        <span className="text-[10px] text-white/30 font-mono ml-auto">Based on your profile</span>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-64 h-36 bg-[#110d1e]/80 border border-white/[0.07] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {recs.map((c) => {
            const initials = c.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
            return (
              <a
                key={c.id}
                href={c.sourceUrl !== '#' ? c.sourceUrl : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex-shrink-0 w-64 bg-[#110d1e]/80 border border-white/[0.07] rounded-2xl p-4 hover:border-emerald-500/30 hover:shadow-[0_0_24px_rgba(168,85,247,0.1)] transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs shadow-[0_0_10px_rgba(168,85,247,0.35)] flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{c.fullName}</p>
                    <p className="text-[#8B93A7] text-[10px] truncate">{c.headline}</p>
                  </div>
                </div>
                {c.bio && <p className="text-[#8B93A7] text-[10px] leading-relaxed line-clamp-2 mb-2">{c.bio}</p>}
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${c.isExternal
                      ? 'text-slate-400 border-slate-500/30 bg-slate-500/10'
                      : 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                    }`}>
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    {c.isExternal ? 'Signal' : 'Verified'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-emerald-400 transition-colors" />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Active filter badge ────────────────────────────────────────────────────────
function FilterBadge({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
      {label}
      <button type="button" onClick={onRemove} className="hover:text-white transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

// ── Main Search Page ───────────────────────────────────────────────────────────
function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const user = session?.user as any;

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [country, setCountry] = useState(searchParams.get('country') || '');
  const [expLevel, setExpLevel] = useState(searchParams.get('exp') || '');

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [externalOnly, setExternalOnly] = useState(false);

  const fetchCandidates = useCallback(async (q: string, loc: string) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (loc) params.set('location', loc);
      const res = await fetch(`/api/search?${params}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setCandidates(data.candidates || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch candidates.');
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const loc = searchParams.get('location') || '';
    if (q || loc) fetchCandidates(q, loc);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (location) params.set('location', location);
    if (category) params.set('category', category);
    if (country) params.set('country', country);
    if (expLevel) params.set('exp', expLevel);
    router.push(`/search?${params}`, { scroll: false });
    fetchCandidates(searchQuery, location);
  };

  // Client-side filtering
  const filtered = candidates.filter((c) => {
    if (verifiedOnly && c.isExternal) return false;
    if (externalOnly && !c.isExternal) return false;
    return true;
  });

  const activeFilters = [
    category && { label: category, clear: () => setCategory('') },
    country && { label: country, clear: () => setCountry('') },
    expLevel && { label: expLevel, clear: () => setExpLevel('') },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <div className="relative min-h-screen bg-[#08050f] text-white overflow-x-hidden">
      <div className="pointer-events-none absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-900/15 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.3em] uppercase text-white/30 mb-3 font-mono">Talent Intelligence</p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
            Find the right talent.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Faster.</span>
          </h1>
          <p className="text-[#8B93A7] max-w-lg mx-auto text-sm leading-relaxed">
            Search across verified candidates and real-time public signals from LinkedIn and GitHub.
          </p>
        </div>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-3xl mx-auto mb-4 bg-[#110d1e]/80 border border-white/[0.08] rounded-2xl p-3 flex flex-col md:flex-row gap-2 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Job title, skill, or keyword…"
              className="w-full bg-transparent pl-9 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none"
            />
          </div>
          <div className="w-px bg-white/[0.07] hidden md:block" />
          <div className="md:w-44 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location…"
              className="w-full bg-transparent pl-9 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>

        {/* Filter dropdowns row */}
        <div className="w-full max-w-3xl mx-auto mb-8 flex flex-wrap gap-2">
          <FilterDropdown label="Category" value={category} options={CATEGORIES} onChange={setCategory} />
          <FilterDropdown label="Country" value={country} options={COUNTRIES} onChange={setCountry} />
          <FilterDropdown label="Experience" value={expLevel} options={EXP_LEVELS} onChange={setExpLevel} />
          {activeFilters.length > 0 && (
            <button
              type="button"
              onClick={() => { setCategory(''); setCountry(''); setExpLevel(''); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white/70 transition-colors ml-auto"
            >
              <X className="w-3 h-3" /> Clear all
            </button>
          )}
        </div>

        {/* Active filter badges */}
        {activeFilters.length > 0 && (
          <div className="w-full max-w-3xl mx-auto flex flex-wrap gap-2 mb-6 -mt-4">
            {activeFilters.map((f) => (
              <FilterBadge key={f.label} label={f.label} onRemove={f.clear} />
            ))}
          </div>
        )}

        {/* Content layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-56 shrink-0">
            <div className="bg-[#110d1e]/70 border border-white/[0.07] rounded-2xl p-5 sticky top-28">
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal className="w-4 h-4 text-white/50" />
                <span className="text-[11px] font-medium text-white/70 uppercase tracking-widest">Filters</span>
              </div>

              <div className="space-y-5">
                {/* Profile Type */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 font-mono mb-3">Profile Type</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Verified Candidates', checked: verifiedOnly, setter: () => { setVerifiedOnly(!verifiedOnly); setExternalOnly(false); } },
                      { label: 'External Signals', checked: externalOnly, setter: () => { setExternalOnly(!externalOnly); setVerifiedOnly(false); } },
                    ].map(({ label, checked, setter }) => (
                      <label key={label} className="flex items-center gap-3 cursor-pointer group" onClick={setter}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${checked ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 group-hover:border-emerald-500/50'
                          }`}>
                          {checked && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-[#8B93A7] group-hover:text-white/80 transition-colors">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div className="pt-3 border-t border-white/[0.06]">
                  <p className="text-[10px] uppercase tracking-widest text-white/30 font-mono mb-3">Experience</p>
                  <div className="space-y-2">
                    {['Entry', 'Mid', 'Senior', 'Expert'].map((level) => (
                      <label
                        key={level}
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => setExpLevel(expLevel === level ? '' : level)}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors flex-shrink-0 ${expLevel === level ? 'border-emerald-500 bg-emerald-500' : 'border-white/20 group-hover:border-emerald-500/50'
                          }`}>
                          {expLevel === level && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-sm text-[#8B93A7] group-hover:text-white/80 transition-colors">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main results */}
          <main className="flex-1 min-w-0">
            {/* Recommended strip — shown when not loading & user has profile */}
            {!loading && (user?.category || user?.country) && (
              <RecommendedStrip
                userCategory={user?.category}
                userCountry={user?.country}
                userExpLevel={user?.experienceLevel}
              />
            )}

            {/* Result count */}
            {hasSearched && !loading && !error && (
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-[#8B93A7]">
                  <span className="text-emerald-400 font-semibold">{filtered.length}</span> candidates found
                  {searchQuery && <span> for "<span className="text-white/70">{searchQuery}</span>"</span>}
                </p>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-[#110d1e]/80 border border-white/[0.07] rounded-2xl p-6 animate-pulse">
                    <div className="flex gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-white/10" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/10 rounded w-2/3" />
                        <div className="h-3 bg-white/10 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-white/10 rounded" />
                      <div className="h-3 bg-white/10 rounded w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center relative">
                <div className="absolute w-72 h-72 bg-red-600/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(239,68,68,0.25)]">
                  <AlertCircle className="w-8 h-8 text-red-500 animate-pulse" />
                </div>
                <h3 className="relative z-10 text-red-400 font-mono tracking-wider uppercase text-lg font-bold mb-2">System Offline</h3>
                <p className="relative z-10 text-slate-300 font-mono text-xs max-w-md bg-red-950/40 border border-red-500/20 rounded-xl p-4 mb-6">
                  Connection Severed: Lost connection to the Mainframe.
                  <span className="block text-red-400/80 mt-1 text-[11px] font-sans">{error}</span>
                </p>
                <button
                  type="button"
                  onClick={() => handleSearch()}
                  className="relative z-10 px-6 py-2.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-200 text-sm font-mono hover:bg-red-600/40 hover:text-white transition-all"
                >
                  RECONNECT_MAINFRAME
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && hasSearched && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <Search className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">No candidates found</h3>
                <p className="text-[#8B93A7] text-sm max-w-sm">
                  Try a different keyword or remove some filters to broaden your search.
                </p>
              </div>
            )}

            {/* Initial prompt */}
            {!loading && !error && !hasSearched && !(user?.category || user?.country) && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/20 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                  <Search className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Start your search</h3>
                <p className="text-[#8B93A7] text-sm max-w-sm">
                  Enter a job title, skill, or keyword above to discover matched talent.
                </p>
              </div>
            )}

            {/* Grid */}
            {!loading && !error && filtered.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map((candidate) => (
                  <CandidateCard key={candidate.id} {...candidate} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#08050f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    }>
      <SearchPage />
    </Suspense>
  );
}
