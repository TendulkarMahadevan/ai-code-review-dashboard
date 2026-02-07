import { renderHook, act } from '@testing-library/react'
import { useReviewStore } from '../store/reviewStore'

describe('Severity Filter', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useReviewStore())
    act(() => {
      result.current.resetFilters()
    })
  })

  it('initializes with empty severity filter', () => {
    const { result } = renderHook(() => useReviewStore())

    expect(result.current.filters.severity).toEqual([])
  })

  it('adds severity to filter', () => {
    const { result } = renderHook(() => useReviewStore())

    act(() => {
      result.current.setFilters({ severity: ['warning'] })
    })

    expect(result.current.filters.severity).toContain('warning')
  })

  it('removes severity from filter', () => {
    const { result } = renderHook(() => useReviewStore())

    act(() => {
      result.current.setFilters({ severity: ['warning', 'critical'] })
    })

    act(() => {
      result.current.setFilters({ severity: ['warning'] })
    })

    expect(result.current.filters.severity).toEqual(['warning'])
    expect(result.current.filters.severity).not.toContain('critical')
  })

  it('handles multiple severity filters', () => {
    const { result } = renderHook(() => useReviewStore())

    act(() => {
      result.current.setFilters({ severity: ['info', 'warning', 'critical'] })
    })

    expect(result.current.filters.severity).toHaveLength(3)
    expect(result.current.filters.severity).toContain('info')
    expect(result.current.filters.severity).toContain('warning')
    expect(result.current.filters.severity).toContain('critical')
  })

  it('resets filters to initial state', () => {
    const { result } = renderHook(() => useReviewStore())

    act(() => {
      result.current.setFilters({ severity: ['critical'], searchQuery: 'test' })
    })

    act(() => {
      result.current.resetFilters()
    })

    expect(result.current.filters.severity).toEqual([])
    expect(result.current.filters.searchQuery).toBe('')
  })
})
