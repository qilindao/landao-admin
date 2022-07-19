<template>
  <div class="app-toolbar">
    <el-tooltip
      class="box-item"
      effect="dark"
      :content="getTitle"
      placement="bottom"
    >
      <icon-svg
        size="26px"
        :name="isFullscreen ? 'icon-fullscreen-exit' : 'icon-fullscreen'"
        @click="toggle"
      ></icon-svg>
    </el-tooltip>
  </div>
</template>
<script>
import { defineComponent, computed, unref } from "vue";
import { useFullscreen } from "@vueuse/core";

export default defineComponent({
  name: "Toolbar",
  setup() {
    //全屏操作
    const { toggle, isFullscreen } = useFullscreen();
    const getTitle = computed(() => {
      return unref(isFullscreen) ? "退出全屏" : "全屏";
    });
    return {
      toggle,
      isFullscreen,
      getTitle,
    };
  },
});
</script>
<style lang="scss" scoped>
.app-toolbar {
  padding: 0 16px;
}
</style>
