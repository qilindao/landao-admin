<template>
  <div class="flex1">
    <el-button
      v-if="buttons.includes('refresh')"
      size="small"
      @click="handleReload"
      >刷新</el-button
    >
    <el-button
      v-if="buttons.includes('refreshCurrent')"
      size="small"
      @click="handlerefreshCurrent"
      >刷新当前页</el-button
    >
    <template v-if="slots.toolbar">
      <slot name="toolbar"></slot>
    </template>
  </div>
  <div class="flex1"></div>
  <div class="flex1"></div>
</template>
<script>
import { defineComponent, useSlots } from "vue";
import VueTypes from "vue-types";

export default defineComponent({
  name: "TableHeader",
  props: {
    buttons: VueTypes.array.def([]), //["refresh", "add"]
    tableAction: VueTypes.object.def({}),
  },
  setup(props) {
    const slots = useSlots();

    const { tableAction } = props;

    //刷新返回第一页
    async function handleReload() {
      tableAction.setPaginationPage(1);
      await tableAction.reload({
        page: 1,
      });
    }

    //刷新当前页
    async function handlerefreshCurrent() {
      await tableAction.reload();
    }
    
    return {
      slots,
      handleReload,
      handlerefreshCurrent,
    };
  },
});
</script>
