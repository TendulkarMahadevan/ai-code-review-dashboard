import { DiffLine } from '../types'

export const getDiffLineClass = (type: DiffLine['type']): string => {
  switch (type) {
    case 'add':
      return 'bg-green-50 border-l-4 border-green-500'
    case 'remove':
      return 'bg-red-50 border-l-4 border-red-500'
    case 'context':
      return 'bg-white'
    case 'header':
      return 'bg-gray-100 text-gray-600 font-semibold'
    default:
      return ''
  }
}

export const getDiffLineSymbol = (type: DiffLine['type']): string => {
  switch (type) {
    case 'add':
      return '+'
    case 'remove':
      return '-'
    case 'context':
      return ' '
    case 'header':
      return ''
    default:
      return ''
  }
}

export const getLanguageClass = (language?: string): string => {
  if (!language) return ''
  return `language-${language}`
}

export const highlightSyntax = (content: string, language?: string): string => {
  return content
}

export const countTotalComments = (files: unknown[]): number => {
  return files.reduce((total, file: any) => {
    return total + (file.commentCount || 0)
  }, 0)
}
