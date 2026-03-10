import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/lib/providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: {
    default: 'Glid — твій органайзер здоров\'я',
    template: '%s | Glid',
  },
  description:
    'Менше хаосу, більше турботи: здоров\'я родини, лікарі й аналізи — усе в одному місці, без бюрократії',
  keywords: ['лікарі', 'онлайн консультація', 'запис до лікаря', 'медицина', 'glid'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk">
      <body className={`${plusJakartaSans.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
