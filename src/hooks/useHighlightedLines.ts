import { useEffect, useState } from 'react'
import { loadHighlighter } from '../utils/highlighter'

/** Loads the syntax highlighter for `language`; returns true once tokens are available. */
export const useHighlighter = (language?: string): boolean => {
  const [readyFor, setReadyFor] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    loadHighlighter(language).then(ok => {
      if (!cancelled && ok && language) setReadyFor(language)
    })
    return () => {
      cancelled = true
    }
  }, [language])

  return !!language && readyFor === language
}
