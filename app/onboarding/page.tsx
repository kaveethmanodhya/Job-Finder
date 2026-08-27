"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  UserCheck, Briefcase, Building2, Sparkles, ArrowRight,
  Loader2, MapPin, Layers, BarChart2, CheckCircle2,
} from "lucide-react";

const CATEGORIES = ["Tech", "Design", "Marketing", "Finance", "Healthcare", "Sales", "Education", "Other"];
const EXPERIENCE_LEVELS = ["Entry", "Mid", "Senior", "Expert"] as const;
const COUNTRIES = [
  "United States", "United Kingdom", "India", "Canada", "Australia", "Germany",
  "France", "Singapore", "UAE", "Sri Lanka", "Netherlands", "Brazil", "Pakistan", "Philippines", "Other",
];

type Role = "CANDIDATE" | "COMPANY";
type ExpLevel = typeof EXPERIENCE_LEVELS[number];

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>("CANDIDATE");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<ExpLevel>("Mid");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect already-onboarded users away
  useEffect(() => {
    if ((session?.user as any)?.isOnboarded) {
      router.replace("/");
    }
  }, [session, router]);

  const handleSubmit = async () => {
    if (!category || !country) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/user/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, category, country, experienceLevel }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to complete onboarding.");

      // Push updated state into NextAuth session
      await update({ role, isOnboarded: true, isVerified: true });

      router.push(role === "COMPANY" ? "/search" : "/jobs");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  const stepClasses = (s: number) =>
    `w-2 h-2 rounded-full transition-all duration-300 ${step >= s ? "bg-emerald-500 w-6" : "bg-white/20"}`;

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-600/12 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-teal-500/8 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={stepClasses(s)} />
          ))}
        </div>

        <div className="bg-[#0d0820]/80 border border-white/[0.09] rounded-3xl p-8 md:p-10 shadow-[0_32px_100px_rgba(0,0,0,0.8)] backdrop-blur-xl">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Step {step} of 3 — {step === 1 ? "Account Type" : step === 2 ? "Your Field" : "Final Details"}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
              {step === 1 && "How will you use Verity?"}
              {step === 2 && "What's your field?"}
              {step === 3 && "Almost there!"}
            </h1>
            <p className="text-[#8B93A7] text-sm max-w-sm mx-auto">
              {step === 1 && "Select your account type to personalise your experience."}
              {step === 2 && "We'll use this to match you with relevant opportunities."}
              {step === 3 && "Your country and experience level helps us surface the right results."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          {/* ─── Step 1: Role ─── */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {([
                {
                  value: "CANDIDATE",
                  label: "I'm looking for work",
                  sub: "Discover signal-matched roles and build your talent profile.",
                  icon: <Briefcase className="w-6 h-6" />,
                  accent: "emerald",
                },
                {
                  value: "COMPANY",
                  label: "I'm hiring talent",
                  sub: "Access verified developer profiles and source top talent.",
                  icon: <Building2 className="w-6 h-6" />,
                  accent: "teal",
                },
              ] as const).map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => setRole(opt.value)}
                  className={`cursor-pointer rounded-2xl p-6 border transition-all duration-300 relative flex flex-col justify-between ${
                    role === opt.value
                      ? opt.accent === "emerald"
                        ? "bg-gradient-to-b from-emerald-600/20 to-emerald-900/30 border-emerald-500/60 shadow-[0_0_30px_rgba(139,92,246,0.25)] scale-[1.02]"
                        : "bg-gradient-to-b from-teal-600/20 to-blue-900/30 border-teal-500/60 shadow-[0_0_30px_rgba(6,182,212,0.25)] scale-[1.02]"
                      : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20"
                  }`}
                >
                  {role === opt.value && (
                    <div className={`absolute top-4 right-4 ${opt.accent === "emerald" ? "text-emerald-400" : "text-teal-400"}`}>
                      <UserCheck className="w-5 h-5" />
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    opt.accent === "emerald"
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-teal-500/10 border border-teal-500/20 text-teal-400"
                  }`}>
                    {opt.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{opt.label}</h3>
                  <p className="text-xs text-[#8B93A7] leading-relaxed">{opt.sub}</p>
                </div>
              ))}
            </div>
          )}

          {/* ─── Step 2: Category ─── */}
          {step === 2 && (
            <div className="mb-8">
              <label className="block text-xs text-white/50 font-medium mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Field / Industry
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all duration-200 ${
                      category === cat
                        ? "bg-emerald-600/30 border-emerald-500/70 text-white shadow-[0_0_12px_rgba(139,92,246,0.2)]"
                        : "bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/[0.07] hover:text-white hover:border-white/20"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── Step 3: Country + Experience Level ─── */}
          {step === 3 && (
            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-xs text-white/50 font-medium mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#0d0820]">Select your country…</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} className="bg-[#0d0820]">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-white/50 font-medium mb-2 flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5" /> Experience Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {EXPERIENCE_LEVELS.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExperienceLevel(lvl)}
                      className={`py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                        experienceLevel === lvl
                          ? "bg-emerald-600/30 border-emerald-500/70 text-white shadow-[0_0_12px_rgba(139,92,246,0.2)]"
                          : "bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/[0.07] hover:text-white"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview — Verified Badge */}
              <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">You'll earn your Verified badge</p>
                  <p className="text-xs text-[#8B93A7] mt-0.5">
                    Completing onboarding immediately grants you the{" "}
                    <span className="text-teal-400 font-medium">Verified ✓</span> status across all of Verity.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex-1 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 transition-all"
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => {
                  if (step === 2 && !category) {
                    setError("Please select a category.");
                    return;
                  }
                  setError("");
                  setStep((s) => s + 1);
                }}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !country}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Setting up your profile…</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Complete & Get Verified</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
