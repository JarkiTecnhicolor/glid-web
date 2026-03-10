const STATS = [
  { value: '500+', label: 'Лікарів' },
  { value: '50+', label: 'Партнерів' },
  { value: '0 грн', label: 'Старт безкоштовно' },
]

const PARTNER_BENEFITS = [
  { icon: '📈', text: 'Нові пацієнти щодня' },
  { icon: '🗓️', text: 'Онлайн-запис 24/7' },
  { icon: '📊', text: 'Аналітика та статистика' },
  { icon: '💬', text: 'Відгуки та рейтинг' },
]

export function PartnerCTASection() {
  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'oklch(0.225 0.068 151)' }}>
      {/* Decorative blobs */}
      <div aria-hidden className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: 'oklch(0.548 0.128 151)' }} />
      <div aria-hidden className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: 'oklch(0.930 0.024 80)' }} />

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5" style={{ background: 'oklch(0.280 0.075 151)', color: 'oklch(0.930 0.024 80)' }}>
            Для бізнесу
          </span>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{ color: 'oklch(0.930 0.024 80)' }}>
            Ставайте партнером Glid
          </h2>
          <p className="mt-4 max-w-xl mx-auto leading-relaxed text-lg" style={{ color: 'oklch(0.800 0.030 151)' }}>
            Ви — клініка, лабораторія або лікарська практика? Підключіться до платформи
            і отримуйте нових пацієнтів вже сьогодні.
          </p>

          {/* Stats */}
          <div className="mt-10 flex justify-center gap-10">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold" style={{ color: 'oklch(0.930 0.024 80)' }}>{value}</p>
                <p className="text-xs mt-1" style={{ color: 'oklch(0.650 0.040 151)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Benefits grid */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {PARTNER_BENEFITS.map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-left" style={{ background: 'oklch(0.265 0.075 151)' }}>
                <span className="text-xl shrink-0">{icon}</span>
                <span className="text-sm font-medium" style={{ color: 'oklch(0.850 0.030 151)' }}>{text}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:partners@glid.com.ua"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 font-semibold text-sm transition-all hover:-translate-y-0.5 hover:opacity-95"
              style={{ background: 'oklch(0.548 0.128 151)', color: 'white', boxShadow: '0 4px 20px rgba(0,60,30,0.4)' }}
            >
              Заповнити заявку
            </a>
            <a
              href="tel:+380800000000"
              className="inline-flex items-center justify-center gap-2 rounded-xl border px-8 py-3.5 font-semibold text-sm transition-all hover:border-opacity-80"
              style={{ borderColor: 'oklch(0.380 0.060 151)', color: 'oklch(0.850 0.030 151)' }}
            >
              Зателефонувати
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
