import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Клініки',
  description:
    'Каталог клінік та лабораторій в Україні. Порівняйте рейтинги, послуги та ціни. Запис онлайн через Glid.',
  openGraph: {
    title: 'Клініки — Glid',
    description: 'Знайдіть клініку або лабораторію та запишіться онлайн.',
  },
}

export default function KlinikyLayout({ children }: { children: React.ReactNode }) {
  return children
}
