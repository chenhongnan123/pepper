<!-- 历史曲线弹窗 -->
<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'900px'"
    transition="dialog-transition"
  >
    <div
      class="
        bluecard-decoration-5
        overflow-y-auto
        overflow-x-hidden
        rounded-xl
        pa-6
      "
      style="
        background-color: #000000;
        min-height: 350px;
      "
      >
      <div
        v-for="i in 5"
        :key="i"
        :class="`rectangle-${i}`"
      ></div>
      <div class="d-flex align-end">
        <div style="font-size: 25px;">历史曲线</div>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false" icon large>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <!-- 标题分割线 -->
      <div class="d-flex align-center">
          <img
            :src="require('@/assets/icons/img/dialog-circle-big-dark.svg')"
            alt=""
            class="mr-2"
          />
          <img
            :src="require('@/assets/icons/img/dialog-circle-small-dark.svg')"
            alt=""
          />
          <v-divider></v-divider>
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
      </div>
      <div class="pt-2 d-flex align-center">
        <v-btn icon
          @click="changePrevPlotLines"
          style="position: relative;top: -10px"
        ><v-icon>mdi-menu-left-outline</v-icon></v-btn>
        <highcharts
        class="flex-grow-1"
        :options="options" theme="dark"></highcharts>
        <v-btn icon
          @click="changeNextPlotLines"
          style="position: relative;top: -10px"
        ><v-icon>mdi-menu-right-outline</v-icon></v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    options: {
      chart: {
        type: 'area',
        background: null,
        height: '300px',
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: [
          // '2023-01-01 00:00:00',
          // '2023-01-01 00:00:01',
        ],
        lineColor: 'rgb(28, 77, 144)',
        labels: {
          style: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 'bold',
            // fontSize: 12,
          },
        },
      },
      yAxis: {
        gridLineColor: 'rgba(28, 77, 144, 0.2)',
        tickPixelInterval: 40,
        lineColor: 'rgb(28, 77, 144)',
        lineWidth: 2,
        title: {
          text: '',
        },
        labels: {
          style: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 'bold',
            // fontSize: 12,
          },
        },
        plotLines: [
          // {
          //   color: 'red', // Color value
          //   dashStyle: 'longdashdot', // Style of the plot line. Default to solid
          //   value: 3, // Value of where the line will appear
          //   width: 2, // Width of the line
          // },
        ],
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, '#80ffff88'],
              [1, '#80ffff00'], // 这里就是设置渐变色的代码
            ],
          },
        },
      },
      series: [{
        data: [
          // 12,
          // 13,
          // 15,
        ],
        lineColor: '#80ffff',
        lineWidth: 1,
        marker: {
          fillColor: '#80ffff',
          radius: 0,
        },
      }],
    },
  }),

  computed: {
    dialog: {
      get() {
        return this.isShow;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
    alarmObj() {
      return this.$store.state.faultDiagnosis.alarmObj;
    },
  },

  methods: {
    ...mapActions('faultDiagnosis', [
      'getCurveData',
    ]),
    async init() {
      const payload = {
        relevanceParma: this.alarmObj?.relevanceParma || '',
        pointId: this.alarmObj?.pointId || '',
        // pointId: '1', // debug
      };
      await this.getCurveData(payload);
      // console.log(this.$store.state.faultDiagnosis.curveData, 'getCurveData');
      this.options.xAxis.categories = this.$store.state
        .faultDiagnosis.curveData?.historyValue?.xValue || [];
      this.options.series[0].data = this.$store.state
        .faultDiagnosis.curveData?.historyValue?.yValue || [];
      const taggerAlarmItem = this.$store.state.faultDiagnosis.curveData?.taggerAlarmItem || [];
      if (taggerAlarmItem.length) {
        this.index = 0;
        this.maxIndex = taggerAlarmItem.length - 1;
        const fristItem = taggerAlarmItem[0];
        this.options.yAxis.plotLines = [
          {
            color: 'red',
            dashStyle: 'solid',
            value: fristItem.upperLimit,
            width: 1,
          },
          {
            color: 'orange',
            dashStyle: 'LongDash',
            value: fristItem.earlyUpperLimit,
            width: 1,
          },
          {
            color: 'orange',
            dashStyle: 'LongDash',
            value: fristItem.earlyLowerLimit,
            width: 1,
          },
          {
            color: 'red',
            dashStyle: 'solid',
            value: fristItem.lowerLimit,
            width: 1,
          },
        ];
      }
    },
    changePrevPlotLines() {
      if (this.index === 0) {
        return;
      }
      this.index -= 1;
    },
    changeNextPlotLines() {
      if (this.index === this.maxIndex) {
        return;
      }
      this.index += 1;
    },
  },

  watch: {
    isShow(val) {
      if (val) {
        this.init();
      }
    },
    index(val) {
      const taggerAlarmItem = this.$store.state.faultDiagnosis.curveData?.taggerAlarmItem || [];
      if (taggerAlarmItem.length) {
        const item = taggerAlarmItem[val];
        this.options.yAxis.plotLines = [
          {
            color: 'red',
            dashStyle: 'solid',
            value: item.upperLimit,
            width: 1,
          },
          {
            color: 'orange',
            dashStyle: 'LongDash',
            value: item.earlyUpperLimit,
            width: 1,
          },
          {
            color: 'orange',
            dashStyle: 'LongDash',
            value: item.earlyLowerLimit,
            width: 1,
          },
          {
            color: 'red',
            dashStyle: 'solid',
            value: item.lowerLimit,
            width: 1,
          },
        ];
      }
    },
  },
};
</script>

<style>

</style>
