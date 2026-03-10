'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/store/auth'
import { appointmentsApi } from '@/lib/api/appointments'
import { AppointmentCard } from '@/components/cabinet/AppointmentCard'
import { AppointmentCardSkeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { buttonVariants } from '@/components/ui/button'

export default function CabinetPage() {
  const { user } = useAuthStore()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['appointments', { status: 'pending', limit: 3 }],
    queryFn: () => appointmentsApi.getUserAppointments({ status: 'pending', limit: 3 }),
  })

  const upcoming = data?.data ?? []

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h1 className="text-xl font-bold text-foreground">
          Привіт, {user?.firstName ?? 'пацієнте'}! 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Управляйте своїми записами та медичними даними
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/likari"
          className="rounded-2xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/40 transition-all"
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-000 text-primary-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p className="font-medium text-foreground text-sm">Знайти лікаря</p>
          <p className="text-xs text-muted-foreground mt-0.5">Записатись на прийом</p>
        </Link>
        <Link
          href="/cabinet/appointments"
          className="rounded-2xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/40 transition-all"
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-000 text-primary-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p className="font-medium text-foreground text-sm">Мої записи</p>
          <p className="text-xs text-muted-foreground mt-0.5">Переглянути всі</p>
        </Link>
        <Link
          href="/cabinet/favorites"
          className="rounded-2xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/40 transition-all"
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-support-error-100 text-support-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <p className="font-medium text-foreground text-sm">Збережені</p>
          <p className="text-xs text-muted-foreground mt-0.5">Улюблені лікарі</p>
        </Link>
        <Link
          href="/cabinet/profile"
          className="rounded-2xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/40 transition-all"
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-000 text-primary-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <p className="font-medium text-foreground text-sm">Профіль</p>
          <p className="text-xs text-muted-foreground mt-0.5">Налаштування</p>
        </Link>
      </div>

      {/* Upcoming appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Майбутні записи</h2>
          <Link href="/cabinet/appointments" className="text-sm text-primary hover:underline">
            Всі записи
          </Link>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <AppointmentCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <ErrorState variant="server" onRetry={() => refetch()} className="p-8" />
        ) : upcoming.length === 0 ? (
          <EmptyState
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
            title="Записів немає"
            description="Знайдіть лікаря та запишіться на прийом"
            action={{ label: 'Знайти лікаря', href: '/likari' }}
          />
        ) : (
          <div className="space-y-3">
            {upcoming.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
