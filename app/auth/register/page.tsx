'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/auth'
import { cn } from '@/lib/utils'

// ─── Schemas ──────────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter()
  const { setTokens, setUser } = useAuthStore()

  const [step, setStep] = useState<1 | 2>(1)
  const [phone, setPhone] = useState('')
  const [channelId, setChannelId] = useState('')
  const [serverError, setServerError] = useState<string | null>(null)

  const phoneForm = useForm<PhoneValues>({ resolver: zodResolver(phoneSchema) })
  const codeForm = useForm<CodeValues>({ resolver: zodResolver(codeSchema) })

  // ── Step 1: send OTP ────────────────────────────────────────────────────────
  async function onStep1(values: PhoneValues) {
    setServerError(null)
    try {
      const res = await authApi.registerInitialOtpOnly({ phone: values.phone })
      setPhone(values.phone)
      setChannelId(res.channelId)
      setStep(2)
    } catch (e: unknown) {
      setServerError(
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Помилка. Перевірте номер і спробуйте ще раз.'
      )
    }
  }

  // ── Step 2: confirm OTP → get tokens ────────────────────────────────────────
  async function onStep2(values: CodeValues) {
    setServerError(null)
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
      router.push('/cabinet')
    } catch (e: unknown) {
      setServerError(
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Невірний код. Спробуйте ще раз.'
      )
    }
  }

  const STEPS = ['Телефон', 'Підтвердження']

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-glid-green-dark">
            glid
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-foreground">Реєстрація</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((label, i) => {
            const num = i + 1
            const active = step === num
            const done = step > num
            return (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0',
                      done
                        ? 'bg-primary text-primary-foreground'
                        : active
                        ? 'border-2 border-primary text-primary'
                        : 'border border-border text-muted-foreground'
                    )}
                  >
                    {done ? '✓' : num}
                  </div>
                  <span
                    className={cn(
                      'text-xs',
                      active ? 'text-foreground font-medium' : 'text-muted-foreground'
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-px',
                      done ? 'bg-primary' : 'bg-border'
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <form onSubmit={phoneForm.handleSubmit(onStep1)} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-medium">
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
            {serverError && <p className="text-sm text-destructive text-center">{serverError}</p>}
            <Button type="submit" disabled={phoneForm.formState.isSubmitting} className="w-full">
              {phoneForm.formState.isSubmitting ? 'Надсилання…' : 'Отримати код'}
            </Button>
          </form>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <form onSubmit={codeForm.handleSubmit(onStep2)} className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Ми надіслали SMS з кодом на <strong className="text-foreground">{phone}</strong>
            </p>
            <div className="space-y-1.5">
              <label htmlFor="code" className="text-sm font-medium">
                Код підтвердження
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
            {serverError && <p className="text-sm text-destructive text-center">{serverError}</p>}
            <Button type="submit" disabled={codeForm.formState.isSubmitting} className="w-full">
              {codeForm.formState.isSubmitting ? 'Перевірка…' : 'Підтвердити'}
            </Button>
            <button
              type="button"
              onClick={() => { setStep(1); setServerError(null) }}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Змінити номер
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Вже є акаунт?{' '}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  )
}
