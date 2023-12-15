<template>
  <div
    :style="`height: ${height}px;width: 100%;`"
    :class="forceHeight ? '' : 'overflow-y-auto'"
  >
    <!-- 第一张控制图 -->
    <div
      v-if="oneChartShow"
      class="mt-4"
    >
      <highcharts
        :id="`${chartName}_valueonechart`"
        ref="valueonechart"
        v-if="optionsOne"
        :options="optionsOne"
      ></highcharts>
      <div
        class="ml-6"
        :style="`overflow-y: auto;height: ${vioPointsHeight - 5}px;`"
      >
        <!-- 累计和控制图下方违规点展示 -->
        <div
          v-if="chartData.chart_type==='cumsum_chart'"
          style="height: 100%;"
        >
          <div v-if="cusumtestlist">
            {{ $t('dataAnalysis.chart.testcusum')}}
            {{ $t('dataAnalysis.chart.testfailed') }}
            {{ cusumtestlist }}
          </div>
        </div>
        <!-- zone_chart区域控制图下方违规点展示 -->
        <div
          v-if="chartData.chart_type==='zone_chart'"
          style="height: 100%;"
        >
          <div v-if="zonetestlist">
            {{ $t('dataAnalysis.chart.testzone')}}
            {{ $t('dataAnalysis.chart.testfailed') }}
            {{ zonetestlist }}
          </div>
        </div>
        <!-- 多变量算法控制图下方违规点展示 -->
        <div
          v-if="chartData.chart_type==='tsqrd_chart' || chartData.chart_type==='genvar_chart'
          || chartData.chart_type==='tsqrd-gv_chart'"
          style="height: 100%;"
        >
          <div v-if="multivariatestestOnelist">
            {{ $t('dataAnalysis.chart.testcusum')}}
            {{ $t('dataAnalysis.chart.testfailed') }}
            {{ multivariatestestOnelist }}
          </div>
        </div>
        <!-- 常规控制图下方检验违规点展示 -->
        <div v-else>
          <div
            :key="index"
            v-for="(data, index) in onetestList"
          >
            <div>{{ getTestContent(data, optionsparams, chartData, true, false) }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 第二张控制图 -->
    <div
      v-if="twoChartShow"
      class="mt-4"
    >
      <highcharts
        :id="`${chartName}_valuetwochart`"
        ref="valuetwochart"
        v-if="optionsTwo"
        :options="optionsTwo"
      ></highcharts>
      <div
        class="ml-6"
        :style="`overflow-y: auto;height: ${vioPointsHeight - 5}px;`"
      >
        <!-- 多变量算法控制图下方违规点展示 -->
        <div
          v-if="chartData.chart_type==='tsqrd_chart' || chartData.chart_type==='genvar_chart'
          || chartData.chart_type==='tsqrd-gv_chart'"
          style="height: 100%;"
        >
          <div v-if="multivariatestestTwolist">
            {{ $t('dataAnalysis.chart.testcusum')}}
            {{ $t('dataAnalysis.chart.testfailed') }}
            {{ multivariatestestTwolist }}
          </div>
        </div>
        <!-- 常规控制图下方检验违规点展示 -->
        <div v-else>
          <div
            :key="index"
            v-for="(data, index) in twotestList"
          >
            <div>{{ getTestContent(data, optionsparams, chartData, false, true) }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 目前仅i-mr-r/s算法包含三张控制图 -->
    <div
      v-if="threeChartShow"
      class="mt-4"
    >
      <highcharts
        :id="`${chartName}_valuethreechart`"
        ref="valuethreechart"
        v-if="optionsThree"
        :options="optionsThree"
      ></highcharts>
      <div
        class="ml-6"
        :style="`overflow-y: auto;height: ${vioPointsHeight - 5}px;`"
      >
        <div
          :key="index"
          v-for="(data, index) in threetestList"
        >
          <div>{{ getTestContent(data, optionsparams, chartData, false, false) }}</div>
        </div>
      </div>
    </div>
    <v-row
      v-if="errMsgShow"
      :height="height"
      class="fill-height pa-0 px-2"
      style="width: 100%;"
      align-content="center"
      justify="center"
    >
      <v-col
        cols="12"
        class="text-center"
      >
        <div
          v-for="(item, index) in errMsgList"
          :key="`err_msg_${index}`"
          class="errmsg-text"
        >
          {{ item }}
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
// 引入highcharts组件
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
// 引入通用方法函数
import {
  bubbleSort,
  getMin,
  getMax,
  isArr,
  isNum,
} from '../../commonUtil';
// 引入控制图相关方法函数
import {
  formatVioPoints,
  isMRChart,
  isHasMRChart,
  getLabelTextFromIndex,
  isViolatePoint,
  getTestsTag,
  getMaxOrMin,
  centerlineLabely,
  formatPointValue,
  centerlineLableText,
  getYAxisLines,
  getLimitSeries,
  getLineLimits,
  getZoneChartPlotBands,
  getZoneChartyAxisLabel,
} from '../../chartUtil';

let vioPoints = {
  first: null,
  second: null,
  third: null,
}; // 公共变量，用来存放违规数据点，区分至多3张图
let that = null;
export default {
  name: 'ControlCharts',
  data() {
    return {
      clientheight: document.body.clientHeight,
      vioPointsHeight: 50, // 违规数据文字容器高度统一设置
      // 控制多张控制图显隐
      oneChartShow: false,
      twoChartShow: false,
      threeChartShow: false,
      errMsgShow: false,
      errMsgList: [],
      spcOptions: {
        chart: {
          height: 200, // 默认高度
          type: 'line', // 控制图全部为折线图
        },
      }, // 控制图配置
      cusumtestlist: null, // 累计和违规数据点文本
      zonetestlist: null, // zone_chart违规数据点文本
      multivariatestestOnelist: null, // 广义方差或T2控制图违规数据点文本
      multivariatestestTwolist: null, // T2-广义方差第二张控制图违规数据点文本
    };
  },
  components: {
    highcharts: Chart,
  },
  props: {
    // 传入当前选项卡选择的参数对象，用作部分控制图逻辑处理
    optionsparams: {
      type: Object,
      required: true,
    },
    // 当前接口返回的计算数据
    chartData: {
      type: Object,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    forceHeight: {
      type: Boolean,
      default: false,
    },
    isDark: {
      type: Boolean,
      default: false,
    },
    chartName: {
      type: String,
      default: 'default',
    },
  },
  computed: {
    ...mapState('dataAnalysis', ['selectedItems']),
    // algorithm() {
    //   return this.selectedItems.algorithm;
    // },
    // algorithmtype() {
    //   return this.selectedItems.algorithmtype;
    // },
    // 全部控制图总高度
    chartContentHeight() {
      if (this.forceHeight) {
        return this.height;
      }
      if (this.chartData.chart_type === 'zone_chart') {
        return 600;
      }
      if (this.threeChartShow && this.height < 900) {
        return 900;
      }
      if (this.twoChartShow && this.height < 600) {
        return 600;
      }
      return this.height < 300 ? 300 : this.height;
    },
    // 控制图高度
    chartHeight() {
      // eslint-disable-next-line
      return this.twoChartShow ? (this.chartContentHeight) / 2
        : this.threeChartShow ? (this.chartContentHeight) / 3 : this.chartContentHeight;
    },
    // 第一张控制图options配置
    optionsOne() {
      if (this.oneChartShow) {
        return this.getChartOptions(true, false);
      }
      return this.options;
    },
    // 第一张控制图检验结果文字列表
    onetestList() {
      return this.oneChartShow ? this.formatTests(true, false) : [];
    },
    // 第二张控制图options配置
    optionsTwo() {
      if (this.twoChartShow) {
        return this.getChartOptions(false, true);
      }
      return this.options;
    },
    // 第二张控制图检验结果文字列表
    twotestList() {
      return this.twoChartShow ? this.formatTests(false, true) : [];
    },
    // 第三张控制图options配置
    optionsThree() {
      if (this.threeChartShow) {
        return this.getChartOptions(false, false);
      }
      return this.options;
    },
    // 第三张控制图检验结果文字列表
    threetestList() {
      return this.threeChartShow ? this.formatTests(false, false) : [];
    },
    // 所有移动极差控制图散点及违规点坐标=index+mr，绘图时坐标点需要用mr进行计算
    movingrange() {
      return Number(this.optionsparams?.estimated?.mrLength) || 0;
    },
  },
  watch: {
    // 返回的图表数据一旦变化，立刻按照类别变更三张图表显隐情况
    chartData: {
      handler(obj) {
        // 图表数据变化时，必须先清空上次绘制的图表数据，以免影响下次绘制
        this.reset();
        this.oneChartShow = false;
        this.twoChartShow = false;
        this.threeChartShow = false;
        if (obj.status && obj.status === 200) {
          this.errMsgShow = false;
          this.oneChartShow = true;
          // 以下算法有两张控制图
          if (obj.chart_type === 'z-mr_chart' || obj.chart_type === 'i-mr_chart'
          || obj.chart_type === 'xbar-r_chart' || obj.chart_type === 'xbar-s_chart'
          || obj.chart_type === 'i-mr-rs_chart' || obj.chart_type === 'tsqrd-gv_chart') {
            this.twoChartShow = true;
          } else {
            this.twoChartShow = false;
          }
          // i-mr-r/s算法有三张控制图
          if (obj.chart_type === 'i-mr-rs_chart') {
            this.threeChartShow = true;
          } else {
            this.threeChartShow = false;
          }
        } else {
          this.oneChartShow = false;
          this.twoChartShow = false;
          this.threeChartShow = false;
          if (obj?.err_msg?.length > 0) {
            this.errMsgList = [
              ...obj.err_msg,
            ];
            this.errMsgShow = true;
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    // 放进全局变量以便在highcharts内部函数中调用this中的函数和数据
    that = this;
  },
  mounted() {
    // 初始化控制图配置
    this.spcOptions = this.getOriginOptions();
    // 加载通用的参数配置
    // Highcharts.setOptions(this.spcOptions);
    Highcharts.chart(`${this.chartName}_valueonechart`, this.optionsOne);
    Highcharts.chart(`${this.chartName}_valuetwochart`, this.optionsTwo);
    Highcharts.chart(`${this.chartName}_valuethreechart`, this.optionsThree);
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    // 图表初始统一配置项
    getOriginOptions() {
      const options = {
        chart: {
          polar: false,
          height: this.chartHeight,
          width: null,
          type: 'line', // 默认折线图
          margin: [30, 100, 50, 90], // 设置内边距，上右下左
          backgroundColor: this.isDark ? 'transparent' : '#FFF',
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
            // general options for all series
            pointPlacement: 'between',
          },
        },
        pane: {
          size: '85%',
        },
        tooltip: {
          enabled: true,
          formatter: null, // 默认为空，以防影响其他图表提示框内容
        },
        yAxis: [
          {
            title: {
              text: '',
              style: {
                color: this.isDark ? '#FFF' : '#666666',
              },
            }, // 不设置title会有默认标题
            opposite: false,
            labels: {
              enabled: true,
              style: {
                color: this.isDark ? '#FFF' : '#666666',
              },
            }, // 纵坐标标签自定义，默认启用
            tickPositions: null, // 坐标点定义，清空以免影响图表下次绘制
            tickAmount: undefined, // y轴坐标点个数
            gridLineColor: 'transparent', // y轴网格线颜色
            plotLines: [], // 默认设置清空自定义坐标线以防影响图表下次绘制
            plotBands: [], // 默认设置清空自定义分区以防影响图表下次绘制
            lineColor: this.isDark ? '#FFF' : '#ccd6eb',
            lineWidth: 1, // y轴的坐标线
            max: null, // 最大最小坐标默认设置空
            min: null,
          },
          {
            title: {
              text: '',
              style: {
                color: this.isDark ? '#FFF' : '#666666',
              },
            }, // 不设置title会有默认标题
            lineWidth: 1, // y轴的坐标线
            lineColor: this.isDark ? '#FFF' : '#ccd6eb',
            opposite: true,
            labels: {
              enabled: false,
              style: {
                color: this.isDark ? '#FFF' : '#666666',
              },
            },
            gridLineColor: 'transparent', // y轴网格线颜色
            plotLines: [],
            plotBands: [],
          },
        ],
        xAxis: [
          {
            categories: [], // x坐标轴数据
            opposite: false,
            // tickInterval: 1, // x轴坐标默认间隔为1
            // tickPixelInterval: 150,
            // tickAmount: 10,
            tickmarkPlacement: 'between',
            startOnTick: false,
            gridLineColor: 'transparent', // x轴网格线颜色
            plotLines: [], // 默认设置清空自定义坐标线以防影响图表下次绘制
            plotBands: [],
            max: null, // 最大最小坐标默认设置空
            min: null,
            lineWidth: 1, // x轴的坐标线
            lineColor: this.isDark ? '#FFF' : '#ccd6eb',
            labels: {
              enabled: true,
              style: {
                color: this.isDark ? '#FFF' : '#666666',
              },
            },
          },
          {
            lineWidth: 1, // x轴的坐标线
            lineColor: this.isDark ? '#FFF' : '#ccd6eb',
            opposite: true,
            labels: {
              enabled: false,
              style: {
                color: this.isDark ? '#FFF' : '#666666',
              },
            },
            tickmarkPlacement: 'between',
            gridLineColor: 'transparent', // x轴网格线颜色
            plotLines: [],
            plotBands: [],
          },
        ],
        series: [], // 清空图表数据
      };
      return options;
    },
    // 清空校验项，隐藏全部控制图
    reset() {
      // this.options = this.getOriginOptions();
      this.oneChartShow = false;
      this.twoChartShow = false;
      this.threeChartShow = false;
      vioPoints = {
        first: null,
        second: null,
        third: null,
      }; // 清空违规数据点
    },
    // 设置对应图表配置参数
    getChartOptions(isfirst, issecond) {
      const { options, chartData } = this;
      // 校验图表数据是否返回
      if (chartData.status && chartData.status === 200) {
        // z-mr、cumsum、zone算法控制图较为特殊，单独处理
        if (chartData.chart_type === 'z-mr_chart') {
          return this.getZMRChartOptions(isfirst, issecond);
        }
        if (chartData.chart_type === 'cumsum_chart') {
          return this.getCumSumChartOptions(isfirst, issecond);
        }
        if (chartData.chart_type === 'zone_chart') {
          return this.getZoneChartOptions(isfirst, issecond);
        }
        return this.getCommonChartOptions(isfirst, issecond);
      }
      return options;
    },
    // z-mr图表参数配置
    getZMRChartOptions(isfirst, issecond) {
      // 获取控制图基本配置参数
      const options = this.getOriginOptions();
      const { chartData } = this;
      const yText = this.getYAxisTitle(chartData, isfirst, issecond, chartData.chart_type);
      options.yAxis[0].title.text = yText;
      // 取group1组数据，目前前段仅支持一个数据列，后期可扩展
      const groupname = 'Group1';
      // 数据散点
      const points = getLineLimits(chartData, 'group', isfirst, issecond, groupname) || [];
      // 获取两张图的points，方便统一x坐标轴
      const points2 = getLineLimits(chartData, 'group', !isfirst, !issecond, groupname) || [];
      // 上限，z-mr控制图上限值均相同，不会存在是一组数的情况
      const upperlimit = Number(getLineLimits(chartData, 'ucl', isfirst, issecond, null));
      // 下限，z-mr控制图下限值均相同，不会存在是一组数的情况
      const lowerlimit = Number(getLineLimits(chartData, 'lcl', isfirst, issecond, null));
      // 中线，z-mr控制图中线值均相同，不会存在是一组数的情况
      const centerline = Number(getLineLimits(chartData, 'cl', isfirst, issecond, null));
      // 获取z和mr控制图校验项的违规数据
      if (isfirst) {
        vioPoints.first = getLineLimits(chartData, 'vio_points', isfirst, issecond, groupname) || [];
      } else {
        vioPoints.second = getLineLimits(chartData, 'vio_points', isfirst, issecond, groupname) || [];
      }
      // 违规数据点
      const violatePoints = isfirst ? vioPoints.first : vioPoints.second;
      // 违规点存在时，控制图高度-违规项文本高度，留出下方文字高度
      const testlist = this.formatTests(isfirst, issecond);
      if (testlist.length > 0) {
        options.chart.height = this.chartHeight - this.vioPointsHeight;
      } else {
        options.chart.height = this.chartHeight;
      }
      if (formatPointValue(upperlimit).toString().length > 10
      || Number(centerline).toFixed(2).toString().length > 10
      || formatPointValue(lowerlimit).toString().length > 10) {
        options.chart.margin = [30, 138, 50, 90]; // 设置内边距，上右下左
      }
      // y轴添加上下限线（红）及中线（绿）
      const yPlotLines = [
        {
          color: 'red',
          dashStyle: 'solid',
          value: upperlimit,
          label: {
            useHTML: true,
            text: `<span style="color:${this.isDark ? '#fff' : '#000'}">UCL=${formatPointValue(upperlimit)}</span>`,
            align: 'right',
            x: 20 + (formatPointValue(upperlimit).toString().length + 4) * 8,
            y: 8,
          },
          width: 1,
          zIndex: 2,
        },
        {
          color: 'green',
          dashStyle: 'solid',
          value: centerline,
          label: {
            useHTML: true,
            text: centerlineLableText(centerline, chartData, isfirst, issecond, this.isDark),
            align: 'right',
            x: Number(centerline) === 0 ? 20 : 20 + (Number(centerline).toFixed(2).length + 3) * 8,
            y: centerlineLabely(chartData, isfirst), // 垂直偏移像素
          },
          width: 1,
          zIndex: 2,
        },
        {
          color: 'red',
          dashStyle: 'solid',
          value: lowerlimit,
          label: {
            useHTML: true,
            text: `<span style="color:${this.isDark ? '#fff' : '#000'}">LCL=${formatPointValue(lowerlimit)}</span>`,
            align: 'right',
            x: 20 + (formatPointValue(lowerlimit).toString().length + 4) * 8,
            y: 8,
          },
          width: 1,
          zIndex: 2,
        },
      ];
      options.yAxis[0].plotLines = yPlotLines;
      const xAxis = chartData.x_axis;
      let sectionNameList = [];
      const series = [];
      // x轴分区线数组
      const xPlotLines = [];
      const yAxiesArr = [];
      // 获取x轴分区列表
      if (xAxis && xAxis.length > 0) {
        sectionNameList = xAxis;
      }
      // 计算分区个数，即返回的xAxis标签列数组长度
      const sectionNameLen = sectionNameList.length;
      // MR控制图需要对points数据进行补null
      if (issecond) {
        for (let n = 0; n < sectionNameLen; n += 1) {
          const sectionname = sectionNameList[n];
          // 每个分区内的数据点肯定比Z控制图每个分区内的数据点少
          // 计算相差的x坐标长度
          const minusLen = points2[sectionname].length - points[sectionname].length;
          // 相差几个坐标长度就补几个null值，注意仅在MR控制图数据点补null
          for (let m = 0; m < minusLen; m += 1) {
            points[sectionname].unshift(null);
          }
        }
      }
      let xLenTotal = 1; // z控制图x轴坐标从1开始
      for (let i = 0; i < sectionNameLen; i += 1) {
        const sectionname = sectionNameList[i];
        const sectionLen = points[sectionname].length;
        const obj = {
          name: yText,
          color: '#7cb5ec', // z-mr所有折线统一配色
          data: [],
        };
        for (let j = 0; j < sectionLen; j += 1) {
          const ydata = {
            x: xLenTotal + j, // x轴坐标从上一个分区坐标值开始算起
            y: points[sectionname][j],
            marker: {
              enabled: true,
              symbol: 'circle',
              fillColor: '',
            },
            dataLabels: {
              enabled: true,
              y: 0,
              color: this.isDark ? '#fff' : '#000',
              style: {},
            }, // 设置默认datalabels，以防被zone控制图datalabels设置影响
          };
          // 违规数据点使用的是index，MR控制图中即对应x坐标减去mr值
          const index = issecond ? Number(ydata.x - this.movingrange) : Number(ydata.x - 1);
          if (isViolatePoint(index, violatePoints)) {
            ydata.marker.fillColor = 'red';
          }
          // 将y轴数值全部放入一个数组以便比较大小确定坐标最大最小值
          yAxiesArr.push(Number(points[sectionname][j]).toFixed(4));
          obj.data.push(ydata);
        }
        xLenTotal += sectionLen; // 计算当前分区的x轴坐标数，作为下个分区的x轴坐标起始点
        series.push(obj);
        const xplotlineObj = {
          // 自定义x轴线值放在两个x轴坐标之间，取+0.5的位置
          value: Number(xLenTotal - 1) + 0.5,
          dashStyle: 'dash',
          width: 1,
          label: {
            style: {
              fontSize: '12px',
              color: this.isDark ? '#fff' : '#000',
            },
            useHTML: false,
            text: `${sectionname}`,
            textAlign: 'right',
            y: -5,
            x: -5,
            rotation: 0,
          },
        };
        xPlotLines.push(xplotlineObj);
      }
      // z-mr控制图存在多条x轴不连续的数据
      options.series = series;
      options.xAxis[0].plotLines = xPlotLines;
      options.plotOptions.series = {
        pointStart: 0, // x轴从0开始
        dataLabels: { // 添加数据点标签，进行违规项标记
          enabled: true,
          formatter() {
            // z-mr控制图区分两张图的检验项
            const viopoints = isfirst ? vioPoints.first : vioPoints.second;
            return getTestsTag(this.x, that.movingrange, viopoints, chartData, isfirst, issecond);
          },
        },
      };
      let max = '';
      let min = '';
      let ULEqualMax = false; // 上限是否等于最大值
      let LLEqualMin = false; // 下限是否等于最小值
      max = getMaxOrMin('max', upperlimit, getMax(yAxiesArr));
      if (Number(upperlimit).toFixed(2) === Number(max).toFixed(2)) {
        ULEqualMax = true;
      }
      min = getMaxOrMin('min', lowerlimit, getMin(yAxiesArr));
      if (Number(lowerlimit).toFixed(2) === Number(min).toFixed(2)) {
        LLEqualMin = true;
      }
      options.yAxis[0].tickAmount = 5; // 纵轴坐标数量
      const interval = (max - min) / 5;
      if (ULEqualMax) {
        // 上限等于最大值时，最大值+interval
        options.yAxis[0].max = Number(max) + Number(interval);
      } else {
        options.yAxis[0].max = Number(max);
      }
      if (LLEqualMin) {
        // 下限等于最小值时，最小值-interval
        options.yAxis[0].min = Number(min) - Number(interval);
      } else {
        options.yAxis[0].min = Number(min);
      }
      // options.yAxis[0].max = getMaxOrMin('max', upperlimit, getMax(yAxiesArr));
      // options.yAxis[0].min = getMaxOrMin('min', lowerlimit, getMin(yAxiesArr));
      // 加长x轴以便增加图表右侧空间，方便放分区标签文字
      options.xAxis[0].max = Number(xLenTotal);
      // 两张图x轴坐标必须保持一致
      const usedPointsLen = (points.length > points2.length) ? points.length : points2.length;
      const xArr = Array.from({ length: usedPointsLen + 1 }, (value, key) => key + 1);
      options.xAxis[0].categories = xArr;
      return options;
    },
    // 累积和cumsum_chart控制图参数配置
    getCumSumChartOptions(isfirst, issecond) {
      // 获取控制图基本配置参数
      const options = this.getOriginOptions();
      const { chartData } = this;
      const yText = this.getYAxisTitle(chartData, isfirst, issecond, chartData.chart_type);
      options.yAxis[0].title.text = yText;
      // 取group1组数据
      const groupname = 'Group1';
      let lowerseries = [];
      let upperseries = [];
      // 高线数据点和低线数据点
      const lowerPoints = getLineLimits(chartData, 'xl', isfirst, issecond, groupname) || [];
      const upperPoints = getLineLimits(chartData, 'xu', isfirst, issecond, groupname) || [];
      // 上限，可能是一个数值，也可能是一组数
      const upperlimit = getLineLimits(chartData, 'ucl', isfirst, issecond, groupname);
      // 下限，可能是一个数值，也可能是一组数
      const lowerlimit = getLineLimits(chartData, 'lcl', isfirst, issecond, groupname);
      // 中线，可能是一个数值，也可能是一组数
      const centerline = getLineLimits(chartData, 'cl', isfirst, issecond, groupname);
      // 存放CUSUM控制图中超出限制的点坐标
      const beyondlimitpoints = [];
      if (lowerPoints && lowerPoints.length > 0) {
        lowerseries = lowerPoints.map((item, index) => {
          const value = Number(item);
          const obj = {
            y: value,
            marker: {
              enabled: true,
              fillColor: '', // 数据点默认不设置填充色
              symbol: 'circle',
            },
            dataLabels: {
              enabled: false, // 默认不显示数据点标签
              y: 0,
              color: this.isDark ? '#fff' : '#000',
              style: {},
            }, // 设置默认datalabels，以防被zone控制图datalabels设置影响
          };
          // 超出上下限的点标记红色
          if ((isNum(upperlimit) && value > upperlimit)
          || (isNum(lowerlimit) && value < lowerlimit)
          // 若上下限为数组，则取对应index纵坐标的值进行比较大小
          || (isArr(upperlimit) && value > upperlimit[index])
          || (isArr(lowerlimit) && value < lowerlimit[index])) {
            beyondlimitpoints.push(index + 1);
            obj.marker.fillColor = 'red';
          }
          return obj;
        });
      }
      if (upperPoints && upperPoints.length > 0) {
        upperseries = upperPoints.map((item, index) => {
          const value = Number(item);
          const obj = {
            y: value,
            marker: {
              enabled: true,
              fillColor: '', // 数据点默认不设置填充色
              symbol: 'circle',
            },
            dataLabels: {
              enabled: false, // 默认不显示数据点标签
              y: 0,
              color: this.isDark ? '#fff' : '#000',
              style: {},
            }, // 设置默认datalabels，以防被zone控制图datalabels设置影响
          };
          // 超出上下限的点标记红色
          if ((isNum(upperlimit) && value > upperlimit)
          || (isNum(lowerlimit) && value < lowerlimit)
          // 若上下限为数组，则取对应index的值进行比较大小
          || (isArr(upperlimit) && value > upperlimit[index])
          || (isArr(lowerlimit) && value < lowerlimit[index])) {
            beyondlimitpoints.push(index + 1);
            obj.marker.fillColor = 'red';
          }
          return obj;
        });
      }
      // 添加上线和下线两条折线
      options.series = [{
        name: yText,
        data: lowerseries,
        color: '#7cb5ec',
      }, {
        name: yText,
        data: upperseries,
        color: '#7cb5ec',
      }];
      const testlist = beyondlimitpoints.concat();
      // 有校验数据点超出限制则在控制图下方标出
      if (testlist.length > 0) {
        this.cusumtestlist = testlist.toString();
        options.chart.height = this.chartHeight - this.vioPointsHeight;
      } else {
        this.cusumtestlist = null;
        options.chart.height = this.chartHeight;
      }
      // 存放自定义y轴线
      const yPlotLines = [];
      // 上限若为数组，则需要绘制对应折线
      if (isArr(upperlimit)) {
        if (upperlimit.length) {
          const ulSeries = getLimitSeries('ul', upperlimit, chartData, isfirst, issecond, this.isDark);
          options.series.push(ulSeries);
          // 创建一条透明上限线，取最后一个上限值作为上限线标签值
          const ul = upperlimit[upperlimit.length - 1];
          const ulPlotline = getYAxisLines('tran-ul', ul, chartData, isfirst, issecond, this.isDark);
          yPlotLines.push(ulPlotline);
          // 上限值长度大于10时，增加右内边距
          if (formatPointValue(ul).toString().length >= 10) {
            options.chart.margin = [30, 138, 50, 90]; // 设置内边距，上右下左
          }
        }
      } else if (isNum(upperlimit)) {
        // 若上限为一个数值，则增加上限线（红）
        const plotlineObj = getYAxisLines('ul', upperlimit, chartData, isfirst, issecond, this.isDark);
        yPlotLines.push(plotlineObj);
        // 上限值长度大于10时，增加右内边距
        if (formatPointValue(upperlimit).toString().length >= 10) {
          options.chart.margin = [30, 138, 50, 90]; // 设置内边距，上右下左
        }
      }
      // 中线若为数组，则需要绘制对应折线
      if (isArr(centerline)) {
        if (centerline.length) {
          const clSeries = getLimitSeries('cl', centerline, chartData, isfirst, issecond, this.isDark);
          options.series.push(clSeries);
          // 创建一条透明中线，取最后一个中线值作为中线线标签值
          const cl = centerline[centerline.length - 1];
          const clPlotline = getYAxisLines('tran-cl', cl, chartData, isfirst, issecond, this.isDark);
          yPlotLines.push(clPlotline);
          // 中线值长度大于10时，增加右内边距
          if (formatPointValue(cl).toString().length >= 10) {
            options.chart.margin = [30, 138, 50, 90]; // 设置内边距，上右下左
          }
        }
      } else if (isNum(centerline)) {
        // 若中线为一个数值，则增加中线（绿）
        const plotlineObj = getYAxisLines('cl', centerline, chartData, isfirst, issecond, this.isDark);
        yPlotLines.push(plotlineObj);
        // 中线值长度大于10时，增加右内边距
        if (formatPointValue(centerline).toString().length >= 10) {
          options.chart.margin = [30, 138, 50, 90]; // 设置内边距，上右下左
        }
      }
      // 下限若为数组，则需要绘制对应折线
      if (isArr(lowerlimit)) {
        if (lowerlimit.length) {
          const llSeries = getLimitSeries('ll', lowerlimit, chartData, isfirst, issecond, this.isDark);
          options.series.push(llSeries);
          // 创建一条透明下限线，取最后一个下限值作为下限线标签值
          const ll = lowerlimit[lowerlimit.length - 1];
          const llPlotline = getYAxisLines('tran-ll', ll, chartData, isfirst, issecond, this.isDark);
          yPlotLines.push(llPlotline);
          // 下限值长度大于10时，增加右内边距
          if (formatPointValue(ll).toString().length >= 10) {
            options.chart.margin = [30, 138, 50, 90]; // 设置内边距，上右下左
          }
        }
      } else if (isNum(lowerlimit)) {
        // 若下限为一个数值，则增加下限线（红）
        const plotlineObj = getYAxisLines('ll', lowerlimit, chartData, isfirst, issecond, this.isDark);
        yPlotLines.push(plotlineObj);
        // 下限值长度大于10时，增加右内边距
        if (formatPointValue(lowerlimit).toString().length >= 10) {
          options.chart.margin = [30, 138, 50, 90]; // 设置内边距，上右下左
        }
      }
      options.yAxis[0].plotLines = yPlotLines;
      // 以返回的xAxis数组为x轴数据
      // 若xAxis为空，则按照返回points自动生成从指定数开始的连续数作为x轴数据
      const xAxis = chartData.x_axis;
      if (xAxis && xAxis.length > 0) {
        // 接口有返回xAxis则表示存在标签列，以返回的标签index为x轴
        options.xAxis[0].categories = xAxis.map((item, index) => index + 1);
        // tooltip提示仍显示对应坐标的标签文本
        options.tooltip = {
          enabled: true,
          formatter() {
            const text = getLabelTextFromIndex(this.point.x, xAxis);
            // eslint-disable-next-line
            return `<b>${this.point.category}(${text}):</b><br>${this.series.name}:${this.point.y}`;
          },
        };
      } else {
        const xArr = upperPoints.map((item, index) => Number(index + 1));
        options.xAxis[0].categories = xArr;
      }
      // 获取纵轴坐标值，统一精度以便比较大小
      const series = lowerseries.concat(upperseries);
      const yAxisPoints = series.filter((item) => item !== null && Object.keys(item).length > 0);
      const yAxisArr = yAxisPoints.map((item) => Number(item.y).toFixed(4));
      let max = '';
      let min = '';
      let ULEqualMax = false; // 上限是否等于最大值
      let LLEqualMin = false; // 下限是否等于最小值
      // 以纵轴最大值或上限值为最大纵坐标
      if (isArr(upperlimit)) {
        const ularr = upperlimit.map((item) => Number(item).toFixed(4));
        max = getMaxOrMin('max', getMax(ularr), getMax(yAxisArr));
        const maxUL = getMax(ularr);
        if (Number(maxUL).toFixed(2) === Number(max).toFixed(2)) {
          ULEqualMax = true;
        }
      }
      if (isNum(upperlimit)) {
        max = getMaxOrMin('max', upperlimit, getMax(yAxisArr));
        if (Number(upperlimit).toFixed(2) === Number(max).toFixed(2)) {
          ULEqualMax = true;
        }
      }
      // 以纵轴最小值或下限值为最小纵坐标
      if (isArr(lowerlimit)) {
        const llarr = lowerlimit.map((item) => Number(item).toFixed(4));
        min = getMaxOrMin('min', getMin(llarr), getMin(yAxisArr));
        const minLL = getMin(llarr);
        if (Number(minLL).toFixed(2) === Number(min).toFixed(2)) {
          LLEqualMin = true;
        }
      }
      if (isNum(lowerlimit)) {
        min = getMaxOrMin('min', lowerlimit, getMin(yAxisArr));
        if (Number(lowerlimit).toFixed(2) === Number(min).toFixed(2)) {
          LLEqualMin = true;
        }
      }
      options.yAxis[0].tickAmount = 5; // 纵轴坐标数量
      const interval = (max - min) / 5;
      if (ULEqualMax) {
        // 上限等于最大值时，最大值+interval
        options.yAxis[0].max = Number(max) + Number(interval);
      } else {
        options.yAxis[0].max = Number(max);
      }
      if (LLEqualMin) {
        // 下限等于最小值时，最小值-interval
        options.yAxis[0].min = Number(min) - Number(interval);
      } else {
        options.yAxis[0].min = Number(min);
      }
      return options;
    },
    // zone_chart控制图参数配置
    getZoneChartOptions(isfirst, issecond) {
      // 获取控制图基本配置参数
      const options = this.getOriginOptions();
      // 增加控制图内边距避免坐标点或坐标轴标签消失
      options.chart.margin = [36, 120, 40, 35]; // 设置内边距，上右下左
      const { chartData } = this;
      const yText = this.getYAxisTitle(chartData, isfirst, issecond, chartData.chart_type);
      options.yAxis[0].title.text = yText;
      // 取group1组数据
      const groupname = 'Group1';
      let series = [];
      const points = getLineLimits(chartData, 'group', isfirst, issecond, groupname) || [];
      // 中线，必定为数值
      const centerline = getLineLimits(chartData, 'cl', isfirst, issecond, groupname);
      // weights不存在分组，groupname为空
      const weights = getLineLimits(chartData, 'weights', isfirst, issecond, null);
      // 右侧纵轴数据
      const zones = getLineLimits(chartData, 'zones', isfirst, issecond, groupname);
      // x散点对应的累计分数
      // eslint-disable-next-line
      const zonescores = getLineLimits(chartData, 'zone_scores', isfirst, issecond, groupname);
      // 获取违规数据点
      const violatePoints = getLineLimits(chartData, 'vio_points', isfirst, issecond, groupname) || [];
      const testlist = violatePoints.map((item) => Number(item + 1));
      if (violatePoints.length > 0) {
        this.zonetestlist = testlist.toString();
        options.chart.height = this.chartHeight - this.vioPointsHeight;
      } else {
        this.zonetestlist = null;
        options.chart.height = this.chartHeight;
      }
      const yAxiesArr = [];
      if (points && points.length > 0) {
        series = points.map((item, index) => {
          const value = Number(item);
          // 将所有数据点y值放入一个数组，以便设置y轴最大最小坐标
          yAxiesArr.push(value.toFixed(3));
          const obj = {
            y: value,
            marker: {
              enabled: true,
              fillColor: '', // 数据点默认不设置填充色
              symbol: 'circle',
              radius: 8,
            },
            dataLabels: {
              enabled: true,
              x: 0,
              y: 9, // 垂直方向偏移像素
              style: {
                color: 'white',
                fontSize: 9, // 标签文本字体大小
                fontWeight: 600,
                textOutline: 'none', // 去除文字外框
              },
              // 显示x点得分
              formatter() {
                return zonescores[index] || 0;
              },
            },
          };
          // 违规数据点标记红色
          if (violatePoints.includes(index)) {
            obj.marker.fillColor = 'red';
            obj.marker.symbol = 'square';
          }
          return obj;
        });
      }
      options.series = [{
        data: series,
        color: '#7cb5ec',
      }];
      // 存放自定义y轴线
      const yPlotLines = [];
      if (isNum(centerline)) {
        // 若中线为一个数值，则增加中线（绿）
        const plotlineObj = getYAxisLines('cl', centerline, chartData, isfirst, issecond, this.isDark);
        yPlotLines.push(plotlineObj);
        // 中线值长度大于10时，增加右内边距
        if (formatPointValue(centerline).toString().length >= 10) {
          options.chart.margin = [30, 138, 50, 90]; // 设置内边距，上右下左
        }
      }
      const yzones = [];
      // eslint-disable-next-line
      for (const j in zones) {
        const val = zones[j];
        if (j !== 'zd' && j !== '-zd') {
          const plotlineObj = getYAxisLines('zone', val.toFixed(3), chartData, isfirst, issecond, this.isDark);
          yPlotLines.push(plotlineObj);
          yzones.push(Number(val.toFixed(3)));
        }
      }
      const maxY = getMaxOrMin('max', zones.zd, getMax(yAxiesArr));
      const minY = getMaxOrMin('min', zones['-zd'], getMin(yAxiesArr));
      // 纵坐标取最大最小值
      yzones.push(Number(maxY));
      yzones.push(Number(minY));
      // 定义纵轴坐标，包含最大最小值
      options.yAxis[0].tickPositions = bubbleSort(yzones);
      options.yAxis[0].labels = {
        enabled: true,
        formatter() {
          const label = this.axis.defaultLabelFormatter.call(this);
          return `${getZoneChartyAxisLabel(label, zones)}`;
        }, // 自定义y轴坐标标签文本
      };
      options.yAxis[0].plotLines = yPlotLines; // 纵轴自定义中线
      options.yAxis[0].opposite = true; // 纵坐标反转至右侧
      options.yAxis[1].opposite = false;
      const zoneList = {
        ...zones,
        z0: centerline, // 必须将中线值也放入y轴坐标数组
      };
      // 自定义纵轴分区数据
      options.yAxis[0].plotBands = getZoneChartPlotBands(weights, zoneList);
      // 以返回的xAxis数组为x轴数据
      // 若xAxis为空，则按照返回points自动生成从指定数开始的连续数作为x轴数据
      const xAxis = chartData.x_axis;
      if (xAxis && xAxis.length > 0) {
        // 接口有返回xAxis则表示存在标签列，以返回的标签index为x轴
        options.xAxis[0].categories = xAxis.map((item, index) => index + 1);
        // tooltip提示仍显示对应坐标的标签文本
        options.tooltip = {
          enabled: true,
          formatter() {
            const text = getLabelTextFromIndex(this.point.x, xAxis);
            // eslint-disable-next-line
            return `<b>${this.point.category}(${text}):</b><br>${this.point.y}`;
          },
        };
      } else {
        const xArr = points.map((item, index) => Number(index + 1));
        options.xAxis[0].categories = xArr;
      }
      return options;
    },
    // 其他控制图参数统一配置
    getCommonChartOptions(isfirst, issecond) {
      // 获取控制图基本配置参数
      const options = this.getOriginOptions();
      const { chartData } = this;
      const yText = this.getYAxisTitle(chartData, isfirst, issecond, chartData.chart_type);
      options.yAxis[0].title.text = yText;
      // 取group1组数据
      let groupname = 'Group1';
      let series = [];
      // 数据点
      if (chartData.chart_type === 'tsqrd_chart' || chartData.chart_type === 'genvar_chart'
        || chartData.chart_type === 'tsqrd-gv_chart') {
        // 多变量算法控制图数据不存在groupname
        groupname = null;
      }
      const points = getLineLimits(chartData, 'group', isfirst, issecond, groupname) || [];
      let points2 = [];
      // 包含MR控制图的算法，分别获取两张图的points，方便统一x坐标轴
      if (isHasMRChart(chartData)) {
        points2 = getLineLimits(chartData, 'group', !isfirst, !issecond, groupname) || [];
      }
      // 上限，可能是一个数值，也可能是一组数（单值算法中的四种控制图仅存在数值的情况）
      const upperlimit = getLineLimits(chartData, 'ucl', isfirst, issecond, groupname);
      // 下限，可能是一个数值，也可能是一组数（单值算法中的四种控制图仅存在数值的情况）
      const lowerlimit = getLineLimits(chartData, 'lcl', isfirst, issecond, groupname);
      // 中线，可能是一个数值，也可能是一组数（单值算法中的四种控制图仅存在数值的情况）
      const centerline = getLineLimits(chartData, 'cl', isfirst, issecond, groupname);
      // 获取各个控制图校验项的违规数据
      if (isfirst) {
        vioPoints.first = getLineLimits(chartData, 'vio_points', isfirst, issecond, groupname) || {};
      } else if (issecond) {
        vioPoints.second = getLineLimits(chartData, 'vio_points', isfirst, issecond, groupname) || {};
      } else {
        vioPoints.third = getLineLimits(chartData, 'vio_points', isfirst, issecond, groupname) || {};
      }
      // 违规数据点
      // eslint-disable-next-line
      const violatePoints = isfirst ? vioPoints.first
        : (issecond ? vioPoints.second : vioPoints.third);
      let testlist = null;
      // 违规点存在时，控制图高度-违规文本高度
      if (chartData.chart_type === 'tsqrd_chart'
        || chartData.chart_type === 'genvar_chart'
        || chartData.chart_type === 'tsqrd-gv_chart') {
        // 多变量算法无检验项，自定义违规点文本提示，单独处理
        testlist = violatePoints.map((item) => Number(item + 1));
        if (violatePoints.length > 0) {
          // T2-广义方差控制图有两张，需要分别获取对应违规文本
          if (isfirst) {
            this.multivariatestestOnelist = testlist.toString();
          } else {
            this.multivariatestestTwolist = testlist.toString();
          }
          options.chart.height = this.chartHeight - this.vioPointsHeight;
        } else {
          if (isfirst) {
            this.multivariatestestOnelist = null;
          } else {
            this.multivariatestestTwolist = null;
          }
          options.chart.height = this.chartHeight;
        }
      } else { // 其他控制图均使用检验项违规文本
        testlist = this.formatTests(isfirst, issecond);
        if (testlist.length > 0) {
          options.chart.height = this.chartHeight - this.vioPointsHeight;
        } else {
          options.chart.height = this.chartHeight;
        }
      }
      if (points && points.length > 0) {
        series = points.map((item, index) => {
          const value = Number(item);
          let xVal = index; // 非MR图散点x轴从1开始
          if (isMRChart(chartData, isfirst, issecond)) {
            // MR图散点x轴从mr值开始
            xVal = index + Number(this.movingrange) - 1;
          }
          const obj = {
            x: Number(xVal),
            y: value,
            marker: {
              enabled: true,
              fillColor: '', // 数据点默认不设置填充色
              symbol: 'circle',
            },
            dataLabels: {
              enabled: true,
              y: 0,
              color: this.isDark ? '#fff' : '#000',
              style: {},
            }, // 设置默认datalabels，以防被zone控制图datalabels设置影响
          };
          // 超出上下限的点标记红色
          if ((isNum(upperlimit) && value > upperlimit)
          || (isNum(lowerlimit) && value < lowerlimit)
          // 若上下限为数组，则取对应index的值进行比较大小
          || (isArr(upperlimit) && value > upperlimit[index])
          || (isArr(lowerlimit) && value < lowerlimit[index])
          // 若为违规数据点则标记红色
          || isViolatePoint(index, violatePoints)) {
            obj.marker.fillColor = 'red';
          }
          return obj;
        });
      }
      // 包含MR控制图的算法，计算两张图坐标点长度之差，给mr图坐标散点补充完整
      if (isHasMRChart(chartData)) {
        // 单张MR控制图，补mr-1个null
        if (chartData.chart_type === 'mr_chart') {
          const fillLen = Number(this.movingrange);
          for (let i = 0; i < fillLen - 1; i += 1) {
            series.unshift(null);
          }
        } else {
          const fillingLen = (points.length > points2.length) ? points.length - points2.length
            : points2.length - points.length;
          // MR图散点数组头部补null
          if (isMRChart(chartData, isfirst, issecond)) {
            for (let i = 0; i < fillingLen; i += 1) {
              series.unshift(null);
            }
          }
        }
      }
      options.series = [{
        name: yText,
        data: series,
      }];
      // 存放自定义y轴线
      const yPlotLines = [];
      // 上限若为数组，则需要绘制对应折线
      if (isArr(upperlimit)) {
        if (upperlimit.length) {
          const ulSeries = getLimitSeries('ul', upperlimit, chartData, isfirst, issecond, this.isDark);
          options.series.push(ulSeries);
          // 创建一条透明色的上限值线，仅用作上限标签展示，取值为数组最后一个值
          const ul = upperlimit[upperlimit.length - 1];
          const ulPlotline = getYAxisLines('tran-ul', ul, chartData, isfirst, issecond, this.isDark);
          yPlotLines.push(ulPlotline);
          // 上限值长度大于10时，增加右内边距
          if (formatPointValue(ul).toString().length >= 10) {
            options.chart.margin = [30, 138, 50, 90]; // 设置内边距，上右下左
          }
        }
      } else if (isNum(upperlimit)) {
        // 若上限为一个数值，则增加上限线（红）
        const plotlineObj = getYAxisLines('ul', upperlimit, chartData, isfirst, issecond, this.isDark);
        yPlotLines.push(plotlineObj);
        // 上限值长度大于10时，增加右内边距
        if (formatPointValue(upperlimit).toString().length >= 10) {
          options.chart.margin = [30, 138, 50, 90]; // 设置内边距，上右下左
        }
      }
      // 中线若为数组，则需要绘制对应折线
      if (isArr(centerline)) {
        if (centerline.length) {
          // 时间加权-移动平均算法，若填写历史均值，则返回中线则为只包含传入均值的数组
          // 此时需要将该值从数组中取出，作为中线
          if (centerline.length === 1) {
            const centerlineNum = Number(centerline[0]);
            const plotline = getYAxisLines('cl', centerlineNum, chartData, isfirst, issecond, this.isDark);
            yPlotLines.push(plotline);
            // 中线值长度大于10时，增加右内边距
            if (formatPointValue(centerlineNum).toString().length >= 10) {
              options.chart.margin = [30, 138, 50, 90]; // 设置内边距，上右下左
            }
          } else {
            // 生成中线曲线
            const clSeries = getLimitSeries('cl', centerline, chartData, isfirst, issecond, this.isDark);
            options.series.push(clSeries);
            // 创建一条透明色的中线值线，仅用作中线标签展示，取值为数组最后一个值
            const cl = centerline[centerline.length - 1];
            const clPlotline = getYAxisLines('tran-cl', cl, chartData, isfirst, issecond, this.isDark);
            yPlotLines.push(clPlotline);
            // 中线值长度大于10时，增加右内边距
            if (formatPointValue(cl).toString().length >= 10) {
              options.chart.margin = [30, 138, 50, 90]; // 设置内边距，上右下左
            }
          }
        }
      } else if (isNum(centerline)) {
        // 若中线为一个数值，则增加中线（绿）
        const plotlineObj = getYAxisLines('cl', centerline, chartData, isfirst, issecond, this.isDark);
        yPlotLines.push(plotlineObj);
        // 中线值长度大于10时，增加右内边距
        if (formatPointValue(centerline).toString().length >= 10) {
          options.chart.margin = [30, 138, 50, 90]; // 设置内边距，上右下左
        }
      }
      // 下限若为数组，则需要绘制对应折线
      if (isArr(lowerlimit)) {
        if (lowerlimit.length) {
          const llSeries = getLimitSeries('ll', lowerlimit, chartData, isfirst, issecond, this.isDark);
          options.series.push(llSeries);
          // 创建一条透明色的下限值线，仅用作下限标签展示，取值为数组最后一个值
          const ll = lowerlimit[lowerlimit.length - 1];
          const llPlotline = getYAxisLines('tran-ll', ll, chartData, isfirst, issecond, this.isDark);
          yPlotLines.push(llPlotline);
          // 下限值长度大于10时，增加右内边距
          if (formatPointValue(ll).toString().length >= 10) {
            options.chart.margin = [30, 138, 50, 90]; // 设置内边距，上右下左
          }
        }
      } else if (isNum(lowerlimit)) {
        // 若下限为一个数值，则增加下限线（红）
        const plotlineObj = getYAxisLines('ll', lowerlimit, chartData, isfirst, issecond, this.isDark);
        yPlotLines.push(plotlineObj);
        // 下限值长度大于10时，增加右内边距
        if (formatPointValue(lowerlimit).toString().length >= 10) {
          options.chart.margin = [30, 138, 50, 90]; // 设置内边距，上右下左
        }
      }
      options.yAxis[0].plotLines = yPlotLines;
      // 以返回的xAxis数组为x轴数据
      const xAxis = chartData.x_axis;
      // 若xAxis为空，则按照返回points自动生成从指定数开始的连续数作为x轴数据
      // 接口有返回xAxis则表示存在标签列，以返回的标签index为x轴
      if (xAxis && xAxis.length > 0) {
        options.xAxis[0].categories = xAxis.map((item, index) => index + 1);
        // tooltip提示仍显示对应坐标的标签文本
        options.tooltip = {
          enabled: true,
          formatter() {
            const text = getLabelTextFromIndex(this.point.x, xAxis);
            // eslint-disable-next-line
            return `<b>${this.point.category}(${text}):</b><br>${this.series.name}:${this.point.y}`;
          },
        };
      } else {
        let xArr = [];
        // 移动极差控制图x轴需要多出移动极差长度值的坐标区间
        // *********同一个算法的多张控制图x轴坐标必须保持一致************//
        if (isHasMRChart(chartData)) {
          const usedPointsLen = (points.length > points2.length) ? points.length : points2.length;
          xArr = Array.from({ length: usedPointsLen + this.movingrange }, (value, key) => key + 1);
        } else {
          xArr = points.map((item, index) => Number(index + 1));
        }
        options.xAxis[0].categories = xArr;
      }
      options.plotOptions.series = {
        pointStart: 0, // x轴从0开始
        dataLabels: { // 添加数据点标签，进行违规项标记
          enabled: true,
          formatter() {
            // 控制图需要区分多张图的检验项，至多3张
            // eslint-disable-next-line
            const viopoints = isfirst ? vioPoints.first : (issecond ? vioPoints.second : vioPoints.third);
            return getTestsTag(this.x, that.movingrange, viopoints, chartData, isfirst, issecond);
          },
        },
      };
      // 获取纵轴坐标值，统一精度以便比较大小
      const validseries = series.filter((item) => item !== null && Object.keys(item).length > 0);
      const yAxisArr = validseries.map((item) => Number(item.y).toFixed(4));
      let max = '';
      let min = '';
      let ULEqualMax = false; // 上限是否等于最大值
      let LLEqualMin = false; // 下限是否等于最小值
      // 以纵轴最大值或上限值为最大纵坐标
      if (isArr(upperlimit)) {
        const ularr = upperlimit.map((item) => Number(item).toFixed(4));
        max = getMaxOrMin('max', getMax(ularr), getMax(yAxisArr));
        const maxUL = getMax(ularr);
        if (Number(maxUL).toFixed(2) === Number(max).toFixed(2)) {
          ULEqualMax = true;
        }
      }
      if (isNum(upperlimit)) {
        max = getMaxOrMin('max', upperlimit, getMax(yAxisArr));
        if (Number(upperlimit).toFixed(2) === Number(max).toFixed(2)) {
          ULEqualMax = true;
        }
      }
      // 以纵轴最小值或下限值为最小纵坐标
      if (isArr(lowerlimit)) {
        const llarr = lowerlimit.map((item) => Number(item).toFixed(4));
        min = getMaxOrMin('min', getMin(llarr), getMin(yAxisArr));
        const minLL = getMin(llarr);
        if (Number(minLL).toFixed(2) === Number(min).toFixed(2)) {
          LLEqualMin = true;
        }
      }
      if (isNum(lowerlimit)) {
        min = getMaxOrMin('min', lowerlimit, getMin(yAxisArr));
        if (Number(lowerlimit).toFixed(2) === Number(min).toFixed(2)) {
          LLEqualMin = true;
        }
      }
      options.yAxis[0].tickAmount = 5; // 纵轴坐标数量
      const interval = (max - min) / 5;
      if (ULEqualMax) {
        // 上限等于最大值时，最大值+interval
        options.yAxis[0].max = Number(max) + Number(interval);
      } else {
        options.yAxis[0].max = Number(max);
      }
      if (LLEqualMin) {
        // 下限等于最小值时，最小值-interval
        options.yAxis[0].min = Number(min) - Number(interval);
      } else {
        options.yAxis[0].min = Number(min);
      }
      return options;
    },
    // 获取控制图y轴标题
    getYAxisTitle(sourcedata, isfirst, issecond, algorithm) {
      // chart_used用于判断i-mr-r/s第三张图为r或s
      const chartUsed = sourcedata.chart_used;
      switch (algorithm) {
        // 单值
        case 'i_chart':
          return this.$t('dataAnalysis.chart.indiviualvalue');
        case 'mr_chart':
          return this.$t('dataAnalysis.chart.movingrange');
        case 'z-mr_chart':
          return isfirst ? this.$t('dataAnalysis.chart.standardeddata') : this.$t('dataAnalysis.chart.movingrange');
        case 'i-mr_chart':
          return isfirst ? this.$t('dataAnalysis.chart.indiviualvalue') : this.$t('dataAnalysis.chart.movingrange');
        // 子组
        case 'xbar-r_chart':
          return isfirst ? this.$t('dataAnalysis.chart.samplemean') : this.$t('dataAnalysis.chart.samplerange');
        case 'xbar-s_chart':
          return isfirst ? this.$t('dataAnalysis.chart.samplemean') : this.$t('dataAnalysis.chart.samplestandarddeviation');
        case 'xbar_chart':
          return this.$t('dataAnalysis.chart.samplemean');
        case 's_chart':
          return this.$t('dataAnalysis.chart.samplestandarddeviation');
        case 'r_chart':
          return this.$t('dataAnalysis.chart.samplerange');
        // zone控制图无标题
        case 'zone_chart':
          return '';
        // 仅i-mr-r/s算法有三张图
        case 'i-mr-rs_chart':
          // eslint-disable-next-line
          return isfirst ? this.$t('dataAnalysis.chart.subgroupmean')
            // eslint-disable-next-line
            : (issecond ? this.$t('dataAnalysis.chart.mrsubgroupmean')
              // eslint-disable-next-line
              : (chartUsed === 'r_chart' ? this.$t('dataAnalysis.chart.samplerange')
                // eslint-disable-next-line
                : this.$t('dataAnalysis.chart.samplestandarddeviation')));
        // 属性
        case 'p_chart':
          return this.$t('dataAnalysis.chart.proportion');
        case 'laney-p_chart':
          return this.$t('dataAnalysis.chart.proportion');
        case 'u_chart':
          return this.$t('dataAnalysis.chart.samplecountperunit');
        case 'laney-u_chart':
          return this.$t('dataAnalysis.chart.samplecountperunit');
        case 'c_chart':
          return this.$t('dataAnalysis.chart.samplecount');
        case 'np_chart':
          return this.$t('dataAnalysis.chart.samplecount');
        // 时间加权
        case 'ewma_chart':
          return this.$t('dataAnalysis.chart.ewma');
        case 'ma_chart':
          return this.$t('dataAnalysis.chart.movingaverage');
        case 'cumsum_chart':
          return this.$t('dataAnalysis.chart.cumulativesum');
        // 多变量
        case 'tsqrd_chart':
          return this.$t('dataAnalysis.chart.tsqurd');
        case 'genvar_chart':
          return this.$t('dataAnalysis.chart.generalizedvariance');
        case 'tsqrd-gv_chart':
          return isfirst ? this.$t('dataAnalysis.chart.tsqurd') : this.$t('dataAnalysis.chart.generalizedvariance');
        default:
          return '';
      }
    },
    // 获取控制图下方检验项文字内容
    getTestContent(points, params, chartData, isfirst, issecond) {
      const { name, num, values } = points;
      let valueStr = '';
      // MR控制图x坐标从mr值开始，因此违规点数据也要对应+mr
      if (isMRChart(chartData, isfirst, issecond)) {
        if (values?.length) {
          valueStr = values.map((it) => it + this.movingrange).toString();
        }
      } else if (values?.length) {
        // 其他控制图index+1即可
        valueStr = values.map((it) => it + 1).toString(); // values.join(',')
      }
      switch (name) {
        case 'oocl':
          return `${this.$t('dataAnalysis.chart.test', { num })}${this.$t('dataAnalysis.options.onepoint', { num: params?.tests?.onepoint?.value })}${this.$t('dataAnalysis.chart.testfailed')}${valueStr}`;
        case 'kos':
          return `${this.$t('dataAnalysis.chart.test', { num })}${this.$t('dataAnalysis.options.npointssameside', { num: params?.tests?.npointssameside?.value })}${this.$t('dataAnalysis.chart.testfailed')}${valueStr}`;
        case 'kid':
          return `${this.$t('dataAnalysis.chart.test', { num })}${this.$t('dataAnalysis.options.npointsall', { num: params?.tests?.npointsall?.value })}${this.$t('dataAnalysis.chart.testfailed')}${valueStr}`;
        case 'kud':
          return `${this.$t('dataAnalysis.chart.test', { num })}${this.$t('dataAnalysis.options.npointsupdown', { num: params?.tests?.npointsupdown?.value })}${this.$t('dataAnalysis.chart.testfailed')}${valueStr}`;
        case 'os2std':
          return `${this.$t('dataAnalysis.chart.test', { num })}${this.$t('dataAnalysis.options.pointsbiggerthan2', { num: params?.tests?.pointsbiggerthan2?.value, num2: (params?.tests?.pointsbiggerthan2?.value || 0) + 1 })}${this.$t('dataAnalysis.chart.testfailed')}${valueStr}`;
        case 'os1std':
          return `${this.$t('dataAnalysis.chart.test', { num })}${this.$t('dataAnalysis.options.pointsbiggerthan1', { num: params?.tests?.pointsbiggerthan1?.value, num2: (params?.tests?.pointsbiggerthan1?.value || 0) + 1 })}${this.$t('dataAnalysis.chart.testfailed')}${valueStr}`;
        case 'kin1std':
          return `${this.$t('dataAnalysis.chart.test', { num })}${this.$t('dataAnalysis.options.npoints1', { num: params?.tests?.npoints1?.value })}${this.$t('dataAnalysis.chart.testfailed')}${valueStr}`;
        case 'koo1std':
          return `${this.$t('dataAnalysis.chart.test', { num })}${this.$t('dataAnalysis.options.npointsbiggerthan1', { num: params?.tests?.npointsbiggerthan1?.value })}${this.$t('dataAnalysis.chart.testfailed')}${valueStr}`;
        default:
          return '';
      }
    },
    // 获取检验项清单列表
    formatTests(isfirst, issecond) {
      if (isfirst) {
        return formatVioPoints(vioPoints.first);
      }
      if (issecond) {
        return formatVioPoints(vioPoints.second);
      }
      return formatVioPoints(vioPoints.third);
    },
  },
};
</script>
<style scoped>
  .titlecard /deep/ .v-card__title{
    font-size: 1rem;
    line-height: 1rem;
    padding: 10px 16px 10px 16px;
  }

  .errmsg-text {
    font-size: 15px;
  }
</style>
