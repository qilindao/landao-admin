<template>
  <el-row type="flex"> </el-row>
  <el-row type="flex">
    <el-table ref="tableRef" :max-height="maxHeight">
      <template v-for="column in columns" :key="column.prop">
        <el-table-column
          :label="column.label"
          :fixed="column.fixed || false"
          :align="column.align || 'left'"
        >
          <template #default="scope">
            <slot :name="column.prop" :scopeData="scope.row"></slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </el-row>
  <el-row type="flex" v-if="isPagination">
    <div class="flex1"></div>
    <el-pagination
      @size-change="handleSize"
      @current-change="handleCurrentChange"
      v-bind="getPaginationProps"
    >
    </el-pagination>
  </el-row>
</template>
<script>
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  ref,
  unref,
} from "vue";
import { basicProps } from "./props";

export default defineComponent({
  name: "LdTable",
  props: basicProps,
  setup(props) {
    const tableRef = ref(null);
    //总数
    const total = ref(0);
    //表格最大高度
    const maxHeight = ref(0);
    //分页
    const paginationRef = reactive({ page: 1, page_size: 20 });
    //分页配置
    const getPaginationProps = computed(() => {
      const { page, page_size } = paginationRef;
      const defOptions = {
        background: true,
        small: true,
        currentPage: page,
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: page_size,
        layout: "total, sizes, prev, pager, next, jumper",
        total: unref(total),
      };
      return { ...defOptions, ...props.paginationProps };
    });
    //更新表格高度
    async function updateHeight() {
      const vm = unref(tableRef);
      let element = null;

      if (vm) {
        let _h = 15;

        // 获取表格上一级元素
        element = vm.$parent.$el;
        // 获取表格上的高度
        _h += element.offsetTop;
        //TODO：实际上，此处要获取紧跟底部的多个兄弟节点，并累加底部兄弟节点的可视高度
        //获取表格下的dom
        let nextEl = element.nextElementSibling;
        //dom存在，就获取高度
        if (nextEl) {
          _h += nextEl.clientHeight + 5;
        }
        maxHeight.value = element.offsetParent.clientHeight - _h;
      }
    }

    const getColumnProps = computed(() => {});

    //分页
    const handleCurrentChange = (val) => {
      pagination.page = val;
    };

    //设置一页显示数量
    const handleSize = (val) => {
      pagination.page_size = val;
    };

    onMounted(() => {
      nextTick(async () => {
        await updateHeight();
      });
    });
    return {
      tableRef,
      maxHeight,
      getPaginationProps,
      handleSize,
      handleCurrentChange,
    };
  },
});
</script>
