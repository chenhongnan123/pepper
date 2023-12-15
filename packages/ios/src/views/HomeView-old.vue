<template>
  <div class="">
    <div class="d-flex align-center justify-center mx-16 my-2 home-model">
      <control-chart
        v-if="view==='2d'"
        :height="modelHeight"
      ></control-chart>
      <div
        class="d-flex flex-column justify-center unity-loading"
        v-if="view==='roaming' && isUnityLoading && false"
      >
        <v-progress-circular
          :size="70"
          :width="7"
          color="primary"
          indeterminate
        ></v-progress-circular>
        <span>{{'loading...'}}</span>
      </div>
      <div
        class="d-flex flex-column align-center justify-center home-btns"
      >
        <!-- eslint-disable-next-line -->
        <div
          class="rounded-xl d-flex flex-column align-center justify-center my-3"
          :class="view==='2d'?'btn-active':'btn-unactive'"
          @click="view='2d'"
        >
          <img
            v-if="view==='2d'"
            style="cursor: pointer"
            class="ml-3 my-2"
            width="50"
            :src="require('@/assets/icons/img/control-chart-active.png')"
            alt=""
          />
          <img
            v-else
            style="cursor: pointer"
            class="ml-3 my-2"
            width="50"
            :src="require('@/assets/icons/img/control-chart-unactive.png')"
            alt=""
          />
          <span
            class="font-weight-bold icon--text text-subtitle-2"
          > {{ $t('home.2dview') }} </span>
        </div>
        <!-- eslint-disable-next-line -->
        <div
          class="rounded-xl d-flex flex-column align-center justify-center my-3"
          :class="view==='3d'?'btn-active':'btn-unactive'"
          @click="view='3d'"
        >
          <img
            v-if="view==='3d'"
            style="cursor: pointer"
            class="my-3"
            width="40"
            :src="require('@/assets/icons/img/3d-view-active.png')"
            alt=""
          />
          <img
            v-else
            style="cursor: pointer"
            class="my-3"
            width="40"
            :src="require('@/assets/icons/img/3d-view-unactive.png')"
            alt=""
          />
          <span
            class="font-weight-bold icon--text text-subtitle-2"
          > {{ $t('home.3dview') }} </span>
        </div>
        <div
          class="sub-btns-group d-flex flex-column align-center justify-center"
          v-if="view==='3d'"
        >
          <!-- eslint-disable-next-line -->
          <div
            class="rounded-xl my-2 d-flex align-center justify-center"
            :class="modelShowType === 1 ? 'btn-active' : 'btn-unactive'"
            @click="showMainPart"
          >
            <img
              v-if="modelShowType === 1"
              style="cursor: pointer"
              class="my-3"
              width="22"
              :src="require('@/assets/icons/img/main-part-active.svg')"
              alt=""
            />
            <img
              v-else
              style="cursor: pointer"
              class="my-3"
              width="22"
              :src="require('@/assets/icons/img/main-part-unactive.png')"
              alt=""
            />
            <span class="font-weight-bold icon--text text-subtitle-2 ml-2">关键零件</span>
          </div>
          <!-- eslint-disable-next-line -->
          <div
            class=" rounded-xl my-2 d-flex align-center justify-center"
            :class="modelShowType === 2 ? 'btn-active' : 'btn-unactive'"
            @click="showMianPoint"
          >
            <img
              v-if="modelShowType === 2"
              style="cursor: pointer"
              class="my-3"
              width="22"
              :src="require('@/assets/icons/img/main-point-active.png')"
              alt=""
            />
            <img
              v-else
              style="cursor: pointer"
              class="my-3"
              width="22"
              :src="require('@/assets/icons/img/main-point-unactive.png')"
              alt=""
            />
            <span class="font-weight-bold icon--text text-subtitle-2 ml-2">关键测点</span>
          </div>
        </div>
        <!-- eslint-disable-next-line -->
        <div
          class="rounded-xl d-flex flex-column align-center justify-center my-3"
          :class="view==='roaming'?'btn-active':'btn-unactive'"
          @click="view ='roaming'"
        >
          <img
            v-if="view ==='roaming'"
            style="cursor: pointer"
            class="ml-3 my-3"
            width="50"
            :src="require('@/assets/icons/img/device-roaming-active.png')"
            alt=""
          />
          <!-- eslint-disable-next-line -->
          <img
            v-else
            style="cursor: pointer"
            class="ml-3 my-3"
            width="50"
            :src="require('@/assets/icons/img/device-roaming-unactive.png')"
            alt=""
          />
          <span
            class="font-weight-bold icon--text text-subtitle-2"
          > {{ $t('home.deviceroaming') }} </span>
        </div>
      </div>
    </div>
    <v-row
      v-if="view !== '2d'"
      no-gutters
      class="mx-16"
      :style="`margin-top:${raderHeight + 8}px`"
    >
      <!-- <v-col class="rader-chart" @click="$router.push('/repair-suggestion')"> -->
      <v-col class="rader-chart">
        <img
        :src="require('@/assets/icons/img/radar-chart-background-dark.png')"
        height="230px"
        alt=""
        class="chart-background">
        <div class="chart-info d-flex flex-column align-center justify-center">
          <span class="text-h6"><font class="text-h3">{{healthAverage}}</font>{{'分'}}</span>
          <span class="text-h6">{{'设备健康状态'}}</span>
        </div>
        <v-charts-rader :chartsData="chartsData1" />
      </v-col>
      <v-col class="rader-chart">
        <img
        :src="require('@/assets/icons/img/radar-chart-background-dark.png')"
        height="230px"
        alt=""
        class="chart-background">
        <div class="chart-info d-flex flex-column align-center justify-center">
          <span class="text-h6"><font class="text-h3">{{performanceScore}}</font>{{'分'}}</span>
          <span class="text-h6">{{'设备绩效得分'}}</span>
        </div>
        <v-charts-rader :chartsData="chartsData2" />
      </v-col>
      <!-- <v-col class="rader-chart" @click="$router.push('/status-monitor')"> -->
      <v-col class="rader-chart">
        <img
        :src="require('@/assets/icons/img/radar-chart-background-dark.png')"
        height="230px"
        alt=""
        class="chart-background">
        <div class="chart-info d-flex flex-column align-center justify-center">
          <span class="text-h6"><font class="text-h3">{{qualityScore}}</font>{{'分'}}</span>
          <span class="text-h6">{{'实时质量得分'}}</span>
        </div>
        <v-charts-rader :chartsData="chartsData3" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ControlChart from '../components/home/ControlChart.vue';
