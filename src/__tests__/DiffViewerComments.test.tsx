import { render, screen } from '@testing-library/react'
import { DiffViewer, VIRTUALIZE_THRESHOLD } from '../components/DiffViewer/DiffViewer'
import { FileDiff, ReviewComment } from '../types'

const makeDiff = (lineCount: number): FileDiff => ({
  id: 'f',
  fileName: 'big.ts',
  status: 'added',
  additions: lineCount,
  deletions: 0,
  language: 'typescript',
  hunks: [
    {
      oldStart: 0,
      oldLines: 0,
      newStart: 1,
      newLines: lineCount,
      lines: Array.from({ length: lineCount }, (_, i) => ({
        lineNumber: i + 1,
        newLineNumber: i + 1,
        type: 'add' as const,
        content: `const v${i + 1} = ${i + 1}`,
      })),
    },
  ],
})

const comment: ReviewComment = {
  id: 'c1',
  fileId: 'f',
  fileName: 'big.ts',
  lineNumber: 2,
  severity: 'warning',
  category: 'Style',
  message: 'Prefer a descriptive name',
  aiConfidence: 0.9,
  timestamp: '2026-01-01T00:00:00Z',
}

describe('DiffViewer comments and virtualization', () => {
  it('renders a comment only under its matching line', () => {
    render(<DiffViewer diff={makeDiff(3)} comments={[comment]} />)

    expect(screen.getAllByText('Prefer a descriptive name')).toHaveLength(1)
    expect(screen.getAllByLabelText('Has comment')).toHaveLength(1)
  })

  it('renders every row for small diffs', () => {
    render(<DiffViewer diff={makeDiff(10)} comments={[]} />)

    expect(screen.queryByTestId('virtual-diff')).not.toBeInTheDocument()
    expect(screen.getByText('const v10 = 10')).toBeInTheDocument()
  })

  it('windows large diffs instead of rendering every row', () => {
    const total = VIRTUALIZE_THRESHOLD + 200
    render(<DiffViewer diff={makeDiff(total)} comments={[]} />)

    expect(screen.getByTestId('virtual-diff')).toBeInTheDocument()
    expect(screen.queryByText(`const v${total} = ${total}`)).not.toBeInTheDocument()
  })
})
