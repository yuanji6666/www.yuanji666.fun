<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import avatarUrl from '../avatar.jpg'
import { posts, siteCopy } from './content/posts'
import { renderMarkdown } from './utils/markdown'

const LOCALE_KEY = 'site-locale'

function readLocale() {
  try {
    const saved = localStorage.getItem(LOCALE_KEY)
    if (saved === 'en' || saved === 'zh') return saved
  } catch {
    // 隐私模式下忽略本地存储
  }

  return 'en'
}

const locale = ref(readLocale())
const activePostSlug = ref(posts[0].slug)
const activeSection = ref('about')
const activeBlogView = ref('directory')
const articleRef = ref(null)
const copy = computed(() => siteCopy[locale.value])

const activePost = computed(
  () => posts.find((post) => post.slug === activePostSlug.value) ?? posts[0],
)

const renderedArticle = computed(() => renderMarkdown(activePost.value.markdown))
let mermaidReady = null

function scrollToSection(id) {
  activeSection.value = id
  if (id === 'blog') {
    activeBlogView.value = 'directory'
  }
}

function openPost(slug) {
  activePostSlug.value = slug
  activeBlogView.value = 'post'
}

function backToBlogDirectory() {
  activeBlogView.value = 'directory'
}

function toggleLocale() {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}

watch(
  locale,
  (value) => {
    document.documentElement.lang = value === 'zh' ? 'zh-CN' : 'en'
    try {
      localStorage.setItem(LOCALE_KEY, value)
    } catch {
      // 隐私模式下忽略本地存储
    }
  },
  { immediate: true },
)

async function getMermaid() {
  if (!mermaidReady) {
    mermaidReady = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'strict',
        fontFamily:
          '"Inter", "Noto Serif SC", "Source Han Serif SC", "LXGW WenKai", serif',
        themeVariables: {
          primaryColor: '#f7f3eb',
          primaryTextColor: '#252525',
          primaryBorderColor: '#d8d2c6',
          lineColor: '#b9b1a4',
          fontSize: '14px',
        },
      })

      return mermaid
    })
  }

  return mermaidReady
}

async function renderMermaidBlocks() {
  if (!articleRef.value) return
  const blocks = articleRef.value.querySelectorAll('.mermaid')
  if (!blocks.length) return

  const mermaid = await getMermaid()

  await mermaid.run({
    nodes: Array.from(blocks),
  })
}

watch([renderedArticle, activeBlogView], async ([, blogView]) => {
  if (blogView !== 'post') return
  await nextTick()
  await renderMermaidBlocks()
})

onMounted(async () => {
  await nextTick()
  await renderMermaidBlocks()
})
</script>

