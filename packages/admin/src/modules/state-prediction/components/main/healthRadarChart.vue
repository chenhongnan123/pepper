<template>
  <div class="radar-chart" :style="`height: ${height}px;`">
    <div class="chart-info d-flex align-center justify-center">
      <span v-show="ifShowScore">
        <font
          class="text-h4"
          :style="`color: ${getColorByScore(Number(healthAverage))};`"
        >{{healthAverage}}</font>
      </span>
    </div>
    <highcharts
      class="mt-2"
      id="healthscorechart"
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
import HighchartsMore from 'highcharts/highcharts-more';

HighchartsMore(Highcharts);

export default {
  name: 'healthRadarChart',
  components: {
    highcharts: Chart,
  },
  data() {
    return {
      moment,
      ifShowScore: true,
      categoriesList: [],
      clientHeight: document.body.clientHeight,
      clientWidth: document.body.clientWidth,
      options: {
        chart: {
          polar: true,
          height: '200px',
          type: 'line',
        },
      }, // 控制图配置
      // healthAverage: 0,
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
    ...mapState('statePrediction', ['bomFirstList', 'deviceBomInfo', 'healthAverage']),
    chartHeight() {
      return this.height - 16;
    },
    healthList() {
      const { deviceBomInfo } = this;
      delete deviceBomInfo['@type'];
      const bomValArr = Object.keys(deviceBomInfo);
      const healthList = bomValArr.map((v) => {
        const obj = {};
        this.bomFirstList.forEach((item) => {
          if (item.bomId === Number(v)) {
            obj.productName = item.bomName;
            obj.productNumber = item.bomNumber;
            obj.grade = this.deviceBomInfo[v];
          }
        });
        return obj;
      });
      return healthList;
    },
  },
  created() {
    this.initChartData();
    // 初始化控制图配置
    this.options = this.getOriginOptions();
    // 加载通用的参数配置
    Highcharts.setOptions(this.options);
  },
  mounted() {},
  watch: {
    isDark: {
      handler() {
        setTimeout(this.refresh, 100);
      },
      immediate: false,
    },
    healthList: {
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
    ...mapMutations('statePrediction', [
      'setHealthAverage',
    ]),
    initChartData() {
      const { healthList } = this;
      if (healthList?.length) {
        let sum = 0;
        this.categoriesList = healthList.map((item) => item.productNumber);
        this.series = healthList.map((item) => {
          sum += Number(item.grade || 0);
          return Number(item.grade || 0);
        });
        if (healthList.length > 0) {
          this.setHealthAverage(Number(Math.round(sum / healthList.length)));
        } else {
          this.setHealthAverage(0);
        }
      }
    },
    // 图表初始统一配置项
    getOriginOptions() {
      const that = this;
      const options = {
        chart: {
          backgroundColor: this.isDark ? '#2a3041' : '',
          polar: true,
          type: 'line',
          height: this.chartHeight,
          margin: undefined,
          // events: {
          //   load() {
          //     const chart = this;
          //     const centerX = chart.plotWidth / 2;
          //     const centerY = chart.plotHeight / 2;
          //     console.log(centerX, centerY);
          //     // 在图表上方添加自定义文字
          //     chart.renderer.text(scroe, centerX * 0.79, centerY * 1.4)
          //       .attr({
          //         zIndex: 5, // 确保文字在tooltip之上
          //       })
          //       .css({
          //         color,
          //         fontSize: '36px',
          //         textAlign: 'center',
          //         verticalAlign: 'middle',
          //       })
          //       .add();
          //   },
          // },
        },
        credits: {
          enabled: false,
        }, // 不显示highcharts链接
        title: {
          text: '', // 不设置title会有默认标题
        },
        tooltip: {
          formatter() {
            // eslint-disable-next-line
            const name = that.healthList.find((item) => item.productNumber === this.x).productName || '';
            return `</b>${this.x}</b><br/></b>${name}</b><br/>${that.$t('statePrediction.chart.grade')}: <b>${this.y}</b>`;
          },
        },
        pane: {
          size: '80%',
        },
        xAxis: {
          categories: this.categoriesList,
          opposite: false,
          startOnTick: false,
          tickmarkPlacement: 'on',
          lineWidth: 0,
          max: null, // 最大最小坐标默认设置空
          min: null,
          gridLineColor: this.isDark ? '#575757' : '#e0e0e0',
          labels: {
            enabled: true,
            style: {
              color: this.isDark ? '#ffffff' : 'rgba(0, 0, 0, 0.6)',
              fontSize: '10px',
            },
          },
        },
        yAxis: {
          title: {
            text: '',
          },
          opposite: false,
          min: 0,
          max: 100,
          tickAmount: 3, // y轴坐标点个数
          lineWidth: 0,
          plotBands: [],
          gridLineInterpolation: 'polygon',
          gridLineColor: this.isDark ? '#575757' : '#e0e0e0',
          endOnTick: false,
          labels: {
            enabled: true,
            style: {
              color: this.isDark ? '#ffffff' : 'rgba(0, 0, 0, 0.6)',
              fontSize: '8px',
            },
          },
          tickPixelInterval: 10,
        },
        legend: {
          enabled: false,
        },
        series: [{
          name: this.$t('statePrediction.chart.scores'),
          data: this.series,
          type: 'line',
          pointPlacement: 'on',
          lineWidth: 1.5,
          marker: {
            enabled: true,
            radius: 2,
          },
          fillColor: {
            radialGradient: {
              cx: 0.5,
              cy: 0.5,
              r: 0.7,
            },
            stops: [
              [0, 'rgba(128, 255, 255, 0.1)'],
              [1, 'rgba(128, 255, 255, 0.5)'],
            ],
          },
          events: {
            mouseOver: () => {
              this.ifShowScore = false;
            },
            mouseOut: () => {
              setTimeout(() => {
                this.ifShowScore = true;
              }, 1000);
            },
          },
        }],
      };
      return options;
    },
    getColorByScore(score) {
      switch (true) {
        case this.isInRange(score, 90, 100):
          return 'rgba(76, 178, 28, 1)'; // 健康
        case this.isInRange(score, 70, 90):
          return 'rgba(164, 186, 30, 1)'; // 比较健康
        case this.isInRange(score, 50, 70):
          return 'rgba(217, 222, 14, 1)'; // 亚健康
        case this.isInRange(score, 30, 50):
          return 'rgba(217, 125, 16, 1)'; // 预警
        case this.isInRange(score, 0, 30):
          return 'rgba(201, 14, 36, 1)'; // 报警
        default:
          return 'rgba(76, 178, 28, 1)';
      }
    },
    // 判断数据在某一个区间
    isInRange(num, min, max) {
      return (num === 0 && min === 0) ? true : (num > min && num <= max);
    },
    // 刷新
    async refresh() {
      await this.initChartData();
      // 初始化控制图配置
      this.options = this.getOriginOptions();
      // 加载通用的参数配置
      Highcharts.setOptions(this.options);
    },
  },
};
</script>

<style lang="scss" scoped>
  .radar-chart {
    position: relative;
    z-index:1;
    cursor: default;
    .chart-info{
      position: absolute;
      z-index: 2;
      // margin: auto;
      // top: calc(50% - 35px);
      // left:calc(50% - 29px);
      top: 43%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
  }
</style>
