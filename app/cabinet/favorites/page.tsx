'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { favoritesApi } from '@/lib/api/favorites'

export default function FavoritesPage() {
  const queryClient = useQueryClient()

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorite-doctors'],
    queryFn: () => favoritesApi.getFavoriteDoctors(),
  })

  const toggle = useMutation({
    mutationFn: (doctorId: string) => favoritesApi.toggleFavoriteDoctor(doctorId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorite-doctors'] }),
  })

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground mb-5">Збережені лікарі</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : !favorites || favorites.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          <p className="text-4xl mb-3">❤️</p>
          <p className="font-medium">Збережених лікарів немає</p>
          <Link href="/likari" className="mt-4 inline-block text-sm text-primary hover:underline">
            Знайти лікаря →
          </Link>
        </div>
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
                  className="text-red-400 hover:text-red-600 transition-colors text-xl"
                  aria-label="Видалити зі збережених"
                >
                  ❤️
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
