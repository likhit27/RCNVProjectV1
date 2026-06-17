export default function PortalLoading() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar skeleton */}
      <aside className="hidden lg:flex w-60 flex-col bg-[#002664] shrink-0 animate-pulse">
        <div className="p-6 border-b border-white/10 space-y-2">
          <div className="h-2.5 w-20 bg-white/20 rounded" />
          <div className="h-4 w-36 bg-white/20 rounded" />
        </div>
        <div className="p-4 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 rounded-full bg-white/20 shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3 w-24 bg-white/20 rounded" />
            <div className="h-2 w-16 bg-white/20 rounded" />
          </div>
        </div>
        <div className="p-4 space-y-3 mt-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-9 bg-white/10 rounded-xl" />
          ))}
        </div>
      </aside>

      {/* Main skeleton */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 animate-pulse">
        {/* Hero card */}
        <div className="h-40 bg-slate-300 rounded-2xl" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
        </div>
        <div className="h-32 bg-slate-200 rounded-2xl" />
      </main>

      {/* Mobile bottom nav skeleton */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#002664] animate-pulse" />
    </div>
  );
}
