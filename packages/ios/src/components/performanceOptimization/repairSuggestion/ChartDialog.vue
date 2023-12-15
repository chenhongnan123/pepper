<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="70%"
    transition="dialog-transition"
  >
    <div class="app-dialog pa-1">
      <v-card class="rounded-lg" style="min-height: 332px">
        <div
          v-for="i in 5"
          :key="i"
          :class="`rectangle-${i}`"
        ></div>
        <v-card-title primary-title class="mt-2 pb-0">
          <span class="text-h5">
            {{ '查看曲线' }}
          </span>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon class="text-h4">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <!-- 标题分割线 -->
        <div class="d-flex align-center px-5">
          <img
            :src="require('@/assets/icons/img/dialog-circle-big-dark.svg')"
            alt=""
            class="mr-2"
          />
          <img
            :src="require('@/assets/icons/img/dialog-circle-small-dark.svg')"
            alt=""
          />
          <v-divider></v-divider>
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
        </div>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="2">
              <v-list-item style="min-height: 35px">
                <v-list-item-content class="py-0">
                  <v-list-item-subtitle>{{'均值'}}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content class="py-0">
                  <v-list-item-title class="pl-1">{{average}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item style="min-height: 35px">
                <v-list-item-content class="py-0">
                  <v-list-item-subtitle>{{'峰值'}}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content class="py-0">
                  <v-list-item-title class="pl-1">{{max}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item style="min-height: 35px">
                <v-list-item-content class="py-0">
                  <v-list-item-subtitle>
                    {{$t('repairSuggestion.upperwarningvalue')}}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content class="py-0">
                  <v-list-item-title class="pl-1">
                    {{alarmPoint.upWarningValue || '0'}}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item style="min-height: 35px">
                <v-list-item-content class="py-0">
                  <v-list-item-subtitle>
                    {{$t('repairSuggestion.upperlimitvalue')}}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content class="py-0">
                  <v-list-item-title class="pl-1">
                    {{alarmPoint.upLimit || '0'}}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item style="min-height: 35px">
                <v-list-item-content class="py-0">
                  <v-list-item-subtitle>
                    {{$t('repairSuggestion.lowerwarningvalue')}}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content class="py-0">
                  <v-list-item-title class="pl-1">
                    {{alarmPoint.downWarningValue || '0'}}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item style="min-height: 35px">
                <v-list-item-content class="py-0">
                  <v-list-item-subtitle>
                    {{$t('repairSuggestion.lowerlimitvalue')}}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content class="py-0">
                  <v-list-item-title class="pl-1">
                    {{alarmPoint.downLimit || '0'}}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col cols="10">
              <v-charts-area-spline :chartsData="chartsData" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </v-dialog>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import VChartsAreaSpline from '../../charts/VChartsAreaSpline.vue';

export default {
  name: 'ChartDialog',
  data() {
    return {
      average: 0,
      max: 0,
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
    chartDialog: {
      type: Boolean,
      required: true,
    },
    alarmPoint: {
      type: Object,
    },
  },
  components: {
    VChartsAreaSpline,
  },
  computed: {
    ...mapState('repairSuggestion', ['dialogChartDataList']),
    dialog: {
      get() {
        return this.chartDialog;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
  },
  methods: {
    ...mapActions('repairSuggestion', ['getChartDataListForDialog']),
    async getChartData() {
      const { paramCode, warningDate } = this.alarmPoint;
      if (!paramCode || !warningDate) {
        return;
      }
      const maxCreationDate = new Date(warningDate).getTime() + (30 * 1000);
      const minCreationDate = maxCreationDate - (30 * 1000);
      const collectionFrequency = 1;
      const payload = {
        paramsCode: paramCode,
        minCreationDate: String(minCreationDate).slice(0, 10),
        maxCreationDate: String(maxCreationDate).slice(0, 10),
        collectionFrequency,
      };
      await this.getChartDataListForDialog(payload);
    },
  },
  watch: {
    dialog(dialog) {
      if (!dialog) {
        return;
      }
      const { alarmPoint } = this;
      // 上限值
      this.chartsData.yAxis.plotLines[0].value = alarmPoint.upLimit || 0;
      // 下限值
      this.chartsData.yAxis.plotLines[1].value = alarmPoint.downLimit || 0;
      // 上限预警值
      this.chartsData.yAxis.plotLines[2].value = alarmPoint.upWarningValue || 0;
      // 下限预警值
      this.chartsData.yAxis.plotLines[3].value = alarmPoint.downWarningValue || 0;
      this.getChartData();
    },
    dialogChartDataList: {
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
};
</script>
