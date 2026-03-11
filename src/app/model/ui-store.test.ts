import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from './ui-store'

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({ showStorageAlert: false, isChatOpen: false })
  })

  it('초기 상태는 모두 false다', () => {
    const state = useUIStore.getState()
    expect(state.showStorageAlert).toBe(false)
    expect(state.isChatOpen).toBe(false)
  })

  it('스토리지 알림을 토글할 수 있다', () => {
    useUIStore.getState().setShowStorageAlert(true)
    expect(useUIStore.getState().showStorageAlert).toBe(true)

    useUIStore.getState().setShowStorageAlert(false)
    expect(useUIStore.getState().showStorageAlert).toBe(false)
  })

  it('채팅 열림 상태를 토글할 수 있다', () => {
    useUIStore.getState().setIsChatOpen(true)
    expect(useUIStore.getState().isChatOpen).toBe(true)

    useUIStore.getState().setIsChatOpen(false)
    expect(useUIStore.getState().isChatOpen).toBe(false)
  })
})
