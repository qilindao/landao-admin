import { unref } from "vue";

export function useTableEvents({ tableElRef }) {
  function setTableLayout() {
    return unref(tableElRef).doLayout();
  }
  return {
    setTableLayout,
  };
}
