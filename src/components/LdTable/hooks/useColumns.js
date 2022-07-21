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
    ...(isFixedLeft ? { fixed: "left" } : {}),
    ...selectionColumnProps,
  });
}

export function useColumns(propsRef, getPaginationRef) {
  const columnsRef = ref(unref(propsRef).columns);

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

  //列配置columns
  function getColumns(opt) {
    const { ignoreIndex = false, ignoreSelection = false } = opt || {};
    let columns = toRaw(unref(getColumnsRef));
    //是否忽略索引
    if (ignoreIndex) {
      columns = columns.filter((item) => item.type !== "index");
    }
    //忽略多选框
    if (ignoreSelection) {
      columns = columns.filter((item) => item.type !== "selection");
    }
    return columns;
  }
  return {
    getColumnsRef,
    getColumns,
    getViewColumns,
  };
}
