import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const cssContent = readFileSync(resolve(__dirname, './index.css'), 'utf-8')

describe('테마 색상 설정', () => {
  describe('라이트 테마', () => {
    it('primary 색상이 #ff7121 (오렌지)이다', () => {
      expect(cssContent).toContain('--primary: #ff7121')
    })

    it('이전 보라색(#6c5ce7)이 primary에 사용되지 않는다', () => {
      expect(cssContent).not.toMatch(/--primary:\s*#6c5ce7/)
    })

    it('ring 색상이 primary와 동일하다', () => {
      expect(cssContent).toContain('--ring: #ff7121')
    })

    it('chart-1이 primary와 동일하다', () => {
      expect(cssContent).toContain('--chart-1: #ff7121')
    })

    it('secondary가 오렌지 톤이다', () => {
      expect(cssContent).toContain('--secondary: #fff4ed')
    })
  })

  describe('다크 테마', () => {
    it('primary가 밝은 오렌지(#ff8c4c)이다', () => {
      expect(cssContent).toContain('--primary: #ff8c4c')
    })

    it('이전 보라색(#a29bfe)이 primary에 사용되지 않는다', () => {
      expect(cssContent).not.toMatch(/--primary:\s*#a29bfe/)
    })
  })

  describe('커스텀 폼 컨트롤', () => {
    it('radio/checkbox 커스텀 스타일이 정의되어 있다', () => {
      expect(cssContent).toContain("input[type='radio']")
      expect(cssContent).toContain("input[type='checkbox']")
    })

    it('appearance: none으로 기본 스타일이 제거된다', () => {
      expect(cssContent).toContain('appearance: none')
    })

    it('checked 상태에서 primary 색상을 사용한다', () => {
      expect(cssContent).toContain('border-color: var(--primary)')
      expect(cssContent).toContain('background-color: var(--primary)')
    })
  })
})
