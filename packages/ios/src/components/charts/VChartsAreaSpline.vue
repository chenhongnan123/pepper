<template>
  <highcharts :options="data" theme="dark"></highcharts>
</template>

<script>
export default {
  name: 'VChartsAreaSpLine',
  data: () => ({
    data: {
      chart: {
        type: 'areaspline',
        background: null,
        height: '220px',
        animation: false,
      },
      title: {
        text: '',
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 60,
        // gridLineWidth: 1,
        // gridLineColor: 'rgba(255, 255, 255, 0.3)',
        // gridLineDashStyle: 'longdash',
        // categories: [],
        lineColor: 'rgb(28, 77, 144)',
        lineWidth: 2,
        labels: {
          style: {
            color: '#ffffff',
            fontWeight: 'bold',
          },
          // align: 'left',
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
      },
      legend: {
        enabled: false,
      },
      series: [{
        data: [],
        color: '#80ffff',
        lineWidth: 2,
        marker: {
          radius: 5,
        },
      }],
    },
  }),
  props: {
    chartsData: {
      type: Object,
      required: false,
    },
  },
  watch: {
    chartsData: {
      handler(newVal) {
        // console.log(newVal.series,"newVal")
        this.data.chart = {
          ...this.data.chart,
          ...newVal.chart,
        };
        this.data.xAxis = {
          ...this.data.xAxis,
          ...newVal.xData,
        };
        this.data.yAxis = {
          ...this.data.yAxis,
          ...newVal.yAxis,
        };
        this.data.series = newVal.series;
        this.data.chart = {
          ...this.data.chart,
          ...newVal.chart,
        };
        this.data.title = {
          ...this.data.title,
          ...newVal.title,
        };
        this.data.plotOptions = {
          ...this.data.plotOptions,
          ...newVal.plotOptions,
        };
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
