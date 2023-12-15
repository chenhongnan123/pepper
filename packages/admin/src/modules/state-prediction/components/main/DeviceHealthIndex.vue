<template>
  <v-card
    :height="height"
    elevation="0"
    color="bg"
  >
    <v-card-title>
      <div class="font-weight-bold">
        {{ $t('statePrediction.title.equipmentHealthIndex') }}
      </div>
    </v-card-title>
    <v-card-text
      class="pb-0"
      :style="`height: ${contentHeight}px;width: 100%;`"
    >
      <v-row
        class="fill-height"
      >
        <!-- 设备评分雷达图 -->
        <v-col
          cols="3"
          :style="`height: ${contentHeight}px;overflow-y: auto;`"
        >
          <div class="d-flex flex-column">
            <div :style="`height: ${radarHeight}px;`">
              <health-radar-chart v-bind="$attrs"
                :height="radarHeight"
              />
            </div>
            <div
              :style="`height: ${radarTitleHeight}px;font-size: 12px;`"
              style="color: #b2b2b2;"
              class="text-center chart-subtitle font-weight-bold"
            >
              {{ $t('statePrediction.label.healthScore') }}
            </div>
          </div>
        </v-col>
        <!-- 右侧评分趋势图 -->
        <v-col
          v-if="chartShow"
          cols="9"
          class="py-1"
          :style="`height: ${contentHeight}px;overflow-y: auto;`"
        >
          <div class="chart-title">
            <v-btn
              x-small
              dense
              text
              style="cursor: pointer;"
              color="primary"
              @click="chartShow = false"
            >
              <v-icon small>mdi-chevron-left</v-icon>
              {{ $t('statePrediction.title.view30daysScores') }}
            </v-btn>
          </div>
          <health-trend-chart
            :height="chartHeight"
          />
        </v-col>
        <!-- 卡片右侧默认内容 -->
        <v-col
          v-else
          cols="9"
          class="py-1"
          :style="`height: ${contentHeight}px;overflow-y: auto;`"
        >
          <!-- 右侧最高/最低评分 -->
          <div
            :style="`height: ${squareHeight}px;`"
            class="scoreContainer"
          >
            <v-row
              class="fill-height pb-1 px-2"
            >
              <v-col cols="6" class="fill-height">
                <div class="text-center scoreTitle">
                  {{ $t('statePrediction.label.highestScore') }}
                </div>
                <health-score-square v-bind="$attrs"
                  :score="highestPart.score"
                  :squareRadius="squareRadius"
                  :partName="highestPart.name"
                  :partNumber="highestPart.number"
                  :statusColor="highestPart.color"
                />
              </v-col>
              <v-divider
                vertical
                class="mt-3"
                style="color: #e0e0e0;"
              ></v-divider>
              <v-col cols="6" class="fill-height">
                <div class="text-center scoreTitle">
                  {{ $t('statePrediction.label.lowestScore') }}
                </div>
                <health-score-square
                  :score="lowestPart.score"
                  :squareRadius="squareRadius"
                  :partName="lowestPart.name"
                  :partNumber="lowestPart.number"
                  :statusColor="lowestPart.color"
                />
              </v-col>
            </v-row>
          </div>
          <!-- 30天内设备运行状态 -->
          <div class="mt-2" :style="`height: ${healthHeight}px;`">
            <health-score-trend
              :height="healthHeight"
              :status="currentTotalStatus"
              @showChart="showChart"
            />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import HealthRadarChart from './healthRadarChart.vue';
import HealthScoreSquare from './healthScoreSquare.vue';
import HealthTrendChart from './healthTrendChart.vue';
import HealthScoreTrend from './healthScoreTrend.vue';

export default {
  name: 'DeviceHealthIndex',
  components: {
    HealthRadarChart,
    HealthScoreSquare,
    HealthTrendChart,
    HealthScoreTrend,
  },
  data() {
    return {
      clientHeight: document.body.clientHeight,
      chartShow: false,
      radarTitleHeight: 30,
    };
  },
  props: {
    height: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('statePrediction', ['deviceScore']),
    contentHeight() {
      return this.height - 52;
    },
    chartHeight() {
      return this.contentHeight - 23;
    },
    squareHeight() {
      return (this.contentHeight - 16) * 0.35;
    },
    squareRadius() {
      return this.squareHeight - 30;
    },
    healthHeight() {
      return (this.contentHeight - 16) * 0.65;
    },
    radarHeight() {
      return this.contentHeight - 24 - this.radarTitleHeight;
    },
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
    currentTotalStatus() {
      return 4;
    },
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions('statePrediction', []),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    init() {
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
    showChart() {
      this.chartShow = true;
    },
  },
};
</script>

<style lang="scss" scoped>
  .scoreContainer {
    width: 100%;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
    .scoreTitle {
      font-size: 14px;
      color: #333333;
    }
    .chart-title {
      font-size: 12px;
      color: var(--v-primary-base);
    }
    .chart-subtitle {
      color: #b2b2b2;
    }
  }
</style>
