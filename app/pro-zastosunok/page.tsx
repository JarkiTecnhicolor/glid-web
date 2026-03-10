import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Про застосунок',
  description: "Glid — мобільний органайзер здоров'я для iOS та Android. Пошук лікарів, запис на прийом, медкарта та аналізи.",
}

const FEATURES = [
  {
    title: 'Зручний пошук лікарів у два кліки',
    desc: 'Знайдіть потрібного спеціаліста за спеціальністю, районом або назвою клініки. Фільтри та рейтинги допоможуть обрати найкращого.',
    emoji: '🔍',
    screen: 'search',
  },
  {
    title: "Медкарта — вся історія здоров'я в одному місці",
    desc: 'Зберігайте результати аналізів, діагнози та призначення. Лікар бачить вашу повну медичну картину одразу.',
    emoji: '📋',
    screen: 'medcard',
  },
  {
    title: 'Записи на прийом',
    desc: 'Записуйтесь до лікаря онлайн у будь-який час. Нагадування не дадуть пропустити прийом.',
    emoji: '📅',
    screen: 'appointments',
  },
  {
    title: 'Закладки — обрані лікарі завжди поруч',
    desc: 'Зберігайте лікарів, яким довіряєте, і записуйтесь до них у кілька кліків.',
    emoji: '❤️',
    screen: 'favorites',
  },
  {
    title: 'Профіль пацієнта',
    desc: "Управляйте особистими даними, додавайте профілі членів родини та відстежуйте їхнє здоров'я.",
    emoji: '👤',
    screen: 'profile',
  },
]

const WHY_GLID = [
  { icon: '⚡', title: 'Швидко', desc: 'Запис до лікаря за 2 хвилини' },
  { icon: '🔒', title: 'Безпечно', desc: 'Медичні дані надійно зашифровані' },
  { icon: '💰', title: 'Вигідно', desc: 'Безкоштовне завантаження та реєстрація' },
  { icon: '🌐', title: 'Зручно', desc: 'iOS, Android та веб — завжди під рукою' },
]

export default function ProZastosunokPage() {
  return (
    <>
      {/* Screen 1 — Hero */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Glid — твій органайзер здоров&apos;я в смартфоні
              </h1>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                Пошук лікарів, онлайн-запис, медкарта та аналізи — все в одному застосунку. Для iOS
                та Android, безкоштовно.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-semibold hover:opacity-80 transition-opacity"
                >
                  🍎 App Store
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-semibold hover:opacity-80 transition-opacity"
                >
                  ▶ Google Play
                </a>
              </div>
            </div>
            {/* Phone placeholder */}
            <div className="flex justify-center">
              <div className="w-56 aspect-[9/19] rounded-[2.5rem] border-4 border-foreground/20 bg-glid-green-light flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <div className="text-6xl">📱</div>
                  <p className="mt-3 text-2xl font-bold text-glid-green-dark">glid</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature screens */}
      {FEATURES.map(({ title, desc, emoji }, i) => (
        <section
          key={title}
          className={`py-16 ${i % 2 === 0 ? 'bg-card' : 'bg-background'}`}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}>
              <div>
                <div className="text-5xl mb-4">{emoji}</div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">{desc}</p>
              </div>
              {/* Screen placeholder */}
              <div className="flex justify-center">
                <div className="w-44 aspect-[9/19] rounded-[2rem] border-4 border-foreground/15 bg-glid-green-light/50 flex items-center justify-center shadow-lg">
                  <span className="text-5xl">{emoji}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Why Glid */}
      <section className="py-20 bg-glid-green-dark text-glid-cream">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Чому саме Glid?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {WHY_GLID.map(({ icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="text-4xl mb-3">{icon}</div>
                <p className="font-semibold text-glid-cream">{title}</p>
                <p className="mt-1 text-sm text-glid-cream/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-foreground">Скачай Glid безкоштовно</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Доступно для iPhone та Android
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-foreground text-background font-semibold hover:opacity-80 transition-opacity"
            >
              🍎 <span><span className="text-xs block opacity-70">Завантажити з</span>App Store</span>
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-foreground text-background font-semibold hover:opacity-80 transition-opacity"
            >
              ▶ <span><span className="text-xs block opacity-70">Доступно в</span>Google Play</span>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
