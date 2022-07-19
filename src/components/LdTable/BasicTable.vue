<template>
  <div ref="wrapRef" class="ld-table clearfix">
    <el-row type="flex" class="ld-table-header">
      <TableHeader v-bind="getToolbarProps" :tableAction="tableAction">
        <template v-if="$slots.toolbar" #toolbar="{}">
          <slot name="toolbar"></slot>
        </template>
      </TableHeader>
    </el-row>
    <el-row type="flex" class="ld-table-body">
      <el-table
        ref="tableRef"
        :max-height="maxHeight"
        v-loading="getLoading"
        v-bind="getTableBindValues"
        :data="getDataSourceRef"
        @selection-change="handleSelectionChange"
      >
        <template v-for="column in getColumns" :key="column.prop">
          <TableColumns :column="column">
            <template v-if="column.slot" #default="scope">
              <slot :name="column.slot" v-bind="scope"></slot>
            </template>
          </TableColumns>
        </template>
        <template #empty>
          <ld-empty :description="emptyDesc" />
        </template>
      </el-table>
    </el-row>
    <el-row type="flex" v-if="pagination" class="ld-table-footer">
      <div class="flex1"></div>
      <el-pagination
        @size-change="handlePageSize"
        @current-change="handlePageCurrentChange"
        v-bind="getPaginationInfo"
      >
      </el-pagination>
    </el-row>
  </div>
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
import { useTableHeight } from "./hooks/useTableHeight";
import { useLoading } from "./hooks/useLoading";
import { usePagination } from "./hooks/usePagination";
import TableColumns from "./components/TableColumns";
import { useDataSource } from "./hooks/useDataSource";
import TableHeader from "./components/TableHeader";
import { useRowSelection } from "./hooks/useRowSelection";
import { createTableContext } from "./hooks/useTableContext";
import { useTableEvents } from "./hooks/useTableEvents";

export default defineComponent({
  name: "LdTable",
  props: basicProps,
  components: {
    TableColumns,
    TableHeader,
  },
  emits: ["register"],
  setup(props, { slots, attrs, emit, expose }) {
    //表格ref
    const tableRef = ref(null);
    const wrapRef = ref(null);
    //表格初始props，可用于hook合并
    const innerPropsRef = ref({});
    //表格头部刷新按钮,button,在hook调用的时候合并
    const toolbarPropsRef = ref({});
    //表格最大高度
    const { maxHeight, updateHeight } = useTableHeight(
      tableRef,
      props.deductHeight
    );

    //表格props
    const getProps = computed(() => {
      return { ...props, ...unref(innerPropsRef) };
    });

    //table列props
    const getColumns = computed(() => {
      return unref(getProps).columns;
    });

    //TableHeader props
    const getToolbarProps = computed(() => {
      const {
        actionButtons = [],
        showTableSetting = false,
        showEasySearch = false,
        tableSetting = {
          size: false, //表格大小
          setting: false, //列设置
          fullScreen: false, //是否全屏
          search: false, //是否启用高级搜索
        },
      } = props;
      const opt = {
        showTableSetting,
        tableSetting,
        showEasySearch,
        buttons: [...actionButtons],
      };
      return {
        ...opt,
        ...unref(toolbarPropsRef),
      };
    });

    //设置toolbar button 属性
    const setToolbarProps = (props) => {
      toolbarPropsRef.value = { ...unref(toolbarPropsRef), ...props };
    };

    //表格loading
    const { getLoading, setLoading } = useLoading(getProps);

    //分页
    const {
      getPaginationInfo,
      setPaginationPage,
      setPaginationPageSize,
      setPaginationTotal,
    } = usePagination(getProps);

    const getTableBindValues = computed(() => {
      let propsData = {
        ...attrs,
        ...unref(getProps),
      };
      return propsData;
    });

    const { getDataSourceRef, getDataSource, fetch, reload } = useDataSource(
      getProps,
      {
        setLoading,
        setPaginationTotal,
        getPaginationInfo,
      }
    );

    //分页
    const handlePageCurrentChange = async (val) => {
      setPaginationPage(val);
      await reload();
    };

    //设置一页显示数量
    const handlePageSize = async (val) => {
      setPaginationPageSize(val);
      await reload();
    };

    //设置表格props
    function setProps(props) {
      innerPropsRef.value = { ...unref(innerPropsRef), ...props };
    }

    //表格选中行事件
    const {
      setSelectedRow: handleSelectionChange,
      getSelectedRows,
      getSelectedRowIds,
      clearSelectedRowKeys,
    } = useRowSelection(tableRef, getProps);

    //表格方法
    const { setTableLayout } = useTableEvents({ tableRef });

    //操作函数
    const tableAction = {
      setPaginationPage,
      reload,
      fetch,
      setProps,
      setToolbarProps,
      getDataSource,
      getSelectedRows,
      getSelectedRowIds,
      clearSelectedRowKeys,
      setTableLayout,
    };

    expose(tableAction);

    emit("register", tableAction);

    //创建父组件对嵌套子组件数据提供
    createTableContext({ ...tableAction, wrapRef, getTableBindValues });

    onMounted(() => {
      nextTick(async () => {
        await updateHeight();
      });
    });

    return {
      tableRef,
      wrapRef,
      maxHeight,
      getLoading,
      getTableBindValues,
      getPaginationInfo,
      handlePageSize,
      handlePageCurrentChange,
      getColumns,
      getDataSourceRef,
      getToolbarProps,
      tableAction,
      handleSelectionChange,
    };
  },
});
</script>
<style lang="scss" scoped>
.ld-table {
  max-width: 100%;
  height: 100%;
  padding: 6px;
  background: #fff;
  &-body {
    padding: 10px 0;
  }
}
</style>
