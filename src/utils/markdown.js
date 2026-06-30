import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import footnote from 'markdown-it-footnote'
import texmath from 'markdown-it-texmath'
import katex from 'katex'
import hljs from 'highlight.js'

function createSlugger() {
  const counts = new Map()

  return (value) => {
    const base = String(value)
      .toLowerCase()
      .trim()
      .replace(/['"’]/g, '')
      .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const current = counts.get(base) ?? 0
    counts.set(base, current + 1)

    return current === 0 ? base || 'section' : `${base || 'section'}-${current + 1}`
  }
}

function createMarkdownIt(slugger) {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        const { value } = hljs.highlight(code, { language: lang })
        return `<pre class="code-block"><code class="hljs language-${lang}">${value}</code></pre>`
      }

      return `<pre class="code-block"><code class="hljs">${md.utils.escapeHtml(code)}</code></pre>`
    },
  })

  md.enable(['table'])
  md.use(footnote)
  md.use(texmath, { engine: katex, delimiters: 'dollars' })
  md.use(anchor, {
    slugify: slugger,
    tabIndex: false,
  })

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const info = (token.info || '').trim().split(/\s+/)[0]

    if (info === 'mermaid') {
      return `<div class="mermaid">${md.utils.escapeHtml(token.content)}</div>`
    }

    return options.highlight
      ? options.highlight(token.content, info, '')
      : `<pre class="code-block"><code>${md.utils.escapeHtml(token.content)}</code></pre>`
  }

  return md
}

export function renderMarkdown(markdown) {
  const slugger = createSlugger()
  const md = createMarkdownIt(slugger)
  return md.render(markdown)
}

export function extractToc(markdown) {
  const slugger = createSlugger()
  const md = createMarkdownIt(slugger)
  const tokens = md.parse(markdown, {})
  const toc = []

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]
    if (token.type !== 'heading_open') continue

    const level = Number(token.tag.slice(1))
    const inline = tokens[i + 1]
    const text = inline?.children?.map((child) => child.content).join('') ?? ''
    const id = token.attrGet('id') ?? slugger(text)
    toc.push({ level, text, id })
  }

  return toc
}
