import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./client', () => ({
  api: {
    get: vi.fn(),
    put: vi.fn(),
  },
}))

import { api } from './client'
import { getStorageSettings, updateStorageSettings } from './settings'

describe('settings api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches admin storage usage settings', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: {} } as never)

    await getStorageSettings()

    expect(api.get).toHaveBeenCalledWith('/admin/storage')
  })

  it('updates admin storage path', async () => {
    vi.mocked(api.put).mockResolvedValue({ data: {} } as never)

    await updateStorageSettings('/var/luminir/data')

    expect(api.put).toHaveBeenCalledWith('/admin/storage', {
      storagePath: '/var/luminir/data',
    })
  })
})
