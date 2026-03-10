import { apiClient } from './client'
import type { Facility, LabAdvancedData, TimeSlot, PaginatedResponse } from '@/types/api'

export interface FacilitiesFilter {
  search?: string
  type?: 'clinic' | 'lab'
  address?: string
  page?: number
  limit?: number
}

export const clinicsApi = {
  getFacilities: (params?: FacilitiesFilter) =>
    apiClient
      .get<PaginatedResponse<Facility>>('/facility-entities/facilities', { params })
      .then((r) => r.data),

  getLabAdvancedData: (facilityId: string) =>
    apiClient
      .get<LabAdvancedData>('/facility-entities/lab-advanced-data', {
        params: { facilityId },
      })
      .then((r) => r.data),

  getLabFreeTimeslots: (facilityId: string, date?: string) =>
    apiClient
      .get<TimeSlot[]>('/facility-entities/lab-free-timeslots', {
        params: { facilityId, date },
      })
      .then((r) => r.data),

  getNetworkLabs: (networkId: string) =>
    apiClient
      .get<Facility[]>('/facility-entities/network-labs', {
        params: { networkId },
      })
      .then((r) => r.data),

  getFacilityReviews: (facilityId: string) =>
    apiClient
      .get('/facility-entities/facility-reviews', { params: { facilityId } })
      .then((r) => r.data),

  createFacilityReview: (facilityId: string, data: { rating: number; text: string }) =>
    apiClient
      .post('/facility-entities/facility-reviews', { facilityId, ...data })
      .then((r) => r.data),

  getFacilityNetworks: () =>
    apiClient
      .get('/facility-entities/facility-networks')
      .then((r) => r.data),
}
