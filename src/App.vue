<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useGitHubImages } from './useImages'
import { useTheme } from './useTheme'

import { config } from './config'

// ================= 组件 =================
import PasswordGate from './components/PasswordGate.vue'  // 密码文件夹
const pwdRef = ref(null)

import R18Gate from './components/R18Gate.vue'  // r18文件夹

// 无权访问文件夹 
import ForbiddenPage from './components/ForbiddenPage.vue'
import { forbiddenFolders } from './config'

import NotFound from './components/NotFound.vue'  // 404

import Footer from './components/Footer.vue'  // Footer

// ================= 改这里 =================
const OWNER = 'mmzyc'
const REPO  = 'MianImage'
const BRANCH = 'main'
const ROOT_FOLDER = 'others'
// 图床 CDN 前缀，末尾要带 /
const CDN = 'https://cdn.jsdelivr.net/gh/'
// 注意：jsDelivr 的完整格式是 https://cdn.jsdelivr.net/gh/用户名/仓库名@分支/
// 所以下面自动拼上 owner/repo@branch
const FULL_CDN = `${CDN}${OWNER}/${REPO}@${BRANCH}/`

// const name = '棉の图床'
// const disc = '这里是木锦棉棉の图床可视化页面'
// ==========================================

const { images, loading, error, load } = useGitHubImages({
  owner: OWNER,
  repo: REPO,
  branch: BRANCH,
  cdnPrefix: FULL_CDN,
})

const { theme, toggle } = useTheme()

const subfolders = computed(() => {
  const cur = activeFolder.value
  const prefix = cur ? cur + '/' : ''
  const set = new Set()

  for (const f of images.value.map(i => i.folder)) {
    if (!f.startsWith(prefix)) continue
    const rest = f.slice(prefix.length)
    if (!rest) continue                       // 就是当前文件夹本身
    const first = rest.split('/')[0]          // 只取下一层
    set.add(cur ? cur + '/' + first : first)
  }

  return Array.from(set).sort()
})

const breadcrumbs = computed(() => {
  const f = activeFolder.value
  if (!f) return []
  const parts = f.split('/')
  return parts.map((name, i) => ({
    name,
    full: parts.slice(0, i + 1).join('/'),
  }))
})

function goCrumb(index) {
  if (index === breadcrumbs.value.length - 1) return
  const target = breadcrumbs.value[index].full
  if (target === ROOT_FOLDER) selectFolder('')   // 回根用 /
  else selectFolder(target)
}

// URL 规则：/ 是根目录（全部），/xxx 是某个文件夹，支持 /photos/2024
function readFolderFromUrl() {
  const base = import.meta.env.BASE_URL
  let path = window.location.pathname
  if (base !== '/' && path.startsWith(base)) {
    path = path.slice(base.length - 1)
  }
  const decoded = decodeURIComponent(path.replace(/^\/+|\/+$/g, ''))
  return decoded === '' ? ROOT_FOLDER : decoded
}

const activeFolder = ref(readFolderFromUrl())   // '' 表示全部

function selectFolder(f) {
  const base = import.meta.env.BASE_URL
  const target = f
    ? base + f.split('/').map(encodeURIComponent).join('/')
    : base
  window.history.pushState({}, '', target)
  activeFolder.value = f || ROOT_FOLDER
}

function syncFromUrl() {
  activeFolder.value = readFolderFromUrl()
}

const visibleImages = computed(() =>
  images.value.filter(i => i.folder === activeFolder.value)
)

const isForbidden = computed(() => {
  const cur = activeFolder.value
  if (!cur) return false
  return forbiddenFolders.some(f =>
    cur === f || cur.startsWith(f + '/')
  )
})

const folderExists = computed(() => {
  if (loading.value) return true
  const cur = activeFolder.value
  if (cur === ROOT_FOLDER) return true
  return images.value.some(i =>
    i.folder === cur || i.folder.startsWith(cur + '/')
  )
})

// ---- 灯箱 ----
const lightboxIndex = ref(-1)
const lightboxOpen = computed(() => lightboxIndex.value >= 0)
const currentImage = computed(() => visibleImages.value[lightboxIndex.value] || null)

