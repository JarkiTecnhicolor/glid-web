'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store/auth'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/likari', label: 'Лікарі' },
  { href: '/kliniky', label: 'Клініки' },
  { href: '/onlayn-konsultaciyi', label: 'Онлайн' },
  { href: '/blog', label: 'Блог' },
  { href: '/pro-nas', label: 'Про нас' },
]

export function Header() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-border/60" style={{ boxShadow: '0 1px 8px rgba(0,60,30,0.06)' }}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Image src="/logo-glid-green.svg" alt="Glid" width={72} height={45} priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-3.5 py-2 rounded-xl text-sm font-medium transition-all',
                isActive(href)
                  ? 'text-primary bg-accent'
                  : 'text-foreground/65 hover:text-foreground hover:bg-muted'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <Link
              href="/cabinet"
              className={cn(
                buttonVariants({ size: 'sm' }),
                'gap-2'
              )}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              Кабінет
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              >
                Увійти
              </Link>
              <Link
                href="/auth/register"
                className={buttonVariants({ size: 'sm' })}
              >
                Реєстрація
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-xl text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Меню"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-white px-4 pb-5 pt-2">
          <nav className="flex flex-col gap-0.5">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive(href)
                    ? 'text-primary bg-accent'
                    : 'text-foreground/65 hover:text-foreground hover:bg-muted'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/60">
            {isAuthenticated ? (
              <Link href="/cabinet" onClick={() => setMobileOpen(false)} className={buttonVariants()}>
                Кабінет
              </Link>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className={buttonVariants({ variant: 'ghost' })}>
                  Увійти
                </Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)} className={buttonVariants()}>
                  Реєстрація
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
