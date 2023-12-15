<template>
  <highcharts :options="data" theme="dark"></highcharts>
</template>

<script>
export default {
  name: 'VChartsAreaSpLine',
  data: () => ({
    data: {
      chart: {
        type: 'pie',
        // background: null,
        height: '260px',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        // marginLeft: 89,
      },
      title: {
        text: '',
      },
      credits: {
        text: '',
        enabled: false,
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
          },
        },
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
        // this.data.xAxis = {
        //   ...this.data.xAxis,
        //   ...newVal.xData,
        // };
        // this.data.yAxis = {
        //   ...this.data.yAxis,
        //   ...newVal.yAxis,
        // };
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
