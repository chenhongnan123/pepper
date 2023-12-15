<template>
  <div class="warp py-2 mt-14" >
    <GeneralTitle class="warp-title"
    :title="`${$t('repairSuggestionDetail.label.deviceHealthScore')}`"></GeneralTitle>
    <div class="warp-content mt-1 pr-10" :style="`height: ${healthScoreHeight}px`">
      <div class="warp-left">
          <HealthRadarChart v-bind="$attrs" :height="healthScoreHeight -10" />
      </div>
      <div class="warp-right d-flex flex-column justify-space-around ml-2">
        <ScoreDisplayHighLow :scoreData="highestPart"
        :scoreTitle="`${$t('repairSuggestionDetail.label.highestScore')}`"
        :height="(healthScoreHeight - 50) / 2">
        </ScoreDisplayHighLow>
        <ScoreDisplayHighLow class="mt-4" :scoreData="lowestPart"
        :scoreTitle="`${$t('repairSuggestionDetail.label.lowestScore')}`"
        :height="(healthScoreHeight - 50) / 2">
        </ScoreDisplayHighLow>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';
import GeneralTitle from '../components/GeneralTitle.vue';
import HealthRadarChart from './HealthRadarChart.vue';
import ScoreDisplayHighLow from './ScoreDisplayHighLow.vue';

export default {
  name: 'HealthScore',
  props: {
    healthScoreHeight: {
      type: Number,
      require: true,
      default: 100,
    },
  },
  data() {
    return {
      clientHeight: document.body.clientHeight,
      chartShow: false,
      radarTitleHeight: 30,
    };
  },
  components: {
    GeneralTitle,
    HealthRadarChart,
    ScoreDisplayHighLow,
  },
  computed: {
    ...mapState('statePrediction', ['deviceScore']),
    highestPart() {
      const max = Math.max(...this.deviceScore.map((item) => item.healthScore));
      const maxObj = this.deviceScore.find((item) => max === item.healthScore);
      let obj = {};
      if (maxObj) {
        obj = {
          name: maxObj.bomName,
          number: maxObj.bomNumber,
          score: maxObj.healthScore,
          // status: maxObj.healthScore,
          color: this.getColorByStatus(maxObj.healthScore),
        };
      } else {
        obj = {
          name: '-',
          number: '-',
          score: 0,
          color: this.getColorByStatus(0),
        };
      }
      return obj;
    },
    lowestPart() {
      const min = Math.min(...this.deviceScore.map((item) => item.healthScore));
      const minObj = this.deviceScore.find((item) => min === item.healthScore);
      let obj = {};
      if (minObj) {
        obj = {
          name: minObj.bomName,
          number: minObj.bomNumber,
          score: minObj.healthScore,
          // status: minObj.healthScore,
          color: this.getColorByStatus(minObj.healthScore),
        };
      } else {
        obj = {
          name: '-',
          number: '-',
          score: 0,
          // status: minObj.healthScore,
          color: this.getColorByStatus(0),
        };
      }
      return obj;
    },
    radarHeight() {
      return this.contentHeight - 24 - this.radarTitleHeight;
    },
    contentHeight() {
      return (this.clientHeight - 100) * 0.3 - 52;
    },
  },
  created() {
  },
  methods: {
    getColorByStatus(score) {
      switch (true) {
        case this.isInRange(score, 90, 100):
          return '#4cb21c'; // 健康
        case this.isInRange(score, 70, 90):
          return '#95f204'; // 比较健康
        case this.isInRange(score, 50, 70):
          return '#ffff00'; // 亚健康
        case this.isInRange(score, 30, 50):
          return '#f59a23'; // 预警
        case this.isInRange(score, 0, 30):
          return '#d9001b'; // 报警
        default:
          return '#4cb21c';
      }
    },
    // 判断数据在某一个区间
    isInRange(num, min, max) {
      return (num === 0 && min === 0) ? true : (num > min && num <= max);
    },
  },
};
</script>
<style lang="scss" scoped>
.warp {
  width: 100%;
  // display: flex;
  .warp-title {
    // flex: 0 0 50px;
  }
  .warp-content {
    // flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    .warp-left {
      flex: 1;
    }

    .warp-right {
      width: 100%;
      flex: 0 0 280px;
    }
  }
}
</style>
