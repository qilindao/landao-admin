<template>
  <div class="app-container">
    <LdTable ref="logTableRef" @register="register">
      <template #toolbar>
        <el-button
          type="danger"
          :disabled="getSelectedRowIds().length === 0"
          size="small"
          @click="handleDatchDel"
          >批量删除</el-button
        ></template
      >
      <template v-slot:operatorSlot="{ row }">
        <TableAction
          :actions="[
            {
              label: '删除',
              type: 'danger',
              auth: 'manage.log.destroy',
              onClick: handleDel.bind(null, row),
            },
          ]"
        ></TableAction>
      </template>
    </LdTable>
  </div>
</template>
<script>
import { LogService } from "@/service";
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import LogSchemas from "@/views/system/schemas/LogSchemas";
import { TableAction, useTable } from "@/components/LdTable";

export default {
  components: {
    TableAction,
  },
  setup() {
    const logTableRef = ref(null);

    //删除日志
    const handleDel = (row) => {
      ElMessageBox.confirm("此操作将永久删除选中数据，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          LogService.doDelete(row.log_id)
            .then((res) => {
              if (logTableRef) {
                logTableRef.value.refresh();
              }
            })
            .catch((err) => {
              ElMessage.error(err);
            });
        })
        .catch(() => {});
    };

    //表格配置和表单配置
    const { tableColumns } = LogSchemas();

    const [
      register,
      { getSelectedRowIds, reload, setPaginationPage, clearSelectedRowKeys },
    ] = useTable({
      api: LogService.getList,
      actionButtons: ["refresh", "refreshCurrent"],
      columns: tableColumns,
      rowKey: "log_id",
      showTableSetting: true,
      showEasySearch: true,
      tableSetting: {
        fullScreen: true,
      },
    });

    function handleDatchDel() {
      ElMessageBox.confirm("此操作将永久删除选中数据，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          LogService.doBatch(getSelectedRowIds())
            .then((res) => {
              if (res.code === 200) {
                setPaginationPage(1);
                clearSelectedRowKeys();
                reload();
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {});
    }

    return {
      handleDel,
      logTableRef,
      register,
      handleDatchDel,
      getSelectedRowIds,
    };
  },
};
</script>
