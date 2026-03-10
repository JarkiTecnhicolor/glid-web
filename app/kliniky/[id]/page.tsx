'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { clinicsApi } from '@/lib/api/clinics'
import { catalogsApi } from '@/lib/api/catalogs'
import { appointmentsApi } from '@/lib/api/appointments'
import { useAuthStore } from '@/lib/store/auth'
import { useRouter } from 'next/navigation'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function FacilityProfilePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedAssistances, setSelectedAssistances] = useState<string[]>([])
  const [bookingStep, setBookingStep] = useState<'browse' | 'confirm' | 'success'>('browse')

  const { data: facility, isLoading } = useQuery({
    queryKey: ['facility', id],
    queryFn: () => clinicsApi.getLabAdvancedData(id),
  })

  const { data: assistances } = useQuery({
    queryKey: ['lab-assistances', id],
    queryFn: () => catalogsApi.getLabAssistances(id),
  })

  const { data: slots } = useQuery({
    queryKey: ['lab-slots', id, selectedDate],
    queryFn: () => clinicsApi.getLabFreeTimeslots(id, selectedDate ?? undefined),
    enabled: !!selectedDate,
  })

  const createAppointment = useMutation({
    mutationFn: () =>
      appointmentsApi.createLabAppointment({
        facilityId: id,
        date: selectedDate ?? '',
        time: slots?.find((s) => s.id === selectedSlot)?.time ?? '',
        slotId: selectedSlot ?? '',
        assistanceIds: selectedAssistances,
      }),
    onSuccess: () => setBookingStep('success'),
  })

  function toggleAssistance(aId: string) {
    setSelectedAssistances((prev) =>
      prev.includes(aId) ? prev.filter((x) => x !== aId) : [...prev, aId]
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-card border border-border rounded-2xl" />
          <div className="h-64 bg-card border border-border rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!facility) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-20 text-center text-muted-foreground">
        <p className="text-5xl mb-4">🏥</p>
        <p className="text-lg font-medium">Заклад не знайдено</p>
      </div>
    )
  }

  const availableSlots = slots?.filter((s) => s.available) ?? []
  const selectedSlotTime = slots?.find((s) => s.id === selectedSlot)?.time

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-4xl space-y-6">
      {/* Header card */}
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col md:flex-row gap-6">
        {facility.logo ? (
          <img
            src={facility.logo}
            alt={facility.name}
            className="w-24 h-24 rounded-2xl object-contain border border-border self-start"
          />
        ) : (
          <div className="w-24 h-24 rounded-2xl bg-glid-green-light flex items-center justify-center text-4xl shrink-0">
            {facility.type === 'lab' ? '🧪' : '🏥'}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{facility.name}</h1>
            <span className="text-xs rounded-full bg-glid-green-light text-glid-green-dark px-3 py-1 font-medium shrink-0">
              {facility.type === 'lab' ? 'Лабораторія' : facility.type === 'clinic' ? 'Клініка' : 'Лікарня'}
            </span>
          </div>

          {facility.address && (
            <p className="mt-2 text-sm text-muted-foreground">📍 {facility.address}</p>
          )}
          {facility.phone && (
            <a href={`tel:${facility.phone}`} className="mt-1 text-sm text-primary hover:underline block">
              📞 {facility.phone}
            </a>
          )}
          {facility.workingHours && (
            <p className="mt-1 text-sm text-muted-foreground">🕐 {facility.workingHours}</p>
          )}
          {facility.rating !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              <span className="text-glid-green">★</span>
              <span className="font-medium">{facility.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {/* About */}
      {facility.about && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-3">Про заклад</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{facility.about}</p>
        </div>
      )}

      {/* Services */}
      {assistances && assistances.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-4">Послуги та аналізи</h2>
          <div className="space-y-2">
            {assistances.map((a) => (
              <label
                key={a.id}
                className={cn(
                  'flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-colors',
                  selectedAssistances.includes(a.id)
                    ? 'border-primary bg-glid-green-light'
                    : 'border-border bg-background hover:border-primary/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedAssistances.includes(a.id)}
                    onChange={() => toggleAssistance(a.id)}
                    className="accent-primary w-4 h-4"
                  />
                  <span className="text-sm font-medium text-foreground">{a.name}</span>
                </div>
                {a.price !== undefined && (
                  <span className="text-sm font-semibold text-primary">{a.price} грн</span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Booking section */}
      {bookingStep === 'success' ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-foreground">Запис успішно створено!</h2>
          <p className="mt-2 text-muted-foreground">
            {facility.name} · {selectedDate && new Date(selectedDate).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })} · {selectedSlotTime}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/cabinet/appointments" className={buttonVariants()}>Мої записи</a>
            <button onClick={() => { setBookingStep('browse'); setSelectedDate(null); setSelectedSlot(null) }} className={buttonVariants({ variant: 'outline' })}>
              Записатись ще раз
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-5">
            {bookingStep === 'confirm' ? 'Підтвердіть запис' : 'Записатись'}
          </h2>

          {bookingStep === 'confirm' ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-background p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Заклад</span>
                  <span className="font-medium">{facility.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Дата</span>
                  <span className="font-medium">
                    {selectedDate && new Date(selectedDate).toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Час</span>
                  <span className="font-medium">{selectedSlotTime}</span>
                </div>
                {selectedAssistances.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Послуг обрано</span>
                    <span className="font-medium">{selectedAssistances.length}</span>
                  </div>
                )}
              </div>

              {createAppointment.isError && (
                <p className="text-sm text-destructive text-center">Помилка запису. Спробуйте ще раз.</p>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setBookingStep('browse')} className="flex-1">
                  Назад
                </Button>
                <Button onClick={() => createAppointment.mutate()} disabled={createAppointment.isPending} className="flex-1">
                  {createAppointment.isPending ? 'Запис…' : 'Підтвердити'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Date selection */}
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Оберіть дату</p>
                <div className="flex flex-wrap gap-2">
                  {/* Generate next 7 days as date options */}
                  {Array.from({ length: 7 }).map((_, i) => {
                    const date = new Date()
                    date.setDate(date.getDate() + i)
                    const dateStr = date.toISOString().split('T')[0]
                    return (
                      <button
                        key={dateStr}
                        onClick={() => { setSelectedDate(dateStr); setSelectedSlot(null) }}
                        className={cn(
                          'px-3 py-2 rounded-xl text-sm font-medium border transition-colors',
                          selectedDate === dateStr
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border text-foreground hover:border-primary'
                        )}
                      >
                        {date.toLocaleDateString('uk-UA', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Slot selection */}
              {selectedDate && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Оберіть час</p>
                  {availableSlots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Немає вільних слотів на цю дату</p>
                  ) : (
                    <div className="grid grid-cols-5 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot.id)}
                          className={cn(
                            'py-2 rounded-lg border text-sm font-medium transition-colors',
                            selectedSlot === slot.id
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background border-border text-foreground hover:border-primary'
                          )}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={() => {
                  if (!isAuthenticated) {
                    router.push(`/auth/login?from=/kliniky/${id}`)
                    return
                  }
                  setBookingStep('confirm')
                }}
                disabled={!selectedDate || !selectedSlot}
                className="w-full"
              >
                {isAuthenticated ? 'Продовжити' : 'Увійти для запису'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
