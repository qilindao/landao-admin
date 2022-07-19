export default function LogSchemas() {
  const tableColumns = [
    {
      label: "#",
      type: "selection",
      width: 55,
      align: "center",
    },
    {
      label: "用户名",
      width: 200,
      align: "center",
      prop: "manage_username",
    },
    {
      label: "请求地址",
      width: 200,
      align: "center",
      prop: "log_action",
      showOverflowTooltip: true,
    },
    {
      label: "请求参数",
      width: 200,
      align: "center",
      prop: "log_params",
      showOverflowTooltip: true,
    },
    {
      label: "请求IP",
      width: 200,
      align: "center",
      prop: "log_ip",
    },
    {
      label: "创建时间",
      width: 200,
      align: "center",
      prop: "created_at",
    },
    {
      label: "操作",
      width: 200,
      fixed: "right",
      align: "center",
      slot: "operatorSlot",
    },
  ];

  return {
    tableColumns,
  };
}
