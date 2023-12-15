<template>
  <highcharts :options="data" theme="dark"></highcharts>
</template>

<script>
import moment from 'moment';

export default {
  name: 'VChartsMultiple',
  data: () => ({
    data: {
      moment,
      chart: {
        background: null,
        height: '250px',
        marginTop: 30,
        animation: false,
      },
      title: {
        text: '',
      },
      tooltip: {
        // dateTimeLabelFormats: {
        //   second: '%Y-%m-%d %H:%M:%S',
        // },
        formatter() {
          // eslint-disable-next-line
          return '</b>' + moment(this.x).format('YYYY-MM-DD HH:mm:ss') + '</b><br/>' + '值：<b>' + this.y + '</b>';
        },
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 80,
        gridLineWidth: 1,
        gridLineColor: 'rgba(255, 255, 255, 0.1)',
        // categories: [],
        lineColor: '#ffffff',
        lineWidth: 1,
        labels: {
          style: {
            color: 'rgba(255, 255, 255, 0.7)',
            // fontWeight: 'bold',
          },
          // align: 'left',
        },
      },
      yAxis: [
        {
          gridLineWidth: 0,
          tickPixelInterval: 40,
          lineColor: 'rgba(255, 255, 255, 0.3)',
          lineWidth: 1,
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
        {
          gridLineWidth: 0,
          tickPixelInterval: 40,
          lineColor: 'rgba(255, 255, 255, 0.3)',
          lineWidth: 0,
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
      ],
      legend: {
        enabled: false,
      },
      series: [{
        data: [],
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
        this.data.chart = {
          ...this.data.chart,
          ...newVal.chart,
        };
        this.data.xAxis = {
          ...this.data.xAxis,
          ...newVal.xData,
        };
        this.data.yAxis = newVal.yAxis;
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
