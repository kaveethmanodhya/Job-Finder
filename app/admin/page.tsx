"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  Building2,
  Sliders,
  CheckCircle2,
  XCircle,
  Search,
  Database,
  Lock,
  ShieldCheck,
  Loader2,
  Trash2,
} from "lucide-react";

function SerperAnalyticsWidget() {
  const [stats, setStats] = useState<{ thisMonthUsage: number; thisMonthLimit: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/serper-stats")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch stats");
        if (data.error) throw new Error(data.error);
        return data;
      })
      .then((data) => {
        setStats(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0d0820] border border-white/[0.08] rounded-2xl p-6 shadow-xl animate-pulse h-[250px] flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-white/10 rounded" />
            <div className="h-3 w-48 bg-white/10 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-16 bg-white/5 rounded-xl border border-white/5" />
          <div className="h-16 bg-white/5 rounded-xl border border-white/5" />
          <div className="h-16 bg-white/5 rounded-xl border border-white/5" />
        </div>
        <div className="h-2 w-full bg-white/10 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0d0820] border border-red-500/20 rounded-2xl p-6 shadow-xl h-[250px] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-3 border border-red-500/20">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-red-400 mb-1">API Offline</h3>
        <p className="text-xs text-red-400/70 max-w-[200px]">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const usage = stats.thisMonthUsage || 0;
  const limit = stats.thisMonthLimit || 2500;
  const remaining = Math.max(limit - usage, 0);
  const percentUsed = Math.min((usage / limit) * 100, 100);

  let barColor = "bg-emerald-500";
  let textColor = "text-emerald-400";
  let glowColor = "shadow-emerald-500/20";
  
  if (percentUsed > 75) { 
    barColor = "bg-amber-500"; 
    textColor = "text-amber-400"; 
    glowColor = "shadow-amber-500/20";
  }
  if (percentUsed > 90) { 
    barColor = "bg-red-500"; 
    textColor = "text-red-400"; 
    glowColor = "shadow-red-500/20";
  }

  return (
    <div className={`bg-[#0d0820] border border-white/[0.08] rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Serper API Usage</h3>
          <p className="text-xs text-[#8B93A7]">Live tracking of Google Search scraping credits</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col justify-center">
          <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Limit</p>
          <p className="text-lg font-mono text-white">{limit.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col justify-center relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-t from-current to-transparent opacity-5 ${textColor} pointer-events-none`} />
          <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Used</p>
          <p className={`text-lg font-mono ${textColor} relative z-10`}>{usage.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col justify-center">
          <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Remaining</p>
          <p className="text-lg font-mono text-white">{remaining.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-[#8B93A7] uppercase tracking-wider text-[10px] font-semibold">Credit Usage Progress</span>
          <span className="font-mono text-white">{percentUsed.toFixed(1)}%</span>
        </div>
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full ${barColor} transition-all duration-1000 ease-out shadow-lg ${glowColor}`} 
            style={{ width: `${percentUsed}%` }} 
          />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"candidates" | "companies" | "settings">("candidates");
  const [searchQuery, setSearchQuery] = useState("");

  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);
  const [deletingUsers, setDeletingUsers] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const userRole = (session?.user as any)?.role;

  useEffect(() => {
    if (userRole === "ADMIN") {
      fetch("/api/admin/users")
        .then((res) => res.json())
        .then((data) => {
          if (data.users) setUsers(data.users);
        })
        .finally(() => setIsLoadingUsers(false));
    }
  }, [userRole]);

  const toggleVerification = async (userId: string, currentStatus: boolean) => {
    setTogglingUserId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isVerified: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, isVerified: !currentStatus } : u));
      } else {
        alert(`Error: ${data.error || "Failed to update verification status"}`);
      }
    } catch (error: any) {
      console.error("Failed to toggle verification", error);
      alert(`Network Error: ${error.message}`);
    } finally {
      setTogglingUserId(null);
    }
  };

  const deleteUsers = async (userIds: string[]) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${userIds.length} user(s)?`)) return;
    
    setDeletingUsers(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter((u) => !userIds.includes(u.id)));
        setSelectedIds((prev) => {
          const newSet = new Set(prev);
          userIds.forEach(id => newSet.delete(id));
          return newSet;
        });
      } else {
        alert(`Error: ${data.error || "Failed to delete users"}`);
      }
    } catch (error: any) {
      console.error("Failed to delete users", error);
      alert(`Network Error: ${error.message}`);
    } finally {
      setDeletingUsers(false);
    }
  };

  const handleSelectAll = (filteredList: any[]) => {
    if (selectedIds.size === filteredList.length && filteredList.length > 0) {
      // Deselect all
      setSelectedIds(new Set());
    } else {
      // Select all visible
      setSelectedIds(new Set(filteredList.map((u) => u.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Protect view client side
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || userRole !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#0d0820] border border-red-500/20 rounded-2xl p-8 text-center shadow-[0_16px_60px_rgba(239,68,68,0.1)]">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Restricted</h1>
          <p className="text-[#8B93A7] text-sm mb-6">
            The Admin Control Panel is strictly reserved for authorized platform administrators.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Filter lists based on roles and search query
  const filteredCandidates = users.filter(
    (u) => u.role === "CANDIDATE" && 
    ((u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCompanies = users.filter(
    (u) => u.role === "COMPANY" && 
    ((u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeFilteredList = activeTab === "candidates" ? filteredCandidates : filteredCompanies;
  const isAllSelected = activeFilteredList.length > 0 && selectedIds.size === activeFilteredList.length;

  return (
    <div className="min-h-screen bg-[#070b14] text-white pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Verity Administration
          </div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-white">
            Admin Control Panel
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> System Operational
          </span>
          <span className="text-xs text-[#8B93A7] bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            Role: <strong className="text-white">ADMIN</strong>
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-white/[0.08] pb-4">
        <button
          onClick={() => { setActiveTab("candidates"); setSelectedIds(new Set()); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === "candidates"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
              : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" /> Manage Clients (Candidates)
        </button>

        <button
          onClick={() => { setActiveTab("companies"); setSelectedIds(new Set()); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === "companies"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
              : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Building2 className="w-4 h-4" /> Manage Companies
        </button>

        <button
          onClick={() => { setActiveTab("settings"); setSelectedIds(new Set()); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === "settings"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
              : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Sliders className="w-4 h-4" /> System Settings & APIs
        </button>
      </div>

      {/* Bulk Actions Header (Shared between table views) */}
      {(activeTab === "candidates" || activeTab === "companies") && selectedIds.size > 0 && (
        <div className="mb-4 p-4 rounded-2xl bg-emerald-900/20 border border-emerald-500/30 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium text-emerald-300">
            {selectedIds.size} row(s) selected
          </span>
          <button
            onClick={() => deleteUsers(Array.from(selectedIds))}
            disabled={deletingUsers}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium transition-all"
          >
            {deletingUsers ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete Selected
          </button>
        </div>
      )}

      {/* Tab Content 1: Manage Clients (Candidates) */}
      {activeTab === "candidates" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search candidates by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <p className="text-xs text-[#8B93A7]">
              Showing {filteredCandidates.length} registered candidate records
            </p>
          </div>

          <div className="bg-[#0d0820] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-left text-sm text-white/80">
                <thead className="bg-white/[0.03] text-xs uppercase text-[#8B93A7] border-b border-white/[0.08]">
                  <tr>
                    <th className="px-4 py-4 w-12 text-center">
                      <input 
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={() => handleSelectAll(filteredCandidates)}
                        className="w-4 h-4 rounded bg-white/5 border-white/20 accent-emerald-500 cursor-pointer" 
                      />
                    </th>
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Verification</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {isLoadingUsers ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mx-auto" />
                      </td>
                    </tr>
                  ) : filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-white/50">
                        No candidates found.
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((c) => (
                      <tr key={c.id} className={`hover:bg-white/[0.02] transition-colors ${selectedIds.has(c.id) ? 'bg-emerald-900/10' : ''}`}>
                        <td className="px-4 py-4 w-12 text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedIds.has(c.id)}
                            onChange={() => toggleSelect(c.id)}
                            className="w-4 h-4 rounded bg-white/5 border-white/20 accent-emerald-500 cursor-pointer" 
                          />
                        </td>
                        <td className="px-6 py-4 font-medium text-white">
                          <div>{c.name || "Unnamed"}</div>
                          <div className="text-xs text-[#8B93A7]">{c.email}</div>
                        </td>
                        <td className="px-6 py-4 text-white/70">{c.category || "Uncategorized"}</td>
                        <td className="px-6 py-4">
                          {c.isVerified ? (
                            <span className="inline-flex items-center gap-1 text-xs text-blue-400">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Profile
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                              <XCircle className="w-3.5 h-3.5" /> Unverified
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => toggleVerification(c.id, c.isVerified)}
                              disabled={togglingUserId === c.id}
                              className="text-[11px] text-emerald-400 hover:text-white font-medium px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 hover:border-emerald-400 transition-all disabled:opacity-50 flex items-center gap-1.5"
                            >
                              {togglingUserId === c.id ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                              {c.isVerified ? "Revoke" : "Approve"}
                            </button>
                            <button 
                              onClick={() => deleteUsers([c.id])}
                              className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Manage Companies */}
      {activeTab === "companies" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search companies by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-teal-500"
              />
            </div>
            <p className="text-xs text-[#8B93A7]">
              Showing {filteredCompanies.length} registered company records
            </p>
          </div>

          <div className="bg-[#0d0820] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-left text-sm text-white/80">
                <thead className="bg-white/[0.03] text-xs uppercase text-[#8B93A7] border-b border-white/[0.08]">
                  <tr>
                    <th className="px-4 py-4 w-12 text-center">
                      <input 
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={() => handleSelectAll(filteredCompanies)}
                        className="w-4 h-4 rounded bg-white/5 border-white/20 accent-teal-500 cursor-pointer" 
                      />
                    </th>
                    <th className="px-6 py-4">Company Lead</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Verification</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {isLoadingUsers ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-teal-400 mx-auto" />
                      </td>
                    </tr>
                  ) : filteredCompanies.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-white/50">
                        No companies found.
                      </td>
                    </tr>
                  ) : (
                    filteredCompanies.map((comp) => (
                      <tr key={comp.id} className={`hover:bg-white/[0.02] transition-colors ${selectedIds.has(comp.id) ? 'bg-teal-900/10' : ''}`}>
                        <td className="px-4 py-4 w-12 text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedIds.has(comp.id)}
                            onChange={() => toggleSelect(comp.id)}
                            className="w-4 h-4 rounded bg-white/5 border-white/20 accent-teal-500 cursor-pointer" 
                          />
                        </td>
                        <td className="px-6 py-4 font-semibold text-white">
                          <div>{comp.name || "Unnamed"}</div>
                          <div className="text-xs text-[#8B93A7] font-normal">{comp.email}</div>
                        </td>
                        <td className="px-6 py-4 text-white/70">{comp.category || "Uncategorized"}</td>
                        <td className="px-6 py-4">
                          {comp.isVerified ? (
                            <span className="inline-flex items-center gap-1 text-xs text-blue-400">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Company Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                              <XCircle className="w-3.5 h-3.5" /> Pending Audit
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => toggleVerification(comp.id, comp.isVerified)}
                              disabled={togglingUserId === comp.id}
                              className="text-[11px] text-teal-400 hover:text-white font-medium px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500 border border-teal-500/20 hover:border-teal-400 transition-all disabled:opacity-50 flex items-center gap-1.5"
                            >
                              {togglingUserId === comp.id ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                              {comp.isVerified ? "Revoke" : "Approve"}
                            </button>
                            <button 
                              onClick={() => deleteUsers([comp.id])}
                              className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete company"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: System Settings */}
      {activeTab === "settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Live API Analytics Widget */}
          <SerperAnalyticsWidget />

          <div className="bg-[#0d0820] border border-white/[0.08] rounded-2xl p-6 shadow-xl h-[250px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">OAuth Security & RBAC</h3>
                  <p className="text-xs text-[#8B93A7]">Social account linking & middleware enforcement</p>
                </div>
              </div>
              <p className="text-xs text-white/60 leading-relaxed max-w-sm">
                All platform authentication is actively routed securely through NextAuth credentials and OAuth providers. Route access is verified strictly on the server-side via JWT inspection.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <span className="text-sm text-white/80">Active Providers</span>
              <span className="text-xs text-teal-400 font-mono bg-teal-500/10 border border-teal-500/20 px-2 py-1 rounded-md">
                Google · GitHub · LinkedIn
              </span>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
