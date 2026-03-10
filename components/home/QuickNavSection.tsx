'use client'

import Link from 'next/link'

const QUICK_LINKS = [
  {
    href: '/likari',
    label: 'Лікарі',
    description: 'Знайдіть потрібного фахівця онлайн',
    color: 'oklch(0.940 0.035 151)',
    iconColor: 'oklch(0.548 0.128 151)',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    href: '/onlayn-konsultaciyi',
    label: 'Онлайн-консультації',
    description: 'Порада лікаря без виходу з дому',
    color: 'oklch(0.935 0.040 220)',
    iconColor: 'oklch(0.480 0.130 220)',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    href: '/kliniky',
    label: 'Клініки та лабораторії',
    description: 'Медичні заклади поруч з вами',
    color: 'oklch(0.945 0.030 60)',
    iconColor: 'oklch(0.560 0.130 60)',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: '/pro-zastosunok',
    label: 'Застосунок Glid',
    description: 'iOS та Android — безкоштовно',
    color: 'oklch(0.940 0.025 300)',
    iconColor: 'oklch(0.500 0.130 300)',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
]

export function QuickNavSection() {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {QUICK_LINKS.map(({ href, label, description, icon, color, iconColor }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl border border-border bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 flex flex-col gap-4"
              style={{
                boxShadow: '0 2px 10px rgba(0,60,30,0.06)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.boxShadow = '0 6px 24px rgba(0,60,30,0.11)'
                el.style.borderColor = 'oklch(0.860 0.030 151)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.boxShadow = '0 2px 10px rgba(0,60,30,0.06)'
                el.style.borderColor = ''
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ background: color, color: iconColor }}
              >
                {icon}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm md:text-[0.95rem] leading-tight">{label}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed hidden md:block">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
