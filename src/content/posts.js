const markdownFiles = import.meta.glob('./posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function slugToTitle(slug) {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function stripLeadingBlankLines(value) {
  return value.replace(/^\n+/, '')
}

function extractTitle(source, fallbackTitle) {
  const headingMatch = source.match(/^#\s+(.+)$/m)
  return headingMatch?.[1]?.replace(/\*+/g, '').trim() || fallbackTitle
}

function extractDescription(source) {
  const blocks = source
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)

  const paragraph = blocks.find((block) => {
    const firstLine = block.split(/\r?\n/, 1)[0].trim()
    return !/^#{1,6}\s+/.test(firstLine) && !/^```/.test(firstLine) && !/^\|/.test(firstLine)
  })

  return paragraph
    ? paragraph
        .replace(/^>\s?/gm, '')
        .replace(/^[-*]\s+/gm, '')
        .replace(/\s+/g, ' ')
        .trim()
    : ''
}

function readPost(filePath, source) {
  const slug = filePath.replace('./posts/', '').replace(/\.md$/, '')
  const fallbackTitle = slugToTitle(slug)
  const [firstLine = '', ...contentLines] = source.split(/\r?\n/)

  let date = ''
  let bodyLines = [firstLine, ...contentLines]

  if (DATE_PATTERN.test(firstLine.trim())) {
    date = firstLine.trim()
    bodyLines = contentLines
    if (bodyLines[0]?.trim() === '') {
      bodyLines = bodyLines.slice(1)
    }
  }

  const markdown = stripLeadingBlankLines(bodyLines.join('\n'))

  return {
    slug,
    title: fallbackTitle,
    date,
    description: extractDescription(markdown),
    markdown,
  }
}

export const posts = Object.entries(markdownFiles)
  .map(([filePath, source]) => {
    const post = readPost(filePath, source)

    return {
      ...post,
      tags: [],
    }
  })
  .sort((left, right) => right.date.localeCompare(left.date))

export const about = {
  heading: 'Hello!',
  paragraphs: [
    "Hi, I'm Ji Yuan.",
    "I'm a sophomore majoring in CS at HUST.",
    '我喜欢计算机，享受编程的乐趣，',
    '目前在探索并学习整个计算机知识体系。',
    '努力拥抱时代，同时做一个纯粹的人，',
    '梦想成为一个有影响力的开源贡献者。',
  ],
  experiences: [
    {
      period: 'Jul 2026',
      text: '<strong>Full-Stack Development</strong> Intern at <strong>Tencent WeChat Group (WXG)</strong>.',
    },
    {
      period: 'Dec 2025',
      text: 'Participated in developing <strong>StrokeClaw</strong>, a multi-agent clinical decision support system.',
      href: 'https://github.com/inagetawaycar123/StrokeClaw',
    },
    {
      period: 'Sep 2024',
      text: 'Started B.S. in <strong>Computer Science <strong> at <strong>HUST</strong>.',
    },
  ],
  contacts: [
    {
      label: 'yuanj597@gmail.com',
      href: 'mailto:yuanj597@gmail.com',
      icon: 'mail',
    },
    {
      label: 'github.com/yuanji6666',
      href: 'https://github.com/yuanji6666',
      icon: 'github',
    },
    {
      label: 'wechat/ yuanji0814',
      href: 'weixin://',
      icon: 'wechat',
    },
  ],
}

export const sitePages = [
  { id: 'about', label: 'About' },
  { id: 'blog', label: 'Blog' },
  { id: 'projects', label: 'Projects' },
]

export const projects = [
  {
    title: 'FeatherHarness',
    href: 'https://github.com/yuanji6666/FeatherHarness',
    description: '一个简单，轻量的Harness实现，基于LangGraph，面向长链复杂任务。',
  },
  {
    title: 'GoMind',
    href: 'https://github.com/yuanji6666/GoMind',
    description: '基于RAG（增强检索生成）的知识库问答应用，分离架构/RAG优化实践。',
  },
  {
    title: 'TinyKV',
    href: 'https://github.com/yuanji6666/TinyKV',
    description: '基于Raft共识算法实现的分布式键值存储系统，支持MVCC和事务。'
  },
  {
    title: 'MyKnowledgeBase',
    href: 'https://github.com/yuanji6666/my-knowledge-base',
    description: 'AI-friendly的知识库体系构建，包含自己所有的学习资料/笔记。'
  }
]
