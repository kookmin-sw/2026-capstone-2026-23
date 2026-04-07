import { api } from './client'

import type {
  AuthUser,
  BootstrapLoginResponse,
  BootstrapStatus,
  LoginResponse,
} from '@/shared/types'

// GET /auth/bootstrap/status
export const getBootstrapStatus = () =>
  api.get<BootstrapStatus>('/auth/bootstrap/status')

// POST /auth/login
export const login = (loginId: string, password: string) =>
  api.post<LoginResponse | BootstrapLoginResponse>('/auth/login', {
    loginId,
    password,
  })

// POST /auth/bootstrap/superuser
export const createSuperuser = (
  bootstrapToken: string,
  name: string,
  loginId: string,
  password: string,
) =>
  api.post<LoginResponse>('/auth/bootstrap/superuser', {
    bootstrapToken,
    name,
    loginId,
    password,
  })

// GET /auth/me
export const getMe = () => api.get<{ user: AuthUser }>('/auth/me')

// POST /auth/password/change
export const changePassword = (currentPassword: string, newPassword: string) =>
  api.post<{ user: AuthUser }>('/auth/password/change', {
    currentPassword,
    newPassword,
  })

// POST /auth/users
export const createUser = (
  name: string,
  loginId: string,
  temporaryPassword: string,
  role: 'ADMIN' | 'USER' = 'USER',
) =>
  api.post<{ user: AuthUser }>('/auth/users', {
    name,
    loginId,
    temporaryPassword,
    role,
  })
