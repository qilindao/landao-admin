<script>
import {  defineComponent } from "vue";
/**
 * 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引
 * 可用于渲染ui、编辑等操作
 */
export default defineComponent({
  name: "TableColumnCell",
  props: {
    text: [String, Number, Array, Object],
    row: Object,
    index: Number,
    customRender: Function,
    column: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    return () => {
      const { text, customRender, row, index, column } = props;
      return customRender({ text, row, index, column });
    };
  },
});
</script>
