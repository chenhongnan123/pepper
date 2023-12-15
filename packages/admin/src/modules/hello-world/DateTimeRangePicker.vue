<template>
  <div>
    <h1>DateTimeRangePicker 带时间的日期选择器 <i>demo</i></h1>
    <!-- DateRangePicker:
    <DateRangePicker @getDateRange="getDateRange" />
    <br> -->
    DateTimeRangePicker:
    <DateTimeRangePicker
      v-model="dateValue"
      dense
      @getDateRange="getDateRange"
    />
    <br>
    value: {{ dateValue }}
    <br>
    <br>
    说明:
    <ul>
      <!-- <li>DateRangePicker: 原有的日期范围选择器，使用vuetify，无法精确时间</li> -->
      <li><b>DateTimeRangePicker: 日期选择器，使用element UI，可以精确到秒的日期范围选择</b></li>
      <li>
        <b>DateTimeRangePicker 示例使用:</b><br>
        <code>
          &#60;DateTimeRangePicker v-model="value" dense/&#62;
        </code>
        <br>
        <code>
          import DateTimeRangePicker from '@/components/commonUI/DateTimeRangePicker.vue';
        </code>
        <br>
        <code>export default { components: { DateTimeRangePicker } }</code>
        <br>
      </li>
    </ul>
  </div>
</template>

<script>
import DateRangePicker from '@/components/commonUI/DateRangePicker.vue';
import DateTimeRangePicker from '@/components/commonUI/DateTimeRangePicker.vue';

export default {
  name: 'HaHa',
  components: {
    DateRangePicker,
    DateTimeRangePicker,
  },
  data() {
    return {
      // dateValue: '',
      // dateValue: null,
      // dateValue: void 0,
      // dateValue: undefined,
      // dateValue: NaN,
      // dateValue: {},
      // dateValue: [],
      // dateValue: '2023-05-01T08:00:00Z',
      // dateValue: 1686292351000,
      // zzc: 建议使用这种方式：
      dateValue: [1686292321000, 1686292351000],
      // dateValue: 168629235.32123,
      // dateValue: [1686292351000],
      // dateValue: [new Date('2023-05-01'), new Date()],
      // dateValue: [new Date('2023-05-01'), 1686292351000],
      // dateValue: ['2023-05-01T08:00:00Z', '2023-06-01'],
      // dateValue: ['2023-05-01', '2023-06-01'],
      // dateValue: ['Fri Jun 01 2023 15:33:20 GMT+0800', 'Fri Jun 09 2023 15:33:20 GMT+0800'],
      // dateValue: [new Date().toString(), new Date().toString()],
    };
  },
  watch: {
    dateValue(val) {
      console.log('watch dateValue', val, typeof val);
    },
  },
  methods: {
    getDateRange(range) {
      console.log(range, 'getDateRange');
    },
  },
};
</script>
