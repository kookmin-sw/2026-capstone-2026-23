import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from '@/shared/ui/badge'

const meta: Meta<typeof Badge> = {
  title: 'Design System/Badge',
  component: Badge,
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'destructive',
        'outline',
        'ghost',
        'link',
        'pink',
        'pink-bold',
        'blue',
        'blue-bold',
        'green',
        'green-bold',
        'purple',
        'purple-bold',
        'yellow',
        'yellow-bold',
      ],
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Playground: Story = {
  args: {
    children: '뱃지',
    variant: 'default',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          Base Variants
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>

      <div>
        <h3
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          Luminir Light (배경: 연한색 / 글자: 진한색)
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <Badge variant="pink">Pink</Badge>
          <Badge variant="blue">Blue</Badge>
          <Badge variant="green">Green</Badge>
          <Badge variant="purple">Purple</Badge>
          <Badge variant="yellow">Yellow</Badge>
        </div>
      </div>

      <div>
        <h3
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          Luminir Bold (배경: 진한색 / 글자: 흰색)
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <Badge variant="pink-bold">Pink</Badge>
          <Badge variant="blue-bold">Blue</Badge>
          <Badge variant="green-bold">Green</Badge>
          <Badge variant="purple-bold">Purple</Badge>
          <Badge variant="yellow-bold">Yellow</Badge>
        </div>
      </div>

      <div>
        <h3
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          Usage Examples
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <Badge variant="green">완료</Badge>
          <Badge variant="blue">처리중</Badge>
          <Badge variant="yellow">대기</Badge>
          <Badge variant="pink">오류</Badge>
          <Badge variant="purple">검토</Badge>
        </div>
      </div>
    </div>
  ),
}
