const TESTIMONIALS = [
  {
    name: 'Олена Ковальчук',
    role: 'Київ',
    text: 'Нарешті знайшла хорошого кардіолога через Glid. Запис зайняв буквально 2 хвилини, а на прийом потрапила вже наступного дня.',
    rating: 5,
    avatar: 'О',
    color: 'oklch(0.920 0.042 151)',
    textColor: 'oklch(0.225 0.068 151)',
  },
  {
    name: 'Михайло Петренко',
    role: 'Харків',
    text: 'Використовую Glid для всієї родини. Медкарта в одному місці — дуже зручно, лікарі одразу бачать попередні діагнози.',
    rating: 5,
    avatar: 'М',
    color: 'oklch(0.935 0.040 220)',
    textColor: 'oklch(0.280 0.120 220)',
  },
  {
    name: 'Вікторія Сидоренко',
    role: 'Одеса',
    text: 'Замовила онлайн-консультацію педіатра вночі, коли захворіла дитина. Лікар відповів за 15 хвилин. Сервіс 5/5!',
    rating: 5,
    avatar: 'В',
    color: 'oklch(0.945 0.030 60)',
    textColor: 'oklch(0.350 0.100 60)',
  },
  {
    name: 'Андрій Мельник',
    role: 'Дніпро',
    text: 'Зручний інтерфейс, відгуки допомогли обрати саме того ортопеда, якого рекомендували знайомі. Рекомендую!',
    rating: 5,
    avatar: 'А',
    color: 'oklch(0.940 0.025 300)',
    textColor: 'oklch(0.350 0.100 300)',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Відгуки
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Нам довіряють</h2>
          <p className="mt-3 text-muted-foreground">
            Понад 10 000 пацієнтів вже обрали Glid для турботи про здоров&apos;я
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {TESTIMONIALS.map(({ name, role, text, rating, avatar, color, textColor }) => (
            <div
              key={name}
              className="rounded-2xl border border-border bg-white p-6"
              style={{ boxShadow: '0 2px 12px rgba(0,60,30,0.06)' }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: rating }).map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="oklch(0.548 0.128 151)" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              <p className="text-sm text-foreground leading-relaxed mb-5">&ldquo;{text}&rdquo;</p>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: color, color: textColor }}
                >
                  {avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
