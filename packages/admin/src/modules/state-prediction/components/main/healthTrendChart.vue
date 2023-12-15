<template>
  <div :style="`height: ${height}px;`">
    <highcharts
      class="mt-2"
      ref="healthscorechart"
      v-if="options"
      :options="options"
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
      clientHeight: document.body.clientHeight,
      clientWidth: document.body.clientWidth,
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
    height: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState('helper', ['isDark']),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('statePrediction', ['monthScoreList']),
    chartHeight() {
      return this.height - 16;
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
      return list.reverse();
    },
    xAxis() {
      return this.scoreData.map((item) => moment(item.date).format('MM-DD')).reverse();
    },
    yAxis() {
      return this.scoreData.map((item) => item.score).reverse();
    },
  },
  created() {
  },
  mounted() {
    // 初始化控制图配置
    this.options = this.getOriginOptions();
    // 加载通用的参数配置
    Highcharts.setOptions(this.options);
  },
  watch: {
    isDark: {
      handler() {
        setTimeout(this.refresh, 100);
      },
      immediate: false,
    },
  },
  methods: {
    ...mapActions('statePrediction', []),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    // 图表初始统一配置项
    getOriginOptions() {
      const options = {
        chart: {
          backgroundColor: this.isDark ? '#2a3041' : '',
          polar: false,
          height: this.chartHeight,
          width: null,
          type: 'spline', // 默认折线图
          margin: undefined, // 设置内边距，上右下左
          color: this.isDark ? '#ffffff' : '#2a3041',
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
          series: {},
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
              color: this.isDark ? '#ffffff' : '#2a3041',
            },
          }, // 纵坐标标签自定义，默认启用
          tickAmount: 5, // y轴坐标点个数
          max: 100,
          min: 0,
          gridLineColor: 'transparent', // y轴网格线颜色
          plotBands: [
            {
              color: this.isDark ? '#2a3041' : '#fff',
              from: 0,
              to: 30, // 故障
              label: {
                text: this.$t('statePrediction.label.fault'),
                align: 'left',
                style: {
                  color: this.isDark ? '#ffffff' : '',
                },
              },
            },
            {
              color: this.isDark ? '#131313' : '#ECF6FB',
              from: 30,
              to: 50, // 预警
              label: {
                text: this.$t('statePrediction.label.earlyWarning'),
                align: 'left',
                y: 4,
                style: {
                  color: this.isDark ? '#ffffff' : '',
                },
              },
            },
            {
              color: this.isDark ? '#2a3041' : '#fff',
              from: 50,
              to: 70, // 亚健康
              label: {
                text: this.$t('statePrediction.label.subHealthy'),
                align: 'left',
                y: 4,
                style: {
                  color: this.isDark ? '#ffffff' : '',
                },
              },
            },
            {
              color: this.isDark ? '#131313' : '#ECF6FB',
              from: 70,
              to: 90, // 比较健康
              label: {
                text: this.$t('statePrediction.label.relativelyHealthy'),
                align: 'left',
                style: {
                  color: this.isDark ? '#ffffff' : '',
                },
              },
            },
            {
              color: this.isDark ? '#2a3041' : '#fff',
              from: 90,
              to: 100, // 健康
              label: {
                text: this.$t('statePrediction.label.healthy'),
                align: 'left',
                y: -2,
                style: {
                  color: this.isDark ? '#ffffff' : '',
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
          name: this.$t('statePrediction.chart.score'),
          data: this.yAxis,
          type: 'spline',
          marker: {
            enabled: false,
            fillColor: undefined,
          },
          lineWidth: 2,
        }],
      };
      return options;
    },
    // 刷新
    refresh() {
      // 初始化控制图配置
      this.options = this.getOriginOptions();
      // 加载通用的参数配置
      Highcharts.setOptions(this.options);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
