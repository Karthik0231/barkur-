export default function AdminLoading() {
  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 shimmer-skeleton rounded-lg" />
          <div className="h-4 w-72 shimmer-skeleton rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 shimmer-skeleton rounded-lg" />
          <div className="h-9 w-32 shimmer-skeleton rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl p-5 border border-border bg-warm-white dark:bg-bg-secondary">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-4 w-24 shimmer-skeleton rounded" />
                <div className="h-8 w-32 shimmer-skeleton rounded" />
                <div className="h-3 w-20 shimmer-skeleton rounded" />
              </div>
              <div className="h-10 w-10 shimmer-skeleton rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl p-6 border border-border bg-warm-white dark:bg-bg-secondary">
          <div className="h-5 w-40 shimmer-skeleton rounded mb-4" />
          <div className="h-[280px] shimmer-skeleton rounded" />
        </div>
        <div className="rounded-xl p-6 border border-border bg-warm-white dark:bg-bg-secondary">
          <div className="h-5 w-32 shimmer-skeleton rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 shimmer-skeleton rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
