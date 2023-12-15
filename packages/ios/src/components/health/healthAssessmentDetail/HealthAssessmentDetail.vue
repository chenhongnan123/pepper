<template>
  <div class="warp d-flex justify-space-between pr-4" :style="`height: ${clientHeight}px;`">
    <div class="warp-left d-flex flex-column justify-sm-start">
      <div class="warp-left-top d-flex">
        <div class="warp-left-top-left d-flex flex-column">
          <TitleStatusCard :titleStatusCardData="titleStatusCardData"></TitleStatusCard>
          <div class="warp-left-top-left-img mx-4">
          <!-- <img src="https://picsum.photos/id/11/1500/1300" alt=""> -->
    <img :src="partAnnexInfo.partPic"
      :alt="`${$t('repairSuggestionDetail.label.partPicture')}`">
          </div>
        </div>
        <div class="warp-left-top-right pr-4">
          <TipCard></TipCard>
        </div>
      </div>
      <div class="warp-left-bottom">
        <WarnCard></WarnCard>
      </div>
    </div>
    <div class="warp-right d-flex flex-column">
      <div class="warp-right-top" :style="`height: ${healthScoreAndTrendHeight}px;`">
        <HealthDetailScore :healthScoreHeight="healthScoreAndTrendHeight - 40">
        </HealthDetailScore>
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
import TipCard from '@/components/health/healthAssessmentDetail/TipCard.vue';
import WarnCard from '@/components/health/healthAssessmentDetail/WarnCard.vue';
import HealthTrend from '@/components/health/components/HealthTrend.vue';
import HealthDetailScore from './HealthDetailScore.vue';

export default {
  name: 'HealthAssessmentDetail',
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
    TipCard,
    WarnCard,
    HealthDetailScore,
    HealthTrend,
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('statePrediction', ['deviceBomDetail', 'recordList', 'deviceHealthInfo', 'partAnnexInfo',
      'monthScoreList',
      'algorithmPlcList',
      'deviceBomDetailInfo',
    ]),
    moduleName() {
      return this.$route.name;
    },
    topCardHeight() {
      return (this.clientHeight - 100) * 0.3;
    },
    bottomCardHeight() {
      return (this.clientHeight - 100) * 0.7;
    },
    bomId() {
      return Number(this.$route.params.id);
    },
    partId() {
      return this.$route.params.partId;
    },
    // 设备健康评分和设备健康趋势除了标题的高度
    healthScoreAndTrendHeight() {
      return (this.clientHeight - 166) / 2;
    },
    titleStatusCardData() {
      return {
        name: this.partAnnexInfo.bomName,
        number: this.partAnnexInfo.partNumber,
        type: 'detail',
      };
    },
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions('statePrediction', [
      'getRecordList',
      'getDeviceHealthInfo',
      'getAlgorithmTypeList',
      'getAlgorithmIconList',
      'getPartAnnexInfo',
      'getMonthScoreDetailList',
      'getAlgorithmPlcList',
      'getPartHealthDetailInfo',
      'getTaskStatusList',
      'getAlgorithmModelList',
      'getMaintenanceTaskList',
      'getDeviceBomDetailInfo',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    ...mapMutations('statePrediction', [
      'setHealthAverage',
    ]),
    refresh() {
      this.init();
    },
    goBack() {
      this.$router.push({ name: 'statePrediction' });
    },
    init() {
      this.getAlgorithmList();
      this.getDeviceHealth();
      this.getWarnList();
      this.getSpcTaskList();
      // this.getDeviceBomDetailInfoByBomId();
    },
    async getDeviceBomDetailInfoByBomId() {
      await this.getDeviceBomDetailInfo(this.bomId);
    },
    async getDeviceHealth() {
      await this.getDeviceHealthInfo();
      await this.getPartHealthDetailInfo(this.bomId);
      if (this.deviceHealthInfo && this.deviceHealthInfo[this.bomId]) {
        this.setHealthAverage(this.deviceHealthInfo[this.bomId].partHealth);
      }
    },
    async getWarnList() {
      const beginTime = new Date().getTime() - 30 * 1000 * 60 * 60 * 24;
      await this.getRecordList(`bomId=${this.bomId}&beginTime=${beginTime}`);
      await this.getAlgorithmPlcList(this.bomId);
    },
    async getAlgorithmList() {
      await this.getMonthScoreDetailList(this.bomId);
      await this.getAlgorithmTypeList();
      await this.getAlgorithmIconList();
      await this.getPartAnnexInfo(this.partId);
    },
    async getSpcTaskList() {
      await this.getTaskStatusList();
      if (this.bomId) {
        await this.getAlgorithmModelList(this.bomId);
        await this.getMaintenanceTaskList(this.bomId);
        await this.getDeviceBomDetailInfo(this.bomId);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.warp {
  width: 100%;

  .warp-left {
    flex: 0 0 66%;

    .warp-left-top {
      flex: 1;
      overflow: hidden;

      .warp-left-top-left {
        flex: 0 0 50%;

        .warp-left-top-left-img {
          height: 100%;
          width: 100%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
      }

      .warp-left-top-right {
        flex: 1;
      }
    }

    //   .warp-left-middle {
    //     flex: 1;
    //     width: 100%;
    //     overflow: hidden;
    //     img {
    //       width: 100%;
    //       height: 100%;
    //       object-fit: contain;
    //     }
    //   }

    .warp-left-bottom {
      flex: 0 0 420px;
    }

  }

  .warp-right {
    flex: 0 0 33%;

    .warp-right-top {
      flex: 1;
    }

    .warp-right-bottom {
      flex: 0 0 55%;
    }
  }
}</style>
