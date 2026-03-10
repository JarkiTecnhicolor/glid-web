import Link from 'next/link'
import Image from 'next/image'

const FOOTER_LINKS = {
  Сервіс: [
    { href: '/likari', label: 'Лікарі' },
    { href: '/kliniky', label: 'Клініки' },
    { href: '/onlayn-konsultaciyi', label: 'Онлайн-консультації' },
  ],
  Компанія: [
    { href: '/pro-nas', label: 'Про нас' },
    { href: '/pro-zastosunok', label: 'Про застосунок' },
    { href: '/blog', label: 'Блог' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-glid-green-dark text-glid-cream">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex hover:opacity-80 transition-opacity">
              <Image
                src="/logo-glid-green.svg"
                alt="Glid"
                width={72}
                height={45}
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }}
              />
            </Link>
            <p className="mt-3 text-sm text-glid-cream/70 max-w-xs">
              Менше хаосу, більше турботи: здоров&apos;я родини, лікарі й аналізи — усе в одному місці.
            </p>

            {/* App store buttons */}
            <div className="flex gap-3 mt-5">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-glid-cream/30 text-xs font-medium hover:bg-glid-cream/10 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                App Store
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-glid-cream/30 text-xs font-medium hover:bg-glid-cream/10 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.27.15.58.19.89.1l12.44-7.18-2.54-2.54-10.79 9.62zm-1.15-20.4C1.76 3.7 2 4.08 2 4.56v14.88c0 .48-.24.86-.97 1.2L13.5 12 2.03 3.36zM21.5 10.28l-2.68-1.55-2.82 2.27L18.82 13.5l2.71-1.56c.77-.44.77-1.22-.03-1.66zM4.07.24c-.31-.09-.62-.05-.89.1l10.79 9.66 2.54-2.54L4.07.24z" />
                </svg>
                Google Play
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-glid-cream mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-glid-cream/70 hover:text-glid-cream transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-glid-cream mb-3">Соцмережі</h3>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="text-glid-cream/70 hover:text-glid-cream transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Telegram"
                className="text-glid-cream/70 hover:text-glid-cream transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-glid-cream/20 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-glid-cream/50">
            &copy; {new Date().getFullYear()} Glid. Усі права захищені.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-xs text-glid-cream/50 hover:text-glid-cream/80 transition-colors">
              Політика конфіденційності
            </Link>
            <Link href="#" className="text-xs text-glid-cream/50 hover:text-glid-cream/80 transition-colors">
              Умови використання
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
