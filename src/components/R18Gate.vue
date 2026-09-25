<script setup>
import { computed, ref, watch } from 'vue'
import { r18Folders } from '../config'

const props = defineProps({
  folder: { type: String, required: true },
})

// 打上 r18 标签的文件夹路径
// const r18Folders = [
//     'r18',
//     'private/photos'
// ]

const isR18 = computed(() => r18Folders.includes(props.folder))

// ---- cookie ----
function getCookie(name) {
  const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return m ? decodeURIComponent(m[2]) : null
}
function setCookie(name, value, hours) {
  const expires = new Date()
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000)
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`
}

const consent = ref(false)
const show = computed(() => isR18.value && !consent.value)

// 切到 r18 文件夹时读取 cookie
watch(() => props.folder, () => {
  consent.value = getCookie('r18_consent') === '1'
}, { immediate: true })

function confirm() {
  setCookie('r18_consent', '1', 1)   // 1 小时
  consent.value = true
}

function exit() {
  if (window.history.length > 1) window.history.back()
  else alert('没有上一页可返回，请手动关闭此标签页。')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="r18-fade">
      <div v-if="show" class="r18-overlay" @click.self="exit">
        <div class="r18-box">
          <div class="r18-title">内容警告</div>
          <div class="r18-desc">
            你正在访问的页面包含 <strong>R18</strong> 内容，<br />
            请确认你已年满 <strong>18</strong> 周岁。
          </div>
          <div class="r18-actions">
            <button class="r18-btn r18-confirm" @click="confirm">我保證我已滿18歲！確定進入！</button>
            <button class="r18-btn r18-exit" @click="exit">退出</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.r18-overlay {
    position: fixed;
    inset: 0;
    z-index: 999999;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.72);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 20px;
}

.r18-box {
    width: min(440px, 100%);
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 40px 36px 32px;
    text-align: center;
    color: var(--text);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
    animation: r18SlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.r18-box.closing {
    animation: r18SlideDown 0.3s ease forwards;
}
@keyframes r18SlideUp {
    from { opacity: 0; transform: scale(0.92) translateY(30px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes r18SlideDown {
    from { opacity: 1; transform: scale(1) translateY(0); }
    to   { opacity: 0; transform: scale(0.95) translateY(20px); }
}

.r18-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 6px;
    background: linear-gradient(135deg, #ff6b6b, #ff8e53);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
}

.r18-desc {
    font-size: 15px;
    line-height: 1.7;
    margin: 12px 0 28px;
    color: var(--text-dim);
}
.r18-desc strong {
    color: #ff6b6b;
    -webkit-text-fill-color: #ff6b6b;
}

.r18-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
}

.r18-btn {
    padding: 12px 32px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 120px;
    font-family: inherit;
}
.r18-btn:active { transform: scale(0.96); }

.r18-confirm {
    background: linear-gradient(135deg, rgb(255, 141, 65), rgb(255, 146, 57));
    color: #fff;
    box-shadow: 0 4px 20px rgba(255, 208, 107, 0.35);
}
.r18-confirm:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(255, 208, 107, 0.45);
}

.r18-exit {
    background: var(--bg-soft);
    color: var(--text-dim);
    border: 1px solid var(--border);
}
.r18-exit:hover {
    background: var(--bg);
    color: var(--text);
}

@media (max-width: 500px) {
    .r18-box { padding: 32px 20px 24px; }
    .r18-title { font-size: 20px; }
    .r18-desc { font-size: 14px; margin-bottom: 22px; }
    .r18-btn { padding: 10px 24px; font-size: 15px; min-width: 100px; flex: 1 1 auto; }
}
@media (max-width: 380px) {
    .r18-box { padding: 24px 16px 20px; }
    .r18-btn { padding: 10px 16px; font-size: 14px; min-width: 80px; }
}
</style>