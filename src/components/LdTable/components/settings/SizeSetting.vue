<template>
  <el-tooltip effect="dark" content="表格尺寸" placement="top">
    <el-dropdown trigger="click" @command="handleCommand">
      <icon-svg name="icon-column-height" size="24px" color="#000"></icon-svg>
      <template #dropdown>
        <el-dropdown-menu>
          <template v-for="(item, index) in sizeType" :key="index">
            <el-dropdown-item
              :command="item.value"
              :class="{ selected: selectedKeysRef === item.value }"
              >{{ item.label }}</el-dropdown-item
            >
          </template>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-tooltip>
</template>
<script>
import { defineComponent, ref } from "vue";
import { useTableContext } from "../../hooks/useTableContext";

export default defineComponent({
  name: "SizeSetting",
  setup() {
    const table = useTableContext();
    const selectedKeysRef = ref(table.getSize());
    const sizeType = ref([
      { value: "large", label: "宽松" },
      { value: "default", label: "默认" },
      { value: "small", label: "紧凑" },
    ]);

    function handleCommand(command) {
      selectedKeysRef.value = command;
      table.setProps({
        size: command,
      });
    }
    return {
      handleCommand,
      sizeType,
      selectedKeysRef,
    };
  },
});
</script>
<style lang="scss" scoped>
.el-dropdown-menu {
  ::v-deep(.selected) {
    background: var(--el-dropdown-menuItem-hover-fill);
    color: var(--el-dropdown-menuItem-hover-color);
  }
}
</style>
