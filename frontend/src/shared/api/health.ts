import { api } from './client'

export const getHealth = () => api.get<{ status: string }>('/health')
