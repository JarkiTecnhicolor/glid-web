'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { favoritesApi } from '@/lib/api/favorites'
import { FavoriteDoctorSkeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'

export default function FavoritesPage() {
  const queryClient = useQueryClient()

  const { data: favorites, isLoading, isError, refetch } = useQuery({
    queryKey: ['favorite-doctors'],
    queryFn: () => favoritesApi.getFavoriteDoctors(),
  })

  const toggle = useMutation({
    mutationFn: (doctorId: string) => favoritesApi.setFavoriteDoctor(doctorId, false),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorite-doctors'] }),
  })

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground mb-5">Збережені лікарі</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <FavoriteDoctorSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState variant="server" onRetry={() => refetch()} />
      ) : !favorites || favorites.length === 0 ? (
        <EmptyState
          icon={
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          }
          title="Збережених лікарів немає"
          description="Додайте лікарів до збережених, щоб швидко їх знаходити"
          action={{ label: 'Знайти лікаря', href: '/likari' }}
        />
      ) : (
        <div className="space-y-3">
          {favorites.map((doctor) => {
            const fullName = [doctor.lastName, doctor.firstName, doctor.middleName].filter(Boolean).join(' ')
            return (
              <div
                key={doctor.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
              >
                {doctor.photo ? (
                  <img
                    src={doctor.photo}
                    alt={fullName}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-glid-green-light flex items-center justify-center text-xl font-bold text-glid-green shrink-0">
                    {(doctor.firstName?.[0] ?? '') + (doctor.lastName?.[0] ?? '')}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Link href={`/likari/${doctor.id}`} className="font-medium text-foreground hover:text-primary transition-colors truncate block">
                    {fullName}
                  </Link>
                  {doctor.speciality && (
                    <p className="text-sm text-muted-foreground">{doctor.speciality}</p>
                  )}
                </div>
                <button
                  onClick={() => toggle.mutate(doctor.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-support-error hover:bg-support-error-100 transition-colors"
                  aria-label="Видалити зі збережених"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
