'use client';

import React from 'react';
import { CheckCircle2, Globe, MapPin, ExternalLink } from 'lucide-react';

interface CandidateCardProps {
  id: string;
  fullName: string;
  headline: string;
  bio?: string;
  skills: string[];
  location: string;
  sourceUrl: string;
  isExternal: boolean;
}

export default function CandidateCard({
  fullName,
  headline,
  bio,
  skills,
  location,
  sourceUrl,
  isExternal,
}: CandidateCardProps) {
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="group relative flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]">
      {/* Hover glow blob */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-emerald-600/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.4)]">
          {initials}
        </div>

        {/* Name + headline */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-semibold text-[15px] truncate">{fullName}</h3>
            {isExternal ? (
              <span className="flex items-center gap-1 text-[10px] text-slate-400 border border-slate-500/30 bg-slate-500/10 px-2 py-0.5 rounded-full shrink-0">
                <Globe className="w-3 h-3" />
                External Signal
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-emerald-300 border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 rounded-full shrink-0">
                <CheckCircle2 className="w-3 h-3" />
                Verified Candidate
              </span>
            )}
          </div>
          <p className="text-[#8B93A7] text-sm mt-0.5 truncate">{headline}</p>
        </div>
      </div>

      {/* Location */}
      <div className="relative flex items-center gap-1.5 text-xs text-[#8B93A7] mb-3">
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        <span>{location}</span>
      </div>

      {/* Bio */}
      {bio && (
        <p className="relative text-[#8B93A7] text-xs leading-relaxed line-clamp-3 mb-4">
          {bio}
        </p>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="relative flex flex-wrap gap-1.5 mb-5">
          {skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-md px-2 py-1 text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          {skills.length > 5 && (
            <span className="bg-slate-800/50 text-[#8B93A7] border border-white/10 rounded-md px-2 py-1 text-xs">
              +{skills.length - 5}
            </span>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="relative mt-auto pt-4 border-t border-white/[0.06]">
        <a
          href={sourceUrl === '#' ? undefined : sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-emerald-500/40 text-emerald-300 text-sm font-medium hover:bg-emerald-500/10 hover:border-emerald-400/60 hover:text-white transition-all duration-200"
          aria-label={`View ${fullName}'s profile`}
        >
          View Profile
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
