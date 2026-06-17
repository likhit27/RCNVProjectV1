export default function AdminLoading() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar skeleton */}
      <aside className="hidden lg:flex w-60 flex-col bg-[#002664] shrink-0 animate-pulse">
        <div className="p-6 border-b border-white/10 space-y-2">
          <div className="h-2.5 w-20 bg-white/20 rounded" />
          <div className="h-4 w-36 bg-white/20 rounded" />
        </div>
        <div className="p-4 space-y-3 mt-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-9 bg-white/10 rounded-xl" />
          ))}
        </div>
      </aside>

      {/* Main skeleton */}
      <main className="flex-1 p-6 lg:p-8 space-y-5 animate-pulse">
        <div className="h-8 w-40 bg-slate-200 rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="h-48 bg-slate-200 rounded-2xl" />
          <div className="h-48 bg-slate-200 rounded-2xl" />
        </div>
      </main>
    </div>
  );
}
