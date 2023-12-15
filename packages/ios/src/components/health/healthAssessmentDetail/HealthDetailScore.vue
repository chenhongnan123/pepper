<template>
    <div class="warp d-flex flex-column py-2 mt-4">
        <GeneralTitle
        :title="`${$t('repairSuggestionDetail.label.deviceHealthScore')}`"
        style="flex:0 0 40px;"></GeneralTitle>
        <div class="warp-content"
        :style="`height: ${healthScoreHeight}px`">
            <!-- 设备环形进度图 -->
            <div class="warp-left d-flex flex-column justify-center align-center">
                    <v-progress-circular
                    :value="healthAverage" :size="healthScoreHeight * 0.7"
                        :width="16" :color="getColorByStatus">
                        <div class="circular-title d-flex flex-column justify-center align-center">
                            <div class="mb-4"
                            :style="`color: ${ getColorByStatus};`">
                              {{ healthAverage }}</div>
                            <div>
                              {{ $t('repairSuggestionDetail.label.healthScore') }}</div>
                        </div>
                    </v-progress-circular>
            </div>
            <div class="warp-right">
                <HealthScoreSquareDetail></HealthScoreSquareDetail>
            </div>
        </div>
    </div>
</template>

<script>
import {
  mapState,
} from 'vuex';
import GeneralTitle from '../components/GeneralTitle.vue';
import HealthScoreSquareDetail from './HealthScoreSquareDetail.vue';

export default {
  name: 'HealthDetailScore',
  components: {
    GeneralTitle,
    HealthScoreSquareDetail,
  },
  data() {
    return {
    };
  },
  props: {
    healthScoreHeight: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState('statePrediction', ['healthAverage']),
    getColorByStatus() {
      switch (true) {
        case this.isInRange(this.healthAverage, 90, 100):
          return 'rgba(76, 178, 28, 1)'; // 健康
        case this.isInRange(this.healthAverage, 70, 90):
          return 'rgba(164, 186, 30, 1)'; // 比较健康
        case this.isInRange(this.healthAverage, 50, 70):
          return 'rgba(217, 222, 14, 1)'; // 亚健康
        case this.isInRange(this.healthAverage, 30, 50):
          return 'rgba(217, 125, 16, 1)'; // 预警
        case this.isInRange(this.healthAverage, 0, 30):
          return 'rgba(201, 14, 36, 1)'; // 报警
        default:
          return 'rgba(76, 178, 28, 1)';
      }
    },
  },
  created() {
  },
  methods: {
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
    .warp-content {
    // flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      .warp-left {
          flex: 1;
          .circular-title {
              color: #b2b2b2;
              div:first-child {
                  font-size: 40px;
              }
              div:last-child {
                  font-size: 20px;
              }
          }
      }

      .warp-right {
          flex: 0 0 58%;
          height: 100%;
      }
    }
}
</style>
