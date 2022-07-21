import { cloneDeep, isBoolean, isFunction } from "lodash-es";
import { ref, unref, computed, watch, toRaw } from "vue";

/**
 * 序号索引
 * @param {*} propsRef
 * @param {*} columns
 */
function handleIndexColumn(propsRef, columns, getPaginationRef) {
  const { showIndexColumn, indexColumnProps, pagination, isTreeTable } =
    unref(propsRef);
  let pushIndexColumns = false;
  if (unref(isTreeTable)) {
    return;
  }
  columns.forEach(() => {
    const indx = columns.findIndex((column) => column.type === "index");
    if (showIndexColumn) {
      pushIndexColumns = indx === -1;
    } else if (!showIndexColumn && indx !== -1) {
      columns.splice(indx, 1);
    }
  });

  if (!pushIndexColumns) return;
  const isFixedLeft = columns.some((item) => item.fixed === "left");
  const indx = columns.findIndex((column) => column.type === "selection");
  const colums = {
    type: "index",
    width: 50,
    label: "序号",
    align: "center",
    visible: true,
    customRender: ({ index }) => {
      if (!pagination) {
        return `${index + 1}`;
      }
      //有分页按页码和页条显示有序序号
      const { pageSize = 20, currentPage = 1 } = unref(getPaginationRef);
      return ((currentPage < 1 ? 1 : currentPage) - 1) * pageSize + index + 1;
    },
    ...(isFixedLeft ? { fixed: "left" } : {}),
    ...indexColumnProps,
  };
  if (indx !== -1) {
    columns.splice(indx + 1, 0, colums);
  } else {
    columns.unshift(colums);
  }
}

/**
 * 是否启用多选
 * @returns
 */
function handleSelectionColumn(propsRef, columns) {
  const { showSelectionColumn, selectionColumnProps, isTreeTable } =
    unref(propsRef);
  let pushSelectionColumns = false;
  if (unref(isTreeTable)) {
    return;
  }
  columns.forEach(() => {
    const indx = columns.findIndex((column) => column.type === "selection");
    if (showSelectionColumn) {
      pushSelectionColumns = indx === -1;
    } else if (!showSelectionColumn && indx !== -1) {
      columns.splice(indx, 1);
    }
  });

  if (!pushSelectionColumns) return;
  const isFixedLeft = columns.some((item) => item.fixed === "left");

  columns.unshift({
    type: "selection",
    width: 50,
    label: "selection",
    align: "center",
    visible: true,
    ...(isFixedLeft ? { fixed: "left" } : {}),
    ...selectionColumnProps,
  });
}

export function useColumns(propsRef, getPaginationRef) {
  const columnsRef = ref(unref(propsRef).columns);
  // let cacheColumns = unref(propsRef).columns;

  //右侧操作列prop名
  const { rightOperatorActionName = "operatorAction" } = unref(propsRef);

  const getColumnsRef = computed(() => {
    const columns = cloneDeep(unref(columnsRef));
    handleSelectionColumn(propsRef, columns);
    handleIndexColumn(propsRef, columns, getPaginationRef);
    if (!columns) {
      return [];
    }
    return columns;
  });

  watch(
    () => unref(propsRef).columns,
    (columns) => {
      columnsRef.value = columns;
      // cacheColumns = columns.filter((item) => !item.type) ?? [];
    }
  );

  //业务控制是否显示columns
  function isIfShow(column) {
    const ifShow = column.ifShow;

    let isIfShow = true;

    if (isBoolean(ifShow)) {
      isIfShow = ifShow;
    }
    if (isFunction(ifShow)) {
      isIfShow = ifShow(column);
    }
    return isIfShow;
  }

  //视图渲染columns
  const getViewColumns = computed(() => {
    const viewColumns = unref(getColumnsRef);
    const columns = cloneDeep(viewColumns);
    return columns.filter((column) => {
      return isIfShow(column);
    });
  });

  // function setColumns(columnList = []) {
  //   const columns = cloneDeep(columnList);
  //   if (!isArray(columns)) return;
  //   if (columns.length <= 0) {
  //     columnsRef.value = [];
  //     return;
  //   }
  //   const firstColumn = columns[0];
  //   if (!isString(firstColumn) && !isArray(firstColumn)) {
  //     columnsRef.value = columns;
  //   } else {
  //     const columnKeys = columns.map((m) => m.toString());
  //     const newColumns = [];
  //     cacheColumns.forEach((item) => {
  //       newColumns.push({
  //         ...item,
  //         visible: columnKeys.includes(item.prop.toString()),
  //       });
  //     });
  //     columnsRef.value = newColumns;
  //   }
  // }

  //列配置columns
  function getColumns(opt) {
    const {
      ignoreIndex = false,
      ignoreSelection = false,
      ignoreOperatorAction = false,
    } = opt || {};
    let columns = toRaw(unref(getColumnsRef));
    //是否忽略序号列
    if (ignoreIndex) {
      columns = columns.filter((item) => item.type !== "index");
    }
    //忽略多选框列
    if (ignoreSelection) {
      columns = columns.filter((item) => item.type !== "selection");
    }
    //过滤掉操作列
    if (ignoreOperatorAction) {
      columns = columns.filter((item) => item.prop !== rightOperatorActionName);
    }
    return columns;
  }

  //设置固定位置
  function setColumnFixed(column, fixed) {
    const isFixed = column.fixed === fixed ? false : fixed;
    const index = unref(columnsRef).findIndex(
      (col) => col.prop === column.value
    );
    if (index !== -1) {
      unref(columnsRef)[index].fixed = isFixed;
      if (isFixed && !unref(columnsRef)[index].width) {
        unref(columnsRef)[index].width = 100;
      }
    }
  }

  //设置列表的显示隐藏
  function setColumnVisible(column, visible) {
    const index = unref(columnsRef).findIndex(
      (col) => col.prop === column.value
    );
    if (index !== -1) {
      unref(columnsRef)[index].visible = visible;
    }
  }

  return {
    getColumnsRef,
    getColumns,
    getViewColumns,
    setColumnFixed,
    setColumnVisible,
  };
}
