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

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Map raw API doctor object to our Doctor interface */
function mapDoctor(raw: any): Doctor {
  return {
    id: String(raw.id),
    firstName: raw.firstName ?? '',
    lastName: raw.lastName ?? '',
    middleName: raw.middleName,
    speciality: raw.speciality ?? raw.specialty?.name ?? raw.specialtyName,
    specialityId: raw.specialityId ?? raw.specialty?.id ?? raw.specialtyId,
    experience: raw.experience,
    photo: raw.photo ?? raw.avatarUrl ?? raw.facility?.avatarUrl,
    rating: typeof raw.rating === 'number' ? raw.rating : undefined,
    reviewCount: raw.reviewCount ?? raw.reviewsCount,
    price: raw.price ?? raw.minPrice,
    facilityId: raw.facilityId ?? raw.facility?.id ? String(raw.facility?.id) : undefined,
    facilityName: raw.facilityName ?? raw.facility?.name,
    isOnline: raw.isOnline ?? raw.category === 'ONLINE',
    distance: raw.distance,
    category: raw.category,
  }
}

function extractDoctors(body: any): PaginatedResponse<Doctor> {
  let rawList: any[] = []
  let total = 0

  if (Array.isArray(body)) {
    rawList = body
    total = body.length
  } else if (body?.content && Array.isArray(body.content)) {
    rawList = body.content
    total = body.totalElements ?? body.content.length
  } else if (body?.data && Array.isArray(body.data)) {
    rawList = body.data
    total = body.total ?? body.data.length
  }

  return { data: rawList.map(mapDoctor), total, page: 0, limit: rawList.length }
}

/* eslint-enable @typescript-eslint/no-explicit-any */

export const doctorsApi = {
  /** Search free doctors with geo, dates, sorting, category */
  getDoctorsFree: (params: DoctorsFreeFilter) =>
    apiClient
      .get('/facility-entities/v2/doctors-free', { params })
      .then((r) => extractDoctors(r.data)),

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
