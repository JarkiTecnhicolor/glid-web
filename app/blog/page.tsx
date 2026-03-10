import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Блог',
  description: "Корисні статті про здоров'я від лікарів Glid: поради, огляди аналізів, профілактика.",
}

const POSTS = [
  {
    slug: 'yak-obernuty-likarya',
    title: 'Як обрати лікаря онлайн: покрокова інструкція',
    excerpt: 'Розповідаємо, на що звернути увагу при виборі фахівця та як підготуватися до першого прийому.',
    date: '2024-12-10',
    readTime: '4 хв',
    category: 'Поради',
    emoji: '🩺',
  },
  {
    slug: 'profilaktyka-zastuda',
    title: '5 способів укріпити імунітет взимку',
    excerpt: 'Прості та ефективні методи, які допоможуть не захворіти в холодну пору року за порадами наших лікарів.',
    date: '2024-12-05',
    readTime: '5 хв',
    category: 'Здоров\'я',
    emoji: '🛡️',
  },
  {
    slug: 'analiz-krovi-shcho-oznachaye',
    title: 'Загальний аналіз крові: що означають показники',
    excerpt: 'Детальний розбір основних показників загального аналізу крові — що є нормою, а що варто обговорити з лікарем.',
    date: '2024-11-28',
    readTime: '7 хв',
    category: 'Аналізи',
    emoji: '🔬',
  },
  {
    slug: 'onlayn-konsultaciya-perevahy',
    title: 'Онлайн-консультація vs. очний прийом: коли що обирати',
    excerpt: 'Розбираємо, в яких ситуаціях онлайн-консультація є повноцінною заміною очному прийому, а коли необхідно їхати до клініки.',
    date: '2024-11-20',
    readTime: '6 хв',
    category: 'Онлайн',
    emoji: '💻',
  },
  {
    slug: 'dytyachi-likariv-yak-obernuty',
    title: 'Як обрати педіатра для дитини: на що звертати увагу',
    excerpt: 'Педіатр — один з найважливіших лікарів для сім\'ї. Ділимося критеріями вибору та питаннями для першого прийому.',
    date: '2024-11-15',
    readTime: '5 хв',
    category: 'Сім\'я',
    emoji: '👶',
  },
  {
    slug: 'medychna-karta-chomu-vazhlyvo',
    title: 'Медична карта: чому важливо мати доступ до своєї історії хвороб',
    excerpt: 'Пояснюємо, як цифрова медкарта спрощує лікування та чому лікарі приймають кращі рішення, маючи повну медичну картину.',
    date: '2024-11-08',
    readTime: '4 хв',
    category: 'Технології',
    emoji: '📋',
  },
]

const CATEGORIES = ['Всі', 'Поради', 'Здоров\'я', 'Аналізи', 'Онлайн', 'Сім\'я', 'Технології']

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-background border-b border-border py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Блог Glid</h1>
          <p className="mt-2 text-muted-foreground">
            Корисні статті про здоров&apos;я від наших лікарів та медичних експертів
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 md:px-6">
          {/* Category filter (static) */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((cat) => (
              <span
                key={cat}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium border cursor-pointer transition-colors ${
                  cat === 'Всі'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border text-foreground hover:border-primary'
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Posts grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-all"
              >
                {/* Cover */}
                <div className="h-44 bg-glid-green-light flex items-center justify-center text-6xl">
                  {post.emoji}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <span className="bg-glid-green-light text-glid-green-dark px-2 py-0.5 rounded-full font-medium">
                      {post.category}
                    </span>
                    <span>·</span>
                    <span>{post.readTime} читання</span>
                  </div>
                  <h2 className="font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{formatDate(post.date)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
