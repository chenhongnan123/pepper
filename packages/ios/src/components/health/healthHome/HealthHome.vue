<template>
    <div class="warp d-flex justify-space-between pr-4" :style="`height: ${clientHeight}px;`">
      <div class="warp-left d-flex flex-column">
        <div class="warp-left-top d-flex ">
          <TitleStatusCard :titleStatusCardData="titleStatusCardData"></TitleStatusCard>
        </div>
        <div class="warp-left-middle  mx-4">
          <!-- <img src="https://picsum.photos/id/11/1500/1300" alt=""> -->
        <img :src="mainDevice.devicePic"
          :alt="`${$t('repairSuggestionDetail.label.equipmentPicture')}`">
        </div>
        <div class="warp-left-bottom">
          <MessageCollect></MessageCollect>
        </div>
      </div>
      <div class="warp-right d-flex flex-column justify-space-between">
        <div class="warp-right-top" :style="`height: ${healthScoreAndTrendHeight}px;`">
          <HealthScore :healthScoreHeight="healthScoreAndTrendHeight"></HealthScore>
        </div>
        <div class="warp-right-bottom" :style="`height: ${healthScoreAndTrendHeight}px;`">
          <HealthTrend :healthTrendHeight="healthScoreAndTrendHeight"></HealthTrend>
        </div>
      </div>
    </div>
  </template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import TitleStatusCard from '@/components/health/components/TitleStatusCard.vue';
// import TipCard from '@/components/health/TipCard.vue';
import MessageCollect from '@/components/health/healthHome/MessageCollect.vue';
import HealthScore from '@/components/health/healthHome/HealthScore.vue';
import HealthTrend from '@/components/health/components/HealthTrend.vue';

export default {
  name: 'HealthHome',
  data() {
    return {
      clientHeight: document.body.clientHeight - 160,
      leftWidth: 35,
      tab: null,
      healthList: [],
      items: [],
      lowestPart: {},
      highestPart: {},
    };
  },
  components: {
    TitleStatusCard,
    // TipCard,
    MessageCollect,
    HealthScore,
    HealthTrend,
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapGetters('auth', ['token']),
    ...mapState('statePrediction', [
      'deviceBomInfo',
      'bomFirstList',
      'deviceHealthInfo',
      'deviceScore',
      'monthScoreList',
      'partsList',
      'deviceBomDetail',
      'mainDevice',
      'partList',
      'bomList',
    ]),
    // 设备健康评分和设备健康趋势除了标题的高度
    healthScoreAndTrendHeight() {
      return (this.clientHeight - 166) / 2;
    },
    titleStatusCardData() {
      return {
        name: this.mainDevice.deviceName,
        number: this.mainDevice.deviceNumber,
        type: 'main',
      };
    },
    isPageChaged() {
      return this.$route.name !== 'home';
    },
  },
  created() {
    // if (this.token) this.init();
  },
  watch: {
    // 监听登录状态，如果登录就从新获取数据
    token: {
      handler(nVal) {
        if (nVal) {
          this.init();
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions('statePrediction', [
      'getDeviceBomInfo',
      'getBomFirstList',
      'getDeviceScore',
      'getMonthScoreList',
      'getPartsList',
      'getDeviceBomDetail',
      // 'getPartTypeList',
      'getPartList',
      'getDeviceMainItem',
      'getDeviceHealthInfo',
      'getBOMList',
      'getAlgorithmTypeList',
      'getAlgorithmIconList',
      'getRecordList',
      'getAlgorithmPlcList',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    async init() {
      // console.log('开启首页轮询');
      // 如果不处于登录状态或切换页面就退出
      if (!this.token || this.isPageChaged) {
        return;
      }
      await this.get30DayScoreList();
      await this.getBomInfo();
      await this.getBomFirstFloorList();
      await this.getDeviceMainItemList();
      await this.getDeviceScoreInfo();
      await this.getPartsTypeList();
      // 开启轮询
      // await this.$getTimeout(15000);
      // await this.init();
    },
    async getBomInfo() {
      await this.getDeviceBomInfo();
    },
    async getBomFirstFloorList() {
      await this.getBomFirstList();
      await this.getBOMPartsInfo(this.bomFirstList[0]);
    },
    async getDeviceScoreInfo() {
      await this.getDeviceScore();
    },
    async get30DayScoreList() {
      await this.getMonthScoreList();
    },
    async getPartsTypeList() {
      // await this.getPartTypeList();
    },
    async getDeviceMainItemList() {
      await this.getBOMList();
      await this.getDeviceHealthInfo();
      await this.getDeviceMainItem();
      await this.getPartList();
      await this.getAlgorithmTypeList();
      await this.getAlgorithmIconList();
      await this.getAlgorithmPlcList('');
      await this.getRecordList('dealFlag=0');
    },
    // 获取BOM下零件信息
    async getBOMPartsInfo(row) {
      const items = [];
      await this.getPartsList(`bomId=${row.bomId}`);
      const obj = {
        name: row.bomName,
        partList: this.partsList,
      };
      items.push(obj);
      this.items = [...items];
    },
  },
};
</script>
  <style lang="scss" scoped>
  .warp {
    width: 100%;

    .warp-left {
      flex: 0 0 66%;
      display: flex;
      justify-content: space-between;

      .warp-left-top {
        flex: 0 0 150px;
        width: 50%;
      }

      .warp-left-middle {
        flex: 1;
        width: 100%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .warp-left-bottom {
        flex: 0 0 250px;
      }

    }

    .warp-right {
      flex: 0 0 33%;
      // justify-content: space-between;
      .warp-right-top {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .warp-right-bottom {
        flex: 0 0 55%;
      }
    }
  }
  </style>
