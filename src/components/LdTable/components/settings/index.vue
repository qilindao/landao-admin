<template>
  <div class="table-setting">
    <SizeSetting
      v-if="getSetting.size"
      :getPopupContainer="getPopupContainer"
    ></SizeSetting>
    <ColumnSetting :getPopupContainer="getPopupContainer"></ColumnSetting>
    <!-- <FullScreenSetting
      class="setting-svg"
      v-if="getSetting.fullScreen"
      :getPopupContainer="getPopupContainer"
    ></FullScreenSetting> -->
  </div>
</template>
<script>
import { computed, defineComponent } from "vue";
// import FullScreenSetting from "./FullScreenSetting";
import SizeSetting from "./SizeSetting.vue";
import ColumnSetting from "./ColumnSetting.vue";
import { useTableContext } from "../../hooks/useTableContext";

export default defineComponent({
  name: "TableSetting",
  components: {
    // FullScreenSetting,
    SizeSetting,
    ColumnSetting,
  },
  props: {
    setting: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["columns-change"],
  setup(props, { emit }) {
    const table = useTableContext();

    const getSetting = computed(() => {
      return {
        size: false,
        setting: false,
        fullScreen: false,
        ...props.setting,
      };
    });

    //设置表格列显示隐藏
    function handleColumnChange(data) {
      emit("columns-change", data);
    }

    function getPopupContainer() {
      return table ? unref(table.wrapRef) : document.body;
    }

    return {
      getSetting,
      handleColumnChange,
      getPopupContainer,
    };
  },
});
</script>

<style lang="scss">
.table-setting {
  margin: 0 8px;
  & > * {
    margin-right: 12px;
  }
}
</style>
