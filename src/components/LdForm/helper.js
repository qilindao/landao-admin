import { isFunction, isNumber } from "lodash-es";
import { unref } from "vue";

/**
 * 生成 placeholder
 * @param {String} component  组件名称
 * @returns 
 */
export function createPlaceholderMessage(component) {
    if (component.includes('Input')) {
        return "请输入"
    }
    if (component.includes('DatePicker')) {
        return '请选择日期'
    }
    if (component.includes('TimeSelect') || component.includes('TimePicker')) {
        return '请选择时间'
    }
    if (component.includes('Select') || component.includes('Cascader')) {
        return "请选择"
    }
    return "";
}

export function handleInputNumberValue(component, val) {
    if (!component) return val
    if (['Input'].includes(component)) {
        return val && isNumber(val) ? `${val}` : val
    }
    return val
}

