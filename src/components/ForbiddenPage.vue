<script setup>
defineProps({
  folder: { type: String, required: true },
})
</script>

<template>
  <div class="forbidden">
    <div class="forbidden-code">403</div>
    <div class="forbidden-title">无权访问</div>
    <div class="forbidden-desc">
      <!-- <span class="forbidden-path">/{{ folder }}</span> -->
    </div>
    <div class="forbidden-hint">该文件夹不存在或你没有权限查看</div>
    <button type="button" class="back-btn" onclick="window.location.href='/'">点击返回主页</button>
  </div>
</template>

<style scoped>
.forbidden {
  padding: 100px 20px;
  text-align: center;
}

.forbidden-code {
  font-size: 80px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ef4444, #f97316);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.forbidden-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
}

.forbidden-desc {
  margin-bottom: 12px;
}

.forbidden-path {
  font-size: 13px;
  color: var(--text-dim);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  word-break: break-all;
}

.forbidden-hint {
  font-size: 13px;
  color: var(--text-dim);
  opacity: 0.7;
}

.back-btn {
  /* width: 100%; */
  display: inline-block;
  margin-top: 10px;
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