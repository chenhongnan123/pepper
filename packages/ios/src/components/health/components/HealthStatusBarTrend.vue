<template>
  <div class="statusBarContainer mt-3">
    <!-- 标题 -->
    <div class="d-flex score-subtitle">
      <div class="mr-auto">
        {{ `${$t('repairSuggestionDetail.title.30daysScores')}：` }}
      </div>
    </div>
    <div
      class="d-flex mt-4"
      style="width: 100%;overflow-x: auto;"
    >
        <div class="block-item d-flex flex-column"
        v-for="(item, index) in healthStatusList" :key="`status_block_${index}`">
          <div
            :style="`background-color: ${item.color};height: ${blockHeight}px;border-radius: 2px;`"
            :title="`${item.status}分`"
            class="block-score"
          >
          </div>
          <div
            :style="`font-size: 6px;`"
            class="status-date-label d-flex justify-center"
          >
            <!-- <span
              v-if="index === 0 || index === healthStatusList.length - 1 || index % 3 === 0"
              class="date-style"
            >{{ item.date }}</span> -->
            <span
              class="date-style"
            >{{ item.date }}</span>
          </div>
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

export default {
  name: 'healthStatusBarTrend',
  components: {
  },
  data() {
    return {
      clientHeight: document.body.clientHeight,
      blockWidth: 21,
      blockHeight: 24,
    };
  },
  // props: {
  //   height: {
  //     type: Number,
  //     required: true,
  //   },
  // },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('statePrediction', ['monthScoreList']),
    healthStatusList() {
      const list = this.monthScoreList.map((item) => {
        const obj = {
          date: item.recordTime,
          status: item.healthScore,
          color: this.getColorByStatus(item.healthScore),
        };
        return obj;
      });
      return list;
    },
  },
  created() {
  },
  methods: {
    ...mapActions('statePrediction', []),
    ...mapMutations('statePrediction', []),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    viewTrendChart() {
      this.$emit('showChart');
    },
    getColorByStatus(score) {
      switch (true) {
        case this.isInRange(score, 90, 100):
          return 'rgba(76, 178, 28, 1)'; // 健康
        case this.isInRange(score, 70, 90):
          return 'rgba(164, 186, 30, 1)'; // 比较健康
        case this.isInRange(score, 50, 70):
          return 'rgba(217, 222, 14, 1)'; // 亚健康
        case this.isInRange(score, 30, 50):
          return 'rgba(217, 125, 16, 1)'; // 预警
        case this.isInRange(score, 0, 30):
          return 'rgba(201, 14, 36, 1)'; // 报警
        default:
          return 'rgba(76, 178, 28, 1)';
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
  .statusBarContainer {
    width: 100%;
    .score-subtitle {
      font-size: 16px;
    }
    .status-date-label {
      display: inline-block;
      white-space: nowrap;
    }
  }
  .date-style {
    color: rgba(242,242,242,0.80);
    margin-top: 2px;
  }
  .block-item {
    width: 3.66%;
    .block-score {
      margin: 0 2px;
    }
  }
</style>
