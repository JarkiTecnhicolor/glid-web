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

// ─── Step schemas ────────────────────────────────────────────────────────────

const step1Schema = z.object({
  phone: z
    .string()
    .min(10, 'Введіть номер телефону')
    .regex(/^\+?[0-9\s\-()]+$/, 'Невірний формат телефону'),
})

const step2Schema = z.object({
  code: z
    .string()
    .length(4, 'Код має складатися з 4 цифр')
    .regex(/^\d+$/, 'Тільки цифри'),
})

const step3Schema = z
  .object({
    firstName: z.string().min(1, "Введіть ім'я"),
    lastName: z.string().min(1, 'Введіть прізвище'),
    email: z.string().email('Невірний email').or(z.literal('')).optional(),
    password: z.string().min(6, 'Пароль — мінімум 6 символів'),
    passwordConfirm: z.string().min(1, 'Підтвердіть пароль'),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: 'Паролі не співпадають',
    path: ['passwordConfirm'],
  })

type Step1 = z.infer<typeof step1Schema>
type Step2 = z.infer<typeof step2Schema>
type Step3 = z.infer<typeof step3Schema>

// ─── Component ───────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter()
  const { setTokens, setUser } = useAuthStore()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [phone, setPhone] = useState('')
  const [serverError, setServerError] = useState<string | null>(null)

  // Step 1
  const form1 = useForm<Step1>({ resolver: zodResolver(step1Schema) })
  // Step 2
  const form2 = useForm<Step2>({ resolver: zodResolver(step2Schema) })
  // Step 3
  const form3 = useForm<Step3>({ resolver: zodResolver(step3Schema) })

  // ── Step 1: send OTP ───────────────────────────────────────────────────────
  async function onStep1(values: Step1) {
    setServerError(null)
    try {
      await authApi.registerInitialPhone({ phone: values.phone })
      setPhone(values.phone)
      setStep(2)
    } catch (e: unknown) {
      setServerError(
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Помилка. Перевірте номер і спробуйте ще раз.'
      )
    }
  }

  // ── Step 2: confirm OTP ────────────────────────────────────────────────────
  async function onStep2(values: Step2) {
    setServerError(null)
    try {
      await authApi.registerConfirmPhone({ phone, code: values.code })
      setStep(3)
    } catch (e: unknown) {
      setServerError(
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Невірний код. Спробуйте ще раз.'
      )
    }
  }

  // ── Step 3: complete profile ───────────────────────────────────────────────
  async function onStep3(values: Step3) {
    setServerError(null)
    try {
      const res = await authApi.registerFinalPhone({
        phone,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email || undefined,
        password: values.password,
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
          'Помилка реєстрації. Спробуйте ще раз.'
      )
    }
  }

  const STEPS = ['Телефон', 'Підтвердження', 'Профіль']

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
          <form onSubmit={form1.handleSubmit(onStep1)} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-medium">
                Номер телефону
              </label>
              <Input
                id="phone"
                placeholder="+38 (0XX) XXX-XX-XX"
                {...form1.register('phone')}
                aria-invalid={!!form1.formState.errors.phone}
              />
              {form1.formState.errors.phone && (
                <p className="text-xs text-destructive">{form1.formState.errors.phone.message}</p>
              )}
            </div>
            {serverError && <p className="text-sm text-destructive text-center">{serverError}</p>}
            <Button type="submit" disabled={form1.formState.isSubmitting} className="w-full">
              {form1.formState.isSubmitting ? 'Надсилання…' : 'Отримати код'}
            </Button>
          </form>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <form onSubmit={form2.handleSubmit(onStep2)} className="space-y-4">
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
                {...form2.register('code')}
                aria-invalid={!!form2.formState.errors.code}
              />
              {form2.formState.errors.code && (
                <p className="text-xs text-destructive">{form2.formState.errors.code.message}</p>
              )}
            </div>
            {serverError && <p className="text-sm text-destructive text-center">{serverError}</p>}
            <Button type="submit" disabled={form2.formState.isSubmitting} className="w-full">
              {form2.formState.isSubmitting ? 'Перевірка…' : 'Підтвердити'}
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

        {/* ── Step 3 ── */}
        {step === 3 && (
          <form onSubmit={form3.handleSubmit(onStep3)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="text-sm font-medium">
                  Ім'я
                </label>
                <Input
                  id="firstName"
                  placeholder="Іван"
                  {...form3.register('firstName')}
                  aria-invalid={!!form3.formState.errors.firstName}
                />
                {form3.formState.errors.firstName && (
                  <p className="text-xs text-destructive">{form3.formState.errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Прізвище
                </label>
                <Input
                  id="lastName"
                  placeholder="Петренко"
                  {...form3.register('lastName')}
                  aria-invalid={!!form3.formState.errors.lastName}
                />
                {form3.formState.errors.lastName && (
                  <p className="text-xs text-destructive">{form3.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-muted-foreground font-normal">(необов'язково)</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                {...form3.register('email')}
                aria-invalid={!!form3.formState.errors.email}
              />
              {form3.formState.errors.email && (
                <p className="text-xs text-destructive">{form3.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Пароль
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Мінімум 6 символів"
                {...form3.register('password')}
                aria-invalid={!!form3.formState.errors.password}
              />
              {form3.formState.errors.password && (
                <p className="text-xs text-destructive">{form3.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="passwordConfirm" className="text-sm font-medium">
                Підтвердіть пароль
              </label>
              <Input
                id="passwordConfirm"
                type="password"
                placeholder="••••••••"
                {...form3.register('passwordConfirm')}
                aria-invalid={!!form3.formState.errors.passwordConfirm}
              />
              {form3.formState.errors.passwordConfirm && (
                <p className="text-xs text-destructive">{form3.formState.errors.passwordConfirm.message}</p>
              )}
            </div>

            {serverError && <p className="text-sm text-destructive text-center">{serverError}</p>}

            <Button type="submit" disabled={form3.formState.isSubmitting} className="w-full">
              {form3.formState.isSubmitting ? 'Реєстрація…' : 'Зареєструватись'}
            </Button>
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
