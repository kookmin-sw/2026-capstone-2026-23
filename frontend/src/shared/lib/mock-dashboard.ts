import type { DashboardSummary, DocumentItem } from '@/shared/types'

export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
  totalJobs: 847,
  completedJobs: 782,
  processingJobs: 12,
  failedJobs: 53,
}

const now = new Date()
const daysAgo = (d: number) => {
  const date = new Date(now)
  date.setDate(date.getDate() - d)
  return date.toISOString()
}

export const MOCK_RECENT_ITEMS: DocumentItem[] = [
  {
    documentId: 'mock-1',
    title: '2025년_사업계획서.hwp',
    originalFilename: '2025년_사업계획서.hwp',
    fileType: 'hwp',
    uploadedAt: daysAgo(0),
    latestStatus: 'COMPLETED',
    jobId: 'job-1',
    processingTimeMs: 12400,
    modelCode: 'gpt-5-mini',
    outputPath: '/output/mock-1.txt',
    error: null,
  },
  {
    documentId: 'mock-2',
    title: '회의록_03월.pdf',
    originalFilename: '회의록_03월.pdf',
    fileType: 'pdf',
    uploadedAt: daysAgo(0),
    latestStatus: 'PROCESSING',
    jobId: 'job-2',
    processingTimeMs: null,
    modelCode: 'gpt-5-mini',
    outputPath: '',
    error: null,
  },
  {
    documentId: 'mock-3',
    title: '연구보고서_최종.hwpx',
    originalFilename: '연구보고서_최종.hwpx',
    fileType: 'hwpx',
    uploadedAt: daysAgo(1),
    latestStatus: 'COMPLETED',
    jobId: 'job-3',
    processingTimeMs: 8900,
    modelCode: 'deepseek-ocr-2',
    outputPath: '/output/mock-3.txt',
    error: null,
  },
  {
    documentId: 'mock-4',
    title: '스캔_영수증.png',
    originalFilename: '스캔_영수증.png',
    fileType: 'png',
    uploadedAt: daysAgo(2),
    latestStatus: 'FAILED',
    jobId: 'job-4',
    processingTimeMs: 3200,
    modelCode: 'gpt-5-mini',
    outputPath: '',
    error: { code: 'OCR_FAILED', message: '이미지 품질이 너무 낮습니다' },
  },
  {
    documentId: 'mock-5',
    title: '계약서_을지로.pdf',
    originalFilename: '계약서_을지로.pdf',
    fileType: 'pdf',
    uploadedAt: daysAgo(3),
    latestStatus: 'COMPLETED',
    jobId: 'job-5',
    processingTimeMs: 15600,
    modelCode: 'gpt-5-mini',
    outputPath: '/output/mock-5.txt',
    error: null,
  },
]

// TrendChart용 — 최근 7일 문서 목록 (uploadedAt 기반 집계용)
export const MOCK_DOCUMENTS_FOR_TREND: { items: DocumentItem[] } = {
  items: [
    ...MOCK_RECENT_ITEMS,
    // 날짜별로 분산된 추가 문서들
    ...[0, 0, 0, 1, 1, 2, 2, 2, 3, 4, 4, 5, 5, 5, 5, 6, 6].map((d, i) => ({
      documentId: `mock-trend-${i}`,
      title: `문서_${i}.pdf`,
      originalFilename: `문서_${i}.pdf`,
      fileType: 'pdf',
      uploadedAt: daysAgo(d),
      latestStatus: 'COMPLETED' as const,
      jobId: `job-trend-${i}`,
      processingTimeMs: 5000 + Math.random() * 10000,
      modelCode: 'gpt-5-mini',
      outputPath: `/output/mock-trend-${i}.txt`,
      error: null,
    })),
  ],
}
