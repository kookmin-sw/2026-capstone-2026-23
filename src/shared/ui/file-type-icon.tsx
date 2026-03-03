import { FileText, Image } from 'lucide-react'

interface FileTypeIconProps {
  fileName: string
  className?: string
}

export function FileTypeIcon({
  fileName,
  className = 'h-8 w-8',
}: FileTypeIconProps) {
  const ext = fileName.split('.').pop()?.toLowerCase()

  switch (ext) {
    case 'pdf':
      return (
        <div
          className={`${className} flex items-center justify-center bg-[#fff1f1] text-[#da1e28]`}
        >
          <FileText className="h-5 w-5" />
        </div>
      )
    case 'hwp':
    case 'hwpx':
      return (
        <div
          className={`${className} flex items-center justify-center bg-[#edf5ff] text-[#0f62fe]`}
        >
          <FileText className="h-5 w-5" />
        </div>
      )
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'tiff':
    case 'bmp':
    case 'webp':
      return (
        <div
          className={`${className} flex items-center justify-center bg-[#e8daff] text-[#6929c4]`}
        >
          <Image className="h-5 w-5" />
        </div>
      )
    default:
      return (
        <div
          className={`${className} flex items-center justify-center bg-muted text-muted-foreground`}
        >
          <FileText className="h-5 w-5" />
        </div>
      )
  }
}

interface FileTypeBadgeProps {
  fileName: string
}

export function FileTypeBadge({ fileName }: FileTypeBadgeProps) {
  const ext = fileName.split('.').pop()?.toUpperCase()

  const getColor = () => {
    const lowerExt = ext?.toLowerCase()
    switch (lowerExt) {
      case 'pdf':
        return 'bg-[#fff1f1] text-[#da1e28] border-[#fa4d56]'
      case 'hwp':
      case 'hwpx':
        return 'bg-[#edf5ff] text-[#0f62fe] border-[#78a9ff]'
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'tiff':
      case 'bmp':
      case 'webp':
        return 'bg-[#e8daff] text-[#6929c4] border-[#a56eff]'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  return (
    <span
      className={`inline-block w-14 text-center py-0.5 whitespace-nowrap text-xs font-medium border ${getColor()}`}
    >
      {ext}
    </span>
  )
}
