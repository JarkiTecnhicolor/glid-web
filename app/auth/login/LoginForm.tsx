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

const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, 'Введіть номер телефону')
    .regex(/^\+?[0-9\s\-()]+$/, 'Невірний формат телефону'),
})

const codeSchema = z.object({
  code: z
    .string()
    .length(4, 'Код має складатися з 4 цифр')
    .regex(/^\d+$/, 'Тільки цифри'),
})

type PhoneValues = z.infer<typeof phoneSchema>
type CodeValues = z.infer<typeof codeSchema>

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setTokens, setUser } = useAuthStore()

  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [phone, setPhone] = useState('')
  const [channelId, setChannelId] = useState('')
  const [error, setError] = useState<string | null>(null)

  const phoneForm = useForm<PhoneValues>({ resolver: zodResolver(phoneSchema) })
  const codeForm = useForm<CodeValues>({ resolver: zodResolver(codeSchema) })

  async function onPhoneSubmit(values: PhoneValues) {
    setError(null)
    try {
      const res = await authApi.registerInitialOtpOnly({ phone: values.phone })
      setPhone(values.phone)
      setChannelId(res.channelId)
      setStep('code')
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Помилка. Перевірте номер і спробуйте ще раз.')
    }
  }

  async function onCodeSubmit(values: CodeValues) {
    setError(null)
    try {
      const res = await authApi.registerConfirmOtpOnly({
        phone,
        confirmationCode: values.code,
        channelId,
      })
      setTokens(res.accessToken, res.refreshToken)
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
      setError(msg || 'Невірний код. Спробуйте ще раз.')
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
            {step === 'phone'
              ? 'Введіть номер телефону для входу'
              : <>Ми надіслали SMS з кодом на <strong className="text-foreground">{phone}</strong></>}
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-medium text-foreground">
                Номер телефону
              </label>
              <Input
                id="phone"
                placeholder="+38 (0XX) XXX-XX-XX"
                {...phoneForm.register('phone')}
                aria-invalid={!!phoneForm.formState.errors.phone}
              />
              {phoneForm.formState.errors.phone && (
                <p className="text-xs text-destructive">{phoneForm.formState.errors.phone.message}</p>
              )}
            </div>

            {error && <p className="text-sm text-destructive text-center">{error}</p>}

            <Button type="submit" disabled={phoneForm.formState.isSubmitting} className="w-full">
              {phoneForm.formState.isSubmitting ? 'Надсилання…' : 'Отримати код'}
            </Button>
          </form>
        ) : (
          <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="code" className="text-sm font-medium text-foreground">
                Код з SMS
              </label>
              <Input
                id="code"
                placeholder="0000"
                maxLength={4}
                inputMode="numeric"
                {...codeForm.register('code')}
                aria-invalid={!!codeForm.formState.errors.code}
              />
              {codeForm.formState.errors.code && (
                <p className="text-xs text-destructive">{codeForm.formState.errors.code.message}</p>
              )}
            </div>

            {error && <p className="text-sm text-destructive text-center">{error}</p>}

            <Button type="submit" disabled={codeForm.formState.isSubmitting} className="w-full">
              {codeForm.formState.isSubmitting ? 'Перевірка…' : 'Увійти'}
            </Button>

            <button
              type="button"
              onClick={() => { setStep('phone'); setError(null) }}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Змінити номер
            </button>
          </form>
        )}

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
