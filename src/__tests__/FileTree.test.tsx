import { render, screen, fireEvent } from '@testing-library/react'
import { FileTree } from '../components/FileTree/FileTree'
import { FileNode } from '../types'

const mockFiles: FileNode[] = [
  {
    id: 'file-1',
    name: 'src',
    path: 'src',
    type: 'directory',
    children: [
      {
        id: 'file-2',
        name: 'App.tsx',
        path: 'src/App.tsx',
        type: 'file',
        commentCount: 3,
      },
      {
        id: 'file-3',
        name: 'utils.ts',
        path: 'src/utils.ts',
        type: 'file',
        commentCount: 0,
      },
    ],
  },
]

jest.mock('../store/reviewStore', () => ({
  useReviewStore: () => ({
    selectedFileId: null,
    setSelectedFile: jest.fn(),
  }),
}))

describe('FileTree', () => {
  it('renders file tree with correct structure', () => {
    render(<FileTree files={mockFiles} />)

    expect(screen.getByText('Files')).toBeInTheDocument()
    expect(screen.getByText('src')).toBeInTheDocument()
    expect(screen.getByText('App.tsx')).toBeInTheDocument()
    expect(screen.getByText('utils.ts')).toBeInTheDocument()
  })

  it('displays comment count badge for files with comments', () => {
    render(<FileTree files={mockFiles} />)

    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('allows directory expansion and collapse', () => {
    render(<FileTree files={mockFiles} />)

    const directory = screen.getByText('src')
    expect(screen.getByText('App.tsx')).toBeVisible()

    fireEvent.click(directory)
    
  })

  it('shows empty state when no files', () => {
    render(<FileTree files={[]} />)

    expect(screen.getByText('No files found')).toBeInTheDocument()
  })
})
