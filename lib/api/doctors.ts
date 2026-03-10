import { apiClient } from './client'
import type {
  Doctor,
  DoctorAdvancedData,
  DoctorAdditionalInfo,
  DoctorReview,
  DoctorReviewsDistribution,
  DoctorSchedule,
  DoctorAssistance,
  TimeSlot,
  PaginatedResponse,
} from '@/types/api'

export interface DoctorsFilter {
  search?: string
  specialityId?: string
  assistanceId?: string
  facilityId?: string
  isOnline?: boolean
  page?: number
  limit?: number
}

export const doctorsApi = {
  getDoctors: (params?: DoctorsFilter) =>
    apiClient
      .get<PaginatedResponse<Doctor>>('/facility-entities/doctors', { params })
      .then((r) => r.data),

  getDoctorAdvancedData: (doctorId: string) =>
    apiClient
      .get<DoctorAdvancedData>('/facility-entities/doctor-advanced-data', {
        params: { doctorId },
      })
      .then((r) => r.data),

  getDoctorAdditionalInfo: (doctorId: string) =>
    apiClient
      .get<DoctorAdditionalInfo>('/facility-entities/doctor-additional-info', {
        params: { doctorId },
      })
      .then((r) => r.data),

  getDoctorReviews: (doctorId: string, params?: { page?: number; limit?: number }) =>
    apiClient
      .get<PaginatedResponse<DoctorReview>>('/facility-entities/doctor-reviews', {
        params: { doctorId, ...params },
      })
      .then((r) => r.data),

  createDoctorReview: (doctorId: string, data: { rating: number; text: string }) =>
    apiClient
      .post<DoctorReview>('/facility-entities/doctor-reviews', { doctorId, ...data })
      .then((r) => r.data),

  getDoctorReviewsDistribution: (doctorId: string) =>
    apiClient
      .get<DoctorReviewsDistribution>(
        '/facility-entities/doctor-reviews-distribution',
        { params: { doctorId } }
      )
      .then((r) => r.data),

  getDoctorSchedules: (doctorId: string) =>
    apiClient
      .get<DoctorSchedule>('/facility-entities/doctor-schedules', {
        params: { doctorId },
      })
      .then((r) => r.data),

  getDoctorFreeTimeslots: (doctorId: string, date?: string) =>
    apiClient
      .get<TimeSlot[]>('/facility-entities/doctor-free-timeslots', {
        params: { doctorId, date },
      })
      .then((r) => r.data),

  getDoctorsAssistances: (doctorId: string) =>
    apiClient
      .get<DoctorAssistance[]>('/facility-entities/doctors-assistances', {
        params: { doctorId },
      })
      .then((r) => r.data),

  getDoctorFacilities: (doctorId: string) =>
    apiClient
      .get('/facility-entities/doctor-facilities', { params: { doctorId } })
      .then((r) => r.data),
}
