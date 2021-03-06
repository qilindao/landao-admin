import { ref, unref, computed } from "vue";

export function useRowSelection(tableRef, propsRef) {
  //选中数据列表
  const selectedRowRef = ref([]);
  //是否选中数据
  const isSelectedRow = ref(false);

  /**
   * 表格key
   */
  const getRowKey = computed(() => {
    const { rowKey } = unref(propsRef);
    return rowKey ? rowKey : "id";
  });

  //获取选中行数据
  const getSelectedRows = () => {
    return unref(selectedRowRef) || [];
  };

  //设置选中行
  const setSelectedRow = (selectedRows) => {
    selectedRowRef.value = selectedRows || [];
    isSelectedRow.value = selectedRows.length > 0 ? true : false;
  };

  /**
   * 清除用户选中
   */
  const clearSelectedRowKeys = () => {
    selectedRowRef.value = [];
    isSelectedRow.value = false;
    //清除用户的选择，否则表格多选头部会呈现半选中
    unref(tableRef).clearSelection();
  };

  //获取选中数据id值
  const getSelectedRowIds = () => {
    const rows = unref(selectedRowRef);
    let ids = [];
    for (const key in rows) {
      ids.push(rows[key][unref(getRowKey)]);
    }
    return ids;
  };

  return {
    isSelectedRow,
    getSelectedRows,
    setSelectedRow,
    getSelectedRowIds,
    clearSelectedRowKeys,
  };
}
