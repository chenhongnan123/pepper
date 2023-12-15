<template>
  <div
    :style="`height: ${height}px;overflow: hidden;`"
    class="list-container mt-2"
  >
    <v-carousel
      v-if="modelList?.length"
      hide-delimiters
      :show-arrows-on-hover="true"
      :cycle="false"
      :height="height"
      v-model="page"
      :style="`height: ${height}px;`"
    >
      <v-carousel-item
        v-for="(item, ind) in modelList"
        :key="`carousel_item_${ind}`"
        class="fill-height"
      >
        <v-card :style="`height: ${height}px;`">
          <v-card-title
            style="width: 100%;"
            class="pa-2"
          >
            <span style="font-size: 16px">
              {{ item.eventName }}
            </span>
            <v-chip
              label
              dense
              small
              color=""
              text-color="#BFBFBF"
              class="ml-2"
            >
              <span class="subtitle-text">{{ getSubtitleInfo(item) }}</span>
            </v-chip>
            <v-spacer />
            <!-- <v-btn
              icon
              @click="item.contentshow = !item.contentshow"
            >
              <v-icon>{{ item.contentshow ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn> -->
          </v-card-title>
          <v-expand-transition>
            <div v-if="item.contentshow">
              <v-divider></v-divider>
              <v-card-text
                :style="`height: ${contentHeight}px;overflow: hidden;`"
                class="pa-2"
              >
                <!-- 若无chart返回，报错提示 -->
                <v-row
                  v-if="!item.chart"
                  class="fill-height"
                  align-content="center"
                  justify="center"
                >
                  <v-col
                    cols="12"
                    class="text-subtitle-1 text-center"
                  >
                    {{ $t('statePrediction.chart.noData') }}
                  </v-col>
                </v-row>
                <div
                  v-else-if="item.type==='0'
                  && (item.algorithmType === '1'|| item.algorithmType === '2')"
                >
                  <control-charts
                    ref="controlcharts-state"
                    :optionsparams="getOptions(item)"
                    :chartData="item.chart"
                    :height="chartHeight"
                    :forceHeight="true"
                    :isDark="isDark"
                    :chartName="item.eventName"
                  />
                </div>
                <div
                  v-else-if="item.type==='0' && item.algorithmType === '6'"
                >
                  <capability-analysis-chart
                    ref="capabilitycharts-state"
                    :optionsparams="getOptions(item)"
                    :chartData="item.chart"
                    :height="chartHeight"
                    :forceHeight="true"
                    :isDark="isDark"
                    :chartName="item.eventName"
                  />
                </div>
                <!-- 定制算法 -->
                <div v-else>
                  <div
                    v-html="item.chart.chart"
                    ref="chart"
                    class="overflow-y-auto d-flex justify-center"
                    :style="`height: ${chartHeight}px;`"
                  ></div>
                </div>
              </v-card-text>
              <div
                class="subtitle-text pa-2"
                :style="`color: ${isDark ? '#ffffff' : 'rgba(0, 0, 0, 0.54)'};`"
              >
                {{ `${$t('statePrediction.label.updateTime')}:`}}
                <span class="ml-2">
                  {{ `${item.updateTime
                    ? moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
                      : '--'}` }}
                </span>
              </div>
            </div>
          </v-expand-transition>
        </v-card>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import moment from 'moment';
import ControlCharts from '@/modules/data-analysis/components/Main/ControlCharts';
import CapabilityAnalysisChart from '@/modules/data-analysis/components/Main/CapabilityAnalysisChart';

export default {
  name: 'DataPredictionList',
  components: {
    ControlCharts,
    CapabilityAnalysisChart,
  },
  data() {
    return {
      moment,
      clientHeight: document.body.clientHeight,
      clientWidth: document.body.clientWidth,
      chartHtml: '',
      modelList: [],
      page: 0,
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
    ...mapState('helper', ['isDark']),
    ...mapState('statePrediction', ['algorithmModelList']),
    contentHeight() {
      return this.height - 64 - 34;
    },
    chartHeight() {
      return this.contentHeight - 16;
    },
    // capabChartHeight() {
    //   return 450;
    // },
    typeList() {
      return [
        {
          text: this.$t('statePrediction.algorithm.standard'),
          type: '0',
        },
        {
          text: this.$t('statePrediction.algorithm.custom'),
          type: '1',
        },
      ];
    },
    algorithmTypeList() {
      return [
        {
          type: '1',
          name: this.$t('statePrediction.algorithm.singleValue'),
        },
        {
          type: '2',
          name: this.$t('statePrediction.algorithm.subgroup'),
        },
        {
          type: '6',
          name: this.$t('statePrediction.algorithm.capabilityAnalysis'),
        },
      ];
    },
    algorithmList() {
      return [
        {
          value: 'i_chart',
          name: this.$t('statePrediction.algorithm.ichart'),
        },
        {
          value: 'mr_chart',
          name: this.$t('statePrediction.algorithm.mrchart'),
        },
        {
          value: 'i-mr_chart',
          name: this.$t('statePrediction.algorithm.i_mrchart'),
        },
        {
          value: 'z-mr_chart',
          name: this.$t('statePrediction.algorithm.z_mrchart'),
        },
        {
          value: 'xbar-r_chart',
          name: this.$t('statePrediction.algorithm.xbar_rchart'),
        },
        {
          value: 'xbar-s_chart',
          name: this.$t('statePrediction.algorithm.xbar_schart'),
        },
        {
          value: 'xbar_chart',
          name: this.$t('statePrediction.algorithm.xbarchart'),
        },
        {
          value: 's_chart',
          name: this.$t('statePrediction.algorithm.schart'),
        },
        {
          value: 'r_chart',
          name: this.$t('statePrediction.algorithm.rchart'),
        },
        {
          value: 'zone_chart',
          name: this.$t('statePrediction.algorithm.zonechart'),
        },
        {
          value: 'i-mr-rs_chart',
          name: this.$t('statePrediction.algorithm.imr_r/schart'),
        },
        {
          value: 'normxpk',
          name: this.$t('statePrediction.algorithm.normalcpkppk'),
        },
        {
          value: 'normxmk',
          name: this.$t('statePrediction.algorithm.normalcmkppk'),
        },
      ];
    },
  },
  mounted() {
    // this.init();
  },
  watch: {
    algorithmModelList() {
      this.init();
    },
  },
  methods: {
    ...mapActions('statePrediction', [
      'getAlgorithmModelList',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    init() {
      const { algorithmModelList } = this;
      if (algorithmModelList?.length) {
        this.modelList = algorithmModelList.map((item) => {
          const obj = {
            ...item,
            contentshow: true,
          };
          return obj;
        });
        // 当前页大于总页数，返回第一页
        if (this.page + 1 > this.modelList.length) {
          this.page = 0;
        }
      } else {
        this.modelList = [];
      }
      const customList = algorithmModelList.filter((i) => i.type === '1');
      if (customList?.length) {
        customList.forEach((data) => {
          this.$nextTick(() => {
            const ele = document.createElement('script');
            const reg = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
            const result = data?.chart?.chart?.match(reg) || [];
            const scriptText = [];
            result.forEach((item) => {
              const reg2 = /<script>([\s\S]*?)<\/script>/;
              if (item.match(reg2)) {
                scriptText.push(item.match(reg2)[1]);
              }
            });
            ele.innerHTML = scriptText;
            if (this.$refs.chart?.length) {
              // 遍历所有chart节点插入元素
              this.$refs.chart.forEach((item) => {
                item.append(ele);
              });
            }
          });
        });
      }
    },
    getSubtitleInfo(item) {
      const type = this.typeList.find((i) => i.type === item.type)?.text || '';
      const algorithmType = this.algorithmTypeList.find((i) => i.type === item.algorithmType)?.name || '';
      const algorithm = this.algorithmList.find((i) => i.value === item.algorithm)?.name || '';
      if (item.type === '0') {
        return `${type}|${algorithmType}|${algorithm}`;
      }
      return `${type}`;
    },
    getOptions(item) {
      if (item?.options) {
        return JSON.parse(item.options);
      }
      return {};
    },
  },
};
</script>

<style lang="scss" scoped>
  .subtitle-text {
    font-size: 12px;
  }
</style>
