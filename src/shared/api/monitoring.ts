import { api } from './client'

import type { SystemMonitoring } from '@/shared/types'

// 실시간 시스템 모니터링 (GET /monitoring/system)
export const getSystemMonitoring = () =>
  api.get<SystemMonitoring>('/monitoring/system')
