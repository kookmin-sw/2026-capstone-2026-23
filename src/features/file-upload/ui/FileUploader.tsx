import { useRef, useState } from 'react'
import { Upload, FolderOpen } from 'lucide-react'
import { collectDroppedFiles } from '../lib/drop-files'

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

    const processFiles = async () => {
      const files = await collectDroppedFiles(e.dataTransfer)
      if (files.length > 0) {
        onFilesAdded(files)
      }
    }

    void processFiles()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesAdded(Array.from(e.target.files))
    }
  }

  return (
    <div
      className={`rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-all duration-200 ${
        isDragging
          ? 'border-primary bg-primary/5 scale-[1.01]'
          : 'border-border'
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
    >
      <div
        className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 ${
          isDragging
            ? 'bg-primary/15 text-primary scale-110'
            : 'bg-muted/80 text-muted-foreground'
        }`}
      >
        <Upload className="h-5 w-5" strokeWidth={2} />
      </div>

      <p className="text-foreground text-sm font-medium">
        {isDragging ? '여기에 놓으세요' : '파일을 드래그하여 업로드'}
      </p>
      <p className="text-muted-foreground mt-1 mb-4 text-xs">
        HWP, HWPX, PDF, Excel, CSV, PNG, JPG, BMP, TIFF
      </p>

      {/* Two action buttons side by side */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="border-border hover:border-primary/40 hover:text-primary text-foreground flex flex-1 items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2.5 text-sm font-medium transition-colors dark:bg-transparent"
        >
          <Upload className="h-4 w-4" />
          파일 선택
        </button>
        <button
          type="button"
          onClick={() => folderInputRef.current?.click()}
          className="border-border hover:border-primary/40 hover:text-primary text-foreground flex flex-1 items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2.5 text-sm font-medium transition-colors dark:bg-transparent"
        >
          <FolderOpen className="h-4 w-4" />
          폴더 선택
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".hwp,.hwpx,.pdf,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.bmp,.tiff"
        className="hidden"
        onChange={handleFileSelect}
      />
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
