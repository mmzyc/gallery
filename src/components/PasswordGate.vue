<script setup>
import { computed, ref, watch } from 'vue'
import { passwords } from '../config'

const props = defineProps({
  folder: { type: String, required: true },   // 当前文件夹路径
})

// 密码表：key 是文件夹路径，value 是 { password, hint }
// const passwords = {
//   'secret': { password: 'abc123', hint: '我的生日' },
  // 'private/photos': { password: 'xyz789', hint: '三个字母' },
  // 以后要加密码，只改这里
// }

// 会话内已解锁的文件夹
const input = ref('')
const error = ref('')

// 从当前文件夹向上找，第一个有密码配置的文件夹
const matchedFolder = computed(() => {
  const cur = props.folder || ''
  const parts = cur.split('/')
  for (let i = parts.length; i > 0; i--) {
    const path = parts.slice(0, i).join('/')
    if (passwords[path]) return path
  }
  return null
})

const config = computed(() =>
  matchedFolder.value ? passwords[matchedFolder.value] : null
)

const cookieTick = ref(0)

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}
function setCookie(name, value, hours) {
  if (hours === 0) {
    // session cookie：不写 expires，关浏览器后失效
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/`
    return
  }
  const expires = new Date()
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000)
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`
}
function cookieKey(folder) {
  return 'pwd_' + encodeURIComponent(folder)
}

const locked = computed(() => {
  cookieTick.value
  if (!config.value) return false
  return getCookie(cookieKey(matchedFolder.value)) !== '1'
})

function tryUnlock() {
  if (input.value === config.value.password) {
    setCookie(cookieKey(matchedFolder.value), '1', 1)   // 1 小时
    cookieTick.value++
    input.value = ''
    error.value = ''
  } else {
    error.value = '密码错误'
  }
}

defineExpose({ locked })

// 切换文件夹时清空输入和错误
watch(() => props.folder, () => {
  input.value = ''
  error.value = ''
})
</script>

<template>
  <div v-if="locked" class="gate">
    <div class="gate-icon">🔒</div>
    <h2 class="gate-title">需要密码</h2>
    <p class="gate-desc">该文件夹需要密码才能访问</p>
    <p v-if="config?.hint" class="gate-hint">提示：{{ config.hint }}</p>
    <form @submit.prevent="tryUnlock">
      <input
        v-model="input"
        type="text"
        class="gate-input"
        placeholder="请输入密码"
        autocomplete="current-password"
      />
      <button type="submit" class="gate-btn">解锁</button>
    </form>
    <p v-if="error" class="gate-error">{{ error }}</p>
  </div>

  <slot v-else />
</template>

<style scoped>
.gate {
  max-width: 440px;
  margin: 80px auto;
  padding: 40px 32px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.gate-icon { font-size: 56px; line-height: 1; margin-bottom: 20px; }

.gate-title {
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: 600;
  color: var(--text);
}

.gate-desc {
  margin: 0 0 18px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-dim);
}

.gate-hint {
  margin: 0 0 22px;
  font-size: 13px;
  color: var(--text-dim);
  font-style: italic;
}

.gate-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  color: var(--text);
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 10px;
  outline: none;
  margin-bottom: 12px;
}
.gate-input:focus { border-color: var(--accent); }

.gate-btn {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.gate-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.35);
}

.gate-error {
  margin: 14px 0 0;
  font-size: 13px;
  color: #f87171;
}
</style>