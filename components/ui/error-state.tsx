'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type ErrorVariant = 'network' | 'auth' | 'not-found' | 'server' | 'generic'

interface ErrorStateProps {
  variant?: ErrorVariant
  title?: string
  description?: string
  onRetry?: () => void
  action?: React.ReactNode
  className?: string
}

const VARIANT_CONFIG: Record<ErrorVariant, { icon: React.ReactNode; title: string; description: string }> = {
  network: {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
        <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
    ),
    title: 'Немає з\'єднання',
    description: 'Перевірте підключення до інтернету та спробуйте ще раз',
  },
  auth: {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: 'Потрібна авторизація',
    description: 'Увійдіть щоб переглянути цей розділ',
  },
  'not-found': {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
    title: 'Нічого не знайдено',
    description: 'Спробуйте змінити параметри пошуку',
  },
  server: {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
    title: 'Помилка сервера',
    description: 'Щось пішло не так. Спробуйте пізніше',
  },
  generic: {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    title: 'Сталася помилка',
    description: 'Спробуйте оновити сторінку',
  },
}

export function ErrorState({
  variant = 'generic',
  title,
  description,
  onRetry,
  action,
  className,
}: ErrorStateProps) {
  const config = VARIANT_CONFIG[variant]

  return (
    <div className={cn('rounded-2xl border border-border bg-card p-12 text-center', className)}>
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-support-error-100">
        <div className="text-support-error">{config.icon}</div>
      </div>
      <p className="font-medium text-foreground">{title ?? config.title}</p>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {description ?? config.description}
      </p>
      <div className="mt-5 flex items-center justify-center gap-3">
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry}>
            Спробувати ще раз
          </Button>
        )}
        {action}
      </div>
    </div>
  )
}
