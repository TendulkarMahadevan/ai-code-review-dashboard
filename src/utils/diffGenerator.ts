import { DiffLine, DiffHunk, FileDiff } from '../types'

interface DiffResult {
  additions: number
  deletions: number
  hunks: DiffHunk[]
}

export const generateDiff = (
  oldContent: string,
  newContent: string,
  fileName: string
): FileDiff => {
  const oldLines = oldContent.split('\n')
  const newLines = newContent.split('\n')

  const diffResult = computeDiff(oldLines, newLines)

  return {
    id: `diff-${Date.now()}`,
    fileName,
    status: 'modified',
    additions: diffResult.additions,
    deletions: diffResult.deletions,
    hunks: diffResult.hunks,
    language: detectLanguage(fileName),
  }
}

const computeDiff = (oldLines: string[], newLines: string[]): DiffResult => {
  const lines: DiffLine[] = []
  let additions = 0
  let deletions = 0

  let oldIndex = 0
  let newIndex = 0
  let lineNumber = 1

  // Simple line-by-line comparison (LCS algorithm for production)
  while (oldIndex < oldLines.length || newIndex < newLines.length) {
    const oldLine = oldLines[oldIndex]
    const newLine = newLines[newIndex]

    if (oldIndex >= oldLines.length) {
      // Only new lines remain
      lines.push({
        lineNumber: lineNumber++,
        newLineNumber: newIndex + 1,
        type: 'add',
        content: newLine,
      })
      additions++
      newIndex++
    } else if (newIndex >= newLines.length) {
      // Only old lines remain
      lines.push({
        lineNumber: lineNumber++,
        oldLineNumber: oldIndex + 1,
        type: 'remove',
        content: oldLine,
      })
      deletions++
      oldIndex++
    } else if (oldLine === newLine) {
      // Lines match
      lines.push({
        lineNumber: lineNumber++,
        oldLineNumber: oldIndex + 1,
        newLineNumber: newIndex + 1,
        type: 'context',
        content: oldLine,
      })
      oldIndex++
      newIndex++
    } else {
      // Lines differ - simple approach: treat as deletion + addition
      lines.push({
        lineNumber: lineNumber++,
        oldLineNumber: oldIndex + 1,
        type: 'remove',
        content: oldLine,
      })
      lines.push({
        lineNumber: lineNumber++,
        newLineNumber: newIndex + 1,
        type: 'add',
        content: newLine,
      })
      deletions++
      additions++
      oldIndex++
      newIndex++
    }
  }

  // Group lines into hunks
  const hunks: DiffHunk[] = [
    {
      oldStart: 1,
      oldLines: oldLines.length,
      newStart: 1,
      newLines: newLines.length,
      lines: [
        {
          lineNumber: 0,
          type: 'header',
          content: `@@ -1,${oldLines.length} +1,${newLines.length} @@`,
        },
        ...lines,
      ],
    },
  ]

  return { additions, deletions, hunks }
}

const detectLanguage = (fileName: string): string => {
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
