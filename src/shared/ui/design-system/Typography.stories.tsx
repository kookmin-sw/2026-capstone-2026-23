import type { Meta, StoryObj } from '@storybook/react'

const typographyScale = [
  {
    className: 'typo-display',
    label: 'Display',
    spec: '36px / Bold / 1.2',
    usage: '랜딩, 히어로 섹션',
    sample: '문서를 더 스마트하게',
  },
  {
    className: 'typo-h1',
    label: 'Heading 1',
    spec: '24px / Bold / 1.3',
    usage: '페이지 제목',
    sample: '파일 목록',
  },
  {
    className: 'typo-h2',
    label: 'Heading 2',
    spec: '20px / SemiBold / 1.4',
    usage: '섹션 제목',
    sample: '최근 변환 내역',
  },
  {
    className: 'typo-h3',
    label: 'Heading 3',
    spec: '18px / SemiBold / 1.4',
    usage: '카드, 위젯 제목',
    sample: '처리 현황',
  },
  {
    className: 'typo-body1',
    label: 'Body 1',
    spec: '14px / Regular / 1.6',
    usage: '주요 본문 텍스트',
    sample:
      '업로드된 문서는 자동으로 텍스트를 추출하고 구조화된 형식으로 저장됩니다.',
  },
  {
    className: 'typo-body2',
    label: 'Body 2',
    spec: '13px / Regular / 1.5',
    usage: '보조 본문, 설명',
    sample: '지원 형식: HWP, HWPX, PDF, JPG, PNG',
  },
  {
    className: 'typo-label',
    label: 'Label',
    spec: '14px / Medium / 1.4',
    usage: '버튼, 폼 라벨, 인터랙티브 텍스트',
    sample: '파일 업로드',
  },
  {
    className: 'typo-caption',
    label: 'Caption',
    spec: '12px / Regular / 1.4',
    usage: '힌트, 타임스탬프, 부가 정보',
    sample: '2분 전 · 3페이지 · 1.2MB',
  },
  {
    className: 'typo-overline',
    label: 'Overline',
    spec: '11px / SemiBold / 1.4 / uppercase',
    usage: '소분류 태그, 카테고리',
    sample: 'document parser',
  },
  {
    className: 'typo-stat',
    label: 'Stat',
    spec: '24px / Bold / 1.2 / tabular-nums',
    usage: '대시보드 수치, 통계',
    sample: '1,284',
  },
  {
    className: 'typo-code',
    label: 'Code',
    spec: '13px / Regular / 1.5 / IBM Plex Mono',
    usage: '코드, 파일 경로, 기술 텍스트',
    sample: '/output/document_001.txt',
  },
]

function TypographyScale() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}
        >
          Typography Scale
        </h1>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '2rem',
          }}
        >
          Pretendard Variable 기반 타이포그래피 시스템. 클래스명 하나로 size,
          weight, line-height가 모두 적용됩니다.
        </p>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr
            style={{
              borderBottom: '2px solid #e5e7eb',
              textAlign: 'left',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#6b7280',
            }}
          >
            <th style={{ padding: '0.5rem 1rem' }}>클래스</th>
            <th style={{ padding: '0.5rem 1rem' }}>스펙</th>
            <th style={{ padding: '0.5rem 1rem' }}>용도</th>
            <th style={{ padding: '0.5rem 1rem', width: '40%' }}>미리보기</th>
          </tr>
        </thead>
        <tbody>
          {typographyScale.map((item) => (
            <tr
              key={item.className}
              style={{ borderBottom: '1px solid #f3f4f6' }}
            >
              <td style={{ padding: '0.75rem 1rem', verticalAlign: 'middle' }}>
                <code
                  style={{
                    fontSize: '0.75rem',
                    color: '#8b5cf6',
                    background: '#f3f4f6',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '3px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  .{item.className}
                </code>
              </td>
              <td
                style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  verticalAlign: 'middle',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.spec}
              </td>
              <td
                style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.75rem',
                  color: '#374151',
                  verticalAlign: 'middle',
                }}
              >
                {item.usage}
              </td>
              <td style={{ padding: '0.75rem 1rem', verticalAlign: 'middle' }}>
                <span className={item.className}>{item.sample}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const meta: Meta = {
  title: 'Design System/Typography',
  component: TypographyScale,
  parameters: {
    layout: 'padded',
  },
}

export default meta

type Story = StoryObj

export const Scale: Story = {}
