export function LoadingSkeleton({ rows = 3, className = "" }: { rows?: number; className?: string }) {
  return <div className={`space-y-3 ${className}`} aria-label="Loading"><div className="h-5 w-40 animate-pulse rounded bg-slate-200" />{Array.from({ length: rows }).map((_, index) => <div key={index} className="card p-4"><div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" /><div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-100" /><div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-slate-100" /></div>)}</div>;
}
