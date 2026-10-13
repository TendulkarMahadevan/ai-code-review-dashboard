import type { HighlighterCore } from 'shiki/core'

export interface HighlightedToken {
  content: string
  color?: string
}

const LANGS: Record<string, () => Promise<unknown>> = {
  typescript: () => import('shiki/langs/typescript.mjs'),
  tsx: () => import('shiki/langs/tsx.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  jsx: () => import('shiki/langs/jsx.mjs'),
  python: () => import('shiki/langs/python.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  markdown: () => import('shiki/langs/markdown.mjs'),
  go: () => import('shiki/langs/go.mjs'),
  java: () => import('shiki/langs/java.mjs'),
  rust: () => import('shiki/langs/rust.mjs'),
}

let highlighterPromise: Promise<HighlighterCore> | null = null
let highlighter: HighlighterCore | null = null
const loadedLangs = new Set<string>()

const normalizeLang = (language?: string): string | null => {
  if (!language) return null
  const lang = language.toLowerCase()
  return lang in LANGS ? lang : null
}

/** Lazily loads shiki (as a separate chunk) and the grammar for `language`. */
export const loadHighlighter = async (language?: string): Promise<boolean> => {
  const lang = normalizeLang(language)
  if (!lang) return false
  try {
    if (!highlighterPromise) {
      highlighterPromise = (async () => {
        const [{ createHighlighterCore }, { createJavaScriptRegexEngine }, theme] =
          await Promise.all([
            import('shiki/core'),
            import('shiki/engine/javascript'),
            import('shiki/themes/github-light.mjs'),
          ])
        return createHighlighterCore({
          themes: [theme.default],
          langs: [],
          engine: createJavaScriptRegexEngine(),
        })
      })()
    }
    highlighter = await highlighterPromise
    if (!loadedLangs.has(lang)) {
      const mod = (await LANGS[lang]()) as { default: never }
      await highlighter.loadLanguage(mod.default)
      loadedLangs.add(lang)
    }
    return true
  } catch (error) {
    console.warn('Syntax highlighting unavailable:', error)
    return false
  }
}

/** Tokenizes one line; returns null until the highlighter and grammar are loaded. */
export const tokenizeLine = (line: string, language?: string): HighlightedToken[] | null => {
  const lang = normalizeLang(language)
  if (!highlighter || !lang || !loadedLangs.has(lang)) return null
  const [tokens] = highlighter.codeToTokensBase(line, { lang, theme: 'github-light' })
  return tokens ?? null
}
