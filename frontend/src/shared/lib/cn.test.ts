import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('단일 클래스를 반환한다', () => {
    expect(cn('text-sm')).toBe('text-sm')
  })

  it('여러 클래스를 합친다', () => {
    expect(cn('text-sm', 'font-bold')).toBe('text-sm font-bold')
  })

  it('falsy 값은 무시한다', () => {
    expect(cn('text-sm', false, null, undefined, 'font-bold')).toBe(
      'text-sm font-bold',
    )
  })

  it('조건부 클래스를 지원한다', () => {
    const isActive = true
    const isDisabled = false
    expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe(
      'base active',
    )
  })

  it('Tailwind 클래스 충돌 시 후순위가 이긴다', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })

  it('충돌하지 않는 Tailwind 클래스는 모두 유지된다', () => {
    const result = cn('bg-red-500', 'text-white', 'p-4')
    expect(result).toContain('bg-red-500')
    expect(result).toContain('text-white')
    expect(result).toContain('p-4')
  })

  it('빈 입력은 빈 문자열을 반환한다', () => {
    expect(cn()).toBe('')
  })
})
