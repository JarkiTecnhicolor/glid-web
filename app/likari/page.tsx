'use client'

import { useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DoctorCard } from '@/components/doctors/DoctorCard'
import { DoctorFilters } from '@/components/doctors/DoctorFilters'
import { doctorsApi } from '@/lib/api/doctors'
import { PartnerCTASection } from '@/components/home/PartnerCTASection'

function DoctorsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const specialityId = searchParams.get('specialityId') ?? undefined
  const search = searchParams.get('search') ?? undefined
  const isOnlineParam = searchParams.get('isOnline')
  const isOnline = isOnlineParam === 'true' ? true : undefined

  const [localSearch, setLocalSearch] = useState(search ?? '')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['doctors', { search, specialityId, isOnline }],
    queryFn: () => doctorsApi.getDoctors({ search, specialityId, isOnline, limit: 20 }),
  })

  const doctors = data?.data ?? []
  const total = data?.total ?? 0

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (localSearch) {
      params.set('search', localSearch)
    } else {
      params.delete('search')
    }
    router.push(`/likari?${params.toString()}`)
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-background border-b border-border py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Знайти лікаря онлайн
          </h1>
          <p className="mt-2 text-muted-foreground">
            {total > 0 ? `${total} лікарів у базі` : 'Пошук лікарів'}
          </p>

          <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-xl">
            <Input
              placeholder="Спеціальність або прізвище лікаря"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Знайти</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFiltersOpen(true)}
            >
              Фільтри
            </Button>
          </form>

          {/* Active filters */}
          {(specialityId || isOnline) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {specialityId && (
                <span className="inline-flex items-center gap-1 text-xs rounded-full bg-glid-green-light text-glid-green-dark px-3 py-1 font-medium">
                  Спеціальність обрана
                  <button
                    onClick={() => {
                      const p = new URLSearchParams(searchParams.toString())
                      p.delete('specialityId')
                      router.push(`/likari?${p.toString()}`)
                    }}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              )}
              {isOnline && (
                <span className="inline-flex items-center gap-1 text-xs rounded-full bg-glid-green-light text-glid-green-dark px-3 py-1 font-medium">
                  Онлайн
                  <button
                    onClick={() => {
                      const p = new URLSearchParams(searchParams.toString())
                      p.delete('isOnline')
                      router.push(`/likari?${p.toString()}`)
                    }}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-10">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-card border border-border animate-pulse" />
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-medium">Лікарів не знайдено</p>
              <p className="mt-2 text-sm">Спробуйте змінити параметри пошуку</p>
            </div>
          ) : (
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Filters drawer */}
      <DoctorFilters
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        currentSpecialityId={specialityId}
        currentIsOnline={!!isOnline}
      />
    </>
  )
}

export default function LikariPage() {
  return (
    <>
      <Suspense>
        <DoctorsContent />
      </Suspense>
      <PartnerCTASection />
    </>
  )
}
