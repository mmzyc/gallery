import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'gallery-theme'
const saved = localStorage.getItem(STORAGE_KEY)
// const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
// const theme = ref(saved || (prefersLight ? 'light' : 'dark'))
const theme = ref(saved || 'light')

watchEffect(() => {
  document.documentElement.dataset.theme = theme.value
  localStorage.setItem(STORAGE_KEY, theme.value)
})

export function useTheme() {
  return {
    theme,
    toggle: () => {
      theme.value = theme.value === 'dark' ? 'light' : 'dark'
    },
  }
}