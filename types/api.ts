// ─── Auth ────────────────────────────────────────────────────────────────────

export interface SignInRequest {
  login: string
  password: string
}

export interface SignInResponse {
  accessToken: string
  refreshToken: string
  user?: User
}

export interface RegisterOtpInitialRequest {
  phone: string
}

export interface RegisterOtpConfirmRequest {
  phone: string
  confirmationCode: string
  channelId: string
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

export interface UserProfileFull {
  firstName: string
  lastName: string
  middleName?: string
  email?: string
  phone: string
  dateBirth?: string
  medicalNotes?: string
  allergicNotes?: string
  treatment?: string
  bloodType?: string
  age?: number
  height?: string
  weight?: string
  lang?: string
  cityId?: number
  isVerified?: boolean
  gender?: { code: 'MALE' | 'FEMALE' }
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
  distance?: number
  category?: DoctorCategory
}

export type DoctorCategory = 'CLINIC' | 'DENT' | 'ONLINE'

export type DoctorSort = 'RATING' | 'CHEAP' | 'EXPENSIVE' | 'DISTANCE'

export interface DoctorsFreeFilter {
  specialtyId?: string
  assistanceId?: string
  facilityIds?: string
  cityId?: string
  searchDistance?: number
  currentCoords?: string
  from?: string
  to?: string
  lastName?: string
  isChildren?: boolean
  sort?: DoctorSort
  category?: DoctorCategory
  page?: number
  size?: number
}

export interface DoctorFacilitiesFilter {
  specialtyId?: string
  assistanceId?: string
  searchDistance?: number
  currentCoords?: string
  page?: number
  size?: number
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
  text?: string
  message?: string
  anonymously?: boolean
  createdAt: string
}

export interface CreateDoctorReviewRequest {
  doctorId: string
  rating: number
  anonymously?: boolean
  message?: string
  appointmentId?: number
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

export interface DoctorFreeTimeslotsFilter {
  doctorId: string
  from: string
  to: string
  assistanceId?: string
  spesialityId?: string
}

export interface DoctorAdvancedDataFilter {
  doctorId: string
  assistanceId?: string
  specialtyId?: string
  from?: string
  to?: string
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
  type?: 'clinic' | 'lab' | 'hospital'
  logo?: string
  address?: string
  phone?: string
  rating?: number
  distance?: number
  coords?: string
}

export interface LabAdvancedData extends Facility {
  about?: string
  workingHours?: string
  services?: string[]
}

export interface LabsFreeFilter {
  from: string
  to: string
  assistanceIds: string
  urgentAssistanceIds?: string
  cityId?: string
  searchDistance?: number
  currentCoords?: string
  facilityIds?: string
  sort?: 'CHEAP' | 'EXPENSIVE' | 'DISTANCE'
  page?: number
  size?: number
}

export interface LabFreeTimeslotsFilter {
  facilityId: string
  from: string
  to: string
  assistanceIds: string
}

export interface LabAdvancedDataFilter {
  facilityId: string
  from: string
  to: string
  assistanceIds: string
  urgentAssistanceIds?: string
}

export interface NetworkLabsFilter {
  searchDistance?: number
  currentCoords?: string
  assistanceIds?: string
  page?: number
  size?: number
}

export interface FacilityReview {
  id: string
  facilityId: string
  userId?: string
  userName?: string
  rating: number
  message?: string
  anonymously?: boolean
  createdAt?: string
}

export interface CreateFacilityReviewRequest {
  facilityId: string
  rating: number
  anonymously?: boolean
  message?: string
  appointmentId?: number
}

// ─── Appointment ──────────────────────────────────────────────────────────────

export type PaymentType = 'CASH' | 'PAYLINK' | 'APAY' | 'DRAFT'

export interface PaymentData {
  type: PaymentType
  status?: 'PENDING' | 'PAID' | 'FAILED'
  resultData?: { orderId?: string }
}

export type AppointmentState =
  | 'NEED_CONFIRMATION'
  | 'SCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED'

export type CommunicationMethod = 'VIDEOCALL' | 'CHAT' | 'PHONE'

export interface Appointment {
  id: string
  doctorId?: string
  doctorName?: string
  doctorSpeciality?: string
  doctorPhoto?: string
  facilityId?: string
  facilityName?: string
  date: string
  time: string
  state: AppointmentState
  status?: AppointmentStatus
  type?: 'clinic' | 'lab' | 'online'
  category?: DoctorCategory | 'LAB'
  assistanceId?: string
  reason?: string
  communicationMethod?: CommunicationMethod
  paymentData?: PaymentData
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
  date: string
  time: string
  doctorId: string
  state: AppointmentState
  assistanceId: string
  reason?: string
  paymentData: PaymentData
}

export interface CreateOnlineAppointmentRequest {
  date: string
  time: string
  doctorId: string
  state: AppointmentState
  assistanceId: string
  communicationMethod: CommunicationMethod
  paymentData: PaymentData
}

export interface CreateLabAppointmentRequest {
  date: string
  time: string
  duration?: number
  facilityId: string
  assistances: number[]
  urgentAssistances?: number[]
  state: AppointmentState
  paymentData: PaymentData
}

export interface EditAppointmentRequest {
  date?: string
  time?: string
  facilityId?: string
  paymentData?: PaymentData
  performMethods?: Array<{ assistanceId: number; code: string }>
}

export interface UserAppointmentsFilter {
  type?: 'ALL' | 'UPCOMING' | 'PAST'
  category?: string
  from?: string
  to?: string
  page?: number
  size?: number
}

export interface AssistancePromoFilter {
  page?: number
  size?: number
  dateFrom?: string
  dateTo?: string
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

// ─── Notification ─────────────────────────────────────────────────────────────

export interface SetNotificationTokenRequest {
  deviceId: string
  platform: 'ios' | 'android'
  app: string
  token: string
}

export interface UpdateVoipTokenRequest {
  deviceId: string
  platform: 'ios' | 'android'
  app: string
  voipToken: string
}

// ─── Diia ─────────────────────────────────────────────────────────────────────

export interface DiiaCreateDeeplinkRequest {
  documentType: string
  returnLink: string
}

// ─── Dobrodoc ─────────────────────────────────────────────────────────────────

export interface DobrodocAppointmentUserData {
  appointmentId: string
  // shape depends on backend response
  [key: string]: unknown
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
