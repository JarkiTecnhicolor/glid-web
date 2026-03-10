'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { catalogsApi } from '@/lib/api/catalogs'

// Palette for icon backgrounds — cycles through these
const ICON_COLORS = [
  { bg: 'oklch(0.920 0.042 151)', fg: 'oklch(0.225 0.068 151)' }, // green-light / dark
  { bg: 'oklch(0.920 0.040 240)', fg: 'oklch(0.250 0.080 240)' }, // blue-light / dark
  { bg: 'oklch(0.950 0.060 80)',  fg: 'oklch(0.300 0.090 60)'  }, // amber-light / dark
  { bg: 'oklch(0.940 0.040 330)', fg: 'oklch(0.300 0.090 330)' }, // pink-light / dark
  { bg: 'oklch(0.930 0.040 200)', fg: 'oklch(0.270 0.080 200)' }, // teal-light / dark
  { bg: 'oklch(0.945 0.045 290)', fg: 'oklch(0.280 0.085 290)' }, // purple-light / dark
]

export function SpecialitiesSection() {
  const { data: specialities } = useQuery({
    queryKey: ['specialities-clinic'],
    queryFn: () => catalogsApi.getSpecialitiesForClinic(),
  })

  const items = specialities?.slice(0, 12) ?? []

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Оберіть свого лікаря
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Понад 30 спеціальностей — знайдіть потрібного фахівця поруч
          </p>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
            {items.map((spec, i) => {
              const palette = ICON_COLORS[i % ICON_COLORS.length]
              return (
                <Link
                  key={spec.id}
                  href={`/likari?specialityId=${spec.id}`}
                  className="group flex flex-col items-center text-center gap-2.5 rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40"
                  style={{ boxShadow: '0 2px 8px rgba(0,60,30,0.06)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,60,30,0.12)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,60,30,0.06)' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-200 group-hover:scale-110"
                    style={{ background: palette.bg, color: palette.fg }}
                  >
                    {spec.icon || '🩺'}
                  </div>
                  <p className="text-xs font-medium text-foreground leading-tight">{spec.name}</p>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-4 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-muted mx-auto mb-2.5" />
                <div className="h-3 bg-muted rounded mx-auto w-3/4" />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/likari"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:border-primary hover:text-primary transition-colors"
            style={{ boxShadow: '0 1px 4px rgba(0,60,30,0.06)' }}
          >
            Всі спеціальності →
          </Link>
        </div>
      </div>
    </section>
  )
}
