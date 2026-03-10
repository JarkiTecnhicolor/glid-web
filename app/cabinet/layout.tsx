import Link from 'next/link'
import type { ReactNode } from 'react'

const NAV_ITEMS = [
  { href: '/cabinet', label: 'Головна', icon: '🏠', exact: true },
  { href: '/cabinet/appointments', label: 'Мої записи', icon: '📅' },
  { href: '/cabinet/favorites', label: 'Збережені', icon: '❤️' },
  { href: '/cabinet/profile', label: 'Профіль', icon: '👤' },
]

export default function CabinetLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="md:w-56 shrink-0">
          <div className="rounded-2xl border border-border bg-card p-3 md:sticky md:top-24">
            <p className="text-xs text-muted-foreground px-3 py-1 font-medium uppercase tracking-wide mb-1">
              Особистий кабінет
            </p>
            <nav className="flex md:flex-col gap-1">
              {NAV_ITEMS.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
                >
                  <span>{icon}</span>
                  <span className="hidden md:inline">{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
