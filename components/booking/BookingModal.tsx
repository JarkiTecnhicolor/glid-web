'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { doctorsApi } from '@/lib/api/doctors'
import { appointmentsApi } from '@/lib/api/appointments'
import { useAuthStore } from '@/lib/store/auth'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  doctorId: string
  doctorName: string
  open: boolean
  onClose: () => void
}

export function BookingModal({ doctorId, doctorName, open, onClose }: Props) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null)
  const [step, setStep] = useState<'slot' | 'confirm' | 'success'>('slot')

  const { data: schedule } = useQuery({
    queryKey: ['doctor-schedule', doctorId],
    queryFn: () => doctorsApi.getDoctorSchedules(doctorId),
    enabled: open,
  })

  const { data: slots } = useQuery({
    queryKey: ['doctor-slots', doctorId, selectedDate],
    queryFn: () => doctorsApi.getDoctorFreeTimeslots(doctorId, selectedDate ?? undefined),
    enabled: !!selectedDate && open,
  })

  const { data: facilities } = useQuery({
    queryKey: ['doctor-facilities', doctorId],
    queryFn: () => doctorsApi.getDoctorFacilities(doctorId),
    enabled: open,
  })

  const createAppointment = useMutation({
    mutationFn: () =>
      appointmentsApi.createClinicAppointment({
        doctorId,
        facilityId: selectedFacilityId ?? '',
        date: selectedDate ?? '',
        time: slots?.find((s) => s.id === selectedSlot)?.time ?? '',
        slotId: selectedSlot ?? '',
      }),
    onSuccess: () => {
      setStep('success')
    },
  })

  function handleConfirm() {
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
    setStep('slot')
    setSelectedDate(null)
    setSelectedSlot(null)
    onClose()
  }

  if (!open) return null

  const workDays = schedule?.workDays ?? []
  const availableSlots = slots?.filter((s) => s.available) ?? []
  const selectedSlotTime = slots?.find((s) => s.id === selectedSlot)?.time

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-lg text-foreground">
            {step === 'success' ? 'Запис підтверджено!' : 'Записатись на прийом'}
          </h2>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === 'success' ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-foreground">Запис успішно створено!</h3>
              <p className="mt-2 text-muted-foreground">
                {doctorName} · {selectedDate && new Date(selectedDate).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })} · {selectedSlotTime}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Переглянути ваші записи можна в особистому кабінеті
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
          ) : step === 'confirm' ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Підтвердіть запис:</p>
              <div className="rounded-xl border border-border bg-card p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Лікар</span>
                  <span className="font-medium text-foreground">{doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Дата</span>
                  <span className="font-medium text-foreground">
                    {selectedDate && new Date(selectedDate).toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Час</span>
                  <span className="font-medium text-foreground">{selectedSlotTime}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('slot')} className="flex-1">
                  Назад
                </Button>
                <Button
                  onClick={handleBook}
                  disabled={createAppointment.isPending}
                  className="flex-1"
                >
                  {createAppointment.isPending ? 'Запис…' : 'Підтвердити'}
                </Button>
              </div>
              {createAppointment.isError && (
                <p className="text-sm text-destructive text-center">Помилка запису. Спробуйте ще раз.</p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Date picker */}
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Оберіть дату</p>
                {workDays.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Завантаження розкладу…</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {workDays.map((day) => (
                      <button
                        key={day.date}
                        onClick={() => { setSelectedDate(day.date); setSelectedSlot(null) }}
                        className={cn(
                          'px-3 py-2 rounded-xl text-sm font-medium border transition-colors',
                          selectedDate === day.date
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border text-foreground hover:border-primary'
                        )}
                      >
                        {new Date(day.date).toLocaleDateString('uk-UA', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Slot picker */}
              {selectedDate && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Оберіть час</p>
                  {availableSlots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Немає вільних слотів</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
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
            </div>
          )}
        </div>

        {step === 'slot' && (
          <div className="px-5 py-4 border-t border-border">
            <Button
              onClick={handleConfirm}
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
