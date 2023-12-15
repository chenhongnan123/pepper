<template>
  <div class="mt-2" :style="`height: ${height}px;`">
    <!-- 若无chart返回，报错提示 -->
    <v-row
      v-if="!item?.jsonResult"
      class="fill-height"
      align-content="center"
      justify="center"
    >
      <v-col
        cols="12"
        class="text-subtitle-1 text-center"
      >
        {{ $t('dataAlarmDetail.alert.noChartData') }}
      </v-col>
    </v-row>
    <div
      v-if="item.type==='0' && (item.algorithmType === '1'|| item.algorithmType === '2')"
    >
      <control-charts
        ref="controlcharts-state"
        :optionsparams="options"
        :chartData="chartData"
        :payload="payload"
        :height="contentHeight"
        :forceHeight="true"
        :isDark="true"
      />
    </div>
    <div
      v-else-if="item.type==='0' && item.algorithmType === '6'"
    >
      <capability-analysis-chart
        ref="capabilitycharts-state"
        :optionsparams="options"
        :chartData="chartData"
        :payload="payload"
        :height="contentHeight"
        :forceHeight="true"
        :isDark="true"
      />
    </div>
    <!-- 定制算法 -->
    <div v-if="item.type==='1'">
      <div
        id="customChart"
        v-html="chartHtml"
        ref="chart"
        class="overflow-y-auto d-flex justify-center"
        :style="`height: ${contentHeight}px;`"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import ControlCharts from '../../charts/ControlCharts.vue';
import CapabilityAnalysisChart from '../../charts/CapabilityAnalysisChart.vue';

export default {
  name: 'DataAlarmChart',
  data() {
    return {
      clientheight: document.body.clientHeight,
      clientwidth: document.body.clientWidth,
      chartHtml: '',
    };
  },
  props: {
    height: {
      type: Number,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  components: {
    ControlCharts,
    CapabilityAnalysisChart,
  },
  computed: {
    contentHeight() {
      return this.height - 8;
    },
    // 事件id
    eventId() {
      return Number(this.$route.params?.eventId) || '';
    },
    // 返回的数据
    chartData() {
      if (this.item?.jsonResult) {
        return JSON.parse(this.item.jsonResult);
      }
      return {};
    },
    // 选项数据
    options() {
      if (this.item?.options) {
        return JSON.parse(this.item.options);
      }
      return {};
    },
    // 入参数据
    payload() {
      if (this.item?.operParam) {
        return JSON.parse(this.item.operParam);
      }
      return {};
    },
  },
  watch: {
    item: {
      handler(val) {
        if (val) {
          if (val.type === '1') {
            // 定制算法需要重新发起试运行请求
            this.runCustomModel();
          }
        }
      },
      deep: true,
      immediate: false,
    },
  },
  created() {
  },
  methods: {
    ...mapActions('dataAlarmDetail', ['runModel']),
    async runCustomModel() {
      if (!this.payload || !this.eventId) {
        return;
      }
      this.chartHtml = '';
      const payload = {
        modelId: this.eventId,
        height: this.contentHeight,
        width: this.clientwidth * 0.5,
        payLoad: JSON.stringify(this.payload),
      };
      const data = await this.runModel(payload);
      if (data) {
        this.chartHtml = data.chart;
        this.$nextTick(() => {
          const ele = document.createElement('script');
          const reg = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
          const result = data.chart.match(reg);
          const scriptText = [];
          result.forEach((item) => {
            const reg2 = /<script>([\s\S]*?)<\/script>/;
            if (item.match(reg2)) {
              scriptText.push(item.match(reg2)[1]);
            }
          });
          ele.innerHTML = scriptText;
          this.$refs.chart.append(ele);
        });
        return;
      }
      this.chartHtml = '';
    },
  },
};
</script>
