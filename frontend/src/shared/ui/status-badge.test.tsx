import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StatusBadge } from './status-badge'

describe('StatusBadge', () => {
  it('renders processing progress percent', () => {
    render(
      <StatusBadge
        status="PROCESSING"
        progressPercent={42}
        currentPage={2}
        totalPages={5}
      />,
    )

    expect(screen.getByText('변환 중 42% (2/5p)')).toBeInTheDocument()
  })
})
