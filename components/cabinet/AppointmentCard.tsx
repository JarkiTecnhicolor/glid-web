import Link from 'next/link'
import type { Appointment, AppointmentStatus } from '@/types/api'
import { cn } from '@/lib/utils'

interface Props {
  appointment: Appointment
}

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; className: string }> = {
  pending: { label: 'Очікує', className: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Підтверджено', className: 'bg-glid-green-light text-glid-green-dark' },
  completed: { label: 'Завершено', className: 'bg-muted text-muted-foreground' },
  cancelled: { label: 'Скасовано', className: 'bg-red-100 text-red-800' },
}

export function AppointmentCard({ appointment }: Props) {
  const status = (appointment.status ? STATUS_CONFIG[appointment.status] : undefined) ?? STATUS_CONFIG.pending

  const dateStr = new Date(appointment.date).toLocaleDateString('uk-UA', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  })

  return (
    <Link
      href={`/cabinet/appointments/${appointment.id}`}
      className="flex gap-4 rounded-2xl border border-border bg-card p-4 hover:shadow-sm hover:border-primary/30 transition-all"
    >
      {/* Doctor avatar */}
      {appointment.doctorPhoto ? (
        <img
          src={appointment.doctorPhoto}
          alt={appointment.doctorName}
          className="w-12 h-12 rounded-xl object-cover shrink-0"
        />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-glid-green-light flex items-center justify-center text-lg font-bold text-glid-green shrink-0">
          {appointment.doctorName?.[0] ?? '?'}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium text-foreground text-sm truncate">{appointment.doctorName}</p>
            {appointment.doctorSpeciality && (
              <p className="text-xs text-muted-foreground truncate">{appointment.doctorSpeciality}</p>
            )}
          </div>
          <span className={cn('text-xs rounded-full px-2.5 py-0.5 font-medium shrink-0', status.className)}>
            {status.label}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          <span>📅 {dateStr}</span>
          <span>🕐 {appointment.time}</span>
          {appointment.facilityName && <span>🏥 {appointment.facilityName}</span>}
        </div>
      </div>
    </Link>
  )
}
