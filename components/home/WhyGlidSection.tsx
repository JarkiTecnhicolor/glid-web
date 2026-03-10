const ADVANTAGES = [
  {
    icon: '🔍',
    title: 'Швидкий пошук',
    description: 'Знайдіть лікаря за спеціальністю, районом або клінікою за кілька секунд',
    stat: '2 хв',
    statLabel: 'середній час пошуку',
  },
  {
    icon: '📅',
    title: 'Зручний запис',
    description: 'Записуйтесь онлайн 24/7 — без черг і нескінченних дзвінків',
    stat: '24/7',
    statLabel: 'доступний запис',
  },
  {
    icon: '📋',
    title: 'Медична карта',
    description: 'Вся історія прийомів, аналізів та діагнозів в одному місці',
    stat: '100%',
    statLabel: 'ваших даних',
  },
  {
    icon: '🔔',
    title: 'Нагадування',
    description: 'Своєчасні сповіщення про записи та результати аналізів',
    stat: '0',
    statLabel: 'пропущених прийомів',
  },
  {
    icon: '💬',
    title: 'Онлайн-консультація',
    description: 'Відеодзвінок або чат з лікарем без виходу з дому',
    stat: '15 хв',
    statLabel: 'до консультації',
  },
  {
    icon: '🔒',
    title: 'Безпека даних',
    description: 'Медичні дані надійно зашифровані та доступні тільки вам',
    stat: 'SSL',
    statLabel: 'захист',
  },
]

export function WhyGlidSection() {
  return (
    <section className="py-20 bg-glid-green-dark">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-glid-cream/50 mb-3">
            Наші переваги
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-glid-cream">Чому саме Glid?</h2>
          <p className="mt-3 text-glid-cream/60 max-w-md mx-auto">
            Ми зробили турботу про здоров&apos;я простою та доступною для кожного
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ADVANTAGES.map(({ icon, title, description, stat, statLabel }) => (
            <div
              key={title}
              className="rounded-2xl p-6 transition-all hover:scale-[1.01]"
              style={{
                background: 'oklch(0.265 0.075 151)',
                border: '1px solid oklch(0.310 0.070 151)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: 'oklch(0.320 0.090 151)' }}
                >
                  {icon}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-glid-cream">{stat}</p>
                  <p className="text-xs text-glid-cream/40">{statLabel}</p>
                </div>
              </div>
              <h3 className="font-semibold text-base text-glid-cream mb-1.5">{title}</h3>
              <p className="text-sm text-glid-cream/60 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
