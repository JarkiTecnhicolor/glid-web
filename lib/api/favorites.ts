import { apiClient } from './client'
import type { Doctor, DoctorAssistance } from '@/types/api'

export const favoritesApi = {
  getFavoriteDoctors: () =>
    apiClient
      .get<Doctor[]>('/facility-entities/user-favorite-doctors')
      .then((r) => r.data),

  setFavoriteDoctor: (doctorId: string, isFavorite: boolean) =>
    apiClient
      .post('/facility-entities/user-favorite-doctors', { doctorId, isFavorite })
      .then((r) => r.data),

  getFavoriteAssistances: () =>
    apiClient
      .get<DoctorAssistance[]>('/facility-entities/user-favorite-assistances')
      .then((r) => r.data),

  setFavoriteAssistance: (assistanceId: string, isFavorite: boolean) =>
    apiClient
      .post('/facility-entities/user-favorite-assistances', { assistanceId, isFavorite })
      .then((r) => r.data),
}
