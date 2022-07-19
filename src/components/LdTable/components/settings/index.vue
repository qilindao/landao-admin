<template>
  <div class="table-setting">
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
import { useTableContext } from "../../hooks/useTableContext";

export default defineComponent({
  name: "TableSetting",
  components: {
    // FullScreenSetting,
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

<style lang="scss" scoped>
.table-setting {
  margin:0 8px;
  & > * {
    margin-right: 12px;
  }

  .setting-svg {
    width: 1.3em !important;
    height: 1.3em !important;
  }
}
</style>
