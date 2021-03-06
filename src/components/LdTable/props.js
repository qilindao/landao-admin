import VueTypes from "vue-types";

export const basicProps = {
  api: {
    type: Function,
    default: null,
  }, //接口api
  actionButtons: VueTypes.array.def([]), //顶部操作按钮
  size: VueTypes.oneOf(["large", "default", "small"]).def("small"), //表格尺寸
  columns: VueTypes.array.def([]), //表格列
  pagination: VueTypes.bool.def(true), //是否显示分页
  paginationProps: VueTypes.object.def({}), //分页配置
  emptyDesc: VueTypes.string.def("暂无数据"), //数据为空提示
  deductHeight: VueTypes.number.def(15), //表格默认要扣除的高度
  rowKey: VueTypes.string.def(""), //表格数据pk
  afterFetch: {
    //请求之后对返回值进行处理
    type: Function,
    default: null,
  },
  border: VueTypes.bool.def(true), //是否显示边框
  stripe: VueTypes.bool.def(true), //是否显示斑马线
  headerCellStyle: VueTypes.object.def({
    background: "#f5f7fa",
    color: "#606266",
  }), //表头样式
  //表头右侧设置
  showTableSetting: VueTypes.bool.def(false),
  showEasySearch: VueTypes.bool.def(false),
  tableSetting: VueTypes.object.def({
    size: false, //表格大小
    setting: false, //列设置
    fullScreen: false, //是否全屏
    search: false, //是否启用高级搜索
  }),
  isTreeTable: VueTypes.bool.def(false), //是否树形表格
  showIndexColumn: VueTypes.bool.def(false), //是否显示序号,默认不显示。要显示，请开启或在columns中配置
  indexColumnProps: VueTypes.object.def(null), //序号列属性
  showSelectionColumn: VueTypes.bool.def(false), //是否显示多选框
  selectionColumnProps: VueTypes.object.def(null), //多选框属性
  rightOperatorActionName: VueTypes.string.def("operatorAction"), //右侧操作条prop名
};
