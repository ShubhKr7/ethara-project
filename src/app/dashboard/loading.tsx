export default function DashboardLoading() {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-10">
        <div className="h-4 w-32 bg-white/5 rounded-full mb-3" />
        <div className="h-12 w-2/3 bg-white/10 rounded-2xl" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl border border-white/5 bg-white/3 p-5" />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 w-40 bg-white/10 rounded-full" />
          <div className="h-4 w-20 bg-white/5 rounded-full" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-2xl border border-white/5 bg-white/2" />
        ))}
      </div>
    </div>
  );
}
