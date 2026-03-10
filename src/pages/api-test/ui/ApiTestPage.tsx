import { useState } from 'react'
import { getHealth, getDocuments, getSupportedFileTypes } from '@/shared/api'

interface ApiResult {
  endpoint: string
  status: 'idle' | 'loading' | 'success' | 'error'
  data?: unknown
  error?: string
}

export function ApiTestPage() {
  const [results, setResults] = useState<ApiResult[]>([])

  const updateResult = (endpoint: string, update: Partial<ApiResult>) => {
    setResults((prev) => {
      const exists = prev.find((r) => r.endpoint === endpoint)
      if (exists) {
        return prev.map((r) =>
          r.endpoint === endpoint ? { ...r, ...update } : r,
        )
      }
      return [...prev, { endpoint, status: 'idle', ...update } as ApiResult]
    })
  }

  const testHealth = async () => {
    updateResult('GET /health', {
      status: 'loading',
      data: undefined,
      error: undefined,
    })
    try {
      const res = await getHealth()
      updateResult('GET /health', { status: 'success', data: res.data })
    } catch (e) {
      updateResult('GET /health', { status: 'error', error: String(e) })
    }
  }

  const testDocuments = async () => {
    updateResult('GET /documents', {
      status: 'loading',
      data: undefined,
      error: undefined,
    })
    try {
      const res = await getDocuments()
      updateResult('GET /documents', { status: 'success', data: res.data })
    } catch (e) {
      updateResult('GET /documents', { status: 'error', error: String(e) })
    }
  }

  const testFileTypes = async () => {
    updateResult('GET /documents/types', {
      status: 'loading',
      data: undefined,
      error: undefined,
    })
    try {
      const res = await getSupportedFileTypes()
      updateResult('GET /documents/types', {
        status: 'success',
        data: res.data,
      })
    } catch (e) {
      updateResult('GET /documents/types', {
        status: 'error',
        error: String(e),
      })
    }
  }

  const testAll = async () => {
    await Promise.all([testHealth(), testDocuments(), testFileTypes()])
  }

  return (
    <div
      style={{
        maxWidth: 800,
        margin: '40px auto',
        fontFamily: 'monospace',
        padding: '0 20px',
      }}
    >
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>API Test Page</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Base URL: <code>/api/v1</code>
      </p>

      <div
        style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}
      >
        <button onClick={testHealth} style={btnStyle}>
          GET /health
        </button>
        <button onClick={testDocuments} style={btnStyle}>
          GET /documents
        </button>
        <button onClick={testFileTypes} style={btnStyle}>
          GET /documents/types
        </button>
        <button
          onClick={testAll}
          style={{ ...btnStyle, background: '#2563eb', color: '#fff' }}
        >
          Test All
        </button>
      </div>

      {results.map((r) => (
        <div key={r.endpoint} style={cardStyle}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <strong>{r.endpoint}</strong>
            <span style={{ color: statusColor(r.status) }}>
              {r.status.toUpperCase()}
            </span>
          </div>
          {r.data !== undefined && (
            <pre style={preStyle}>{JSON.stringify(r.data, null, 2)}</pre>
          )}
          {r.error && (
            <pre style={{ ...preStyle, color: '#dc2626' }}>{r.error}</pre>
          )}
        </div>
      ))}
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  padding: '8px 16px',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  background: '#f9fafb',
  cursor: 'pointer',
  fontSize: 14,
}

const cardStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: 16,
  marginBottom: 12,
}

const preStyle: React.CSSProperties = {
  background: '#f3f4f6',
  padding: 12,
  borderRadius: 6,
  overflow: 'auto',
  fontSize: 13,
  margin: 0,
}

const statusColor = (s: string) =>
  s === 'success'
    ? '#16a34a'
    : s === 'error'
      ? '#dc2626'
      : s === 'loading'
        ? '#ca8a04'
        : '#9ca3af'
