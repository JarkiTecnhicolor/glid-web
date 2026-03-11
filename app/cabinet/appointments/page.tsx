'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { appointmentsApi } from '@/lib/api/appointments'
import { AppointmentCard } from '@/components/cabinet/AppointmentCard'
import { AppointmentCardSkeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { cn } from '@/lib/utils'

type TypeFilter = 'ALL' | 'UPCOMING' | 'PAST'

const TYPE_TABS: { key: TypeFilter; label: string }[] = [
  { key: 'ALL', label: 'Всі' },
  { key: 'UPCOMING', label: 'Майбутні' },
  { key: 'PAST', label: 'Минулі' },
]

const EMPTY_MESSAGES: Record<TypeFilter, string> = {
  ALL: 'У вас поки немає записів',
  UPCOMING: 'Немає майбутніх записів',
  PAST: 'Немає минулих записів',
}

export default function AppointmentsPage() {
  const [type, setType] = useState<TypeFilter>('ALL')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['appointments', { type }],
    queryFn: () => appointmentsApi.getUserAppointments({ type }),
  })

  const appointments = data?.data ?? []

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground mb-5">Мої записи</h1>

      {/* Status tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-5 border-b border-border">
        {TYPE_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setType(key)}
            className={cn(
              'px-3 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg border-b-2 -mb-px transition-colors',
              type === key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <AppointmentCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState variant="server" onRetry={() => refetch()} />
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
          title={EMPTY_MESSAGES[type]}
          description="Знайдіть лікаря та запишіться на прийом"
          action={{ label: 'Знайти лікаря', href: '/likari' }}
        />
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} />
          ))}
        </div>
      )}
    </div>
  )
}
