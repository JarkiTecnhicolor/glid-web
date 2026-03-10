import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import { Providers } from '@/lib/providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JsonLd, organizationJsonLd, websiteJsonLd } from '@/components/seo/JsonLd'

const manrope = Manrope({
  variable: '--font-sans',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
})

const baseUrl = 'https://glid-web.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Glid — твій органайзер здоров\'я',
    template: '%s | Glid',
  },
  description:
    'Менше хаосу, більше турботи: здоров\'я родини, лікарі й аналізи — усе в одному місці, без бюрократії',
  keywords: [
    'лікарі',
    'онлайн консультація',
    'запис до лікаря',
    'медицина',
    'glid',
    'пошук лікаря',
    'клініки',
    'здоров\'я',
    'медичний органайзер',
    'Україна',
  ],
  authors: [{ name: 'Glid' }],
  creator: 'Glid',
  publisher: 'Glid',
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: baseUrl,
    siteName: 'Glid',
    title: 'Glid — твій органайзер здоров\'я',
    description:
      'Пошук лікарів, запис на прийом, онлайн-консультації та управління здоров\'ям родини — усе в одному місці.',
    images: [
      {
        url: '/logo-glid-green.svg',
        width: 512,
        height: 512,
        alt: 'Glid — органайзер здоров\'я',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glid — твій органайзер здоров\'я',
    description:
      'Пошук лікарів, запис на прийом та управління здоров\'ям родини в Україні.',
    images: ['/logo-glid-green.svg'],
  },
  alternates: {
    canonical: baseUrl,
  },
  category: 'health',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk">
      <body className={`${manrope.variable} antialiased min-h-screen flex flex-col`}>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
