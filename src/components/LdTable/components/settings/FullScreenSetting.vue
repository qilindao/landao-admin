<template>
  <el-tooltip
    effect="dark"
    :content="isFullscreen ? '退出全屏' : '全屏'"
    placement="bottom"
  >
    <icon-svg
      size="1.3em"
      :name="isFullscreen ? 'icon-fullscreen-exit' : 'icon-fullscreen'"
      @click="toggle"
    ></icon-svg>
  </el-tooltip>
</template>
<script>
import { useFullscreen } from "@vueuse/core";
import { defineComponent } from "vue";
import { useTableContext } from "../../hooks/useTableContext";

export default defineComponent({
  name: "FullScreenSetting",
  setup() {
    const table = useTableContext();
    const { toggle, isFullscreen } = useFullscreen(table.wrapRef);
    return {
      toggle,
      isFullscreen,
    };
  },
});
</script>
