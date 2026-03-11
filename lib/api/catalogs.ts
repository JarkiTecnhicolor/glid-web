import { apiClient } from './client'
import type { Speciality, Assistance, DoctorCategory } from '@/types/api'

export const catalogsApi = {
  getSpecialities: () =>
    apiClient
      .get<Speciality[]>('/catalogs/specialities')
      .then((r) => r.data),

  getSpecialitiesForClinic: (category?: DoctorCategory) =>
    apiClient
      .get<{ uk: Speciality[] } | Speciality[]>('/catalogs/specialities-clinic', {
        params: category ? { category } : undefined,
      })
      .then((r) => (Array.isArray(r.data) ? r.data : r.data.uk)),

  getSpecialtyAssistances: (specialtyId: string) =>
    apiClient
      .get<Assistance[]>('/catalogs/specialty-assistances', {
        params: { specialtyId },
      })
      .then((r) => r.data),

  getAssistances: () =>
    apiClient
      .get<Assistance[]>('/catalogs/assistances')
      .then((r) => r.data),

  getLabAssistances: () =>
    apiClient
      .get<Assistance[]>('/catalogs/assistances-lab')
      .then((r) => r.data),

  getAssistanceInfo: (assistanceId: string) =>
    apiClient
      .get<Assistance>('/catalogs/assistance-info', {
        params: { assistanceId },
      })
      .then((r) => r.data),
}
