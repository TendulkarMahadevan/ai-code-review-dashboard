export interface UploadedFile {
  id: string
  name: string
  content: string
  timestamp: Date
}

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

export const generateFileId = (fileName: string): string => {
  return `uploaded-${Date.now()}-${fileName.replace(/[^a-zA-Z0-9]/g, '-')}`
}

export const detectLanguage = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    go: 'go',
    rb: 'ruby',
    php: 'php',
    swift: 'swift',
    kt: 'kotlin',
    rs: 'rust',
  }
  return languageMap[ext || ''] || 'plaintext'
}
