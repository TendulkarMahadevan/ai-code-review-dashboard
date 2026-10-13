import { render, screen } from '@testing-library/react'
import { FileTree } from '../components/FileTree/FileTree'
import { FileNode } from '../types'

const files: FileNode[] = [
  {
    id: 'dir',
    name: 'src',
    path: 'src',
    type: 'directory',
    children: [
      { id: 'a', name: 'a.ts', path: 'src/a.ts', type: 'file' },
      { id: 'b', name: 'b.ts', path: 'src/b.ts', type: 'file' },
    ],
  },
]

jest.mock('../store/reviewStore', () => ({
  useReviewStore: () => ({ selectedFileId: 'b', setSelectedFile: jest.fn() }),
}))

describe('FileTree selection', () => {
  it('marks only the selected nested file as selected', () => {
    render(<FileTree files={files} />)

    expect(screen.getByRole('treeitem', { name: 'File: b.ts' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByRole('treeitem', { name: 'File: a.ts' })).toHaveAttribute(
      'aria-selected',
      'false'
    )
  })
})
