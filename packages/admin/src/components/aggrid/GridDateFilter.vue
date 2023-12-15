<template>
  <el-date-picker
    v-model="value1"
    type="datetimerange"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    align="right"
    value-format="yyyy/MM/dd hh:mm:ss"
    @change="submit"
    >
  </el-date-picker>
</template>

<script>
import { Button, DatePicker } from 'element-ui';

export default {
  data() {
    return {
      text1: '',
      text2: '',
      value1: '',
      filterText: '',
    };
  },
  components: {
    [DatePicker.name]: DatePicker,
    [Button.name]: DatePicker,
  },
  methods: {
    updateFilter() {
      this.filterText = 'test';
      this.params.filterChangedCallback();
      document.querySelector(`[aria-colindex="${this.params.colDef.index + 1}"] div[ref="eFloatingFilterBody"] input[ref="eInput"]`).value = this.text1;
    },
    getModel() {
      // console.log('setmodel');
      //   if (!this.isFilterActive()) {
      //     return null;
      //   }
      return { value: this.value1 };
    },
    // setModel(model) {
    //   // console.log(model, 'getmodel');
    //   this.filterText = 'test';
    // },
    doesFilterPass(params) {
      console.log(params, 'params');
    },
    submit(dateTime) {
      console.log(dateTime, 'dateTime');
      this.params.filterChangedCallback();
      document.querySelector(`[aria-colindex="${this.params.colDef.index + 1}"] div[ref="eFloatingFilterBody"] input[ref="eInput"]`).value = dateTime;
    },
  },
};
</script>