<template>
  <div class="shell">
    <header class="site-header">
      <a class="brand" href="#" aria-label="About Ji" @click.prevent="scrollToSection('about')">
        <span class="brand-signature">Yuan</span>
      </a>

      <div class="header-tools">
        <nav class="site-nav" :aria-label="copy.ui.navLabel">
          <button
            v-for="link in copy.pages"
            :key="link.id"
            class="nav-link"
            type="button"
            :data-active="activeSection === link.id"
            @click="scrollToSection(link.id)"
          >
            <span>{{ link.label }}</span>
          </button>
        </nav>

        <button
          class="lang-toggle"
          type="button"
          :aria-label="copy.ui.switchLanguage"
          @click="toggleLocale"
        >
          <span>{{ locale === 'zh' ? 'EN' : '中文' }}</span>
        </button>
      </div>
    </header>

    <main class="layout">
      <section v-if="activeSection === 'about'" class="panel-content intro">
        <div class="about-panel">
          <h1 class="about-heading">{{ copy.about.heading }}</h1>

          <div class="about-grid">
            <div class="about-rail">
              <img class="about-avatar" :src="avatarUrl" alt="yuanji avatar" />
            </div>

            <div class="about-copy">
              <p v-for="line in copy.about.paragraphs" :key="line">
                {{ line }}
              </p>
            </div>
          </div>

          <div class="about-links" aria-label="Contact links">
            <a
              v-for="contact in copy.about.contacts"
              :key="contact.href"
              class="contact-link"
              :href="contact.href"
              :target="contact.icon === 'github' ? '_blank' : undefined"
              :rel="contact.icon === 'github' ? 'noreferrer' : undefined"
            >
              <span class="contact-icon" aria-hidden="true">
                <template v-if="contact.icon === 'mail'">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm0 2v.25l8 5.5 8-5.5V8H4Zm16 8V10.1l-7.44 5.12a1 1 0 0 1-1.12 0L4 10.1V16h16Z"
                      fill="currentColor"
                    />
                  </svg>
                </template>
                <template v-else-if="contact.icon === 'github'">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.68c-2.77.6-3.35-1.19-3.35-1.19-.45-1.15-1.11-1.45-1.11-1.45-.91-.63.07-.62.07-.62 1 .07 1.52 1.03 1.52 1.03.89 1.52 2.33 1.08 2.9.83.09-.66.35-1.08.64-1.33-2.21-.26-4.53-1.1-4.53-4.91 0-1.08.38-1.96 1.02-2.65-.1-.26-.44-1.3.1-2.71 0 0 .83-.27 2.74 1.01a9.5 9.5 0 0 1 4.98 0c1.9-1.28 2.73-1.01 2.73-1.01.54 1.41.2 2.45.1 2.71.64.69 1.02 1.57 1.02 2.65 0 3.82-2.33 4.65-4.55 4.9.36.31.68.91.68 1.84v2.73c0 .26.18.57.69.47A10 10 0 0 0 12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </template>
                <template v-else-if="contact.icon === 'wechat'">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M9.2 4.1C5.72 4.1 3 6.45 3 9.4c0 1.72.95 3.25 2.47 4.23l-.72 2.47c-.1.35.11.66.38.66.08 0 .16-.02.24-.06l2.26-1.13c.47.09.9.13 1.37.13.45 0 .88-.04 1.3-.12-.1-.32-.15-.65-.15-.98 0-2.85 2.75-5.16 6.1-5.16.32 0 .63.02.93.06C17.68 5.98 13.97 4.1 9.2 4.1Zm-1.7 5.1c-.44 0-.8-.35-.8-.79s.36-.8.8-.8c.45 0 .81.36.81.8s-.36.8-.81.8Zm3.34 0c-.44 0-.8-.35-.8-.79s.36-.8.8-.8c.45 0 .8.36.8.8s-.35.8-.8.8Zm7.06.88c-3.23 0-5.8 2.13-5.8 4.76 0 2.62 2.57 4.75 5.8 4.75.43 0 .85-.04 1.29-.12l1.94.97c.24.12.44.02.53-.12.08-.13.14-.34.06-.61l-.62-2.1c1.18-.79 1.94-2.01 1.94-3.57 0-2.63-2.57-4.76-5.14-4.76Zm-2.1 3.55c-.41 0-.75-.34-.75-.75s.34-.74.75-.74c.42 0 .76.33.76.74s-.34.75-.76.75Zm2.84 0c-.41 0-.75-.34-.75-.75s.34-.74.75-.74c.42 0 .76.33.76.74s-.34.75-.76.75Z"
                      fill="currentColor"
                    />
                  </svg>
                </template>
                <template v-else>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M7.1 19.4c-.17 0-.33-.04-.48-.11-.36-.18-.57-.58-.47-.96l.68-2.53A7.4 7.4 0 0 1 5 10.7C5 6.99 8.28 4 12.33 4S19.66 6.99 19.66 10.7s-3.28 6.7-7.33 6.7c-.8 0-1.57-.11-2.3-.33L7.6 19.2c-.13.13-.31.2-.5.2ZM8.8 8.9c-.42 0-.76.34-.76.76s.34.76.76.76.76-.34.76-.76-.34-.76-.76-.76Zm7.05 0c-.42 0-.76.34-.76.76s.34.76.76.76.76-.34.76-.76-.34-.76-.76-.76Zm-5.58 3.1h4.11v-.95H10.27v.95Z"
                      fill="currentColor"
                    />
                  </svg>
                </template>
              </span>
              <span class="contact-label">{{ contact.label }}</span>
            </a>
          </div>

          <div v-if="copy.about.experiences?.length" class="about-experiences">
            <div v-for="item in copy.about.experiences" :key="item.period" class="experience-item">
              <span class="experience-period">{{ item.period }}</span>
              <span v-if="!item.href" class="experience-text" v-html="item.text"></span>
              <a v-else class="experience-text" :href="item.href" target="_blank" rel="noreferrer" v-html="item.text"></a>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="activeSection === 'blog'" class="panel-content story">
        <div v-if="activeBlogView === 'directory'" class="blog-directory">
          <ul class="post-list blog-directory-list">
            <li v-for="post in posts" :key="post.slug">
              <button class="post-link blog-card" type="button" @click="openPost(post.slug)">
                <span class="post-date">{{ post.date }}</span>
                <span class="post-title">{{ post.title }}</span>
              </button>
            </li>
          </ul>
        </div>

        <div v-else class="blog-detail">
          <button class="blog-back" type="button" @click="backToBlogDirectory">
            ← {{ copy.ui.backToDirectory }}
          </button>

          <article ref="articleRef" class="article">
            <header class="article-header">
              <p class="article-kicker">{{ activePost.date }}</p>
              <h2>{{ activePost.title }}</h2>
            </header>

            <div class="article-body" v-html="renderedArticle"></div>
          </article>
        </div>
      </section>

      <section v-else-if="activeSection === 'projects'" class="panel-content stack">
        <ul class="project-list">
          <li v-for="project in copy.projects" :key="project.title">
            <h3>
              <a
                class="project-link"
                :href="project.href || undefined"
                :target="project.href ? '_blank' : undefined"
                :rel="project.href ? 'noreferrer' : undefined"
              >
                {{ project.title }}
              </a>
            </h3>
            <p>{{ project.description }}</p>
          </li>
        </ul>
      </section>
    </main>

    <footer class="footer">
    </footer>
  </div>
</template>
