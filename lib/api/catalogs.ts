import { apiClient } from './client'
import type { Speciality, Assistance } from '@/types/api'

export const catalogsApi = {
  getSpecialities: () =>
    apiClient
      .get<Speciality[]>('/catalogs/specialities')
      .then((r) => r.data),

  getSpecialitiesForClinic: (facilityId?: string) =>
    apiClient
      .get<Speciality[]>('/catalogs/specialities-clinic', {
        params: facilityId ? { facilityId } : undefined,
      })
      .then((r) => r.data),

  getSpecialtyAssistances: (specialityId: string) =>
    apiClient
      .get<Assistance[]>('/catalogs/specialty-assistances', {
        params: { specialityId },
      })
      .then((r) => r.data),

  getAssistances: () =>
    apiClient
      .get<Assistance[]>('/catalogs/assistances')
      .then((r) => r.data),

  getLabAssistances: (facilityId?: string) =>
    apiClient
      .get<Assistance[]>('/catalogs/assistances-lab', {
        params: facilityId ? { facilityId } : undefined,
      })
      .then((r) => r.data),

  getAssistanceInfo: (assistanceId: string) =>
    apiClient
      .get<Assistance>('/catalogs/assistance-info', {
        params: { assistanceId },
      })
      .then((r) => r.data),
}
