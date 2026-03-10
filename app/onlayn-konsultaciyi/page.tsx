'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DoctorCard } from '@/components/doctors/DoctorCard'
import { doctorsApi } from '@/lib/api/doctors'
import { cn } from '@/lib/utils'

const HOW_TO_STEPS = [
  { num: '01', title: 'Знайдіть лікаря', desc: 'Використовуйте пошук або фільтри для підбору потрібного спеціаліста' },
  { num: '02', title: 'Оберіть час', desc: 'Виберіть зручний час для відеоконсультації з доступних слотів лікаря' },
  { num: '03', title: 'Підтвердіть запис', desc: 'Введіть дані та отримайте підтвердження на пошту або SMS' },
  { num: '04', title: 'Проведіть консультацію', desc: 'Підключіться у призначений час через застосунок Glid' },
]

const ADVANTAGES = [
  { icon: '🏠', title: 'Без виходу з дому', desc: 'Отримайте консультацію лікаря де б ви не знаходились' },
  { icon: '⚡', title: 'Швидко', desc: 'Запис на сьогодні або завтра — без тривалого очікування' },
  { icon: '💰', title: 'Вигідно', desc: 'Онлайн-консультації часто дешевші за прийом у клініці' },
  { icon: '🔒', title: 'Конфіденційно', desc: 'Ваші дані та медична інформація надійно захищені' },
]

const FAQ = [
  {
    q: 'Як проходить онлайн-консультація?',
    a: 'Консультація проходить у форматі відеодзвінка через застосунок Glid. Після підтвердження запису ви отримаєте посилання для підключення.',
  },
  {
    q: 'Чи можна отримати рецепт після онлайн-консультації?',
    a: 'Так, лікар може виписати електронний рецепт після консультації. Він буде доступний у вашому особистому кабінеті.',
  },
  {
    q: 'Що робити, якщо виникли технічні проблеми?',
    a: 'Зверніться до служби підтримки через чат у застосунку або за телефоном. Ми оперативно вирішимо будь-яке питання.',
  },
  {
    q: 'Чи можна записати онлайн-консультацію для дитини?',
    a: 'Так, ви можете записати дитину до педіатра або іншого дитячого спеціаліста. Увімкніть фільтр "Дитячий лікар" для відповідного пошуку.',
  },
]

function OnlineConsultationsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const searchParam = searchParams.get('search') ?? undefined
  const [localSearch, setLocalSearch] = useState(searchParam ?? '')
  const [childOnly, setChildOnly] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['doctors-online', { search: searchParam, childOnly }],
    queryFn: () => doctorsApi.getDoctors({ search: searchParam, isOnline: true, limit: 10 }),
  })

  const doctors = data?.data ?? []

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (localSearch) params.set('search', localSearch)
    else params.delete('search')
    router.push(`/onlayn-konsultaciyi?${params.toString()}`)
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-background border-b border-border py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Консультація з лікарем онлайн
          </h1>
          <p className="mt-3 text-muted-foreground md:text-lg max-w-xl">
            Порадьтеся з досвідченим спеціалістом, не виходячи з дому. Відеоконсультація за 15 хвилин.
          </p>

          <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-xl">
            <Input
              placeholder="Спеціальність або прізвище лікаря"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Знайти</Button>
          </form>

          <label className="mt-4 flex items-center gap-2 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={childOnly}
              onChange={(e) => setChildOnly(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-foreground font-medium">Дитячий лікар</span>
          </label>
        </div>
      </section>

      {/* Doctors list */}
      <section className="py-10">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-xl font-bold text-foreground mb-5">Лікарі для онлайн-консультації</h2>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 rounded-2xl bg-card border border-border animate-pulse" />
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <div className="text-5xl mb-4">💻</div>
              <p className="font-medium">Лікарів не знайдено</p>
            </div>
          ) : (
            <div className="space-y-4">
              {doctors.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How to */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
            Як записатись на консультацію?
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {HOW_TO_STEPS.map(({ num, title, desc }) => (
              <div key={num} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-glid-green text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {num}
                </div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
            Переваги онлайн-консультацій
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {ADVANTAGES.map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                <div className="text-3xl shrink-0">{icon}</div>
                <div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
            Поширені запитання
          </h2>
          <div className="space-y-3">
            {FAQ.map(({ q, a }, i) => (
              <div key={i} className="rounded-2xl border border-border bg-background overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-medium text-foreground text-sm md:text-base">{q}</span>
                  <span className={cn('text-muted-foreground transition-transform text-xl leading-none', openFaq === i ? 'rotate-45' : '')}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App CTA */}
      <section className="py-16 bg-glid-green-dark text-glid-cream text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold">Завантажуй застосунок Glid</h2>
          <p className="mt-3 text-glid-cream/70 max-w-md mx-auto">
            Усі функції — включаючи відеоконсультації — доступні у мобільному застосунку
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <a href="#" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-glid-cream/40 text-sm font-semibold hover:border-glid-cream transition-colors">
              <span>🍎</span> App Store
            </a>
            <a href="#" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-glid-cream/40 text-sm font-semibold hover:border-glid-cream transition-colors">
              <span>▶</span> Google Play
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default function OnlineConsultationsPage() {
  return (
    <Suspense>
      <OnlineConsultationsContent />
    </Suspense>
  )
}
