import { apiClient } from './client'
import type {
  Appointment,
  AppointmentDiagnosis,
  AppointmentAttachment,
  CreateClinicAppointmentRequest,
  CreateOnlineAppointmentRequest,
  CreateLabAppointmentRequest,
  EditAppointmentRequest,
  UserAppointmentsFilter,
} from '@/types/api'

export const appointmentsApi = {
  /** Get user appointments list with filters */
  getUserAppointments: (params?: UserAppointmentsFilter) =>
    apiClient
      .get('/facility-entities/user-appointments', { params })
      .then((r) => r.data),

  /** Get single appointment by ID */
  getUserAppointment: (appointmentId: string) =>
    apiClient
      .get<Appointment>(`/facility-entities/user-appointments/${appointmentId}`)
      .then((r) => r.data),

  /** Edit user appointment */
  updateUserAppointment: (appointmentId: string, data: EditAppointmentRequest) =>
    apiClient
      .put<Appointment>(`/facility-entities/user-appointments/${appointmentId}`, data)
      .then((r) => r.data),

  /** Create clinic appointment */
  createClinicAppointment: (data: CreateClinicAppointmentRequest) =>
    apiClient
      .post<Appointment>('/facility-entities/create-clinic-appointment', data)
      .then((r) => r.data),

  /** Create online appointment */
  createOnlineAppointment: (data: CreateOnlineAppointmentRequest) =>
    apiClient
      .post<Appointment>('/facility-entities/create-clinic-appointment', data)
      .then((r) => r.data),

  /** Create lab appointment */
  createLabAppointment: (data: CreateLabAppointmentRequest) =>
    apiClient
      .post<Appointment>('/facility-entities/create-lab-appointment', data)
      .then((r) => r.data),

  /** Stage appointment (confirm/reject) */
  stageAppointment: (appointmentId: string, stage: 'confirm' | 'reject') =>
    apiClient
      .post(`/facility-entities/stage-appointment/${appointmentId}`, { stage })
      .then((r) => r.data),

  /** Get suitable facilities for an appointment by city */
  getSuitableFacilities: (appointmentId: string, cityId?: string) =>
    apiClient
      .get(`/facility-entities/appointment-suitable-facilities/${appointmentId}`, {
        params: cityId ? { cityId } : undefined,
      })
      .then((r) => r.data),

  /** Get appointment diagnoses */
  getAppointmentDiagnoses: () =>
    apiClient
      .get<AppointmentDiagnosis[]>('/facility-entities/appointment-diagnoses')
      .then((r) => r.data),

  /** Get appointment attachments list */
  getAppointmentAttachments: () =>
    apiClient
      .get<AppointmentAttachment[]>('/facility-entities/appointment-attachments')
      .then((r) => r.data),

  /** Get appointment attachment download link */
  getAttachmentDownloadLink: (attachmentId: string) =>
    apiClient
      .get<{ url: string }>('/facility-entities/appointment-attachment-link', {
        params: { attachmentId },
      })
      .then((r) => r.data),

  /** Get appointment content (medcard) */
  getAppointmentContent: (params?: { page?: number; size?: number }) =>
    apiClient
      .get('/facility-entities/appointment-content', { params })
      .then((r) => r.data),

  // ─── Dobrodoc ──────────────────────────────────────────────────────────────

  /** Get Dobrodoc appointment and user data */
  getDobrodocAppointmentUserData: (appointmentId: string) =>
    apiClient
      .get('/dobrodoc/appointment-user-data', { params: { appointmentId } })
      .then((r) => r.data),

  /** Upload file to Dobrodoc appointment chat */
  uploadDobrodocChatFile: (appointmentId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient
      .post('/dobrodoc/appointment-chat-file', formData, {
        params: { appointmentId },
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },
}
