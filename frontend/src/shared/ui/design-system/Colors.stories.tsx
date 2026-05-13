import type { Meta, StoryObj } from '@storybook/react'

const colorGroups = [
  {
    name: 'Pink',
    colors: [
      { label: 'Pink 80', className: 'luminir-pink-80', hex: '#C41AFF' },
      { label: 'Pink 50', className: 'luminir-pink-50', hex: '#E0A6FF' },
      { label: 'Pink 20', className: 'luminir-pink-20', hex: '#F4DEFF' },
    ],
  },
  {
    name: 'Blue',
    colors: [
      { label: 'Blue 50', className: 'luminir-blue-50', hex: '#149DE6' },
      { label: 'Blue 30', className: 'luminir-blue-30', hex: '#5EBDF0' },
      { label: 'Blue 10', className: 'luminir-blue-10', hex: '#DBF2FF' },
    ],
  },
  {
    name: 'Green',
    colors: [
      { label: 'Green 60', className: 'luminir-green-60', hex: '#00AD85' },
      { label: 'Green 40', className: 'luminir-green-40', hex: '#5DE1C2' },
      { label: 'Green 10', className: 'luminir-green-10', hex: '#D9FBF3' },
    ],
  },
  {
    name: 'Purple',
    colors: [
      { label: 'Purple 50', className: 'luminir-purple-50', hex: '#9D80F7' },
      { label: 'Purple 20', className: 'luminir-purple-20', hex: '#D5D1FF' },
    ],
  },
  {
    name: 'Yellow',
    colors: [
      { label: 'Yellow 60', className: 'luminir-yellow-60', hex: '#CAAF00' },
      { label: 'Yellow 50', className: 'luminir-yellow-50', hex: '#FFD900' },
      { label: 'Yellow 10', className: 'luminir-yellow-10', hex: '#FFF9D1' },
    ],
  },
]

function ColorPalette() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}
        >
          Luminir Color Palette
        </h1>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '2rem',
          }}
        >
          각 색상 클래스는 배경색과 글자색이 자동 매칭됩니다. 클래스명 하나로
          적용 가능합니다.
        </p>
      </div>

      {colorGroups.map((group) => (
        <div key={group.name}>
          <h2
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
              color: '#374151',
            }}
          >
            {group.name}
          </h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {group.colors.map((color) => (
              <div
                key={color.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '160px',
                }}
              >
                <div
                  className={color.className}
                  style={{
                    height: '80px',
                    borderRadius: '8px 8px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  Aa
                </div>
                <div
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #e5e7eb',
                    borderTop: 'none',
                    borderRadius: '0 0 8px 8px',
                  }}
                >
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    {color.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {color.hex}
                  </div>
                  <code
                    style={{
                      fontSize: '0.6875rem',
                      color: '#8b5cf6',
                      background: '#f3f4f6',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '3px',
                    }}
                  >
                    .{color.className}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const meta: Meta = {
  title: 'Design System/Colors',
  component: ColorPalette,
  parameters: {
    layout: 'padded',
  },
}

export default meta

type Story = StoryObj

export const Palette: Story = {}
