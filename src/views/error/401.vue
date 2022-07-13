<template>
  <div class="app-result app-result-403">
    <div class="app-result-icon app-result-image">
      <icon-svg name="error-403" class="error-403"></icon-svg>
    </div>
    <div class="app-result-title">403</div>
    <div class="app-result-subtitle">抱歉，您无权访问此页面。</div>
    <div class="app-result-extra">
      <RouterLink
        :to="{ path: '/', replace: true }"
        class="el-button el-button--primary"
        >回到首页</RouterLink
      >
    </div>
  </div>
</template>
<style scoped>
.error-403 {
  width: 252px !important;
  height: 294px !important;
}
</style>
