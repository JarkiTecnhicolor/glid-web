import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Онлайн-консультації',
  description:
    'Відеоконсультації з лікарями онлайн — швидко, зручно, без черг. Оберіть спеціаліста та запишіться через Glid.',
  openGraph: {
    title: 'Онлайн-консультації — Glid',
    description: 'Відеоконсультації з лікарями онлайн без черг.',
  },
}

export default function OnlineConsultationsLayout({ children }: { children: React.ReactNode }) {
  return children
}