function openLightbox(i) { lightboxIndex.value = i }
function closeLightbox() { lightboxIndex.value = -1 }
function prev() {
  const n = visibleImages.value.length
  if (!n) return
  lightboxIndex.value = (lightboxIndex.value - 1 + n) % n
}
function next() {
  const n = visibleImages.value.length
  if (!n) return
  lightboxIndex.value = (lightboxIndex.value + 1) % n
}
function onKeydown(e) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
}

watch(activeFolder, () => closeLightbox())

onMounted(() => {
  load()
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('popstate', syncFromUrl)      // 新增
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('popstate', syncFromUrl)   // 新增
})
</script>

<template>
  <div class="app">
    <div class="topbar">
      <header class="header">
        <div class="header-left">
          <h1 class="title">{{ config.name }}</h1>
          <i class="subtitle">{{ config.disc }}</i>
          <p class="subtitle">
            <span v-if="loading">正在加载…</span>
            <span v-else-if="error" class="error">{{ error }}</span>
            <span v-else>
              共 {{ images.length }} 张图片 · {{ subfolders.length }} 个子文件夹
            </span>
          </p>
        </div>

        <button
          class="theme-toggle"
          :title="theme === 'dark' ? '切换到亮色' : '切换到暗色'"
          @click="toggle"
        >
          <span v-if="theme === 'dark'">☀️</span>
          <span v-else>🌙</span>
        </button>
      </header>

      <nav v-if="!loading && !error && breadcrumbs.length" class="breadcrumbs">
        <template v-for="(b, i) in breadcrumbs" :key="b.full">
          <button
            class="crumb"
            :disabled="i === breadcrumbs.length - 1"
            @click="goCrumb(i)"
          >
            {{ b.name }}
          </button>
          <span class="crumb-sep">/</span>
        </template>
      </nav>

      <nav v-if="!loading && !error && subfolders.length && !pwdRef?.locked && !isForbidden" class="folders">
        <button
          v-for="f in subfolders"
          :key="f"
          class="folder-btn"
          :class="{ active: activeFolder === f }"
          @click="selectFolder(f)"
        >
          {{ f.split('/').pop() }}
        </button>
      </nav>
    </div>

    <main class="content">
      <ForbiddenPage v-if="isForbidden" :folder="activeFolder" />
      <PasswordGate v-else ref="pwdRef" :folder="activeFolder">
        <R18Gate :folder="activeFolder" />
        <div v-if="loading" class="grid">
          <div v-for="i in 12" :key="i" class="skeleton"></div>
        </div>

        <NotFound v-else-if="!error && !folderExists" :path="activeFolder" />

        <div v-else-if="!error && visibleImages.length === 0 && subfolders.length" class="folder-grid">
          <div
            v-for="f in subfolders"
            :key="f"
            class="folder-card"
            @click="selectFolder(f)"
          >
            <div class="folder-icon">📁</div>
            <div class="folder-name">{{ f.split('/').pop() }}</div>
          </div>
        </div>

        <div v-else-if="!error && visibleImages.length === 0" class="empty">
          这里还没有图片 🗂️
        </div>

        <div v-else-if="!error && visibleImages.length === 0" class="empty">
          这里还没有图片 🗂️
        </div>

        <TransitionGroup v-else name="fade" tag="div" class="grid">
          <div
            v-for="(img, index) in visibleImages"
            :key="img.path"
            class="card"
            @click="openLightbox(index)"
          >
            <img :src="img.url" :alt="img.name" loading="lazy" />
            <div class="card-overlay">
              <span class="card-name">{{ img.name }}</span>
            </div>
          </div>
        </TransitionGroup>
      </PasswordGate>
    </main>

    <Transition name="zoom">
      <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
        <button class="lb-close" @click="closeLightbox">✕</button>
        <button class="lb-nav lb-prev" @click.stop="prev">‹</button>
        <img
          v-if="currentImage"
          :src="currentImage.url"
          :alt="currentImage.name"
          class="lb-img"
        />
        <button class="lb-nav lb-next" @click.stop="next">›</button>
        <div v-if="currentImage" class="lb-caption">
          <span class="lb-name">{{ currentImage.name }}</span>
          <span class="lb-path">{{ currentImage.path }}</span>
        </div>
      </div>
    </Transition>

    <Footer />
  </div>
</template>