'use client'

import Link from 'next/link'

const BLOG_POSTS = [
  {
    slug: 'yak-obernuty-likarya',
    title: 'Як обрати лікаря онлайн: покрокова інструкція',
    excerpt: 'Розповідаємо, на що звернути увагу при виборі фахівця та як підготуватися до першого прийому.',
    date: '2024-12-10',
    readTime: '4 хв',
    category: 'Поради',
    emoji: '🩺',
    color: 'oklch(0.920 0.042 151)',
  },
  {
    slug: 'profilaktyka-zastuda',
    title: '5 способів укріпити імунітет взимку',
    excerpt: "Прості та ефективні методи, які допоможуть не захворіти в холодну пору року за порадами наших лікарів.",
    date: '2024-12-05',
    readTime: '5 хв',
    category: "Здоров'я",
    emoji: '🛡️',
    color: 'oklch(0.920 0.040 240)',
  },
  {
    slug: 'analiz-krovi-shcho-oznachaye',
    title: 'Загальний аналіз крові: що означають показники',
    excerpt: 'Детальний розбір основних показників загального аналізу крові — що є нормою, а що варто обговорити з лікарем.',
    date: '2024-11-28',
    readTime: '7 хв',
    category: 'Аналізи',
    emoji: '🔬',
    color: 'oklch(0.945 0.045 290)',
  },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function BlogSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Блог Glid</h2>
            <p className="mt-2 text-muted-foreground">Корисні статті про здоров&apos;я від наших лікарів</p>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Всі статті →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
              style={{ boxShadow: '0 2px 12px rgba(0,60,30,0.07)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(0,60,30,0.13)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,60,30,0.07)' }}
            >
              {/* Cover */}
              <div className="h-44 flex items-center justify-center text-6xl" style={{ background: post.color }}>
                {post.emoji}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: post.color, color: 'oklch(0.225 0.068 151)' }}>
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.readTime} читання</span>
                </div>
                <h3 className="font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <p className="mt-3 text-xs text-muted-foreground">{formatDate(post.date)}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/blog" className="text-primary text-sm font-medium hover:underline">
            Всі статті →
          </Link>
        </div>
      </div>
    </section>
  )
}
