import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Token helpers (browser-only) ────────────────────────────────────────────

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('glid_access_token')
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('glid_refresh_token')
}

function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('glid_access_token', accessToken)
  localStorage.setItem('glid_refresh_token', refreshToken)
}

function clearTokens() {
  localStorage.removeItem('glid_access_token')
  localStorage.removeItem('glid_refresh_token')
  localStorage.removeItem('glid_user')
}

// ─── Request interceptor — attach X-Access-Token header ──────────────────────

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token) {
    config.headers['X-Access-Token'] = token
  }
  return config
})

// ─── Response interceptor — 401 → refresh → retry ────────────────────────────

let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push((token: string) => {
          originalRequest.headers['X-Access-Token'] = token
          resolve(apiClient(originalRequest))
        })
      })
    }

    isRefreshing = true

    try {
      const refreshToken = getRefreshToken()
      if (!refreshToken) throw new Error('No refresh token')

      const { data } = await axios.post(`${BASE_URL}/user/refresh-token`, {
        token: refreshToken,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Token': getAccessToken() ?? '',
        },
      })

      const newAccessToken: string = data.accessToken
      const newRefreshToken: string = data.refreshToken ?? refreshToken

      saveTokens(newAccessToken, newRefreshToken)

      refreshQueue.forEach((cb) => cb(newAccessToken))
      refreshQueue = []

      originalRequest.headers['X-Access-Token'] = newAccessToken
      return apiClient(originalRequest)
    } catch {
      clearTokens()
      refreshQueue = []
      if (typeof window !== 'undefined') {
        const isCabinet = window.location.pathname.startsWith('/cabinet')
        if (isCabinet) {
          window.location.href = '/auth/login'
        }
      }
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  }
)

export { getAccessToken, getRefreshToken, saveTokens, clearTokens }
