import { describe, it, expect, beforeEach } from 'vitest'
import { useUploadStore } from './store'

function resetStore() {
  useUploadStore.setState({
    files: [],
    modelId: 'm1',
    parallelCount: 1,
    isConverting: false,
    batchStatus: '',
    selectedResultPath: '',
    isPreferredModel: false,
    overwriteMode: 'OVERWRITE',
    jobId: null,
  })
}

function createMockFile(name: string): File {
  return new File(['content'], name, { type: 'application/pdf' })
}

describe('useUploadStore', () => {
  beforeEach(() => {
    resetStore()
  })

  describe('addFiles', () => {
    it('파일을 추가하면 pending 상태와 progress 0으로 생성된다', () => {
      const { addFiles } = useUploadStore.getState()
      addFiles([createMockFile('test.pdf')])

      const { files } = useUploadStore.getState()
      expect(files).toHaveLength(1)
      expect(files[0].status).toBe('pending')
      expect(files[0].progress).toBe(0)
      expect(files[0].file.name).toBe('test.pdf')
    })

    it('여러 파일을 한 번에 추가할 수 있다', () => {
      const { addFiles } = useUploadStore.getState()
      addFiles([createMockFile('a.pdf'), createMockFile('b.hwp')])

      expect(useUploadStore.getState().files).toHaveLength(2)
    })

    it('기존 파일에 추가하면 누적된다', () => {
      const { addFiles } = useUploadStore.getState()
      addFiles([createMockFile('a.pdf')])
      addFiles([createMockFile('b.pdf')])

      expect(useUploadStore.getState().files).toHaveLength(2)
    })

    it('각 파일에 고유 id가 부여된다', () => {
      const { addFiles } = useUploadStore.getState()
      addFiles([createMockFile('a.pdf'), createMockFile('b.pdf')])

      const { files } = useUploadStore.getState()
      expect(files[0].id).not.toBe(files[1].id)
    })
  })

  describe('removeFile', () => {
    it('id로 파일을 제거할 수 있다', () => {
      const { addFiles } = useUploadStore.getState()
      addFiles([createMockFile('a.pdf'), createMockFile('b.pdf')])

      const fileId = useUploadStore.getState().files[0].id
      useUploadStore.getState().removeFile(fileId)

      const { files } = useUploadStore.getState()
      expect(files).toHaveLength(1)
      expect(files[0].file.name).toBe('b.pdf')
    })

    it('존재하지 않는 id로 제거해도 에러가 나지 않는다', () => {
      const { addFiles } = useUploadStore.getState()
      addFiles([createMockFile('a.pdf')])

      useUploadStore.getState().removeFile('nonexistent')
      expect(useUploadStore.getState().files).toHaveLength(1)
    })
  })

  describe('updateFile', () => {
    it('파일 상태를 업데이트할 수 있다', () => {
      const { addFiles } = useUploadStore.getState()
      addFiles([createMockFile('test.pdf')])

      const fileId = useUploadStore.getState().files[0].id
      useUploadStore.getState().updateFile(fileId, {
        status: 'converting',
        progress: 50,
        currentPage: 3,
        totalPages: 10,
      })

      const updated = useUploadStore.getState().files[0]
      expect(updated.status).toBe('converting')
      expect(updated.progress).toBe(50)
      expect(updated.currentPage).toBe(3)
      expect(updated.totalPages).toBe(10)
    })

    it('다른 파일은 영향받지 않는다', () => {
      const { addFiles } = useUploadStore.getState()
      addFiles([createMockFile('a.pdf'), createMockFile('b.pdf')])

      const fileId = useUploadStore.getState().files[0].id
      useUploadStore.getState().updateFile(fileId, { status: 'completed' })

      expect(useUploadStore.getState().files[1].status).toBe('pending')
    })
  })

  describe('설정 변경', () => {
    it('모델 ID를 변경할 수 있다', () => {
      useUploadStore.getState().setModelId('m2')
      expect(useUploadStore.getState().modelId).toBe('m2')
    })

    it('병렬 처리 수를 변경할 수 있다', () => {
      useUploadStore.getState().setParallelCount(4)
      expect(useUploadStore.getState().parallelCount).toBe(4)
    })

    it('덮어쓰기 모드를 변경할 수 있다', () => {
      useUploadStore.getState().setOverwriteMode('KEEP_BOTH')
      expect(useUploadStore.getState().overwriteMode).toBe('KEEP_BOTH')
    })
  })

  describe('reset', () => {
    it('파일, 변환 상태, 배치 상태, 선택 경로가 초기화된다', () => {
      const store = useUploadStore.getState()
      store.addFiles([createMockFile('test.pdf')])
      store.setIsConverting(true)
      store.setBatchStatus('processing')
      store.setSelectedResultPath('/output/test')

      useUploadStore.getState().reset()

      const state = useUploadStore.getState()
      expect(state.files).toHaveLength(0)
      expect(state.isConverting).toBe(false)
      expect(state.batchStatus).toBe('')
      expect(state.selectedResultPath).toBe('')
    })

    it('모델 ID와 병렬 처리 수는 reset으로 초기화되지 않는다', () => {
      useUploadStore.getState().setModelId('m2')
      useUploadStore.getState().setParallelCount(4)

      useUploadStore.getState().reset()

      const state = useUploadStore.getState()
      expect(state.modelId).toBe('m2')
      expect(state.parallelCount).toBe(4)
    })
  })
})
