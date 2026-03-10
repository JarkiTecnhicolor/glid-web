// ─── Auth ────────────────────────────────────────────────────────────────────

export interface SignInRequest {
  login: string
  password: string
}

export interface SignInResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface RegisterPhoneStep1Request {
  phone: string
}

export interface RegisterPhoneStep2Request {
  phone: string
  code: string
}

export interface RegisterPhoneStep3Request {
  phone: string
  firstName: string
  lastName: string
  email?: string
  password: string
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  firstName: string
  lastName: string
  phone: string
  email?: string
  avatar?: string
  lang?: string
}

// ─── Doctor ───────────────────────────────────────────────────────────────────

export interface Doctor {
  id: string
  firstName: string
  lastName: string
  middleName?: string
  speciality?: string
  specialityId?: string
  experience?: number
  photo?: string
  rating?: number
  reviewCount?: number
  price?: number
  facilityId?: string
  facilityName?: string
  isOnline?: boolean
}

export interface DoctorAdvancedData extends Doctor {
  about?: string
  education?: string[]
  categories?: string[]
  languages?: string[]
}

export interface DoctorAdditionalInfo {
  doctorId: string
  certificates?: string[]
  awards?: string[]
  memberships?: string[]
}

export interface DoctorReview {
  id: string
  doctorId: string
  userId: string
  userName: string
  rating: number
  text: string
  createdAt: string
}

export interface DoctorReviewsDistribution {
  doctorId: string
  average: number
  total: number
  distribution: { rating: number; count: number }[]
}

export interface DoctorSchedule {
  doctorId: string
  workDays: WorkDay[]
}

export interface WorkDay {
  date: string
  slots: TimeSlot[]
}

export interface TimeSlot {
  id: string
  time: string
  available: boolean
}

export interface DoctorAssistance {
  id: string
  name: string
  price: number
  duration?: number
}

// ─── Facility (Clinic / Lab) ──────────────────────────────────────────────────

export interface Facility {
  id: string
  name: string
  type: 'clinic' | 'lab' | 'hospital'
  logo?: string
  address?: string
  phone?: string
  rating?: number
}

export interface LabAdvancedData extends Facility {
  about?: string
  workingHours?: string
  services?: string[]
}

// ─── Appointment ──────────────────────────────────────────────────────────────

export interface Appointment {
  id: string
  doctorId: string
  doctorName: string
  doctorSpeciality?: string
  doctorPhoto?: string
  facilityId?: string
  facilityName?: string
  date: string
  time: string
  status: AppointmentStatus
  type: 'clinic' | 'lab' | 'online'
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'

export interface AppointmentDiagnosis {
  id: string
  appointmentId: string
  code?: string
  name: string
  description?: string
}

export interface AppointmentAttachment {
  id: string
  appointmentId: string
  name: string
  type: string
  size?: number
  createdAt: string
}

export interface CreateClinicAppointmentRequest {
  doctorId: string
  facilityId: string
  date: string
  time: string
  slotId: string
  assistanceId?: string
}

export interface CreateLabAppointmentRequest {
  facilityId: string
  date: string
  time: string
  slotId: string
  assistanceIds?: string[]
}

// ─── Catalogs ─────────────────────────────────────────────────────────────────

export interface Speciality {
  id: string
  name: string
  icon?: string
}

export interface Assistance {
  id: string
  name: string
  specialityId?: string
  price?: number
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// ─── API Error ────────────────────────────────────────────────────────────────

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}
