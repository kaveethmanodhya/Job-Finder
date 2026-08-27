"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function SignupContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [tab, setTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [credError, setCredError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const handleOAuth = (provider: string) => {
    signIn(provider, { callbackUrl: "/onboarding" });
  };

  // ── Sign In with credentials ──────────────────────────────────────────────
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCredError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setCredError("Invalid username or password.");
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  };

  // ── Manual register → then auto sign-in ──────────────────────────────────
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCredError("");
    setRegSuccess("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: regEmail, password: regPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed.");

      // Auto sign-in after successful registration
      const signInRes = await signIn("credentials", {
        username: regEmail,
        password: regPassword,
        redirect: false,
      });

      if (signInRes?.error) {
        setRegSuccess("Account created! Please sign in.");
        setTab("login");
        setLoading(false);
      } else {
        window.location.href = "/onboarding";
      }
    } catch (err: any) {
      setCredError(err.message || "Registration failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08050f] text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm bg-[#110d1e]/80 border border-white/[0.08] rounded-2xl p-8 shadow-[0_8px_60px_rgba(0,0,0,0.5)]">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-semibold tracking-wide">VERITY</span>
        </div>

        {/* Login / Register Toggle */}
        <div className="flex rounded-xl bg-white/[0.05] p-1 mb-6 border border-white/10">
          <button
            onClick={() => { setTab("login"); setCredError(""); setRegSuccess(""); }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              tab === "login" ? "bg-emerald-600 text-white shadow-sm" : "text-white/50 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab("register"); setCredError(""); setRegSuccess(""); }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              tab === "register" ? "bg-emerald-600 text-white shadow-sm" : "text-white/50 hover:text-white"
            }`}
          >
            Register Account
          </button>
        </div>

        <h1 className="text-xl font-semibold text-white mb-1">
          {tab === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-[#8B93A7] text-xs mb-6">
          {tab === "login"
            ? "Sign in to access your Verity dashboard."
            : "Register below or use a social provider."}
        </p>

        {/* Error / Success banner */}
        {(error || credError) && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            {credError
              ? credError
              : error === "OAuthAccountNotLinked"
              ? "This email is already linked to another provider. Try a different sign-in method."
              : error === "UnauthorizedAdmin"
              ? "Access denied. Admin rights required."
              : "Authentication error. Please try again."}
          </div>
        )}
        {regSuccess && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-xs">
            {regSuccess}
          </div>
        )}

        {/* ── Sign In Form ── */}
        {tab === "login" && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-3 mb-4">
            <input
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-all"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Signing in…</> : "Sign In"}
            </button>
          </form>
        )}

        {/* ── Register Form ── */}
        {tab === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 mb-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-all"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-all"
            />
            <input
              type="password"
              placeholder="Password (min. 6 characters)"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating account…</> : "Create Account"}
            </button>
          </form>
        )}

        <div className="relative flex py-2 items-center mb-3">
          <div className="flex-grow border-t border-white/10" />
          <span className="flex-shrink mx-3 text-[10px] text-white/30 uppercase tracking-wider">or social</span>
          <div className="flex-grow border-t border-white/10" />
        </div>

        <div className="space-y-3">
          {/* Google */}
          <button
            onClick={() => handleOAuth("google")}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/80 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* GitHub */}
          <button
            onClick={() => handleOAuth("github")}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/80 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all"
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.01 2.04.14 3 .4 2.28-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>

          {/* LinkedIn */}
          <button
            onClick={() => handleOAuth("linkedin")}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/80 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Continue with LinkedIn
          </button>
        </div>

        <p className="mt-6 text-center text-[11px] text-white/25">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#08050f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
