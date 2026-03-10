import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Лікарі',
  description:
    'Знайдіть лікаря в Україні — пошук за спеціальністю, містом та відгуками. Запис на прийом онлайн через Glid.',
  openGraph: {
    title: 'Лікарі — Glid',
    description: 'Пошук лікарів за спеціальністю та запис на прийом онлайн.',
  },
}

export default function LikariLayout({ children }: { children: React.ReactNode }) {
  return children
}
