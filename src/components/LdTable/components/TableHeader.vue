<template>
  <div class="flex1">
    <el-button
      v-if="buttons.includes('refresh')"
      size="small"
      @click="handleReload"
      >刷新</el-button
    >
    <el-button
      v-if="buttons.includes('refreshCurrent')"
      size="small"
      @click="handlerefreshCurrent"
      >刷新当前页</el-button
    >
    <template v-if="slots.toolbar">
      <slot name="toolbar"></slot>
    </template>
  </div>
  <div class="flex1"></div>
  <div class="ld-search-key">
    <el-form
      ref="filterFormRef"
      size="small"
      class="ld-search-key__form"
      v-if="showEasySearch"
      :inline="true"
    >
      <el-form-item prop="search_text">
        <el-input
          class="ld-search-key__input"
          v-model="filterData.search_text"
          placeholder="关键字搜索"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleEasySearch()">查询</el-button>
      </el-form-item>
    </el-form>
    <TableSetting
      :setting="tableSetting"
      v-if="showTableSetting"
      @columns-change="handleColumnChange"
    ></TableSetting>
  </div>
</template>
<script>
import { defineComponent, useSlots, reactive } from "vue";
import VueTypes from "vue-types";

import TableSetting from "./settings/index";

export default defineComponent({
  name: "TableHeader",
  components: {
    TableSetting,
  },
  props: {
    buttons: VueTypes.array.def([]), //["refresh", "add"]
    tableAction: VueTypes.object.def({}),
    tableSetting: VueTypes.object.def({
      size: false, //表格大小
      setting: false, //列设置
      fullScreen: false, //是否全屏
      search: false, //是否启用高级搜索
    }),
    showTableSetting: VueTypes.bool.def(false), //是否启用设置
    showEasySearch: VueTypes.bool.def(false), //简易搜索
  },
  emits: ["columns-change"],
  setup(props, { emit }) {
    const slots = useSlots();
    const filterData = reactive({ search_text: "" });
    const { tableAction } = props;

    //刷新返回第一页
    async function handleReload() {
      tableAction.setPaginationPage(1);
      await tableAction.reload({
        page: 1,
      });
    }

    //刷新当前页
    async function handlerefreshCurrent() {
      await tableAction.reload();
    }

    //设置表格列
    function handleColumnChange(data) {
      emit("columns-change", data);
    }

    //简易搜索
    async function handleEasySearch() {
       tableAction.setPaginationPage(1);
        await tableAction.reload({
          page: 1,
          ...filterData,
        });
    }
    return {
      slots,
      handleReload,
      handlerefreshCurrent,
      handleColumnChange,
      filterData,
      handleEasySearch,
    };
  },
});
</script>
