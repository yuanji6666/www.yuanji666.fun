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

const contacts = [
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
]

const projectLinks = [
  {
    title: 'FeatherHarness',
    href: 'https://github.com/yuanji6666/FeatherHarness',
  },
  {
    title: 'GoMind',
    href: 'https://github.com/yuanji6666/GoMind',
  },
  {
    title: 'TinyKV',
    href: 'https://github.com/yuanji6666/TinyKV',
  },
  {
    title: 'MyKnowledgeBase',
    href: 'https://github.com/yuanji6666/my-knowledge-base',
  },
]

export const siteCopy = {
  zh: {
    pages: [
      { id: 'about', label: '关于' },
      { id: 'blog', label: '博客' },
      { id: 'projects', label: '项目' },
    ],
    about: {
      heading: '你好！',
      paragraphs: [
        '你好，我是 JimmyYuan',
        '我喜欢计算机，享受编程的乐趣',
        '在探索并学习整个计算机知识体系',
        '努力拥抱时代，同时做一个纯粹的人',
        '目前对 AI 全栈感兴趣，从Infra到Agent',
        '呵护好自己的好奇心和求知欲'
      ],
      experiences: [
        {
          period: '2026.07',
          text: '全栈开发实习生，就职于腾讯微信事业群',
        },
        {
          period: '2024.09',
          text: '开始在华中科技大学攻读计算机科学学士学位',
        },
      ],
      contacts: [
        ...contacts,
        {
          label: '微信 / yuanji0814',
          href: 'weixin://',
          icon: 'wechat',
        },
      ],
    },
    projects: [
      {
        ...projectLinks[0],
        description: '一个简单，轻量的Harness实现，基于LangGraph，面向长链复杂任务。',
      },
      {
        ...projectLinks[1],
        description: '基于RAG（增强检索生成）的知识库问答应用，分离架构/RAG优化实践。',
      },
      {
        ...projectLinks[2],
        description: '基于Raft共识算法实现的分布式键值存储系统，支持MVCC和事务。',
      },
      {
        ...projectLinks[3],
        description: 'AI-friendly的知识库体系构建，包含自己所有的学习资料/笔记。',
      },
    ],
    ui: {
      navLabel: '主导航',
      backToDirectory: '返回目录',
      switchLanguage: '切换为英文',
    },
  },
  en: {
    pages: [
      { id: 'about', label: 'About' },
      { id: 'blog', label: 'Blog' },
      { id: 'projects', label: 'Projects' },
    ],
    about: {
      heading: 'Hello!',
      paragraphs: [
        "Hi, I'm JimmyYuan",
        'I love computers and the joy of coding',
        'exploring and learning computer science',
        'embracing the times, and staying sincere',
        'into the AI stack, from infra to agents',
        'looking after my curiosity and urge to learn',
      ],
      experiences: [
        {
          period: 'Jul 2026',
          text: 'Full-Stack Development Intern at Tencent WeXin Group (WXG).',
        },
        {
          period: 'Sep 2024',
          text: 'Started B.S. in Computer Science at HUST.',
        },
      ],
      contacts: [
        ...contacts,
        {
          label: 'wechat / yuanji0814',
          href: 'weixin://',
          icon: 'wechat',
        },
      ],
    },
    projects: [
      {
        ...projectLinks[0],
        description: 'A lightweight Harness on LangGraph, built for long-horizon tasks.',
      },
      {
        ...projectLinks[1],
        description: 'A RAG knowledge-base Q&A app, with a split architecture.',
      },
      {
        ...projectLinks[2],
        description: 'A Raft-based distributed KV store with MVCC and transactions.',
      },
      {
        ...projectLinks[3],
        description: 'An AI-friendly base of my notes and learning materials.',
      },
    ],
    ui: {
      navLabel: 'Primary',
      backToDirectory: 'Back to directory',
      switchLanguage: 'Switch to Chinese',
    },
  },
}
