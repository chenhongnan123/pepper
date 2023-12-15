<template>
    <div :style="`height: ${healthTrendHeight}px;`">
      <highcharts
        class="mt-2"
        ref="healthscorechart"
        :options="options"
        id="healthTrendChart"
      ></highcharts>
    </div>
  </template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import moment from 'moment';
// 引入highcharts组件
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';

export default {
  name: 'healthTrendChart',
  components: {
    highcharts: Chart,
  },
  data() {
    return {
      moment,
      options: {
        chart: {
          polar: false,
          height: 200, // 默认高度
          type: 'spline', // 折线图
        },
      }, // 控制图配置
    };
  },
  props: {
    healthTrendHeight: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('statePrediction', ['monthScoreList']),
    chartHeight() {
      return this.healthTrendHeight - 16;
    },
    scoreData() {
      const list = this.monthScoreList.map((item) => {
        const obj = {
          date: item.recordTime,
          status: item.healthScore,
          score: item.healthScore,
        };
        return obj;
      });
      return list;
    },
    xAxis() {
      return this.scoreData.map((item) => moment(item.date).format('MM-DD'));
    },
    yAxis() {
      return this.scoreData.map((item) => item.score);
    },
  },
  created() {
  },
  mounted() {
  },
  watch: {
    scoreData: {
      handler() {
        // 初始化控制图配置
        // this.options = this.getOriginOptions();
        // setTimeout(() => {
        // 加载通用的参数配置
        // Highcharts.setOptions(this.options);
        Highcharts.chart('healthTrendChart', this.getOriginOptions());
        // }, 500);
      },
      immediate: false,
    },
  },
  // beforeDestroy() {
  // this.$store.commit('statePrediction/setMonthScoreList', []);
  // },
  methods: {
    ...mapActions('statePrediction', []),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    // 图表初始统一配置项
    getOriginOptions() {
      const options = {
        chart: {
          polar: false,
          height: this.chartHeight,
          width: null,
          type: 'spline', // 默认折线图
          margin: undefined, // 设置内边距，上右下左
          backgroundColor: 'transparent',
        },
        credits: {
          enabled: false,
        }, // 不显示highcharts链接
        title: {
          text: '', // 不设置title会有默认标题
        },
        legend: {
          enabled: false, // 隐藏图例
        },
        plotOptions: {
          series: {
          },
        },
        tooltip: {
          enabled: true,
          formatter: null, // 默认为空，以防影响其他图表提示框内容
        },
        yAxis: {
          title: {
            text: '',
          }, // 不设置title会有默认标题
          opposite: false,
          labels: {
            enabled: true,
            style: {
              color: 'rgba(242,242,242,0.80)',
              fontSize: '16px',
            },
          }, // 纵坐标标签自定义，默认启用
          tickAmount: 5, // y轴坐标点个数
          max: 100,
          min: 0,
          gridLineColor: 'transparent', // y轴网格线颜色
          minorGridLineColor: 'rgba(242,242,242,0.80)',
          plotBands: [
            {
              color: 'transparent',
              from: 0,
              to: 12.5, // 故障
              label: {
                text: this.$t('repairSuggestionDetail.label.fault'),
                align: 'left',
                y: 15,
                style: {
                  color: 'rgba(242,242,242,0.80)',
                  fontSize: '16px',
                },
              },
            },
            {
              color: 'rgba(242,242,242,0.10)',
              from: 12.5,
              to: 37.5, // 预警
              label: {
                text: this.$t('repairSuggestionDetail.label.earlyWarning'),
                align: 'left',
                y: 2.5,
                style: {
                  color: 'rgba(242,242,242,0.80)',
                  fontSize: '16px',
                },
              },
            },
            {
              color: 'transparent',
              from: 37.5,
              to: 62.5, // 亚健康
              label: {
                text: this.$t('repairSuggestionDetail.label.subHealthy'),
                align: 'left',
                y: 5,
                style: {
                  color: 'rgba(242,242,242,0.80)',
                  fontSize: '16px',
                },
              },
            },
            {
              color: 'rgba(242,242,242,0.10)',
              from: 62.5,
              to: 87.5, // 比较健康
              label: {
                text: this.$t('repairSuggestionDetail.label.relativelyHealthy'),
                align: 'left',
                y: 5,
                style: {
                  color: 'rgba(242,242,242,0.80)',
                  fontSize: '16px',
                },
              },
            },
            {
              color: 'transparent',
              from: 87.5,
              to: 100, // 健康
              label: {
                text: this.$t('repairSuggestionDetail.label.healthy'),
                align: 'left',
                y: -8,
                style: {
                  color: 'rgba(242,242,242,0.80)',
                  fontSize: '16px',
                },
              },
            },
          ], // 默认设置清空自定义分区以防影响图表下次绘制
          lineWidth: 0, // y轴的坐标线
        },
        xAxis: {
          categories: this.xAxis, // x坐标轴数据
          opposite: false,
          startOnTick: false,
          gridLineColor: 'transparent', // x轴网格线颜色
          max: null, // 最大最小坐标默认设置空
          min: null,
          lineWidth: 0, // x轴的坐标线
          labels: {
            enabled: false,
          },
        },
        series: [{
          name: this.$t('repairSuggestionDetail.chart.score'),
          data: this.yAxis,
          type: 'spline',
          marker: {
            enabled: false,
            fillColor: undefined,
          },
          lineWidth: 2,
          zones: [{
            value: 30,
            color: 'rgba(201, 14, 36, 1)',
          }, {
            value: 50,
            color: 'rgba(217, 125, 16, 1)',
          }, {
            value: 70,
            color: 'rgba(217, 222, 14, 1)',
          }, {
            value: 90,
            color: 'rgba(164, 186, 30, 1)',
          }, {
            value: 100,
            color: 'rgba(76, 178, 28, 1)',
          }, {
            color: 'rgba(76, 178, 28, 1)',
          }],
        }],
      };
      return options;
    },
    getColorByStatus(score) {
      switch (true) {
        case this.isInRange(score, 90, 100):
          return '#4cb21c'; // 健康
        case this.isInRange(score, 70, 90):
          return '#95f204'; // 比较健康
        case this.isInRange(score, 50, 70):
          return '#ffff00'; // 亚健康
        case this.isInRange(score, 30, 50):
          return '#f59a23'; // 预警
        case this.isInRange(score, 0, 30):
          return '#d9001b'; // 报警
        default:
          return '#4cb21c';
      }
    },
    // 判断数据在某一个区间
    isInRange(num, min, max) {
      return (num === 0 && min === 0) ? true : (num > min && num <= max);
    },
  },
};
</script>

  <style lang="scss" scoped>
  </style>
