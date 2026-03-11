import { apiClient } from './client'
import type {
  Doctor,
  DoctorAdvancedData,
  DoctorAdditionalInfo,
  DoctorReview,
  DoctorReviewsDistribution,
  DoctorAssistance,
  DoctorsFreeFilter,
  DoctorFacilitiesFilter,
  DoctorFreeTimeslotsFilter,
  DoctorAdvancedDataFilter,
  CreateDoctorReviewRequest,
  PaginatedResponse,
} from '@/types/api'

export const doctorsApi = {
  /** Search free doctors with geo, dates, sorting, category */
  getDoctorsFree: (params: DoctorsFreeFilter) =>
    apiClient
      .get('/facility-entities/v2/doctors-free', { params })
      .then((r) => {
        const body = r.data
        console.log('[doctors-free] raw response:', JSON.stringify(body).slice(0, 500))
        // Normalize: API may return { data: [...], total } or [...] directly or { content: [...] }
        if (Array.isArray(body)) {
          return { data: body, total: body.length, page: 0, limit: body.length } as PaginatedResponse<Doctor>
        }
        if (body?.content && Array.isArray(body.content)) {
          return { data: body.content, total: body.totalElements ?? body.content.length, page: body.number ?? 0, limit: body.size ?? body.content.length } as PaginatedResponse<Doctor>
        }
        if (body?.data && Array.isArray(body.data)) {
          return body as PaginatedResponse<Doctor>
        }
        // Fallback
        return { data: [], total: 0, page: 0, limit: 0 } as PaginatedResponse<Doctor>
      }),

  /** Get doctor facilities (clinics where the doctor works) */
  getDoctorFacilities: (params: DoctorFacilitiesFilter) =>
    apiClient
      .get('/facility-entities/doctor-facilities', { params })
      .then((r) => r.data),

  /** Get doctor advanced data (with timeslots context) */
  getDoctorAdvancedData: (params: DoctorAdvancedDataFilter) =>
    apiClient
      .get<DoctorAdvancedData>('/facility-entities/doctor-advanced-data', { params })
      .then((r) => r.data),

  /** Get doctor additional info (certificates, awards) */
  getDoctorAdditionalInfo: (doctorId: string) =>
    apiClient
      .get<DoctorAdditionalInfo>('/facility-entities/doctor-additional-info', {
        params: { doctorId },
      })
      .then((r) => r.data),

  /** Get doctor free timeslots for a date range */
  getDoctorFreeTimeslots: (params: DoctorFreeTimeslotsFilter) =>
    apiClient
      .get('/facility-entities/doctor-free-timeslots', { params })
      .then((r) => r.data),

  /** Get doctor assistances (services the doctor provides) */
  getDoctorAssistances: (doctorId: string) =>
    apiClient
      .get<DoctorAssistance[]>('/facility-entities/doctor-assistances', {
        params: { doctorId },
      })
      .then((r) => r.data),

  /** Get doctor reviews list */
  getDoctorReviews: (doctorId: string, params?: { page?: number; size?: number }) =>
    apiClient
      .get<PaginatedResponse<DoctorReview>>('/facility-entities/doctor-reviews', {
        params: { doctorId, ...params },
      })
      .then((r) => r.data),

  /** Create a doctor review */
  createDoctorReview: (data: CreateDoctorReviewRequest) =>
    apiClient
      .post<DoctorReview>('/facility-entities/doctor-reviews', data)
      .then((r) => r.data),

  /** Get doctor reviews distribution (rating breakdown) */
  getDoctorReviewsDistribution: (doctorId: string) =>
    apiClient
      .get<DoctorReviewsDistribution>(
        '/facility-entities/doctor-reviews-distribution',
        { params: { doctorId } }
      )
      .then((r) => r.data),

  /** Upload doctor avatar (admin) */
  uploadDoctorAvatar: (facilityId: string, doctorId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient
      .post('/attachments/doctor-avatar', formData, {
        params: { facilityId, doctorId },
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },

  /** Set/unset doctor as favorite */
  setDoctorFavorite: (doctorId: string, isFavorite: boolean) =>
    apiClient
      .post('/facility-entities/user-favorite-doctors', { doctorId, isFavorite })
      .then((r) => r.data),

  /** Get favorite doctors list */
  getFavoriteDoctors: () =>
    apiClient
      .get<Doctor[]>('/facility-entities/user-favorite-doctors')
      .then((r) => r.data),
}
