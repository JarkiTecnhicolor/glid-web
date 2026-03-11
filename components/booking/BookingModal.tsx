'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { doctorsApi } from '@/lib/api/doctors'
import { appointmentsApi } from '@/lib/api/appointments'
import { useAuthStore } from '@/lib/store/auth'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { DoctorAssistance } from '@/types/api'

interface Props {
  doctorId: string
  doctorName: string
  specialtyId?: string
  open: boolean
  onClose: () => void
}

type Step = 'service' | 'slot' | 'confirm' | 'success'

type SlotItem = { date?: string; time?: string; id?: string; available?: boolean }

export function BookingModal({ doctorId, doctorName, specialtyId, open, onClose }: Props) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  const [step, setStep] = useState<Step>('service')
  const [selectedAssistance, setSelectedAssistance] = useState<DoctorAssistance | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<SlotItem | null>(null)

  // Step 1: Load doctor's services
  const { data: assistances, isLoading: assistancesLoading } = useQuery({
    queryKey: ['doctor-assistances', doctorId],
    queryFn: () => doctorsApi.getDoctorAssistances(doctorId),
    enabled: open,
  })

  // Step 2: Load free timeslots (only when assistance is selected)
  const today = new Date()
  const fromDate = today.toISOString().split('T')[0]
  const toDate = new Date(today.getTime() + 14 * 86400000).toISOString().split('T')[0]

  const { data: timeslots, isLoading: slotsLoading } = useQuery({
    queryKey: ['doctor-timeslots-booking', doctorId, selectedAssistance?.id, fromDate, toDate],
    queryFn: () =>
      doctorsApi.getDoctorFreeTimeslots({
        doctorId,
        from: fromDate,
        to: toDate,
        assistanceId: String(selectedAssistance!.id),
        spesialityId: specialtyId,
      }),
    enabled: open && !!selectedAssistance,
  })

  // Group timeslots by date
  const allSlots: SlotItem[] = (timeslots as SlotItem[] | undefined) ?? []
  const dateSet = [...new Set(allSlots.map((s) => s.date).filter(Boolean))] as string[]
  const slotsForDate = selectedDate ? allSlots.filter((s) => s.date === selectedDate) : []

  // Step 3: Create appointment
  const createAppointment = useMutation({
    mutationFn: () =>
      appointmentsApi.createClinicAppointment({
        doctorId,
        date: selectedDate ?? '',
        time: selectedSlot?.time ?? '',
        state: 'SCHEDULED',
        assistanceId: String(selectedAssistance!.id),
        paymentData: { type: 'CASH' },
      }),
    onSuccess: () => {
      setStep('success')
    },
  })

  function handleSelectAssistance(assistance: DoctorAssistance) {
    setSelectedAssistance(assistance)
    setSelectedDate(null)
    setSelectedSlot(null)
    setStep('slot')
  }

  function handleProceedToConfirm() {
    if (!isAuthenticated) {
      router.push(`/auth/login?from=/likari/${doctorId}`)
      return
    }
    setStep('confirm')
  }

  function handleBook() {
    createAppointment.mutate()
  }

  function handleClose() {
    setStep('service')
    setSelectedAssistance(null)
    setSelectedDate(null)
    setSelectedSlot(null)
    onClose()
  }

  function handleBack() {
    if (step === 'confirm') {
      setStep('slot')
    } else if (step === 'slot') {
      setStep('service')
      setSelectedDate(null)
      setSelectedSlot(null)
    }
  }

  if (!open) return null

  const stepLabels: Record<Step, string> = {
    service: 'Оберіть послугу',
    slot: 'Оберіть дату та час',
    confirm: 'Підтвердження',
    success: 'Запис створено!',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            {(step === 'slot' || step === 'confirm') && (
              <button onClick={handleBack} className="text-muted-foreground hover:text-foreground">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}
            <h2 className="font-semibold text-lg text-foreground">{stepLabels[step]}</h2>
          </div>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* ── Step: Service ── */}
          {step === 'service' && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-4">
                Лікар: <span className="font-medium text-foreground">{doctorName}</span>
              </p>
              {assistancesLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-16 bg-card border border-border rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : !assistances || assistances.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Послуги не знайдені</p>
              ) : (
                assistances.map((a: DoctorAssistance) => (
                  <button
                    key={a.id}
                    onClick={() => handleSelectAssistance(a)}
                    className="w-full flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left hover:border-primary/40 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{a.name}</p>
                      {a.duration && (
                        <p className="text-xs text-muted-foreground mt-0.5">{a.duration} хв</p>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-primary ml-3 shrink-0">{a.price} грн</span>
                  </button>
                ))
              )}
            </div>
          )}

          {/* ── Step: Slot ── */}
          {step === 'slot' && (
            <div className="space-y-6">
              {/* Selected service badge */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Послуга:</span>
                <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-0.5 text-xs font-medium">
                  {selectedAssistance?.name}
                </span>
              </div>

              {/* Date picker */}
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Оберіть дату</p>
                {slotsLoading ? (
                  <p className="text-sm text-muted-foreground">Завантаження розкладу...</p>
                ) : dateSet.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Немає вільних дат на найближчі 2 тижні</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {dateSet.map((date) => (
                      <button
                        key={date}
                        onClick={() => { setSelectedDate(date); setSelectedSlot(null) }}
                        className={cn(
                          'px-3 py-2 rounded-xl text-sm font-medium border transition-colors',
                          selectedDate === date
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border text-foreground hover:border-primary'
                        )}
                      >
                        {new Date(date).toLocaleDateString('uk-UA', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Slot picker */}
              {selectedDate && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Оберіть час</p>
                  {slotsForDate.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Немає вільних слотів</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {slotsForDate.map((slot) => (
                        <button
                          key={slot.id ?? slot.time}
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            'py-2 rounded-lg border text-sm font-medium transition-colors',
                            selectedSlot?.id === slot.id || selectedSlot?.time === slot.time
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
            </div>
          )}

          {/* ── Step: Confirm ── */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Підтвердіть запис:</p>
              <div className="rounded-xl border border-border bg-card p-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Лікар</span>
                  <span className="font-medium text-foreground">{doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Послуга</span>
                  <span className="font-medium text-foreground text-right max-w-[200px] truncate">{selectedAssistance?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Дата</span>
                  <span className="font-medium text-foreground">
                    {selectedDate && new Date(selectedDate).toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Час</span>
                  <span className="font-medium text-foreground">{selectedSlot?.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Вартість</span>
                  <span className="font-semibold text-primary">{selectedAssistance?.price} грн</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Оплата</span>
                  <span className="font-medium text-foreground">Готівка</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Назад
                </Button>
                <Button
                  onClick={handleBook}
                  disabled={createAppointment.isPending}
                  className="flex-1"
                >
                  {createAppointment.isPending ? 'Запис...' : 'Підтвердити'}
                </Button>
              </div>
              {createAppointment.isError && (
                <p className="text-sm text-destructive text-center">Помилка запису. Спробуйте ще раз.</p>
              )}
            </div>
          )}

          {/* ── Step: Success ── */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="oklch(0.548 0.128 151)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">Запис створено!</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {doctorName}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedAssistance?.name}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {selectedDate && new Date(selectedDate).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })} · {selectedSlot?.time}
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <Button onClick={() => { router.push('/cabinet/appointments'); handleClose() }}>
                  Мої записи
                </Button>
                <Button variant="ghost" onClick={handleClose}>
                  Закрити
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer button for slot step */}
        {step === 'slot' && (
          <div className="px-5 py-4 border-t border-border">
            <Button
              onClick={handleProceedToConfirm}
              disabled={!selectedDate || !selectedSlot}
              className="w-full"
            >
              {isAuthenticated ? 'Продовжити' : 'Увійти для запису'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
