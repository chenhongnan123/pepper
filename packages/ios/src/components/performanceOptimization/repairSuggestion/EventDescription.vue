<template>
  <div>
    <div
      class="primary--text font-weight-bold bluetitlepart"
    >
      <div class="title">
         <v-menu
          offset-y
          offset-overflow
          allow-overflow
          auto
          max-height="100"
        >
            <template v-slot:activator="{ on, attrs }">
              <span
                v-bind="attrs"
                v-on="on"
              >
                <font class="mr-n2">
                  {{alarmPoint.stationName || '-'}}
                </font>
                <v-icon
                  large
                  class="mr-n2 text-white"
                >mdi-menu-down</v-icon>
              </span>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in alarmOptions"
                :key="index"
                link
                @click='alarmPoint = item;getPointParam()'
              >
                <v-list-item-content>
                  <v-list-item-title>{{ item.stationName }}</v-list-item-title>
                  <!-- <v-list-item-subtitle>{{ item.testItem }}</v-list-item-subtitle> -->
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
      </div>
      <div class="bgImg">
        <img
          :src="require('@/assets/icons/img/darkbluesquare.svg')"
          alt=""
        />
      </div>
      <div class="cardtop">
        <div class="darkbluerectangle"></div>
        <div class="lightbluerectangle"></div>
      </div>
    </div>
    <v-card
      class="bluecard rounded-xl overflow-y-auto"
      :style="`height: ${height}px`"
      rounded
    >
      <v-card-text>
        <v-row no-gutters class="mt-1 mx-2" style="width:35%">
          <v-col cols="4" class="pl-1">
            <v-select
              solo
              dense
              v-model="param"
              :items="paramList"
              hide-details
              class="thin-input"
              return-object
              item-value="paramCode"
              item-text="testItem"
            >
              <template #selection = {item}>
                <span class="primary--text text-truncate text-caption font-weight-bold">
                  {{ item.testItem }}
                </span>
              </template>
            </v-select>
          </v-col>
          <v-col cols="2" class="mx-1">
            <v-select
              solo
              dense
              v-model="chartType"
              :items="chartTypeList"
              hide-details
              class="thin-input"
              @change="getFrequencyList"
              return-object
              item-value="id"
              item-text="text"
            >
              <template #selection = {item}>
                <span class="primary--text text-truncate text-caption font-weight-bold">
                  {{item.text}}
                </span>
              </template>
              <template #item = {item}>
                <span class="primary--text text-truncate text-caption font-weight-bold">
                  {{item.text}}
                </span>
              </template>
            </v-select>
          </v-col>
          <v-col cols="2" class="mx-1">
            <v-select
              solo
              dense
              v-model="frequency"
              :items="frequencyList"
              hide-details
              class="thin-input"
              return-object
              item-value="value"
              item-text="text"
            >
              <template #selection = {item}>
                <span class="primary--text text-truncate text-caption font-weight-bold">
                  {{ item.text }}
                </span>
              </template>
              <template #item = {item}>
                <span class="primary--text text-truncate text-caption font-weight-bold">
                  {{ item.text }}
                </span>
              </template>
            </v-select>
          </v-col>
        </v-row>
        <v-row no-gutters class="my-0">
          <v-col cols="2" class="pt-1">
            <v-list-item class="leftText">
              <v-list-item-content class="py-0">
                <v-list-item-subtitle>{{'均值'}}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content class="py-0">
                <v-list-item-title class="pl-1">{{average}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="leftText">
              <v-list-item-content class="py-0">
                <v-list-item-subtitle>{{'峰值'}}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content class="py-0">
                <v-list-item-title class="pl-1">{{max}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="leftText">
              <v-list-item-content class="py-0">
                <v-list-item-subtitle>
                  {{$t('repairSuggestion.upperwarningvalue')}}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content class="py-0">
                <v-list-item-title class="pl-1">
                  {{param?.upWarningValue || '0'}}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="leftText">
              <v-list-item-content class="py-0">
                <v-list-item-subtitle>
                  {{$t('repairSuggestion.upperlimitvalue')}}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content class="py-0">
                <v-list-item-title class="pl-1">
                  {{param?.upLimit || '0'}}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="leftText">
              <v-list-item-content class="py-0">
                <v-list-item-subtitle>
                  {{$t('repairSuggestion.lowerwarningvalue')}}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content class="py-0">
                <v-list-item-title class="pl-1">
                  {{param?.downWarningValue || '0'}}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="leftText">
              <v-list-item-content class="py-0">
                <v-list-item-subtitle>
                  {{$t('repairSuggestion.lowerlimitvalue')}}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content class="py-0">
                <v-list-item-title class="pl-1">
                  {{param?.downLimit || '0'}}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="10" class="pa-0">
            <v-charts-area-spline :chartsData="chartsData" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import VChartsAreaSpline from '../../charts/VChartsAreaSpline.vue';

export default {
  name: 'EventChart',
  data() {
    return {
      alarmPoint: {},
      param: null,
      chartType: null,
      frequency: null,
      average: 0,
      max: 0,
      frequencyList: [],
      paramList: [],
      chartsData: {
        yAxis: {
          plotLines: [
            {
              value: 700,
              color: 'red',
              width: 1,
            },
            {
              value: 100,
              color: 'red',
              width: 1,
            },
            {
              value: 588,
              color: '#f59a23',
              width: 1,
              dashStyle: 'dash',
            },
            {
              value: 232,
              color: '#f59a23',
              width: 1,
              dashStyle: 'dash',
            },
          ],
        },
        series: [{
          name: 'value',
          data: [],
          pointPlacement: 'on',
          color: '#18FEFE',
          lineWidth: 1.5,
          marker: {
            radius: 0,
          },
          fillColor: {
            linearGradient: [0, 0, 0, 160],
            stops: [
              [0, '#18FEFE'],
              [1, 'rgba(0, 0, 0, 0)'],
            ],
          },
        }],
      },
    };
  },
  props: {
    height: {
      type: Number,
    },
  },
  components: {
    VChartsAreaSpline,
  },
  created() {
  },
  computed: {
    ...mapState('repairSuggestion', [
      'pointList',
      'alarmPointList',
      'chartDataList',
      'stationWarningList',
      'stationWarningDetailList',
    ]),
    ...mapState('statusMonitor', ['chartTypeList']),
    alarmOptions() {
      return this.stationWarningList;
    },
    isPageChaged() {
      return this.$route.name !== 'repairSuggestionDetail';
    },
  },
  watch: {
    alarmOptions: {
      handler() {
        this.init();
      },
      immediate: false,
      deep: true,
    },
    param: {
      handler(val) {
        // 上限值
        this.chartsData.yAxis.plotLines[0].value = val.upLimit || 0;
        // 下限值
        this.chartsData.yAxis.plotLines[1].value = val.downLimit || 0;
        // 上限预警值
        this.chartsData.yAxis.plotLines[2].value = val.upWarningValue || 0;
        // 下限预警值
        this.chartsData.yAxis.plotLines[3].value = val.downWarningValue || 0;
      },
      immediate: false,
      deep: true,
    },
    chartDataList: {
      handler(val) {
        // console.log(val, 'watch');
        let sum = 0;
        let max = 0;
        const chartdata = val.map((item, i) => {
          // 时区问题，东八区加八个小时
          const time = new Date(item.creationDate).getTime() + (8 * 60 * 60 * 1000);
          const y = Number(item.value);
          sum += y;
          max = max < y ? y : max;
          return {
            x: time + i * 1000,
            y,
          };
        });
        this.average = sum ? Math.round(sum / val.length) : 0;
        this.max = max;
        this.chartsData.series[0].data = chartdata;
      },
      immediate: false,
    },
  },
  methods: {
    ...mapActions('repairSuggestion', ['getParamList', 'getChartDataList', 'getWarningDetailList']),
    async init() {
      const { stationWarningList, chartTypeList } = this;
      if (stationWarningList.length) {
        this.alarmPoint = {
          ...stationWarningList[0],
        };
        this.getPointParam();
      }
      [this.chartType] = chartTypeList;
      this.frequencyList = chartTypeList[0].frequencyList;
      [this.frequency] = chartTypeList[0].frequencyList;
      await this.getChartData();
    },
    async getChartData() {
      if (this.isPageChaged) {
        return;
      }
      const { param, chartType, frequency } = this;
      if (!param || !chartType || !frequency) {
        return;
      }
      const { paramId } = param;
      // console.log(param, 'param');
      const maxCreationDate = new Date().getTime();
      const minCreationDate = maxCreationDate - (chartType.value * 60 * 60 * 1000);
      const collectionFrequency = frequency.value;
      const payload = {
        paramsCode: paramId,
        minCreationDate: String(minCreationDate).slice(0, 10),
        maxCreationDate: String(maxCreationDate).slice(0, 10),
        collectionFrequency,
      };
      await this.getChartDataList(payload);
      await this.$getTimeout(1000);
      this.getChartData();
    },
    async getPointParam() {
      const { alarmPoint } = this;
      const { stationName } = alarmPoint;
      if (stationName) {
        await this.getWarningDetailList(stationName);
        if (this.stationWarningDetailList?.length) {
          this.paramList = this.stationWarningDetailList;
        }
      } else {
        this.paramList = [];
      }
      [this.param] = this.paramList;
    },
    getFrequencyList() {
      const { chartType } = this;
      this.frequencyList = chartType.frequencyList;
      this.frequency = null;
    },
  },
};
</script>

<style lang="scss" scoped>
  .leftText {
    min-height: 35px;
  }
</style>
