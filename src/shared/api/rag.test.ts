import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

import { api } from './client'
import { createRagSession, sendRagMessage } from './rag'

describe('rag api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a session with document ids and output paths', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: {} } as never)

    await createRagSession({
      title: 'Chat: sample.txt',
      documentIds: ['d_1'],
      documentPaths: ['/app/data/outputs/sample.txt'],
    })

    expect(api.post).toHaveBeenCalledWith('/rag/sessions', {
      title: 'Chat: sample.txt',
      documentIds: ['d_1'],
      documentPaths: ['/app/data/outputs/sample.txt'],
    })
  })

  it('sends a message with topK', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: {} } as never)

    await sendRagMessage('s_1', 'summarize', 5)

    expect(api.post).toHaveBeenCalledWith(
      '/rag/sessions/s_1/messages',
      {
        content: 'summarize',
        topK: 5,
      },
      {
        timeout: 180000,
      },
    )
  })
})
