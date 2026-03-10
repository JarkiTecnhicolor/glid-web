'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { catalogsApi } from '@/lib/api/catalogs'

interface Props {
  open: boolean
  onClose: () => void
  currentSpecialityId?: string
  currentIsOnline?: boolean
}

export function DoctorFilters({ open, onClose, currentSpecialityId, currentIsOnline }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [specialityId, setSpecialityId] = useState(currentSpecialityId ?? '')
  const [isOnline, setIsOnline] = useState(currentIsOnline ?? false)

  const { data: specialities } = useQuery({
    queryKey: ['specialities-clinic'],
    queryFn: () => catalogsApi.getSpecialitiesForClinic(),
    enabled: open,
  })

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString())
    if (specialityId) {
      params.set('specialityId', specialityId)
    } else {
      params.delete('specialityId')
    }
    if (isOnline) {
      params.set('isOnline', 'true')
    } else {
      params.delete('isOnline')
    }
    router.push(`/likari?${params.toString()}`)
    onClose()
  }

  function resetFilters() {
    setSpecialityId('')
    setIsOnline(false)
    const params = new URLSearchParams(searchParams.toString())
    params.delete('specialityId')
    params.delete('isOnline')
    router.push(`/likari?${params.toString()}`)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div className="w-full max-w-sm bg-background shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-lg text-foreground">Фільтри</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors text-xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Online filter */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Тип консультації</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isOnline}
                onChange={(e) => setIsOnline(e.target.checked)}
                className="w-4 h-4 rounded border-border accent-primary"
              />
              <span className="text-sm text-foreground">Тільки онлайн</span>
            </label>
          </div>

          {/* Speciality filter */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Спеціальність</h3>
            {specialities ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="speciality"
                    value=""
                    checked={specialityId === ''}
                    onChange={() => setSpecialityId('')}
                    className="accent-primary"
                  />
                  <span className="text-sm text-foreground">Всі спеціальності</span>
                </label>
                {specialities.map((spec) => (
                  <label key={spec.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="speciality"
                      value={spec.id}
                      checked={specialityId === spec.id}
                      onChange={() => setSpecialityId(spec.id)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-foreground">{spec.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-5 bg-muted rounded animate-pulse" />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-border flex gap-3">
          <Button variant="outline" onClick={resetFilters} className="flex-1">
            Скинути
          </Button>
          <Button onClick={applyFilters} className="flex-1">
            Застосувати
          </Button>
        </div>
      </div>
    </div>
  )
}
