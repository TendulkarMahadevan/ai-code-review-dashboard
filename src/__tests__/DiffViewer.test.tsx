import { render, screen } from '@testing-library/react'
import { DiffViewer } from '../components/DiffViewer/DiffViewer'
import { FileDiff } from '../types'

const mockDiff: FileDiff = {
  id: 'file-1',
  fileName: 'src/App.tsx',
  status: 'modified',
  additions: 5,
  deletions: 2,
  language: 'typescript',
  hunks: [
    {
      oldStart: 1,
      oldLines: 10,
      newStart: 1,
      newLines: 13,
      lines: [
        {
          lineNumber: 1,
          type: 'header',
          content: '@@ -1,10 +1,13 @@',
        },
        {
          lineNumber: 2,
          oldLineNumber: 1,
          newLineNumber: 1,
          type: 'context',
          content: 'import React from "react"',
        },
        {
          lineNumber: 3,
          oldLineNumber: 2,
          type: 'remove',
          content: 'const App = () => {',
        },
        {
          lineNumber: 4,
          newLineNumber: 2,
          type: 'add',
          content: 'const App: React.FC = () => {',
        },
      ],
    },
  ],
}

describe('DiffViewer', () => {
  it('renders diff with file name and status', () => {
    render(<DiffViewer diff={mockDiff} comments={[]} />)

    expect(screen.getByText('src/App.tsx')).toBeInTheDocument()
    expect(screen.getByText('modified')).toBeInTheDocument()
  })

  it('displays additions and deletions count', () => {
    render(<DiffViewer diff={mockDiff} comments={[]} />)

    expect(screen.getByText('+5 additions')).toBeInTheDocument()
    expect(screen.getByText('-2 deletions')).toBeInTheDocument()
  })

  it('renders diff lines with correct symbols', () => {
    render(<DiffViewer diff={mockDiff} comments={[]} />)

    expect(screen.getByText('import React from "react"')).toBeInTheDocument()
    expect(screen.getByText('const App = () => {')).toBeInTheDocument()
    expect(screen.getByText('const App: React.FC = () => {')).toBeInTheDocument()
  })

  it('displays language when provided', () => {
    render(<DiffViewer diff={mockDiff} comments={[]} />)

    expect(screen.getByText(/Language:/)).toBeInTheDocument()
    expect(screen.getByText('typescript')).toBeInTheDocument()
  })
})
