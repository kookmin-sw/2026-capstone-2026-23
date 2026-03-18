import { useRef, useState } from 'react'
import { Upload, Folder } from 'lucide-react'
import { Button } from '@/shared/ui/button'

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void
}

export function FileUploader({ onFilesAdded }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const items = Array.from(e.dataTransfer.items)
    const files: File[] = []

    const processEntry = async (entry: FileSystemEntry): Promise<void> => {
      return new Promise((resolve) => {
        if (entry.isFile) {
          ;(entry as FileSystemFileEntry).file((file: File) => {
            files.push(file)
            resolve()
          })
        } else if (entry.isDirectory) {
          const dirReader = (entry as FileSystemDirectoryEntry).createReader()
          dirReader.readEntries(async (entries) => {
            for (const childEntry of entries) {
              await processEntry(childEntry)
            }
            resolve()
          })
        } else {
          resolve()
        }
      })
    }

    const processItems = async () => {
      for (const item of items) {
        const entry = item.webkitGetAsEntry?.()
        if (entry) {
          await processEntry(entry)
        } else if (item.kind === 'file') {
          const file = item.getAsFile()
          if (file) files.push(file)
        }
      }
      if (files.length > 0) {
        onFilesAdded(files)
      }
    }

    processItems()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesAdded(Array.from(e.target.files))
    }
  }

  return (
    <div>
      <label className="text-foreground mb-2 block text-sm font-medium">
        문서 파일
      </label>

      <div
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          isDragging
            ? 'border-primary bg-accent scale-[1.02]'
            : 'border-border hover:border-primary/60 hover:bg-accent/50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsDragging(false)
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${isDragging ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}
        >
          <Upload className="h-6 w-6" />
        </div>
        <p className="text-foreground mb-1 text-sm font-medium">
          {isDragging
            ? '파일을 여기에 놓으세요'
            : '클릭하거나 파일을 드래그하여 업로드'}
        </p>
        <p className="text-muted-foreground text-xs">
          HWP, HWPX, PDF, PNG, JPG, BMP, TIFF
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".hwp,.hwpx,.pdf,.png,.jpg,.jpeg,.bmp,.tiff"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      <Button
        variant="outline"
        className="mt-3 w-full"
        onClick={(e) => {
          e.stopPropagation()
          folderInputRef.current?.click()
        }}
      >
        <Folder className="mr-2 h-4 w-4" />
        폴더 전체 업로드
      </Button>
      <input
        ref={folderInputRef}
        type="file"
        // @ts-expect-error webkitdirectory is valid but not in TS types
        webkitdirectory=""
        directory=""
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  )
}