import VChartsRader from '../components/charts/VChartsRadar.vue';

// const { CommonService } = ServiceFactory;
export default {
  name: 'HomeView',
  data: () => ({
    clientheight: document.body.clientHeight,
    clientwidth: document.body.clientWidth,
    view: '2d',
    modelShowType: 0,
    timeCount: 0,
    healthAverage: 0,
    performanceAverage: 0,
    qualityAverage: 0,
    chartsData1: {
      xData: {
        // categories: ['后干缩站', '透明纸部件', '手轮齿轮箱', '烟支进给传动箱', '内框纸切割装置'],
        categories: [],
        tickmarkPlacement: 'on',
        lineWidth: 0,
        gridLineColor: '#1c3131',
        labels: {
          style: {
            color: '#00ffff',
            fontSize: '15px',
            fontWeight: 'bold',
          },
        },
      },
      series: [{
        name: 'Area',
        // data: [43000, 19000, 60000, 35000, 17000],
        data: [],
        pointPlacement: 'on',
        color: '#80ffff',
        lineWidth: 1.5,
        marker: {
          radius: 3,
        },
        fillColor: {
          radialGradient: {
            cx: 0.5,
            cy: 0.5,
            r: 0.7,
          },
          stops: [
            [0, 'rgba(128, 255, 255, 0.1)'],
            [1, 'rgba(128, 255, 255, 0.5)'],
          ],
        },
      }],
    },
    chartsData2: {
      xData: {
        // categories: ['产品品质', '原料消耗', '材料消耗', '能源消耗', '设备运行状态'],
        categories: [],
        tickmarkPlacement: 'on',
        lineWidth: 0,
        gridLineColor: '#1c3131',
        labels: {
          style: {
            color: '#00ffff',
            fontSize: '15px',
            fontWeight: 'bold',
          },
        },
      },
      series: [{
        name: 'Area',
        // data: [43000, 19000, 60000, 35000, 17000],
        data: [],
        pointPlacement: 'on',
        color: '#80ffff',
        lineWidth: 1.5,
        marker: {
          radius: 3,
        },
        fillColor: {
          radialGradient: {
            cx: 0.5,
            cy: 0.5,
            r: 0.7,
          },
          stops: [
            [0, 'rgba(128, 255, 255, 0.1)'],
            [1, 'rgba(128, 255, 255, 0.5)'],
          ],
        },
      }],
    },
    chartsData3: {
      xData: {
        // categories: ['重量', '吸阻', '圆周', '长度', '空头', '物料重量', '成品率', '水分', '切叶(梗)丝'],
        categories: [],
        tickmarkPlacement: 'on',
        lineWidth: 0,
        gridLineColor: '#1c3131',
        labels: {
          style: {
            color: '#00ffff',
            fontSize: '15px',
            fontWeight: 'bold',
          },
        },
      },
      series: [{
        name: 'Area',
        // data: [43000, 19000, 60000, 35000, 17000, 43000, 19000, 60000, 35000],
        data: [],
        pointPlacement: 'on',
        color: '#80ffff',
        lineWidth: 1.5,
        marker: {
          radius: 3,
        },
        fillColor: {
          radialGradient: {
            cx: 0.5,
            cy: 0.5,
            r: 0.7,
          },
          stops: [
            [0, 'rgba(128, 255, 255, 0.1)'],
            [1, 'rgba(128, 255, 255, 0.5)'],
          ],
        },
      }],
    },
  }),
  components: {
    ControlChart,
    VChartsRader,
  },
  computed: {
    ...mapState('auth', ['isTokenValid', 'token']),
    ...mapState('home', [
      'healthList',
      'performanceList',
      'performanceScore',
      'qualityList',
      'qualityScore',
      'mainPointList',
      'mainPartList',
    ]),
    primaryColor() {
      if (this.$vuetify.theme.dark) {
        return this.$vuetify.theme.themes.dark.primary;
      }
      return this.$vuetify.theme.themes.light.primary;
    },
    modelHeight() {
      return this.clientheight - 160;
    },
    raderHeight() {
      return this.clientheight - 400;
    },
    isPageChaged() {
      return this.$route.name !== 'home';
    },
  },
  created() {
    // this.getScoreLoop();
  },
  watch: {
    healthList: {
      handler(healthList) {
        let sum = 0;
        this.chartsData1.xData.categories = healthList.map((item) => item.productName);
        this.chartsData1.series[0].data = healthList.map((item) => {
          sum += Number(item.grade);
          return Number(item.grade);
        });
        if (healthList.length) {
          this.healthAverage = Math.round(sum / healthList.length);
        } else {
          this.healthAverage = 0;
        }
      },
      immediate: false,
    },
    performanceList: {
      handler(performanceList) {
        let sum = 0;
        this.chartsData2.xData.categories = performanceList.map((item) => item.Name);
        this.chartsData2.series[0].data = performanceList.map((item) => {
          sum += Number(item.Score);
          return Number(item.Score);
        });
        if (performanceList.length) {
          this.performanceAverage = Math.round(sum / performanceList.length);
        } else {
          this.performanceAverage = 0;
        }
      },
      immediate: false,
    },
    qualityList: {
      handler(qualityList) {
        if (qualityList.length) {
          let sum = 0;
          this.chartsData3.xData.categories = qualityList.map((item) => item.Name);
          this.chartsData3.series[0].data = qualityList.map((item) => {
            sum += Number(item.Source);
            return Number(item.Source);
          });
          this.qualityAverage = Math.round(sum / qualityList.length);
        } else {
          this.qualityAverage = 0;
        }
      },
      immediate: false,
    },
  },
  methods: {
    ...mapActions('home', [
      'getMainPart',
      'getMainPoint',
      'getHealthList',
      'getPerformanceList',
      'getQualityList',
    ]),
    // 显示关键零件
    async showMainPart() {
      if (this.modelShowType) {
        this.$root.$digitalModel.refresh();
      }
      if (this.modelShowType === 1) {
        this.modelShowType = 0;
        return;
      }
      this.modelShowType = 1;
      await this.getMainPart();
      this.$root.$digitalModel.showMainMesh(this.mainPartList);
    },
    // 显示关键测点，要求测点所在零件跟随测点变色
    async showMianPoint() {
      if (this.modelShowType) {
        this.$root.$digitalModel.refresh();
      }
      if (this.modelShowType === 2) {
        this.modelShowType = 0;
        return;
      }
      this.modelShowType = 2;
      await this.getMainPoint();
      this.$root.$digitalModel.showMainPointNew(this.mainPointList);
      await this.getPointerLoop();
    },
    async getScoreLoop() {
      if (this.isPageChaged) {
        return;
      }
      if (this.isTokenValid) {
        await this.getHealthList();
        await this.getPerformanceList();
        await this.getQualityList();
      }
      await this.$getTimeout(30 * 1000);
      this.getScoreLoop();
    },
    async getPointerLoop() {
      if (this.isPageChaged) {
        return;
      }
      if (this.modelShowType === 2) {
        await this.getMainPoint();
        this.$root.$digitalModel.showMainPointNew(this.mainPointList);
      }
      await this.$getTimeout(5 * 1000);
      this.getPointerLoop();
    },
  },
};
</script>
