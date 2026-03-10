import type { Metadata } from 'next'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Про нас',
  description: 'Glid — платформа для пошуку лікарів і запису на прийом в Україні. Дізнайтесь більше про нашу команду та місію.',
}

const STATS = [
  { value: '500+', label: 'Лікарів' },
  { value: '50+', label: 'Клінік-партнерів' },
  { value: '10 000+', label: 'Пацієнтів' },
  { value: '4.8', label: 'Рейтинг у App Store' },
]

const TEAM = [
  { name: 'Олексій Шевченко', role: 'Засновник та CEO', avatar: 'О' },
  { name: 'Марина Коваль', role: 'Медичний директор', avatar: 'М' },
  { name: 'Дмитро Бойко', role: 'CTO', avatar: 'Д' },
  { name: 'Юлія Мороз', role: 'Head of Product', avatar: 'Ю' },
  { name: 'Андрій Сидоренко', role: 'Head of Design', avatar: 'А' },
  { name: 'Олена Павленко', role: 'Head of Marketing', avatar: 'О' },
]

const STORY_STEPS = [
  {
    year: '2021',
    icon: '💡',
    title: 'Ідея',
    desc: 'Засновники Glid зіткнулися з проблемою: пошук і запис до лікаря в Україні — це хаос. Ми вирішили це змінити.',
  },
  {
    year: '2022',
    icon: '🚀',
    title: 'Запуск',
    desc: 'Вийшла перша версія мобільного застосунку. Перші 100 лікарів і 500 пацієнтів.',
  },
  {
    year: '2023',
    icon: '📈',
    title: 'Зростання',
    desc: 'Партнерство з 30+ клініками. Запуск онлайн-консультацій. 5000 активних користувачів.',
  },
  {
    year: '2024',
    icon: '🌟',
    title: 'Сьогодні',
    desc: 'Понад 10 000 пацієнтів, 500 лікарів, 50 клінік. Веб-платформа та розширення функцій.',
  },
]

export default function ProNasPage() {
  return (
    <>
      {/* Screen 1 — Banner */}
      <section className="bg-glid-green-dark text-glid-cream py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Glid — твій органайзер здоров&apos;я
          </h1>
          <p className="mt-5 text-glid-cream/70 text-lg max-w-xl mx-auto leading-relaxed">
            Ми змінюємо підхід до медицини в Україні — робимо турботу про здоров&apos;я простою,
            зручною та доступною для кожного.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-glid-cream text-glid-green-dark font-semibold hover:opacity-90 transition-opacity"
            >
              🍎 App Store
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-glid-cream/40 font-semibold hover:border-glid-cream transition-colors"
            >
              ▶ Google Play
            </a>
          </div>
        </div>
      </section>

      {/* Screen 2 — Stats */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center rounded-2xl border border-border bg-card p-6">
                <p className="text-3xl md:text-4xl font-bold text-glid-green-dark">{value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screen 3 — Team */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Команда Glid</h2>
            <p className="mt-3 text-muted-foreground">Люди, які щодня роблять медицину доступнішою</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {TEAM.map(({ name, role, avatar }) => (
              <div key={name} className="flex flex-col items-center text-center w-40">
                <div className="w-20 h-20 rounded-full bg-glid-green flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  {avatar}
                </div>
                <p className="mt-3 font-semibold text-foreground text-sm">{name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screen 4 — Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Наша історія</h2>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="space-y-8">
              {STORY_STEPS.map(({ year, icon, title, desc }) => (
                <div key={year} className="flex gap-6">
                  <div className="shrink-0 flex flex-col items-center gap-1">
                    <div className="w-16 h-16 rounded-2xl bg-glid-green-light flex items-center justify-center text-2xl z-10 relative">
                      {icon}
                    </div>
                    <span className="text-xs font-bold text-glid-green-dark">{year}</span>
                  </div>
                  <div className="flex-1 rounded-2xl border border-border bg-card p-5 mt-2">
                    <h3 className="font-bold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Screen 5 — CTA */}
      <section className="py-20 bg-glid-green text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold">Починайте з Glid сьогодні</h2>
          <p className="mt-3 text-primary-foreground/80 max-w-md mx-auto">
            Знайдіть свого лікаря або завантажте застосунок — це безкоштовно
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/likari"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary-foreground text-primary font-semibold hover:opacity-90 transition-opacity"
            >
              Знайти лікаря
            </Link>
            <a
              href="#"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl border-2 border-primary-foreground/50 font-semibold hover:border-primary-foreground transition-colors"
            >
              🍎 Завантажити App
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
