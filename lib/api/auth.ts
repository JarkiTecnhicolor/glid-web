import { apiClient } from './client'
import type {
  SignInRequest,
  SignInResponse,
  RegisterOtpInitialRequest,
  RegisterOtpConfirmRequest,
  RegisterPhoneStep1Request,
  RegisterPhoneStep2Request,
  RegisterPhoneStep3Request,
  User,
  UserProfileFull,
} from '@/types/api'

export const authApi = {
  signIn: (data: SignInRequest) =>
    apiClient.post<SignInResponse>('/user/signin', data).then((r) => r.data),

  signOut: (refreshToken: string) =>
    apiClient
      .post('/user/signout', { 'refresh-token': refreshToken })
      .then((r) => r.data),

  refreshToken: (refreshToken: string) =>
    apiClient
      .post<SignInResponse>('/user/refresh-token', { token: refreshToken })
      .then((r) => r.data),

  getProfileFull: () =>
    apiClient.get<UserProfileFull>('/user/profile-full').then((r) => r.data),

  updateProfileFull: (data: Partial<UserProfileFull>) =>
    apiClient.post<UserProfileFull>('/user/profile-full', data).then((r) => r.data),

  // ─── OTP-only registration (2 steps) ─────────────────────────────────────
  registerInitialOtpOnly: (data: RegisterOtpInitialRequest) =>
    apiClient
      .post<{ channelId: string }>('/user/register-initial-phone-otp-only', data)
      .then((r) => r.data),

  registerConfirmOtpOnly: (data: RegisterOtpConfirmRequest) =>
    apiClient
      .post<SignInResponse>('/user/register-confirm-phone-otp-only', data)
      .then((r) => r.data),

  // ─── Full registration (3 steps) ─────────────────────────────────────────
  registerInitialPhone: (data: RegisterPhoneStep1Request) =>
    apiClient
      .post('/user/register-initial-phone', data)
      .then((r) => r.data),

  registerConfirmPhone: (data: RegisterPhoneStep2Request) =>
    apiClient
      .post('/user/register-confirm-phone', data)
      .then((r) => r.data),

  registerFinalPhone: (data: RegisterPhoneStep3Request) =>
    apiClient
      .post<SignInResponse>('/user/register-final-phone', data)
      .then((r) => r.data),

  // ─── Unregister ──────────────────────────────────────────────────────────
  unregisterPhone: (phone: string) =>
    apiClient.post('/user/unregister-phone', { phone }).then((r) => r.data),

  // ─── Reset password (3 steps) ────────────────────────────────────────────
  resetPasswordInitialPhone: (phone: string) =>
    apiClient
      .post('/user/reset-password-initial-phone', { phone })
      .then((r) => r.data),

  resetPasswordConfirmPhone: (phone: string, code: string) =>
    apiClient
      .post('/user/reset-password-confirm-phone', { phone, code })
      .then((r) => r.data),

  resetPasswordFinalPhone: (phone: string, code: string, password: string) =>
    apiClient
      .post('/user/reset-password-final-phone', { phone, code, password })
      .then((r) => r.data),

  changeCurrentPassword: (currentPassword: string, newPassword: string) =>
    apiClient
      .post('/user/change-current-password', { currentPassword, newPassword })
      .then((r) => r.data),

  // ─── Avatar ──────────────────────────────────────────────────────────────
  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient
      .post('/attachments/user-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },

  deleteAvatar: () =>
    apiClient.get('/user/delete-avatar').then((r) => r.data),

  // ─── Email confirmation ──────────────────────────────────────────────────
  confirmEmail: () =>
    apiClient.post('/user/email-confirmation').then((r) => r.data),

  // ─── Survey ──────────────────────────────────────────────────────────────
  getSurvey: () =>
    apiClient.get('/user/survey').then((r) => r.data),

  saveSurvey: (answers: Array<{ id: number; answer: { selection: boolean; answerContent?: string } }>) =>
    apiClient.post('/user/survey', answers).then((r) => r.data),
}
