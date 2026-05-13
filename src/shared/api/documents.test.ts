import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./client', () => ({
  api: {
    get: vi.fn(),
  },
}))

import { api } from './client'
import { downloadDocument } from './documents'

describe('documents api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('downloads document originals from the document endpoint', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: new Blob() } as never)

    await downloadDocument('d_1234567890')

    expect(api.get).toHaveBeenCalledWith('/documents/d_1234567890/download', {
      responseType: 'blob',
    })
  })
})
