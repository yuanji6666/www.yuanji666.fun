export const posts = [
  {
    slug: 'reading-code-like-prose',
    title: 'Reading Code Like Prose',
    date: '2026-06-18',
    description: '关于把代码当成一段可阅读文本来整理的笔记。',
    tags: ['writing', 'reading', 'systems'],
    markdown: `
有些代码适合被“理解”，有些代码适合被“阅读”。

当一个系统足够小，叙述顺序就会变成一种设计工具。

> 好的代码不是把信息藏起来，而是按读者最容易接受的顺序摆出来。

## 一条经验

如果一个函数需要读两遍，通常不是读者不够认真，而是结构还可以再整理。

| 目标 | 做法 |
| --- | --- |
| 降低认知负担 | 把依赖放在前面 |
| 提升局部性 | 让上下文紧贴使用处 |
| 维护节奏 | 保持段落长度相似 |

## 数学

阅读体验也可以量化。一个简单的心智负担模型可以写成：

\`\`\`tex
L = \alpha S + \beta C + \gamma B
\`\`\`

其中 $S$ 表示结构复杂度，$C$ 表示上下文切换，$B$ 表示打断次数。

## 图示

\`\`\`mermaid
flowchart TD
  A[Start] --> B[Read the code]
  B --> C{Need more context?}
  C -->|Yes| D[Find the nearest definition]
  C -->|No| E[Keep reading]
  D --> B
  E --> F[Understand the shape]
\`\`\`

## 脚注

好的注释往往不是解释“发生了什么”，而是解释“为什么这样安排”。[^1]

[^1]: 当实现细节本身足够直观时，注释应该尽量短。

## 结尾

把代码写成能顺着读下去的文本，通常比“聪明”更重要。
`,
  },
  {
    slug: 'notes-on-markdown',
    title: 'Notes on Markdown',
    date: '2026-05-09',
    description: '一份针对 Markdown 文章结构的整理。',
    tags: ['markdown', 'docs'],
    markdown: `
Markdown 适合记笔记，因为它会把“内容”放在最前面。

## 规则

1. 标题负责分层。
2. 列表负责罗列。
3. 引用负责强调。
4. 代码块负责保留原样。

## 小表格

| 元素 | 作用 |
| --- | --- |
| Heading | 组织视线 |
| Quote | 提供语气 |
| Code | 保留精确性 |

## 结论

如果排版足够安静，读者会更愿意停留。
`,
  },
  {
    slug: 'systems-that-age-well',
    title: 'Systems That Age Well',
    date: '2026-03-21',
    description: '关于长期可维护系统的一点观察。',
    tags: ['systems', 'design'],
    markdown: `
真正经得住时间的系统，往往都很朴素。

## 它们通常有几个共同点

- 边界清楚
- 依赖稳定
- 概念少
- 行为可预测

## 一个简单判断

当你开始为了“看起来现代”而增加结构时，通常已经偏离了问题本身。

> 十年后依然不过时的设计，往往在第一天就很克制。
`,
  },
]

export const about = {
  heading: 'Hello!',
  paragraphs: [
    "Hi, I'm Ji Yuan.",
    "I'm a sophomore majoring in CS at HUST.",
    "我喜欢计算机，享受编程的乐趣；",
    '目前正在探索学习整个计算机知识体系。',
    '拥抱时代，努力做一个纯粹的人，',
    '梦想成为一个有影响力的开源贡献者',
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
      label: 'wechat/yuanji0814',
      href: 'weixin://',
      icon: 'wechat',
    },
  ],
}

export const sitePages = [
  { id: 'about', label: 'About' },
  { id: 'blog', label: 'Blog' },
  { id: 'projects', label: 'Projects' },
  { id: 'notes', label: 'Notes' },
]

export const projects = [
  {
    title: 'Static Notes Engine',
    description: '一个只做一件事的 Markdown 阅读器，输出干净的静态页面。',
  },
  {
    title: 'Reading Checklist',
    description: '帮助快速扫读长文的轻量工具，强调目录与结构感。',
  },
]
