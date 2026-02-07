import React, { useMemo, useState } from 'react'
import { FileNode } from '../../types'
import { useReviewStore } from '../../store/reviewStore'
import { Badge } from '../UI'

interface FileTreeProps {
  files: FileNode[]
  className?: string
}

interface FileTreeNodeProps {
  node: FileNode
  depth: number
  isSelected: boolean
  onSelect: (id: string) => void
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({ node, depth, isSelected, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleClick = () => {
    if (node.type === 'file') {
      onSelect(node.id)
    } else {
      setIsExpanded(!isExpanded)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  const paddingLeft = depth * 16

  return (
    <div>
      <div
        role={node.type === 'file' ? 'button' : 'treeitem'}
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-all rounded-md ${
          isSelected && node.type === 'file'
            ? 'bg-primary-100 text-primary-900 font-medium'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
        style={{ paddingLeft: `${paddingLeft + 12}px` }}
        aria-selected={isSelected}
        aria-label={`${node.type === 'directory' ? 'Folder' : 'File'}: ${node.name}`}
      >
        {node.type === 'directory' ? (
          <span className="text-gray-500 flex-shrink-0" aria-hidden="true">
            {isExpanded ? '📂' : '📁'}
          </span>
        ) : (
          <span className="text-gray-500 flex-shrink-0" aria-hidden="true">
            📄
          </span>
        )}
        <span className="flex-1 truncate text-sm">{node.name}</span>
        {node.type === 'file' && node.commentCount !== undefined && node.commentCount > 0 && (
          <Badge variant="danger" className="flex-shrink-0">
            {node.commentCount}
          </Badge>
        )}
      </div>
      {node.type === 'directory' && isExpanded && node.children && (
        <div role="group">
          {node.children.map(child => (
            <FileTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              isSelected={isSelected}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const FileTree: React.FC<FileTreeProps> = ({ files, className = '' }) => {
  const { selectedFileId, setSelectedFile } = useReviewStore()

  const totalFiles = useMemo(() => {
    const count = (nodes: FileNode[]): number => {
      return nodes.reduce((acc, node) => {
        if (node.type === 'file') return acc + 1
        if (node.children) return acc + count(node.children)
        return acc
      }, 0)
    }
    return count(files)
  }, [files])

  const filesWithIssues = useMemo(() => {
    const count = (nodes: FileNode[]): number => {
      return nodes.reduce((acc, node) => {
        if (node.type === 'file' && node.commentCount && node.commentCount > 0) return acc + 1
        if (node.children) return acc + count(node.children)
        return acc
      }, 0)
    }
    return count(files)
  }, [files])

  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <h2 className="text-lg font-bold text-gray-900">Files</h2>
        <p className="text-sm text-gray-600 mt-1">
          {totalFiles} files • {filesWithIssues} with issues
        </p>
      </div>
      <div className="p-2 max-h-[calc(100vh-280px)] overflow-y-auto" role="tree">
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No files found</p>
          </div>
        ) : (
          files.map(node => (
            <FileTreeNode
              key={node.id}
              node={node}
              depth={0}
              isSelected={selectedFileId === node.id}
              onSelect={setSelectedFile}
            />
          ))
        )}
      </div>
    </div>
  )
}
