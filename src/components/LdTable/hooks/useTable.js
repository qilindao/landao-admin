import { ref, unref, onUnmounted, watch, toRaw } from "vue";
import { getDynamicProps } from "@/landao/utils";

export function useTable(tableProps) {
  const tableRef = ref(null);
  const loadedRef = ref(null);

  let stopWatch;

  function register(instance) {
    onUnmounted(() => {
      tableRef.value = null;
      loadedRef.value = null;
    });
    if (unref(loadedRef) && instance === unref(tableRef)) return;
    tableRef.value = instance;
    if (tableRef) {
      //设置表格props
      instance.setProps(getDynamicProps(tableProps));
      //设置表格头部刷新按钮
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
      } = tableProps;
      instance.setToolbarProps({
        showTableSetting,
        tableSetting,
        showEasySearch,
        buttons: [...actionButtons],
      });
    }
    loadedRef.value = true;

    stopWatch?.();

    stopWatch = watch(
      () => tableProps,
      () => {
        tableProps && instance.setProps(getDynamicProps(tableProps));
      },
      {
        immediate: true,
        deep: true,
      }
    );
  }

  function getTableInstance() {
    const table = unref(tableRef);
    if (!table) {
      throw console.error("Table 实例未创建，请确保 Table 实例已创建。");
    }
    console.log(tableRef);
    return table;
  }

  const methods = {
    //请求数据
    reload: async (params) => {
      return await getTableInstance().reload(params);
    },
    //设置表格props
    setProps: (props) => {
      getTableInstance().setProps(props);
    },
    //设置表格 loading
    setLoading: (loading) => {
      getTableInstance().setLoading(loading);
    },
    //获取数据
    getDataSource: () => {
      return getTableInstance().getDataSource();
    },
    //获取列表props
    getColumns: () => {
      const columns = getTableInstance().getColumns() || [];
      return toRaw(columns);
    },
    //设置页码
    setPaginationPage: (page) => {
      return getTableInstance().setPaginationPage(page);
    },
    //清除用户选中
    clearSelectedRowKeys: () => {
      getTableInstance().clearSelectedRowKeys();
    },
    //对 Table 进行重新布局。 当表格可见性变化时，您可能需要调用此方法以获得正确的布局
    setTableLayout: () => {
      getTableInstance().setTableLayout();
    },
    //表格多选，选中列
    getSelectedRows: () => {
      return getTableInstance().getSelectedRows();
    },
    //表格选中的id
    getSelectedRowIds: () => {
      return getTableInstance().getSelectedRowIds();
    },
  };

  return [register, methods];
}
