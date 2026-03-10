import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-lg bg-neutral-100 animate-skeleton', className)} />
  )
}

/** Skeleton that mimics a DoctorCard layout */
export function DoctorCardSkeleton() {
  return (
    <div className="flex gap-5 rounded-2xl bg-white border border-border p-5 card-shadow">
      {/* Avatar */}
      <Skeleton className="w-24 h-24 md:w-28 md:h-28 rounded-2xl shrink-0" />
      {/* Info */}
      <div className="flex-1 flex flex-col justify-between gap-2">
        <div>
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-4 w-32 mb-3" />
          <div className="flex gap-3">
            <Skeleton className="h-7 w-28 rounded-lg" />
            <Skeleton className="h-7 w-36 rounded-lg" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-3.5 h-3.5 rounded-sm" />
            ))}
            <Skeleton className="h-4 w-8 ml-1" />
          </div>
          <Skeleton className="h-8 w-24 rounded-xl hidden sm:block" />
        </div>
      </div>
    </div>
  )
}

/** Skeleton that mimics an AppointmentCard layout */
export function AppointmentCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-4">
      <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Skeleton className="h-4 w-36 mb-1.5" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="mt-2 flex gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
    </div>
  )
}

/** Skeleton for favorite doctor items */
export function FavoriteDoctorSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
      <Skeleton className="w-14 h-14 rounded-xl shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-4 w-40 mb-1.5" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="w-8 h-8 rounded-full" />
    </div>
  )
}
