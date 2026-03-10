import { apiClient } from './client'
import type { Doctor, DoctorAssistance } from '@/types/api'

export const favoritesApi = {
  getFavoriteDoctors: () =>
    apiClient
      .get<Doctor[]>('/facility-entities/user-favorite-doctors')
      .then((r) => r.data),

  toggleFavoriteDoctor: (doctorId: string) =>
    apiClient
      .post('/facility-entities/user-favorite-doctors', { doctorId })
      .then((r) => r.data),

  getFavoriteAssistances: () =>
    apiClient
      .get<DoctorAssistance[]>('/facility-entities/user-favorite-assistances')
      .then((r) => r.data),

  toggleFavoriteAssistance: (assistanceId: string) =>
    apiClient
      .post('/facility-entities/user-favorite-assistances', { assistanceId })
      .then((r) => r.data),
}
