import { apiClient } from './client'
import type {
  Appointment,
  AppointmentDiagnosis,
  AppointmentAttachment,
  CreateClinicAppointmentRequest,
  CreateLabAppointmentRequest,
  PaginatedResponse,
} from '@/types/api'

export const appointmentsApi = {
  getUserAppointments: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient
      .get<PaginatedResponse<Appointment>>('/facility-entities/user-appointments', {
        params,
      })
      .then((r) => r.data),

  updateUserAppointment: (appointmentId: string, data: Partial<Appointment>) =>
    apiClient
      .put<Appointment>('/facility-entities/user-appointments', {
        appointmentId,
        ...data,
      })
      .then((r) => r.data),

  cancelUserAppointment: (appointmentId: string) =>
    apiClient
      .delete('/facility-entities/user-appointments', {
        params: { appointmentId },
      })
      .then((r) => r.data),

  createClinicAppointment: (data: CreateClinicAppointmentRequest) =>
    apiClient
      .post<Appointment>('/facility-entities/create-clinic-appointment', data)
      .then((r) => r.data),

  createLabAppointment: (data: CreateLabAppointmentRequest) =>
    apiClient
      .post<Appointment>('/facility-entities/create-lab-appointment', data)
      .then((r) => r.data),

  getAppointmentDiagnoses: (appointmentId: string) =>
    apiClient
      .get<AppointmentDiagnosis[]>('/facility-entities/appointment-diagnoses', {
        params: { appointmentId },
      })
      .then((r) => r.data),

  getAppointmentAttachments: (appointmentId: string) =>
    apiClient
      .get<AppointmentAttachment[]>('/facility-entities/appointment-attachments', {
        params: { appointmentId },
      })
      .then((r) => r.data),

  getAttachmentDownloadLink: (attachmentId: string) =>
    apiClient
      .get<{ url: string }>('/facility-entities/appointment-attachment-link', {
        params: { attachmentId },
      })
      .then((r) => r.data),

  deleteAppointmentAttachment: (attachmentId: string) =>
    apiClient
      .delete('/facility-entities/appointment-attachments', {
        params: { attachmentId },
      })
      .then((r) => r.data),
}
