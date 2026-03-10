'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { appointmentsApi } from '@/lib/api/appointments'
import { AppointmentCard } from '@/components/cabinet/AppointmentCard'
import { cn } from '@/lib/utils'

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'Всі' },
  { key: 'pending', label: 'Очікують' },
  { key: 'confirmed', label: 'Підтверджені' },
  { key: 'completed', label: 'Завершені' },
  { key: 'cancelled', label: 'Скасовані' },
]

export default function AppointmentsPage() {
  const [status, setStatus] = useState<StatusFilter>('all')

  const { data, isLoading } = useQuery({
    queryKey: ['appointments', { status }],
    queryFn: () =>
      appointmentsApi.getUserAppointments(status !== 'all' ? { status } : undefined),
  })

  const appointments = data?.data ?? []

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground mb-5">Мої записи</h1>

      {/* Status tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-5 border-b border-border">
        {STATUS_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setStatus(key)}
            className={cn(
              'px-3 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg border-b-2 -mb-px transition-colors',
              status === key
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
            <div key={i} className="h-20 rounded-2xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          <p className="text-4xl mb-3">📅</p>
          <p className="font-medium">Записів немає</p>
        </div>
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
