export default function TalentPage() {
  return (
    <div className="min-h-screen bg-[#08050f] text-white flex flex-col items-center justify-center gap-4 px-4">
      <div className="w-14 h-14 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
        <span className="text-2xl">🎯</span>
      </div>
      <h1 className="text-3xl font-semibold">Find Talent</h1>
      <p className="text-[#8B93A7] text-sm text-center max-w-sm">
        Discover signal-matched candidates. Head to{' '}
        <a href="/search" className="text-emerald-400 hover:underline">Search</a>{' '}
        to get started.
      </p>
    </div>
  );
}
