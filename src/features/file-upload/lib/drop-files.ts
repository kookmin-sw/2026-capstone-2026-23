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
  const files: File[] = []
  const items = Array.from(dataTransfer.items ?? [])

  for (const item of items) {
    const entry = item.webkitGetAsEntry?.()

    if (entry) {
      files.push(...(await collectEntryFiles(entry)))
    } else if (item.kind === 'file') {
      const file = item.getAsFile()
      if (file) files.push(file)
    }
  }

  if (files.length > 0) {
    return files
  }

  return Array.from(dataTransfer.files ?? [])
}
