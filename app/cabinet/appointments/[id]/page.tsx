'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentsApi } from '@/lib/api/appointments'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AppointmentStatus } from '@/types/api'

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; className: string }> = {
  pending: { label: 'Очікує підтвердження', className: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Підтверджено', className: 'bg-glid-green-light text-glid-green-dark' },
  completed: { label: 'Завершено', className: 'bg-muted text-muted-foreground' },
  cancelled: { label: 'Скасовано', className: 'bg-red-100 text-red-800' },
}

export default function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [cancelConfirm, setCancelConfirm] = useState(false)

  // We fetch the appointments list and find the one by id
  const { data: allAppointments, isLoading } = useQuery({
    queryKey: ['appointments', {}],
    queryFn: () => appointmentsApi.getUserAppointments({ limit: 100 }),
  })

  const appointment = allAppointments?.data.find((a) => a.id === id)

  const { data: diagnoses } = useQuery({
    queryKey: ['diagnoses', id],
    queryFn: () => appointmentsApi.getAppointmentDiagnoses(id),
    enabled: !!appointment && appointment.status === 'completed',
  })

  const { data: attachments } = useQuery({
    queryKey: ['attachments', id],
    queryFn: () => appointmentsApi.getAppointmentAttachments(id),
    enabled: !!appointment && appointment.status === 'completed',
  })

  const cancelMutation = useMutation({
    mutationFn: () => appointmentsApi.cancelUserAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      router.push('/cabinet/appointments')
    },
  })

  const getDownloadLink = useMutation({
    mutationFn: (attachmentId: string) => appointmentsApi.getAttachmentDownloadLink(attachmentId),
    onSuccess: ({ url }) => window.open(url, '_blank'),
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-card border border-border rounded-xl w-32" />
          <div className="h-40 bg-card border border-border rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-20 text-center text-muted-foreground">
        <p className="text-4xl mb-3">📅</p>
        <p className="font-medium">Запис не знайдено</p>
        <button onClick={() => router.back()} className="mt-4 text-primary text-sm hover:underline">
          ← Назад
        </button>
      </div>
    )
  }

  const status = STATUS_CONFIG[appointment.status] ?? STATUS_CONFIG.pending
  const dateStr = new Date(appointment.date).toLocaleDateString('uk-UA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const canCancel = appointment.status === 'pending' || appointment.status === 'confirmed'

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-2xl space-y-5">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
      >
        ← Мої записи
      </button>

      {/* Main card */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-3 mb-5">
          <h1 className="text-lg font-bold text-foreground">Деталі запису</h1>
          <span className={cn('text-xs rounded-full px-3 py-1 font-medium', status.className)}>
            {status.label}
          </span>
        </div>

        <div className="flex items-center gap-4 pb-5 border-b border-border">
          {appointment.doctorPhoto ? (
            <img
              src={appointment.doctorPhoto}
              alt={appointment.doctorName}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-glid-green-light flex items-center justify-center text-xl font-bold text-glid-green shrink-0">
              {appointment.doctorName?.[0] ?? '?'}
            </div>
          )}
          <div>
            <p className="font-semibold text-foreground">{appointment.doctorName}</p>
            {appointment.doctorSpeciality && (
              <p className="text-sm text-muted-foreground">{appointment.doctorSpeciality}</p>
            )}
          </div>
        </div>

        <div className="pt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Дата</span>
            <span className="font-medium text-foreground">{dateStr}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Час</span>
            <span className="font-medium text-foreground">{appointment.time}</span>
          </div>
          {appointment.facilityName && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Заклад</span>
              <span className="font-medium text-foreground">{appointment.facilityName}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Тип</span>
            <span className="font-medium text-foreground capitalize">
              {appointment.type === 'online' ? 'Онлайн' : appointment.type === 'lab' ? 'Лабораторія' : 'Клініка'}
            </span>
          </div>
        </div>
      </div>

      {/* Diagnoses (for completed) */}
      {diagnoses && diagnoses.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-4">Діагнози</h2>
          <div className="space-y-3">
            {diagnoses.map((d) => (
              <div key={d.id} className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-center gap-2">
                  {d.code && (
                    <span className="text-xs rounded bg-muted px-2 py-0.5 font-mono text-muted-foreground">
                      {d.code}
                    </span>
                  )}
                  <p className="text-sm font-medium text-foreground">{d.name}</p>
                </div>
                {d.description && (
                  <p className="mt-2 text-xs text-muted-foreground">{d.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attachments (for completed) */}
      {attachments && attachments.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-4">Документи</h2>
          <div className="space-y-2">
            {attachments.map((att) => (
              <div key={att.id} className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl">📄</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{att.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {att.type} {att.size ? `· ${Math.round(att.size / 1024)} KB` : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => getDownloadLink.mutate(att.id)}
                  disabled={getDownloadLink.isPending}
                  className="shrink-0 text-sm text-primary hover:underline ml-3"
                >
                  Завантажити
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel button */}
      {canCancel && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-3">Скасування запису</h2>
          {cancelConfirm ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Ви впевнені, що хочете скасувати запис? Цю дію не можна відмінити.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setCancelConfirm(false)} className="flex-1">
                  Назад
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => cancelMutation.mutate()}
                  disabled={cancelMutation.isPending}
                  className="flex-1"
                >
                  {cancelMutation.isPending ? 'Скасування…' : 'Так, скасувати'}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setCancelConfirm(true)}>
              Скасувати запис
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
