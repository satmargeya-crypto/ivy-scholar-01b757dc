export function LoadingState() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading universities...</p>
      </div>
    </div>
  );
}

export function UniversityCardSkeleton() {
  return (
    <div className="card-editorial rounded-xl overflow-hidden animate-pulse">
      <div className="p-6 md:p-8">
        <div className="h-6 bg-muted rounded w-3/4 mb-2" />
        <div className="h-4 bg-muted rounded w-1/2 mb-6" />
        <div className="flex gap-2 mb-6">
          <div className="h-6 bg-muted rounded-full w-20" />
          <div className="h-6 bg-muted rounded-full w-24" />
          <div className="h-6 bg-muted rounded-full w-20" />
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
          <div>
            <div className="h-6 bg-muted rounded w-12 mb-1" />
            <div className="h-3 bg-muted rounded w-16" />
          </div>
          <div>
            <div className="h-6 bg-muted rounded w-12 mb-1" />
            <div className="h-3 bg-muted rounded w-16" />
          </div>
          <div>
            <div className="h-6 bg-muted rounded w-12 mb-1" />
            <div className="h-3 bg-muted rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
