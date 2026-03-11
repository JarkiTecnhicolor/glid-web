import { apiClient } from './client'
import type {
  Facility,
  LabAdvancedData,
  FacilityReview,
  CreateFacilityReviewRequest,
  LabsFreeFilter,
  LabFreeTimeslotsFilter,
  LabAdvancedDataFilter,
  NetworkLabsFilter,
  AssistancePromoFilter,
  PaginatedResponse,
} from '@/types/api'

export const clinicsApi = {
  /** Get free labs with geo, dates, sorting */
  getLabsFree: (params: LabsFreeFilter) =>
    apiClient
      .get('/facility-entities/labs-free', { params })
      .then((r) => r.data),

  /** Get lab advanced data (timeslots context) */
  getLabAdvancedData: (params: LabAdvancedDataFilter) =>
    apiClient
      .get<LabAdvancedData>('/facility-entities/lab-advanced-data', { params })
      .then((r) => r.data),

  /** Get lab free timeslots */
  getLabFreeTimeslots: (params: LabFreeTimeslotsFilter) =>
    apiClient
      .get('/facility-entities/lab-free-timeslots', { params })
      .then((r) => r.data),

  /** Get network labs with geo search */
  getNetworkLabs: (params: NetworkLabsFilter) =>
    apiClient
      .get<Facility[]>('/facility-entities/network-labs', { params })
      .then((r) => r.data),

  /** Get facility reviews */
  getFacilityReviews: (facilityId: string, params?: { page?: number; size?: number }) =>
    apiClient
      .get<PaginatedResponse<FacilityReview>>('/facility-entities/facility-reviews', {
        params: { facilityId, ...params },
      })
      .then((r) => r.data),

  /** Create facility review */
  createFacilityReview: (data: CreateFacilityReviewRequest) =>
    apiClient
      .post('/facility-entities/facility-reviews', data)
      .then((r) => r.data),

  /** Get facility reviews distribution (rating breakdown) */
  getFacilityReviewsDistribution: (facilityId: string) =>
    apiClient
      .get('/facility-entities/facility-reviews-distribution', {
        params: { facilityId },
      })
      .then((r) => r.data),

  /** Get assistances promo list */
  getAssistancesPromo: (params?: AssistancePromoFilter) =>
    apiClient
      .get('/facility-entities/assistances-promo', { params })
      .then((r) => r.data),
}
