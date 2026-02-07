import { useEffect, useCallback } from 'react'
import { FileNode } from '../types'

interface UseKeyboardNavigationProps {
  files: FileNode[]
  selectedFileId: string | null
  onSelectFile: (fileId: string) => void
  enabled?: boolean
}

export const useKeyboardNavigation = ({
  files,
  selectedFileId,
  onSelectFile,
  enabled = true,
}: UseKeyboardNavigationProps) => {
  const flattenFiles = useCallback((nodes: FileNode[]): FileNode[] => {
    return nodes.reduce<FileNode[]>((acc, node) => {
      if (node.type === 'file') {
        acc.push(node)
      }
      if (node.children) {
        acc.push(...flattenFiles(node.children))
      }
      return acc
    }, [])
  }, [])

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      const flatFiles = flattenFiles(files)
      const currentIndex = flatFiles.findIndex(f => f.id === selectedFileId)

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault()
        const nextIndex = Math.min(currentIndex + 1, flatFiles.length - 1)
        if (flatFiles[nextIndex]) {
          onSelectFile(flatFiles[nextIndex].id)
        }
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault()
        const prevIndex = Math.max(currentIndex - 1, 0)
        if (flatFiles[prevIndex]) {
          onSelectFile(flatFiles[prevIndex].id)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [files, selectedFileId, onSelectFile, enabled, flattenFiles])
}
