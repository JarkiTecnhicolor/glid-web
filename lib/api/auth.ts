import { apiClient } from './client'
import type {
  SignInRequest,
  SignInResponse,
  RegisterPhoneStep1Request,
  RegisterPhoneStep2Request,
  RegisterPhoneStep3Request,
  User,
} from '@/types/api'

export const authApi = {
  signIn: (data: SignInRequest) =>
    apiClient.post<SignInResponse>('/user/signin', data).then((r) => r.data),

  signOut: () =>
    apiClient.get('/user/signout').then((r) => r.data),

  refreshToken: (refreshToken: string) =>
    apiClient
      .get<SignInResponse>('/user/refresh-token', {
        headers: { Authorization: `Bearer ${refreshToken}` },
      })
      .then((r) => r.data),

  getAccount: () =>
    apiClient.get<User>('/user/account').then((r) => r.data),

  getProfileFull: () =>
    apiClient.get<User>('/user/profile-full').then((r) => r.data),

  updateProfileFull: (data: Partial<User>) =>
    apiClient.post<User>('/user/profile-full', data).then((r) => r.data),

  // Registration — 3 steps
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

  // Reset password — 3 steps
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

  deleteAvatar: () =>
    apiClient.get('/user/delete-avatar').then((r) => r.data),
}
