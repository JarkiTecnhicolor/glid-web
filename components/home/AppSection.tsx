const APP_FEATURES = [
  { icon: '🔍', text: 'Пошук лікарів за 2 кліки' },
  { icon: '📅', text: 'Онлайн-запис без черг' },
  { icon: '📋', text: 'Медкарта та історія прийомів' },
  { icon: '🔔', text: 'Нагадування про записи' },
  { icon: '🔬', text: 'Результати аналізів онлайн' },
  { icon: '❤️', text: 'Улюблені лікарі та клініки' },
]

export function AppSection() {
  return (
    <section className="py-20 overflow-hidden" style={{ background: 'oklch(0.970 0.010 151)' }}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5" style={{ background: 'oklch(0.920 0.042 151)', color: 'oklch(0.225 0.068 151)' }}>
              Мобільний застосунок
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Glid у вашому<br />смартфоні
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Усе здоров&apos;я родини в одному місці. Завантажте застосунок і
              отримайте доступ до всіх функцій будь-де та будь-коли.
            </p>

            <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {APP_FEATURES.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm text-foreground">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: 'oklch(0.920 0.042 151)' }}>
                    {f.icon}
                  </span>
                  {f.text}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{ background: 'oklch(0.140 0.020 240)', color: 'white', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span>
                  <span className="block text-[10px] opacity-70 leading-none mb-0.5">Завантажити з</span>
                  App Store
                </span>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{ background: 'oklch(0.140 0.020 240)', color: 'white', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.27.15.58.19.89.1l12.44-7.18-2.54-2.54-10.79 9.62zm-1.15-20.4C1.76 3.7 2 4.08 2 4.56v14.88c0 .48-.24.86-.97 1.2L13.5 12 2.03 3.36zM21.5 10.28l-2.68-1.55-2.82 2.27L18.82 13.5l2.71-1.56c.77-.44.77-1.22-.03-1.66zM4.07.24c-.31-.09-.62-.05-.89.1l10.79 9.66 2.54-2.54L4.07.24z" />
                </svg>
                <span>
                  <span className="block text-[10px] opacity-70 leading-none mb-0.5">Доступно в</span>
                  Google Play
                </span>
              </a>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center">
            <div className="relative w-56 md:w-60">
              {/* Glow */}
              <div aria-hidden className="absolute inset-0 rounded-[2.5rem] blur-2xl opacity-40" style={{ background: 'oklch(0.548 0.128 151)', transform: 'scale(0.85) translateY(12%)' }} />
              <div className="relative rounded-[2.5rem] border-[5px] aspect-[9/19] flex flex-col overflow-hidden" style={{ borderColor: 'oklch(0.225 0.068 151)', boxShadow: '0 24px 60px rgba(0,60,30,0.25)' }}>
                {/* Status bar */}
                <div className="h-8 flex items-center justify-between px-5 text-[10px] font-semibold shrink-0" style={{ background: 'oklch(0.225 0.068 151)', color: 'oklch(0.930 0.024 80)' }}>
                  <span>9:41</span>
                  <span>●●●</span>
                </div>
                {/* Screen */}
                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6" style={{ background: 'oklch(0.990 0.003 80)' }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl font-black" style={{ background: 'oklch(0.548 0.128 151)' }}>G</div>
                  <p className="text-xl font-bold" style={{ color: 'oklch(0.225 0.068 151)' }}>glid</p>
                  <div className="w-full space-y-2 mt-2">
                    {['Лікарі', 'Записи', 'Медкарта'].map((item) => (
                      <div key={item} className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'oklch(0.920 0.042 151)' }}>
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'oklch(0.548 0.128 151)' }} />
                        <span className="text-xs font-medium" style={{ color: 'oklch(0.225 0.068 151)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-center" style={{ color: 'oklch(0.550 0.050 151)' }}>Скоро тут буде скрін застосунку</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
