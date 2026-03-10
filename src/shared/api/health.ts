import { api } from './client'

export interface HealthResponse {
  status: string
}

export const getHealth = () => api.get<HealthResponse>('/health')
