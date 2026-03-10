import Link from 'next/link'
import type { Facility } from '@/types/api'
import { cn } from '@/lib/utils'

interface Props {
  facility: Facility
}

const TYPE_LABEL: Record<string, string> = {
  clinic: 'Клініка',
  lab: 'Лабораторія',
  hospital: 'Лікарня',
}

export function FacilityCard({ facility }: Props) {
  return (
    <Link
      href={`/kliniky/${facility.id}`}
      className="group flex gap-4 rounded-2xl border border-border bg-card p-4 md:p-5 hover:shadow-md hover:border-primary/40 transition-all"
    >
      {/* Logo */}
      <div className="shrink-0">
        {facility.logo ? (
          <img
            src={facility.logo}
            alt={facility.name}
            className="w-16 h-16 rounded-xl object-contain bg-background border border-border"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-glid-green-light flex items-center justify-center text-2xl">
            {facility.type === 'lab' ? '🧪' : '🏥'}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground text-sm md:text-base group-hover:text-primary transition-colors truncate">
            {facility.name}
          </h3>
          <span className="shrink-0 text-xs rounded-full bg-glid-green-light text-glid-green-dark px-2 py-0.5 font-medium">
            {TYPE_LABEL[facility.type] ?? facility.type}
          </span>
        </div>

        {facility.address && (
          <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1 truncate">
            <span>📍</span>
            {facility.address}
          </p>
        )}

        {facility.phone && (
          <p className="mt-0.5 text-sm text-muted-foreground">
            📞 {facility.phone}
          </p>
        )}

        {facility.rating !== undefined && (
          <div className="mt-2 flex items-center gap-1">
            <span className="text-glid-green text-sm">★</span>
            <span className="text-sm font-medium">{facility.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
