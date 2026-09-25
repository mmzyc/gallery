import { ref } from 'vue'

export function useGitHubImages({ owner, repo, branch = 'main', cdnPrefix }) {
  const images = ref([])
  const loading = ref(false)
  const error = ref('')

  const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif']

  async function load() {
    loading.value = true
    error.value = ''
    try {
      const api = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
      const res = await fetch(api)
      if (!res.ok) throw new Error(`GitHub API 请求失败（${res.status}）`)
      const data = await res.json()

      images.value = (data.tree || [])
        .filter(i => i.type === 'blob')
        .filter(i => IMAGE_EXT.includes(i.path.split('.').pop().toLowerCase()))
        .map(i => {
          const segs = i.path.split('/')
          const name = segs.pop()
          const folder = segs.join('/')
          return {
            path: i.path,
            name,
            folder,
            url: cdnPrefix + i.path,
          }
        })
        .sort((a, b) => a.path.localeCompare(b.path))
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { images, loading, error, load }
}