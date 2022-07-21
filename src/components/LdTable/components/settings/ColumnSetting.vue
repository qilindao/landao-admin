<template>
  <el-popover placement="bottom-end" width="320px" trigger="click">
    <template #reference>
      <span>
        <el-tooltip effect="dark" content="列设置" placement="top">
          <IconSvg name="icon-setting" size="24px"></IconSvg>
        </el-tooltip>
      </span>
    </template>
    <el-scrollbar height="280px" class="table-column-setting">
      <el-checkbox-group
        v-model="checkedList"
        ref="columnListRef"
        @change="handleChange"
      >
        <template v-for="item in plainOptions" :key="item.value">
          <div
            class="table-column-setting__check-item"
            v-if="!('ifShow' in item && !item.ifShow)"
          >
            <el-checkbox :label="item.value">{{ item.label }}</el-checkbox>
            <span
              class="table-column-setting__fixed-left"
              :class="[{ active: item.fixed === 'left' }]"
              @click="handleColumnFixed(item, 'left')"
            >
              <el-tooltip
                effect="dark"
                content="固定到左侧"
                placement="bottom-end"
              >
                <IconSvg name="icon-arrow-align-left"></IconSvg>
              </el-tooltip>
            </span>
            <el-divider direction="vertical" />
            <span
              class="table-column-setting__fixed-right"
              :class="[{ active: item.fixed === 'right' }]"
              @click="handleColumnFixed(item, 'right')"
            >
              <el-tooltip
                effect="dark"
                content="固定到右侧"
                placement="bottom-end"
              >
                <IconSvg name="icon-arrow-align-left"></IconSvg
              ></el-tooltip>
            </span>
          </div>
        </template>
      </el-checkbox-group>
    </el-scrollbar>
  </el-popover>
</template>
<script>
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  unref,
  watchEffect,
} from "vue";
import { useTableContext } from "../../hooks/useTableContext";

export default defineComponent({
  setup() {
    const table = useTableContext();
    const columnListRef = ref(null);
    const plainOptions = ref([]);
    const plainSortOptions = ref([]);

    const state = reactive({
      isInit: true, //加载
      checkedList: [], //已选中
    });
    //某列的选中和取消选中
    function handleChange(checkedList = []) {
      const sortList = unref(plainSortOptions).map((item) => item.value);
      checkedList.sort((prev, next) => {
        return sortList.indexOf(prev) - sortList.indexOf(next);
      });
      setColumns(checkedList);
    }

    //重新获取表格列表配置
    function getColumns() {
      const ret = [];
      table
        .getColumns({
          ignoreIndex: true,
          ignoreSelection: true,
          ignoreOperatorAction: true,
        })
        .forEach((item) => {
          const { label, prop } = item;
          ret.push({
            label,
            value: prop || label,
            fixed: item.fixed || false,
          });
        });
      return ret;
    }

    //初始化columns 和 checkedList
    function init() {
      const columns = getColumns();
      const checkList = table
        .getColumns({
          ignoreIndex: true,
          ignoreSelection: true,
          ignoreOperatorAction: true,
        })
        .map((item) => {
          return item.prop || item.label;
        })
        .filter(Boolean);
      if (!plainOptions.value.length) {
        plainOptions.value = columns;
        plainSortOptions.value = columns;
      } else {
        unref(plainOptions).forEach((item) => {
          const findItem = columns.find((column) => column.prop === item.prop);
          if (findItem) {
            item.fixed = findItem.fixed;
          }
        });
      }
      state.isInit = true;
      state.checkedList = checkList;
    }

    watchEffect(() => {
      setTimeout(() => {
        const columns = table.getColumns();
        if (columns.length && state.isInit) {
          init();
        }
      }, 0);
    });

    //设置列显示隐藏
    function setColumns(columns = []) {
      table.setColumns(columns);
    }
    //设置固定位置
    function handleColumnFixed(column, fixed) {
      if (!state.checkedList.includes(column.value)) return;
      table.setColumnFixed(column, fixed);
      const columns = getColumns();
      const isFixed = column.fixed === fixed ? false : fixed;
      const index = columns.findIndex((col) => col.prop === column.value);
      if (index !== -1) {
        columns[index].fixed = isFixed;
      }
      plainOptions.value = columns;
    }

    return {
      ...toRefs(state),
      plainOptions,
      columnListRef,
      handleChange,
      handleColumnFixed,
    };
  },
});
</script>
<style lang="scss" scoped>
.table-column-setting {
  &__check-item {
    display: flex;
    align-items: center;
    min-width: 100%;
    padding: 4px 0;

    ::v-deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
      color: var(--el-checkbox-text-color);
    }

    ::v-deep(.el-checkbox) {
      width: 100%;
      &:hover {
        color: var(--el-color-primary);
      }
    }
    ::v-deep(.el-divider) {
      font-size: 16px;
    }
  }
  &__fixed-left,
  &__fixed-right {
    color: rgb(0 0 0 / 45%);
    cursor: pointer;
    display: inline-flex;
    &.active,
    &:hover {
      color: var(--el-color-primary);
    }

    &.disabled {
      color: var(--el-color-info-light-7);
      cursor: not-allowed;
    }
    svg {
      font-size: 16px;
    }
  }

  &__fixed-right {
    transform: rotate(180deg);
  }
}
</style>
