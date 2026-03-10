'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FacilityCard } from '@/components/clinics/FacilityCard'
import { clinicsApi } from '@/lib/api/clinics'
import { PartnerCTASection } from '@/components/home/PartnerCTASection'
import { cn } from '@/lib/utils'

type FacilityType = 'all' | 'clinic' | 'lab'

function KlinikyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const searchParam = searchParams.get('search') ?? undefined
  const typeParam = (searchParams.get('type') ?? 'all') as FacilityType

  const [localSearch, setLocalSearch] = useState(searchParam ?? '')

  const { data, isLoading } = useQuery({
    queryKey: ['facilities', { search: searchParam, type: typeParam }],
    queryFn: () =>
      clinicsApi.getFacilities({
        search: searchParam,
        type: typeParam !== 'all' ? typeParam : undefined,
        limit: 20,
      }),
  })

  const facilities = data?.data ?? []
  const total = data?.total ?? 0

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (localSearch) params.set('search', localSearch)
    else params.delete('search')
    router.push(`/kliniky?${params.toString()}`)
  }

  function setType(type: FacilityType) {
    const params = new URLSearchParams(searchParams.toString())
    if (type === 'all') params.delete('type')
    else params.set('type', type)
    router.push(`/kliniky?${params.toString()}`)
  }

  const TYPE_TABS: { key: FacilityType; label: string }[] = [
    { key: 'all', label: 'Всі' },
    { key: 'clinic', label: 'Клініки' },
    { key: 'lab', label: 'Лабораторії' },
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-background border-b border-border py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Знайти клініку або лабораторію
          </h1>
          <p className="mt-2 text-muted-foreground">
            {total > 0 ? `${total} закладів у базі` : 'Пошук медичних закладів'}
          </p>

          <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-xl">
            <Input
              placeholder="Назва або адреса"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Знайти</Button>
          </form>

          {/* Type filter tabs */}
          <div className="mt-5 flex gap-2">
            {TYPE_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setType(key)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium border transition-colors',
                  typeParam === key
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border text-foreground hover:border-primary'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-10">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-card border border-border animate-pulse" />
              ))}
            </div>
          ) : facilities.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <div className="text-5xl mb-4">🏥</div>
              <p className="text-lg font-medium">Закладів не знайдено</p>
              <p className="mt-2 text-sm">Спробуйте змінити параметри пошуку</p>
            </div>
          ) : (
            <div className="space-y-4">
              {facilities.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default function KlinikyPage() {
  return (
    <>
      <Suspense>
        <KlinikyContent />
      </Suspense>
      <PartnerCTASection />
    </>
  )
}
