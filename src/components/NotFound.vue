<script setup>
defineProps({
  path: { type: String, required: true },
})
</script>

<template>
  <div class="not-found">
    <div class="not-found-code">404</div>
    <div class="not-found-title">文件夹不存在</div>
    <!-- <div class="not-found-path">/{{ path }}</div> -->
    <button type="button" class="back-btn" onclick="window.location.href='/'">点击返回主页</button>
  </div>
</template>

<style scoped>
.not-found {
  padding: 100px 20px;
  text-align: center;
}
.not-found-code {
  font-size: 80px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 16px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.not-found-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 10px;
}
.not-found-path {
  font-size: 13px;
  color: var(--text-dim);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  word-break: break-all;
}

.back-btn {
  /* width: 100%; */
  display: inline-block;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 500;
  color: #649ee9;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.back-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.35);
  color: pink;
}
</style>