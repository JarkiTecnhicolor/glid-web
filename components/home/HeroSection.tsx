'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { catalogsApi } from '@/lib/api/catalogs'

const POPULAR_SPECS = ['Терапевт', 'Педіатр', 'Кардіолог', 'Дерматолог', 'Невролог', 'Гінеколог']

export function HeroSection() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const { data: specialities } = useQuery({
    queryKey: ['specialities-clinic'],
    queryFn: () => catalogsApi.getSpecialitiesForClinic(),
  })

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.push(query.trim() ? `/likari?search=${encodeURIComponent(query.trim())}` : '/likari')
  }

  function searchSpec(name: string) {
    const match = specialities?.find((s) => s.name.toLowerCase().includes(name.toLowerCase()))
    router.push(match ? `/likari?specialityId=${match.id}` : `/likari?search=${encodeURIComponent(name)}`)
  }

  return (
    <section className="relative overflow-hidden py-16 md:py-28" style={{ background: 'oklch(0.930 0.024 80)' }}>
      {/* Subtle dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(circle, oklch(0.548 0.128 151) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Soft glow spots */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-40" style={{ background: 'radial-gradient(circle, oklch(0.870 0.080 151) 0%, transparent 65%)' }} />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-25" style={{ background: 'radial-gradient(circle, oklch(0.870 0.050 80) 0%, transparent 65%)' }} />

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="max-w-2xl mx-auto text-center">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full border border-glid-green/20 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-glid-green-dark mb-8"
            style={{ boxShadow: '0 2px 12px rgba(0,60,30,0.10)' }}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-glid-green opacity-70" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-glid-green" />
            </span>
            500+ лікарів вже у Glid
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-glid-green-dark leading-[1.1] tracking-tight">
            Твій лікар —{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, oklch(0.548 0.128 151) 0%, oklch(0.380 0.110 160) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              без черги
            </span>
          </h1>
          <p className="mt-4 text-xl text-glid-green-dark/55 leading-relaxed">
            Знайди, обери та запишись онлайн за 2 хвилини.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-9">
            <div
              className="flex items-center rounded-2xl bg-white p-2"
              style={{ boxShadow: '0 12px 48px rgba(0,60,30,0.18)' }}
            >
              <div className="pl-3 pr-2 shrink-0" style={{ color: 'oklch(0.548 0.128 151)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Спеціальність або прізвище лікаря..."
                className="flex-1 bg-transparent py-3 px-2 text-base text-foreground placeholder:text-muted-foreground/70 outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl px-7 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 hover:-translate-y-px active:translate-y-0"
                style={{ background: 'linear-gradient(135deg, oklch(0.548 0.128 151), oklch(0.430 0.120 158))', boxShadow: '0 4px 16px rgba(0,120,60,0.35)' }}
              >
                Знайти
              </button>
            </div>
          </form>

          {/* Popular chips */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <span className="text-xs text-glid-green-dark/40 self-center font-medium uppercase tracking-wide">Популярні:</span>
            {POPULAR_SPECS.map((spec) => (
              <button
                key={spec}
                type="button"
                onClick={() => searchSpec(spec)}
                className="text-sm rounded-full border border-glid-green/20 bg-white/60 backdrop-blur-sm px-3.5 py-1 text-glid-green-dark font-medium hover:bg-glid-green hover:text-white hover:border-glid-green transition-all duration-150"
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Stats row */}
          <div className="mt-12 flex justify-center gap-4 md:gap-6">
            {[
              { value: '500+', label: 'Лікарів', color: 'oklch(0.920 0.042 151)', accent: 'oklch(0.548 0.128 151)' },
              { value: '50+',  label: 'Клінік',  color: 'oklch(0.920 0.040 240)', accent: 'oklch(0.450 0.100 240)' },
              { value: '10 000+', label: 'Пацієнтів', color: 'oklch(0.940 0.040 330)', accent: 'oklch(0.520 0.120 330)' },
            ].map(({ value, label, color, accent }) => (
              <div
                key={label}
                className="flex-1 max-w-[160px] rounded-2xl border border-white/90 backdrop-blur-sm py-5 px-3 text-center"
                style={{ background: 'rgba(255,255,255,0.75)', boxShadow: '0 4px 20px rgba(0,60,30,0.08)' }}
              >
                <div className="w-8 h-8 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: color }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: accent }} />
                </div>
                <p className="text-2xl font-extrabold text-glid-green-dark tracking-tight">{value}</p>
                <p className="text-xs text-glid-green-dark/50 mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
