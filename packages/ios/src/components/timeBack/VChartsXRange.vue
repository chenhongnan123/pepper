<template>
  <!-- <highcharts :options="data" theme="dark"></highcharts> -->
  <div id="chart-list"></div>
</template>

<script>
import Highcharts from 'highcharts';

export default {
  name: 'VChartsXRange',
  mounted() {
    this.container = document.getElementById('chart-list');
    this.renderMoutipleCharts(this.container, this);
  },
  data: () => ({
    container: null,
    clientheight: document.body.clientHeight,
  }),
  props: {
    xrangedata: {
      type: Array,
      required: false,
      default: () => [],
    },
    linedata: {
      type: Array,
      required: false,
      default: () => [],
    },
    timeRange: {
      type: Array,
      required: false,
      default: () => [],
    },
    height: {
      type: Number,
      required: false,
      default: 200,
    },
  },
  computed: {
    iszh() {
      return this.$i18n.locale === 'zhHans';
    },
  },
  methods: {
    init() {
      this.renderMoutipleCharts(this.container, this);
    },
    renderMoutipleCharts(container, _this) {
      console.log(_this);
      const highlightPoint = function (e) {
        let chart = null;
        let point = null;
        let event = null;
        // console.log(Highcharts.charts.length, 'Highcharts.charts');
        for (let i = 0; i < Highcharts.charts.length; i += 1) {
          chart = Highcharts.charts[i];
          // console.log(Highcharts.charts, 'Highcharts.charts');
          // console.log(i, 'i');
          // console.log(chart, 'chart');
          // console.log(e, 'e');
          if (chart) {
            // Find coordinates within the chart
            event = chart.pointer.normalize(e);
            // Get the hovered point
            point = chart.series[0].searchPoint(event, true);
            // console.log(point, 'point');
            if (point) {
              // console.log('point');
              point.highlight(e);
            }
          }
        }
      };
      ['mousemove', 'touchmove', 'touchstart'].forEach((eventType) => {
        container.addEventListener(
          eventType,
          (e) => {
            // console.log(e, 'addEventListener');
            highlightPoint(e);
          },
        );
      });
      // 设置时区
      if (this.iszh) {
        Highcharts.setOptions({
          global: {
            timezoneOffset: -8 * 60,
          },
        });
      }
      /**
       * 重写内部的方法， 这里是将提示框即十字准星的隐藏函数关闭
       */
      Highcharts.Pointer.prototype.reset = function () {
        return undefined;
      };
      /**
       * 高亮当前的数据点，并设置鼠标滑动状态及绘制十字准星线
       */
      Highcharts.Point.prototype.highlight = function (event) {
        this.onMouseOver(); // 显示鼠标激活标识
        this.series.chart.tooltip.refresh(this); // 显示提示框
        this.series.chart.xAxis[0].drawCrosshair(event, this); // 显示十字准星线
      };
      const { xrangedata, linedata, timeRange } = this;
      const chartDiv = document.createElement('div');
      chartDiv.className = 'chart';
      const xRangeChartDiv = document.createElement('div');
      xRangeChartDiv.className = 'x-range-chart';
      chartDiv.appendChild(xRangeChartDiv);
      const lineChartListDiv = document.createElement('div');
      lineChartListDiv.className = 'line-chart-list py-2 overflow-y-auto';
      lineChartListDiv.style = `height:${this.height - 8}px`;
      chartDiv.appendChild(lineChartListDiv);
      linedata.forEach((line) => {
        const lineChartContainerDiv = document.createElement('div');
        lineChartContainerDiv.className = 'line-chart-container';
        const chartTitleDiv = document.createElement('div');
        chartTitleDiv.innerHTML = `<i aria-hidden="true" class="v-icon notranslate mdi mdi-line-scan theme--dark primary--text"></i><span class="font-weight-bold white--text">${
          line.dataSourceName}|${line.columnName}|${line.storageFrequencyName || '-'
        }</span>`;
        lineChartContainerDiv.appendChild(chartTitleDiv);
        const lineChartDiv = document.createElement('div');
        lineChartDiv.className = 'line-chart';
        lineChartContainerDiv.appendChild(lineChartDiv);
        lineChartListDiv.appendChild(lineChartContainerDiv);
        const lineOptions = {
          chart: {
            backgroundColor: 'transparent',
            height: '150px',
          },
          title: {
            text: '',
          },
          credits: {
            enabled: false,
          },
          legend: {
            enabled: false,
          },
          tooltip: {
            backgroundColor: 'rgba(60, 68, 68, 0.5)',
            borderWidth: 0,
            style: {
              color: 'rgba(255, 255, 255, 0.9)',
            },
            // headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{point.y}',
          },
          xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
              millisecond: '%H:%M:%S.%L',
              second: '%H:%M:%S',
              minute: '%H:%M',
              hour: '%H:%M',
              day: '%m-%d',
              week: '%m-%d',
              month: '%Y-%m',
              year: '%Y',
            },
            labels: {
              style: {
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: 'bold',
                // fontSize: 12,
              },
            },
            min: timeRange.length === 2 ? timeRange[0] : null,
            max: timeRange.length === 2 ? timeRange[1] : null,
          },
          yAxis: {
            title: {
              text: '',
            },
            labels: {
              align: 'left',
              x: 3,
              y: 10,
              format: '{value:.,0f}',
              style: {
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: 'bold',
                // fontSize: 12,
              },
            },
            tickPixelInterval: 100,
            categories: [],
            lineWidth: 0,
            gridLineWidth: 0,
          },
          series: [{
            data: line.data,
            name: 'xrange',
            type: 'spline',
            color: 'rgba(13, 166, 203, 0.9)',
            lineWidth: 1,
          }],
        };
        console.log(lineOptions, 'lineOptions');
        Highcharts.chart(lineChartDiv, lineOptions);
      });
      const options = {
        chart: {
          backgroundColor: 'rgba(60, 68, 68, 0.5)',
          height: '150px',
          spacingTop: 10,
          // spacingBottom: 20,
          scrollablePlotArea: {
            minHeight: 50 + 20 * xrangedata.length, // 设置这个属性能在页面滚动时，头部固定
          },
        },
        title: {
          text: '',
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          backgroundColor: 'rgba(60, 68, 68, 0.9)',
          borderWidth: 0,
          style: {
            color: 'rgba(255, 255, 255, 0.9)',
          },
          // headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: `{point.alarmName}<br/>${_this.$t('timeBack.layout')}:{point.bomParentName}<br/>${_this.$t('timeBack.part')}:{point.bomName}`,
          xDateFormat: '%Y-%m-%d %H:%M:%S',
        },
        xAxis: {
          labels: {
            style: {
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 'bold',
              // fontSize: 12,
            },
          },
          type: 'datetime',
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%m-%d',
            week: '%m-%d',
            month: '%Y-%m',
            year: '%Y',
          },
          opposite: true,
          min: timeRange.length === 2 ? timeRange[0] : null,
          max: timeRange.length === 2 ? timeRange[1] : null,
        },
        yAxis: {
          title: {
            text: '',
          },
          labels: {
            enabled: false,
          },
          categories: [],
          lineWidth: 0,
          gridLineColor: 'rgba(0, 0, 0, 0.99)',
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              inside: true,
              format: '{point.name}',
              color: 'rgba(255, 255, 255, 0.9)',
              style: {
                fontWeight: 'bold',
                // fontSize: 12,
              },
            },
          },
        },
        series: [{
          data: xrangedata,
          name: 'xrange',
          type: 'xrange',
          color: '#9e0e20',
          fillOpacity: 0.3,
          maxPointWidth: 20,
        }],
      };
      console.log(container.childNodes, 'container.childNodes');
      if (container.childNodes.length) {
        container.removeChild(container.childNodes[0]);
      }
      container.appendChild(chartDiv);
      console.log(options, 'options');
      Highcharts.chart(xRangeChartDiv, options);
    },
  },
  watch: {
  },
};
</script>
