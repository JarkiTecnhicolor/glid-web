'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/store/auth'
import { appointmentsApi } from '@/lib/api/appointments'
import { AppointmentCard } from '@/components/cabinet/AppointmentCard'
import { buttonVariants } from '@/components/ui/button'

export default function CabinetPage() {
  const { user } = useAuthStore()

  const { data } = useQuery({
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
          <div className="text-3xl mb-2">🔍</div>
          <p className="font-medium text-foreground text-sm">Знайти лікаря</p>
          <p className="text-xs text-muted-foreground mt-0.5">Записатись на прийом</p>
        </Link>
        <Link
          href="/cabinet/appointments"
          className="rounded-2xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/40 transition-all"
        >
          <div className="text-3xl mb-2">📅</div>
          <p className="font-medium text-foreground text-sm">Мої записи</p>
          <p className="text-xs text-muted-foreground mt-0.5">Переглянути всі</p>
        </Link>
        <Link
          href="/cabinet/favorites"
          className="rounded-2xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/40 transition-all"
        >
          <div className="text-3xl mb-2">❤️</div>
          <p className="font-medium text-foreground text-sm">Збережені</p>
          <p className="text-xs text-muted-foreground mt-0.5">Улюблені лікарі</p>
        </Link>
        <Link
          href="/cabinet/profile"
          className="rounded-2xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/40 transition-all"
        >
          <div className="text-3xl mb-2">👤</div>
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
        {upcoming.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            <p className="text-4xl mb-3">📅</p>
            <p className="font-medium">Записів немає</p>
            <Link
              href="/likari"
              className={buttonVariants({ size: 'sm', className: 'mt-4' })}
            >
              Знайти лікаря
            </Link>
          </div>
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
