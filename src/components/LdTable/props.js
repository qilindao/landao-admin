import VueTypes from "vue-types";

export const basicProps = {
    api: VueTypes.func.def(null),//接口api
    size: VueTypes.oneOf(['', 'large', 'default', 'small']).def('default'),//表格尺寸
    columns: VueTypes.array.def([]),//表格列
    pagination: VueTypes.bool.def(true),//是否显示分页
    paginationProps: VueTypes.object.def({}),//分页配置
}