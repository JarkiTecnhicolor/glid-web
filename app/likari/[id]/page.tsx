'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { doctorsApi } from '@/lib/api/doctors'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BookingModal } from '@/components/booking/BookingModal'

type Tab = 'info' | 'schedule' | 'services' | 'reviews'

export default function DoctorProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('info')
  const [bookingOpen, setBookingOpen] = useState(false)

  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const specialtyId = searchParams.get('specialtyId') ?? undefined

  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctor', id, specialtyId],
    queryFn: () => doctorsApi.getDoctorAdvancedData({ doctorId: id, specialtyId }),
  })

  const { data: reviews } = useQuery({
    queryKey: ['doctor-reviews', id],
    queryFn: () => doctorsApi.getDoctorReviews(id),
    enabled: activeTab === 'reviews',
  })

  const { data: assistances } = useQuery({
    queryKey: ['doctor-assistances', id],
    queryFn: () => doctorsApi.getDoctorAssistances(id),
    enabled: activeTab === 'services',
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-card border border-border rounded-2xl" />
          <div className="h-64 bg-card border border-border rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-20 text-center text-muted-foreground">
        <p className="text-5xl mb-4">🔍</p>
        <p className="text-lg font-medium">Лікаря не знайдено</p>
      </div>
    )
  }

  const fullName = [doctor.lastName, doctor.firstName, doctor.middleName].filter(Boolean).join(' ')

  const TABS: { key: Tab; label: string }[] = [
    { key: 'info', label: 'Інформація' },
    { key: 'schedule', label: 'Розклад' },
    { key: 'services', label: 'Послуги' },
    { key: 'reviews', label: 'Відгуки' },
  ]

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        {/* Doctor header card */}
        <div className="rounded-2xl border border-border bg-card p-6 flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="shrink-0 self-start">
            {doctor.photo ? (
              <img
                src={doctor.photo}
                alt={fullName}
                className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-glid-green-light flex items-center justify-center text-4xl font-bold text-glid-green">
                {(doctor.firstName?.[0] ?? '') + (doctor.lastName?.[0] ?? '')}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{fullName}</h1>
            {doctor.speciality && (
              <p className="mt-1 text-muted-foreground">{doctor.speciality}</p>
            )}

            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              {doctor.experience !== undefined && (
                <div>
                  <span className="text-muted-foreground">Досвід: </span>
                  <span className="font-medium">{doctor.experience} р.</span>
                </div>
              )}
              {doctor.rating != null && (
                <div className="flex items-center gap-1">
                  <span className="text-glid-green">★</span>
                  <span className="font-medium">{doctor.rating.toFixed(1)}</span>
                  {doctor.reviewCount !== undefined && (
                    <span className="text-muted-foreground">({doctor.reviewCount} відгуків)</span>
                  )}
                </div>
              )}
              {doctor.isOnline && (
                <span className="inline-flex items-center gap-1 text-xs rounded-full bg-glid-green-light text-glid-green-dark px-2 py-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-glid-green inline-block" />
                  Онлайн-консультація
                </span>
              )}
            </div>

            {doctor.price !== undefined && (
              <p className="mt-3 text-lg font-semibold text-foreground">
                від <span className="text-primary">{doctor.price} грн</span>
              </p>
            )}

            <button
              onClick={() => setBookingOpen(true)}
              className={cn(buttonVariants({ size: 'lg' }), 'mt-4')}
            >
              Записатись на прийом
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-border flex gap-0">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                'px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px',
                activeTab === key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mt-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {doctor.about && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h2 className="font-semibold text-foreground mb-3">Про лікаря</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{doctor.about}</p>
                </div>
              )}
              {doctor.education && doctor.education.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h2 className="font-semibold text-foreground mb-3">Освіта</h2>
                  <ul className="space-y-2">
                    {doctor.education.map((edu, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-glid-green mt-0.5">◆</span>
                        {edu}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {doctor.categories && doctor.categories.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h2 className="font-semibold text-foreground mb-3">Категорії та звання</h2>
                  <div className="flex flex-wrap gap-2">
                    {doctor.categories.map((cat) => (
                      <span key={cat} className="text-xs rounded-full bg-glid-green-light text-glid-green-dark px-3 py-1 font-medium">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {!doctor.about && !doctor.education?.length && !doctor.categories?.length && (
                <p className="text-center text-muted-foreground py-8">Інформація відсутня</p>
              )}
            </div>
          )}

          {activeTab === 'schedule' && (
            <ScheduleTab doctorId={id} onBook={() => setBookingOpen(true)} />
          )}

          {activeTab === 'services' && (
            <div className="space-y-3">
              {assistances === undefined ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-14 bg-card border border-border rounded-xl animate-pulse" />
                ))
              ) : assistances.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Послуги не вказані</p>
              ) : (
                assistances.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4">
                    <p className="text-sm font-medium text-foreground">{a.name}</p>
                    <p className="text-sm text-primary font-semibold">{a.price} грн</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {reviews === undefined ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-24 bg-card border border-border rounded-2xl animate-pulse" />
                ))
              ) : reviews.data.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Відгуків ще немає</p>
              ) : (
                reviews.data.map((review) => (
                  <div key={review.id} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-glid-green-light flex items-center justify-center text-sm font-bold text-glid-green">
                        {review.userName?.[0] ?? '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{review.userName}</p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={cn('text-sm', i < review.rating ? 'text-glid-green' : 'text-muted')}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <BookingModal
        doctorId={id}
        doctorName={fullName}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </>
  )
}

function ScheduleTab({ doctorId, onBook }: { doctorId: string; onBook: () => void }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Generate date range: today + 7 days
  const today = new Date()
  const fromDate = today.toISOString().split('T')[0]
  const toDate = new Date(today.getTime() + 7 * 86400000).toISOString().split('T')[0]

  const { data: timeslots, isLoading } = useQuery({
    queryKey: ['doctor-timeslots', doctorId, fromDate, toDate],
    queryFn: () => doctorsApi.getDoctorFreeTimeslots({ doctorId, from: fromDate, to: toDate }),
  })

  // Group timeslots by date for day selection
  const timeslotData = (timeslots as { date?: string; time?: string; id?: string; available?: boolean }[] | undefined) ?? []
  const dateSet = [...new Set(timeslotData.map((s: { date?: string }) => s.date).filter(Boolean))]

  const slotsForDate = selectedDate
    ? timeslotData.filter((s: { date?: string }) => s.date === selectedDate)
    : []

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="h-24 bg-card border border-border rounded-2xl animate-pulse" />
      ) : dateSet.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-4xl mb-3">📅</p>
          <p>Доступних записів немає</p>
        </div>
      ) : (
        <>
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Оберіть дату</p>
            <div className="flex flex-wrap gap-2">
              {dateSet.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date as string)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium border transition-colors',
                    selectedDate === date
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border text-foreground hover:border-primary'
                  )}
                >
                  {new Date(date as string).toLocaleDateString('uk-UA', { weekday: 'short', day: 'numeric', month: 'short' })}
                </button>
              ))}
            </div>
          </div>

          {selectedDate && slotsForDate.length > 0 && (
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Вільні слоти</p>
              <div className="flex flex-wrap gap-2">
                {slotsForDate.map((slot: { id?: string; time?: string }) => (
                  <button
                    key={slot.id}
                    onClick={onBook}
                    className="px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedDate && slotsForDate.length === 0 && (
            <p className="text-sm text-muted-foreground">Немає вільних слотів на цю дату</p>
          )}
        </>
      )}
    </div>
  )
}
