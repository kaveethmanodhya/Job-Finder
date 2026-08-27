"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { LogOut, ChevronDown, X } from "lucide-react";

// ── OAuth provider button ─────────────────────────────────────────────────────
function OAuthButton({
  provider,
  label,
  icon,
  onClick,
}: {
  provider: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/80 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-200"
    >
      {icon}
      <span>Continue with {label}</span>
    </button>
  );
}

// ── Auth modal ────────────────────────────────────────────────────────────────
function AuthModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [roleIntent, setRoleIntent] = useState<"CANDIDATE" | "COMPANY">("CANDIDATE");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleOAuth = (provider: string) => {
    const callbackUrl = tab === "register" ? "/onboarding" : "/";
    signIn(provider, { callbackUrl });
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setErrorMsg("Invalid username or password.");
      setLoading(false);
    } else {
      onClose();
      window.location.reload();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-sm bg-[#0d0820] border border-white/[0.09] rounded-2xl p-7 shadow-[0_24px_80px_rgba(0,0,0,0.7)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-4">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-semibold tracking-wide text-sm">VERITY</span>
        </div>

        {/* Login / Register Toggle */}
        <div className="flex rounded-xl bg-white/[0.05] p-1 mb-6 border border-white/10">
          <button
            onClick={() => { setTab("login"); setErrorMsg(""); }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              tab === "login"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab("register"); setErrorMsg(""); }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              tab === "register"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            Register Account
          </button>
        </div>

        {tab === "register" && (
          <div className="mb-5">
            <p className="text-xs text-white/60 font-medium mb-2">I want to:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRoleIntent("CANDIDATE")}
                className={`py-2 px-3 rounded-lg border text-xs text-left transition-all ${
                  roleIntent === "CANDIDATE"
                    ? "border-emerald-500 bg-emerald-500/15 text-white"
                    : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                }`}
              >
                <div className="font-semibold">Find Work</div>
                <div className="text-[10px] opacity-70">As Candidate</div>
              </button>
              <button
                type="button"
                onClick={() => setRoleIntent("COMPANY")}
                className={`py-2 px-3 rounded-lg border text-xs text-left transition-all ${
                  roleIntent === "COMPANY"
                    ? "border-teal-500 bg-teal-500/15 text-white"
                    : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                }`}
              >
                <div className="font-semibold">Hire Talent</div>
                <div className="text-[10px] opacity-70">As Company</div>
              </button>
            </div>
          </div>
        )}

        <h2 className="text-lg font-semibold text-white mb-1">
          {tab === "login" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="text-[#8B93A7] text-xs mb-4">
          {tab === "login"
            ? "Sign in to access your Verity dashboard."
            : "Select provider or register to set up your account."}
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Username/Password Form */}
        <form onSubmit={handleCredentialsSubmit} className="space-y-3 mb-4">
          <div>
            <input
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In with Credentials"}
          </button>
        </form>

        <div className="relative flex py-2 items-center mb-3">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-3 text-[10px] text-white/30 uppercase tracking-wider">or social</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <div className="space-y-3">
          {/* Google */}
          <OAuthButton
            provider="google"
            label="Google"
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            }
            onClick={() => handleOAuth("google")}
          />

          {/* GitHub */}
          <OAuthButton
            provider="github"
            label="GitHub"
            icon={
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.01 2.04.14 3 .4 2.28-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            }
            onClick={() => handleOAuth("github")}
          />

          {/* LinkedIn */}
          <OAuthButton
            provider="linkedin"
            label="LinkedIn"
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            }
            onClick={() => handleOAuth("linkedin")}
          />
        </div>

        <p className="mt-5 text-center text-[11px] text-white/25">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

// ── User menu dropdown ────────────────────────────────────────────────────────
function UserMenu({ name, image, role }: { name: string; image?: string | null; role?: string }) {
  const [open, setOpen] = useState(false);
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-white/10 transition-all duration-200"
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            width={28}
            height={28}
            className="rounded-full border border-white/20"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-[11px] font-bold text-white">
            {initials}
          </div>
        )}
        <span className="text-[13px] text-white/70 hidden sm:block max-w-[120px] truncate">
          {name}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-52 bg-[#0d0820] border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.07]">
              <p className="text-xs text-white/40">Signed in as</p>
              <p className="text-sm text-white font-medium truncate">{name}</p>
              {role && (
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {role}
                </span>
              )}
            </div>
            <div className="p-1.5">
              {role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-emerald-300 hover:bg-emerald-500/10 transition-all mb-1"
                >
                  Admin Control Panel
                </Link>
              )}
              <button
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const { data: session, status } = useSession();
  const [modalOpen, setModalOpen] = useState(false);

  const userRole = (session?.user as any)?.role;

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#070b14]/70 backdrop-blur-lg border-b border-white/10">
        <div className="w-[95%] max-w-7xl mx-auto flex items-center justify-between py-4 px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Verity"
              width={100}
              height={30}
              priority
              className="h-6 w-auto object-contain drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            />
          </Link>

          {/* Role-Based Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60 font-medium">
            {/* Show 'Find Jobs' to Candidates, Admins, or Unauthenticated */}
            {(userRole === "CANDIDATE" || userRole === "ADMIN" || !userRole || userRole === "UNASSIGNED") && (
              <Link href="/jobs" className="hover:text-emerald-400 transition-colors duration-200">
                Find Jobs
              </Link>
            )}

            {/* Show 'Find Candidates' to Companies, Admins, or Unauthenticated */}
            {(userRole === "COMPANY" || userRole === "ADMIN" || !userRole || userRole === "UNASSIGNED") && (
              <Link href="/search" className="hover:text-emerald-400 transition-colors duration-200">
                Find Candidates
              </Link>
            )}

            {/* Admin link */}
            {userRole === "ADMIN" && (
              <Link href="/admin" className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors flex items-center gap-1">
                Admin Dashboard
              </Link>
            )}

            <Link href="/how" className="hover:text-emerald-400 transition-colors duration-200">
              How it works
            </Link>
          </div>

        {/* Auth area */}
        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <div className="w-7 h-7 rounded-full bg-white/10 animate-pulse" />
          ) : session?.user ? (
            <UserMenu
              name={session.user.name ?? session.user.email ?? "User"}
              image={session.user.image}
              role={userRole}
            />
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              className="text-[13px] font-semibold px-6 py-2 rounded-full border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-[#08050f] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300"
            >
              Login / Register
            </button>
          )}
        </div>
        </div>
      </nav>

      {/* Auth modal */}
      {modalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
