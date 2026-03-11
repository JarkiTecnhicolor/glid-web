'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/auth'

const schema = z.object({
  login: z.string().min(1, 'Введіть телефон або email'),
  password: z.string().min(1, 'Введіть пароль'),
})

type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setTokens, setUser } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setError(null)
    try {
      const res = await authApi.signIn({ login: values.login, password: values.password })
      setTokens(res.accessToken, res.refreshToken)

      // Sync token to cookie for middleware
      document.cookie = `glid_access_token=${res.accessToken}; path=/; max-age=3600`

      try {
        const profile = await authApi.getProfileFull()
        setUser(profile as Parameters<typeof setUser>[0])
      } catch {
        // non-blocking
      }

      const from = searchParams.get('from') || '/cabinet'
      router.push(from)
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Неправильний логін або пароль')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-glid-green-dark">
            glid
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-foreground">Вхід</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Введіть ваш телефон або email та пароль
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="login" className="text-sm font-medium text-foreground">
              Телефон або email
            </label>
            <Input
              id="login"
              placeholder="+38 (0XX) XXX-XX-XX або email"
              {...register('login')}
              aria-invalid={!!errors.login}
            />
            {errors.login && (
              <p className="text-xs text-destructive">{errors.login.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Пароль
              </label>
              <Link
                href="/auth/reset-password"
                className="text-xs text-primary hover:underline"
              >
                Забули пароль?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Вхід…' : 'Увійти'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Немає акаунту?{' '}
          <Link href="/auth/register" className="text-primary font-medium hover:underline">
            Зареєструватись
          </Link>
        </p>
      </div>
    </div>
  )
}
