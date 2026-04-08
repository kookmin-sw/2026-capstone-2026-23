import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getBootstrapStatus,
  login,
  createSuperuser,
  getMe,
  changePassword,
  createUser,
} from '@/shared/api'
import { useSessionStore } from '../model/store'

import type {
  BootstrapLoginResponse,
  LoginResponse,
  UserRole,
} from '@/shared/types'

export function useBootstrapStatus() {
  return useQuery({
    queryKey: ['auth', 'bootstrap-status'],
    queryFn: async () => {
      const { data } = await getBootstrapStatus()
      return data
    },
  })
}

export function useCurrentUser() {
  const token = useSessionStore((s) => s.token)
  const setUser = useSessionStore((s) => s.setUser)

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await getMe()
      setUser(data.user)
      return data.user
    },
    enabled: !!token,
    retry: false,
  })
}

export function useLogin() {
  const setSession = useSessionStore((s) => s.setSession)

  return useMutation({
    mutationFn: async ({
      loginId,
      password,
    }: {
      loginId: string
      password: string
    }) => {
      const { data } = await login(loginId, password)
      return data
    },
    onSuccess: (data) => {
      if ('accessToken' in data) {
        const res = data as LoginResponse
        setSession(res.accessToken, res.user)
      }
    },
  })
}

export function useCreateSuperuser() {
  const setSession = useSessionStore((s) => s.setSession)

  return useMutation({
    mutationFn: async (params: {
      bootstrapToken: string
      name: string
      loginId: string
      password: string
    }) => {
      const { data } = await createSuperuser(
        params.bootstrapToken,
        params.name,
        params.loginId,
        params.password,
      )
      return data
    },
    onSuccess: (data) => {
      setSession(data.accessToken, data.user)
    },
  })
}

export function useChangePassword() {
  const setUser = useSessionStore((s) => s.setUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: {
      currentPassword: string
      newPassword: string
    }) => {
      const { data } = await changePassword(
        params.currentPassword,
        params.newPassword,
      )
      return data
    },
    onSuccess: (data) => {
      setUser(data.user)
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
  })
}

export function useCreateUser() {
  return useMutation({
    mutationFn: async (params: {
      name: string
      loginId: string
      temporaryPassword: string
      role: Exclude<UserRole, 'SUPERUSER'>
    }) => {
      const { data } = await createUser(
        params.name,
        params.loginId,
        params.temporaryPassword,
        params.role,
      )
      return data
    },
  })
}

function isBootstrapResponse(
  data: LoginResponse | BootstrapLoginResponse,
): data is BootstrapLoginResponse {
  return 'bootstrapRequired' in data && data.bootstrapRequired === true
}

export { isBootstrapResponse }
