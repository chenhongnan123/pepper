<template>
  <highcharts :options="data" theme="dark"></highcharts>
</template>

<script>
let that = null;
export default {
  name: 'VChartsColumnStack',
  data: () => ({
    data: {
      chart: {
        background: null,
        height: '280px',
        marginTop: 30,
        type: 'column',
        animation: false,
      },
      title: {
        text: '',
      },
      tooltip: {
        formatter() {
          // eslint-disable-next-line
          return '</b>' + this.x + '</b><br/>' + this.series.name + '：<b>' + this.y + 'h</b>';
        },
      },
      xAxis: {
        categories: [],
        gridLineWidth: 1,
        gridLineColor: 'rgba(24, 254, 254, 0.1)',
        labels: {
          style: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'grey',
          },
        },
      },
      yAxis: {
        gridLineColor: 'rgba(24, 254, 254, 0.1)',
        title: '',
        stackLabels: {
          enabled: false,
        },
        labels: {
          style: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
          },
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          borderWidth: 0, // 设置描边宽度
          dataLabels: {
            enabled: true,
            color: 'white',
            style: {
              // 如果不需要数据标签阴影，可以将 textOutline 设置为 'none'
              textOutline: '1px 1px none',
            },
          },
        },
        series: {
          cursor: 'pointer',
          point: {
            events: {
              // eslint-disable-next-line
              click: function (e) {
                // console.log(e, 'e', this.category);
                that.$emit('getDataByDate', this.category);
              },
            },
          },
        },
      },
      series: [],
    },
  }),
  props: {
    chartsData: {
      type: Object,
      required: false,
    },
  },
  mounted() {
    that = this;
  },
  watch: {
    chartsData: {
      handler(newVal) {
        if (newVal?.xAxis) {
          this.data.xAxis = newVal?.xAxis;
        }
        if (newVal?.series) {
          this.data.series = newVal?.series;
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
