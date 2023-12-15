<template>
  <div class="radar-chart mr-2" :style="`height: ${height}px;`">
    <template v-if="currentLocale === 'zhHans'">
      <div class="chart-info d-flex flex-column align-center justify-center">
        <div>
          <span class="text-h3">{{ healthAverage }}</span>
          <span class="text-h6">
            {{ `${$t('repairSuggestionDetail.label.score')}` }}
          </span>
        </div>
        <div class="text-body-1">
          {{ `${$t('repairSuggestionDetail.label.deviceHealthScore')}` }}
        </div>
      </div>
    </template>
    <template v-else>
      <div class="chart-info-en d-flex flex-column align-center justify-center">
          <div class="text-h3">{{ healthAverage }}</div>
          <div class="text-h6">
            {{ `${$t('repairSuggestionDetail.label.score')}` }}
          </div>
      </div>
    </template>
    <highcharts ref="healthscorechart" id="healthRadarChart" :options="options"></highcharts>
  </div>
</template>

<script>
import { getLocale } from '@/utils/cookies';
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
  name: 'HealthRadarChart',
  components: {
    highcharts: Chart,
  },
  data() {
    return {
      moment,
      ifShowScore: true,
      categoriesList: [],
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
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('statePrediction', ['bomFirstList', 'deviceBomInfo', 'healthAverage']),
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
    currentLocale() {
      // 中文返回zhHans，英文返回en
      return getLocale() || '';
    },
  },
  created() {
  },
  mounted() {
    // await this.initChartData();
    // // 初始化控制图配置
    // this.options = await this.getOriginOptions();
    // // 加载通用的参数配置
    // // Highcharts.setOptions(this.options);
    // await Highcharts.chart('healthRadarChart', this.options);
  },
  watch: {
    healthList: {
      async handler() {
        // 初始化控制图配置
        await this.initChartData();
        // setTimeout(() => {
        // this.options = await this.getOriginOptions();
        // 加载通用的参数配置
        Highcharts.chart('healthRadarChart', await this.getOriginOptions());
        // }, 1000);
      },
      // immediate: false,
      deep: true,
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
    async initChartData() {
      const { healthList } = this;
      if (healthList?.length) {
        let sum = 0;
        this.categoriesList = healthList.map((item) => item.productNumber);
        this.series = healthList.map((item) => {
          sum += Number(item.grade || 0);
          return Number(item.grade || 0);
        });
        if (healthList.length > 0) {
          await this.setHealthAverage(Number(Math.round(sum / healthList.length)));
        } else {
          await this.setHealthAverage(0);
        }
      }
    },
    // 图表初始统一配置项
    getOriginOptions() {
      const that = this;
      const options = {
        colors: ['var(--v-primary-base)', '#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
          '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
        chart: {
          polar: true,
          type: 'line',
          height: this.height,
          margin: undefined,
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
            // const name = that.healthList.find((item) => item.productNumber == this.x).productName || '';
            return `</b>${this.x}</b><br/>${that.$t('repairSuggestionDetail.label.scores')}：<b>${this.y}</b>`;
          },
        },
        pane: {
          size: '60%',
        },
        xAxis: {
          categories: this.categoriesList,
          opposite: false,
          startOnTick: false,
          tickmarkPlacement: 'on',
          lineWidth: 0,
          max: null, // 最大最小坐标默认设置空
          min: null,
          gridLineColor: 'rgba(242,242,242,0.10)',
          labels: {
            enabled: true,
            style: {
              color: 'rgba(242,242,242,0.80)',
              fontSize: `${this.height / 24}`,
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
          gridLineInterpolation: 'polygon',
          gridLineWidth: 1,
          endOnTick: false,
          labels: {
            enabled: true,
            style: {
              color: 'rgba(0, 0, 0, 0.6)',
              fontSize: '8px',
            },
          },
          gridLineColor: 'transparent', // y轴网格线颜色
          tickPixelInterval: 10,
          plotBands: [
            {
              color: 'rgba(242,242,242,0.3)',
              from: 0,
              to: 30, // 故障
            },
            {
              color: 'rgba(242,242,242,0.25)',
              from: 30,
              to: 50, // 预警
            },
            {
              color: 'rgba(242,242,242,0.20)',
              from: 50,
              to: 70, // 亚健康
            },
            {
              color: 'rgba(242,242,242,0.15)',
              from: 70,
              to: 90, // 比较健康
            },
            {
              color: 'rgba(242,242,242,0.10)',
              from: 90,
              to: 100, // 健康
            },
          ],
        },
        legend: {
          enabled: false,
        },
        series: [{
          name: '',
          data: this.series,
          type: 'line',
          pointPlacement: 'on',
          lineWidth: 2,
          marker: {
            enabled: false,
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
      if (score <= 30) {
        return '#d9001b'; // 报警
      }
      if (score > 30 && score <= 50) {
        return '#f59a23'; // 预警
      }
      if (score > 50 && score <= 70) {
        return '#ffff00'; // 亚健康
      }
      if (score > 70 && score <= 90) {
        return '#95f204'; // 比较健康
      }
      return '#4cb21c'; // 健康
    },
  },
};
</script>

<style lang="scss" scoped>
.radar-chart {
  position: relative;
  z-index: 1;
  cursor: default;
  color: #fff;

  .chart-info {
    position: absolute;
    z-index: 2;
    // margin: auto;
    // top: calc(50% - 35px);
    // left:calc(50% - 29px);
    top: 48%;
    left: 50%;
    transform: translate(-50%, -50%);

    div:first-child {
      font-weight: bold;
      span:first-child {
        font-size: 30px;
      }
      span:last-child {
        font-weight: bold;
        font-size:18px;
      }
    }
    div:last-child {
      font-weight: bold;
      font-size:18px;
    }
  }
  .chart-info-en {
    position: absolute;
    z-index: 2;
    top: 48%;
    left: 50%;
    transform: translate(-50%, -50%);
    div:last-child {
      font-weight: bold;
    }
  }
}
</style>
