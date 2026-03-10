'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/store/auth'
import { authApi } from '@/lib/api/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z.object({
  firstName: z.string().min(1, "Введіть ім'я"),
  lastName: z.string().min(1, 'Введіть прізвище'),
  email: z.string().email('Невірний email').or(z.literal('')).optional(),
})

type FormValues = z.infer<typeof schema>

export default function ProfilePage() {
  const router = useRouter()
  const { user, setUser, logout } = useAuthStore()
  const queryClient = useQueryClient()
  const [saved, setSaved] = useState(false)

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.getProfileFull(),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
    },
  })

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        email: profile.email ?? '',
      })
    }
  }, [profile, reset])

  const updateProfile = useMutation({
    mutationFn: (data: FormValues) => authApi.updateProfileFull(data),
    onSuccess: (updated) => {
      setUser(updated)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  function handleLogout() {
    logout()
    document.cookie = 'glid_access_token=; path=/; max-age=0'
    router.push('/')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-foreground">Профіль</h1>

      {/* Profile form */}
      <form
        onSubmit={handleSubmit((v) => updateProfile.mutate(v))}
        className="rounded-2xl border border-border bg-card p-6 space-y-4"
      >
        <h2 className="font-semibold text-foreground">Особисті дані</h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Ім'я</label>
            <Input {...register('firstName')} aria-invalid={!!errors.firstName} />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Прізвище</label>
            <Input {...register('lastName')} aria-invalid={!!errors.lastName} />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" {...register('email')} aria-invalid={!!errors.email} />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Телефон</label>
          <Input value={user?.phone ?? ''} disabled className="opacity-60" />
          <p className="text-xs text-muted-foreground">Телефон не можна змінити</p>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting || updateProfile.isPending}>
            {isSubmitting || updateProfile.isPending ? 'Збереження…' : 'Зберегти'}
          </Button>
          {saved && <span className="text-sm text-glid-green font-medium">✓ Збережено</span>}
          {updateProfile.isError && (
            <span className="text-sm text-destructive">Помилка збереження</span>
          )}
        </div>
      </form>

      {/* Logout */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground mb-3">Акаунт</h2>
        <Button variant="destructive" onClick={handleLogout}>
          Вийти з акаунту
        </Button>
      </div>
    </div>
  )
}
