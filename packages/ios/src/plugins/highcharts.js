import Vue from 'vue';
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';
import HighchartsMore from 'highcharts/highcharts-more';
import solidGauge from 'highcharts/modules/solid-gauge';
import HighchartsXrange from 'highcharts/modules/xrange';

Highcharts.theme = {
  colors: ['#55D802', '#FFA100', '#FF3800', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
  chart: {
    backgroundColor: null,
    style: {
      fontFamily: 'Poppins',
    },
  },
  credits: {
    enabled: false,
  },
  xAxis: {
    labels: {
      style: {
        color: '#1976d2',
        fontSize: 12,
      },
    },
  },
  yAxis: {
    labels: {
      style: {
        color: '#1976d2',
        fontSize: 12,
      },
    },
  },
  legend: {
    enabled: true,
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle',
    itemStyle: {
      color: '#1976d2',
    },
  },
  plotOptions: {
    column: {
      dataLabels: {
        enabled: true,
        // rotation: 45,
        // y:-20,
        style: {
          fontSize: 12,
          color: '#1976d2',
        },
      },
    },
  },
};

Highcharts.setOptions(Highcharts.theme);
HighchartsMore(Highcharts);
solidGauge(Highcharts);
HighchartsXrange(Highcharts);
Vue.use(HighchartsVue);
