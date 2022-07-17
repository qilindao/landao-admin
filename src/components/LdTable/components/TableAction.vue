<template>
  <div>
    <template v-for="(action, index) in getActions" :key="index">
      <el-tooltip v-if="action.tooltop" v-bind="getTooltip(action)">
        <el-button v-bind="action">
          <icon-svg
            v-if="action.icon"
            :name="action.icon"
            :class="{ 'mr-1': !!action.label }"
          ></icon-svg>
          {{ action.label }}
        </el-button>
      </el-tooltip>
      <el-button v-else v-bind="action">
        <icon-svg
          v-if="action.icon"
          :name="action.icon"
          :class="{ 'mr-1': !!action.label }"
        ></icon-svg>
        {{ action.label }}
      </el-button>
    </template>
  </div>
</template>
<script>
import { defineComponent, computed, toRaw } from "vue";
import { usePermission } from "@/landao/hooks/dom/usePermission";
import { isBoolean, isFunction, isString } from "@/landao/utils/is";

export default defineComponent({
  name: "TableAction",
  props: {
    actions: {
      type: Array,
      default: [],
    },
    dropDownActions: {
      type: Array,
      default: [],
    },
    divider: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const { hasAuth } = usePermission();
    //控制按钮是否显示
    function isIfShow(action) {
      const ifShow = action.ifShow;
      let isIfShow = true;
      if (isBoolean(ifShow)) {
        isIfShow = ifShow;
      }
      if (isFunction(ifShow)) {
        isIfShow = ifShow(action);
      }
      return isIfShow;
    }
    //按钮
    const getActions = computed(() => {
      return (toRaw(props.actions) || [])
        .filter((action) => {
          return (
            (action.auth ? hasAuth(action.auth) : true) && isIfShow(action)
          );
        })
        .map((action) => {
          return {
            link: true,
            size: "small",
            type: "primary",
            ...action,
          };
        });
    });

    //Tooltip 文字提示
    function getTooltip(tooltip) {
      return {
        effect: "dark",
        placement: "bottom",
        ...(isString(tooltip) ? { content: tooltip } : tooltip),
      };
    }
    return { getActions, getTooltip };
  },
});
</script>
<style lang="scss" scoped>
.mr-1 {
  margin-right: 1px;
}
</style>
