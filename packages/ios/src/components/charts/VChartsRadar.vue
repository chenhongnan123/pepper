<template>
  <highcharts :options="data" theme="dark"></highcharts>
</template>

<script>
export default {
  name: 'VChartsRader',
  data: () => ({
    data: {
      chart: {
        polar: true,
        height: '220px',
        marginTop: 16,
        type: 'area',
      },
      title: {
        text: '',
      },
      pane: {
        size: '90%',
      },
      tooltip: {
        formatter() {
          // eslint-disable-next-line
          return '</b>' + this.x + '</b><br/>' + '分数：<b>' + this.y + '</b>';
        },
      },
      xAxis: {
        tickmarkPlacement: 'on',
        lineWidth: 0,
      },
      yAxis: {
        min: 0,
        lineWidth: 0,
        gridLineColor: '#1c3131',
        endOnTick: false,
        labels: {
          enabled: false,
        },
        tickPixelInterval: 10,
      },
      legend: {
        enabled: false,
      },
      series: [{
        name: 'Area',
        data: [1, 8, 2, 7, 3, 6, 4, 5],
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
        // console.log(newVal.series, 'newVal');
        this.data.xAxis = newVal.xData;
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
