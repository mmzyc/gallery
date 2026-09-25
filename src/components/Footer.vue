<script setup>
const year = new Date().getFullYear()
import { config } from '../config';
</script>

<template>
  <footer class="footer">
    <p class="footer-text">
      By <a href="https://mjmm.top/" target="_blank">{{ config.author }}</a><br>
      © 2026-{{ year }} 棉の图床 · Powered by Vue + Vite
    </p>
  </footer>
</template>

<style>
/* 让 .app 成为撑满一屏的纵向 flex 容器 */
.app {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

/* 内容区撑开剩余空间，把 footer 挤到底部 */
.content {
  flex: 1;
  width: 100%;
}

.footer {
  max-width: 1200px;
  margin: 40px auto 0;
  padding: 20px 24px 32px;
  border-top: 1px solid var(--border);
  text-align: center;
  line-height: 1.5;
}

.footer-text,
.footer-text a {
  margin: 0;
  font-size: 13px;
  color: var(--text-dim);
  opacity: 0.75;
}

.footer-text a {
  text-underline-offset: 3.5px;
  font-weight: 600;
  transition: 0.3s;
}
.footer-text a:hover {
  color: rgb(50, 177, 255);
}

@media (max-width: 640px) {
  .footer { padding: 16px 16px 24px; }
}
</style>