async function readAllDirectoryEntries(
  dirReader: FileSystemDirectoryReader,
): Promise<FileSystemEntry[]> {
  const entries: FileSystemEntry[] = []

  while (true) {
    const batch = await new Promise<FileSystemEntry[]>((resolve, reject) => {
      dirReader.readEntries(resolve, reject)
    })

    if (batch.length === 0) {
      return entries
    }

    entries.push(...batch)
  }
}

async function collectEntryFiles(entry: FileSystemEntry): Promise<File[]> {
  if (entry.isFile) {
    return new Promise((resolve, reject) => {
      ;(entry as FileSystemFileEntry).file((file) => resolve([file]), reject)
    })
  }

  if (entry.isDirectory) {
    const dirReader = (entry as FileSystemDirectoryEntry).createReader()
    const entries = await readAllDirectoryEntries(dirReader)
    const nestedFiles = await Promise.all(entries.map(collectEntryFiles))
    return nestedFiles.flat()
  }

  return []
}

export async function collectDroppedFiles(
  dataTransfer: DataTransfer,
): Promise<File[]> {
  const items = Array.from(dataTransfer.items ?? [])
  const directFiles = Array.from(dataTransfer.files ?? [])
  const entries: FileSystemEntry[] = []
  const files: File[] = []

  for (const item of items) {
    const entry = item.webkitGetAsEntry?.()

    if (entry) {
      entries.push(entry)
    } else if (item.kind === 'file') {
      const file = item.getAsFile()
      if (file) files.push(file)
    }
  }

  if (entries.length > 0) {
    const entryFiles = await Promise.all(entries.map(collectEntryFiles))
    files.push(...entryFiles.flat())
  }

  if (files.length > 0) {
    return files
  }

  return directFiles
}
