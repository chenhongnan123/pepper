<template>
  <div class="warp d-flex justify-space-around pa-4">
    <div class="warp-left pt-2 pr-2 ma-2 rounded">
      <v-carousel cycle height="100%" delimiter-icon="mdi-circle"
      hide-delimiter-background hide-delimiters
        show-arrows-on-hover v-if="allAlarmList?.length">
        <v-carousel-item v-for="(item, i) in allAlarmList" :key="i">
          <div class="carousel-title d-flex align-center rounded">
            <div class="carousel-card-icon d-flex justify-start align-center pl-4">
              <v-icon class="card-icon d-flex justify-center align-center">
                mdi-alert</v-icon>
            </div>
            <div class="card-content d-flex justify-center align-center">
              {{ item.alarmType === 'plc' ?
                `${$t('homeView.label.plcAlarm')}` :
                `${$t('homeView.label.dataAlarm')}` }}
            </div>
            <!-- 分页 -->
            <div class="carousel-page ml-auto px-2 mr-2 rounded">
              {{ i + 1 }}/{{ allAlarmList.length }}
            </div>
          </div>
          <template v-if="item.alarmType === 'data'">
            <DataAlarmList :alarmData="item" :height="320"></DataAlarmList>
          </template>
          <template v-if="item.alarmType === 'plc'">
              <PlcAlarmList :alarmData="item" :height="320"></PlcAlarmList>
          </template>
        </v-carousel-item>
      </v-carousel>
      <template v-else>
        <div class="carousel-title d-flex align-center rounded">
          <div class="carousel-card-icon d-flex justify-start align-center px-3">
            <v-icon class="card-icon d-flex justify-center align-center">
              mdi-alert</v-icon>
          </div>
          <div class="card-content d-flex justify-center align-center">
            {{ `${$t('repairSuggestionDetail.title.alarm')}` }}
          </div>

        </div>
        <div class="no-data">{{
      `${$t('repairSuggestionDetail.title.thereAreNo')}${$t('repairSuggestionDetail.title.alarm')}`
        }}</div>
      </template>
    </div>
    <div class="warp-right d-flex flex-column ma-2">
      <div class="warp-right-top d-flex pa-2 mb-2 rounded">
        <div class="warp-card-icon d-flex justify-center align-center">
          <v-icon class="card-icon d-flex justify-center align-center">
            mdi-bell-outline</v-icon>
        </div>
        <div class="card-content">
            {{ getDeviceTipByStatus(deviceStatus()) }}
        </div>

      </div>

      <div class="warp-right-bottom pa-2 rounded">
        <v-carousel cycle height="100%" delimiter-icon="mdi-circle"
        hide-delimiter-background hide-delimiters
          show-arrows-on-hover v-if="suggestionList?.length">
          <v-carousel-item v-for="(item, i) in suggestionList" :key="i">
            <div class="carousel-card d-flex flex-column justify-space-between px-2 py-1">
              <div class="carousel-title d-flex rounded">

                <div class="carousel-tips">
                  {{ `${$t('repairSuggestionDetail.label.tips')}：` }}
                </div>
                <!-- 分页 -->
                <div class="carousel-page ml-auto px-2 rounded">
                  {{ i + 1 }}/{{ suggestionList?.length }}
                </div>
              </div>
              <div class="carousel-content d-flex justify-space-between">
                <div class="carousel-content-left">
                  {{ item.tips || '-' }}
                </div>
                <div class="carousel-content-right pl-2">
                  <v-btn v-show="suggestionList?.length"
                  color="var(--v-primary-base)" dense outlined
                    @click="goStateDetail(item)">
                    {{ $t('repairSuggestionDetail.btn.viewDetail') }}
                  </v-btn>

                </div>
              </div>
            </div>
          </v-carousel-item>
        </v-carousel>
        <template v-else>
          <div class="carousel-title d-flex rounded">

            <div class="carousel-card d-flex flex-column justify-space-between px-2 py-1">
              <div class="carousel-title d-flex rounded">

                <div class="carousel-tips">
                  {{ `${$t('repairSuggestionDetail.label.tips')}：` }}
                </div>
              </div>
            </div>
          </div>
          <div class="no-data-tip">
        {{
      `${$t('repairSuggestionDetail.title.thereAreNo')}${$t('repairSuggestionDetail.label.tips')}`
          }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapActions,
} from 'vuex';
import DataAlarmList from './DataAlarmList.vue';
import PlcAlarmList from '../components/PlcAlarmList.vue';

export default {
  name: 'MessageCollect',
  data() {
    return {
      currentPage: 1,
      colors: [
        'indigo',
        'warning',
        'pink darken-2',
        'red lighten-1',
        'deep-purple accent-4',
      ],
      slides: [
        'First',
        'Second',
        'Third',
        'Fourth',
        'Fifth',
      ],
    };
  },
  components: {
    DataAlarmList,
    PlcAlarmList,
  },
  computed: {
    ...mapState('statePrediction', ['mainDeviceInfo', 'suggestionList', 'mainDevice', 'partList',
      'bomList',
      'deviceHealthInfo',
      'healthAverage',
      'algorithmPlcList',
      'recordList', 'algorithmTypeList', 'algorithmIconList',
    ]),
    moduleName() {
      return this.$route.name;
    },
    suggestionList() {
      if (this.partsList?.length) {
        const list = this.partsList.filter((item) => item.score < 70);
        if (list?.length) {
          return list.map((item) => {
            const {
              bomNumber, bomName, score, bomId, partId,
            } = item;
            const status = this.getStatusNameByScore(score);
            return {
              bomId,
              partId,
              tips: this.$t(
                'repairSuggestionDetail.tips.partTip',
                { number: bomNumber, name: bomName, status },
              ),
            };
          });
        }
      }
      return [];
    },
    tips() {
      return [
        {
          status: 1,
          text: this.$t('repairSuggestionDetail.tips.healthy'),
        },
        {
          status: 2,
          text: this.$t('repairSuggestionDetail.tips.relativelyHealthy'),
        },
        {
          status: 3,
          text: this.$t('repairSuggestionDetail.tips.subHealthy'),
        },
        {
          status: 4,
          text: this.$t('repairSuggestionDetail.tips.earlyWarning'),
        },
        {
          status: 5,
          text: this.$t('repairSuggestionDetail.tips.fault'),
        },
      ];
    },
    partsList() {
      const arr = Object.keys(this.deviceHealthInfo);
      const list = arr.map((item) => {
        const sameList = this.bomList.find((v) => v.bomId === Number(item));
        return sameList;
      });
      const bomLsit = list.filter((item) => item !== undefined);
      bomLsit.forEach((item) => {
        item.score = this.deviceHealthInfo[item.bomId].partHealth;
      });
      return bomLsit;
    },
    allAlarmList() {
      return this.algorithmPlcList.concat(this.recordList);
      // return this.recordList;
    },
  },
  created() {
  },
  methods: {
    ...mapActions('statePrediction', [
      'getDeviceBomDetailInfo',
    ]),
    async getDeviceBomDetailInfoByBomId(bomId) {
      await this.getDeviceBomDetailInfo(bomId);
    },
    getDeviceTipByStatus(status) {
      const { tips } = this;
      const tip = tips.find((item) => item.status === status);
      return tip ? tip.text : '';
    },
    getStatusNameByScore(score) {
      if (score <= 30) {
        return this.$t('repairSuggestionDetail.label.fault');
      }
      if (score > 30 && score <= 50) {
        return this.$t('repairSuggestionDetail.label.earlyWarning');
      }
      if (score > 50 && score <= 70) {
        return this.$t('repairSuggestionDetail.label.subHealthy');
      }
      if (score > 70 && score <= 90) {
        return this.$t('repairSuggestionDetail.label.relativelyHealthy');
      }
      return this.$t('repairSuggestionDetail.label.healthy');
    },
    async goStateDetail(item) {
      await this.getDeviceBomDetailInfoByBomId(item.bomId);
      this.$router.push({
        name: 'healthAssessmentDetail',
        params: {
          id: item.bomId,
          partId: item.partId,
        },
      });
    },
    deviceStatus() {
      let score = this.healthAverage;
      let status = 5;
      if (!score) score = 0;
      switch (true) {
        case this.isInRange(score, 90, 100):
          status = 1;
          break;
        case this.isInRange(score, 70, 90):
          status = 2;
          break;
        case this.isInRange(score, 50, 70):
          status = 3;
          break;
        case this.isInRange(score, 30, 50):
          status = 4;
          break;
        default:
          status = 5;
          break;
      }
      return status;
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
  height: 280px;

  .warp-left {
    flex: 0 0 49%;
    background-color: rgba(60, 68, 68, 0.5);

    .carousel-title {
      flex: 0 0 50px;

      .carousel-card-icon {
        flex: 0 0 60px;
        height: 100%;
        line-height: 100%;

        .card-icon {
          color: red;
          font-size: 40px;
        }
      }

      .card-content {
        font-size: 20px;
        font-weight: bold;
      }

      .carousel-page {
        font-size: 14px;
        font-weight: lighter;
        background: rgba(242, 242, 242, 0.20);
        color: #b2b2b2;
        height: 32px;
        line-height: 32px;
      }
    }

    .no-data {
      width: 100%;
      height: calc(100% - 66px);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .carousel-card {
      height: 100%;

      .carousel-title {
        flex: 0 0 50px;

        .carousel-card-icon {
          flex: 0 0 60px;
          height: 100%;
          line-height: 100%;

          .card-icon {
            color: red;
            font-size: 40px;
          }
        }

        .card-content {
          font-size: 14px;
        }
      }

      .carousel-type {
        flex: 0 0 20px;
      }

      .carousel-content {
        flex: 1;
        color: rgba(255, 255, 255, 0.698)
      }

      .carousel-time {
        flex: 0 0 20px;
        color: rgba(255, 255, 255, 0.698);

      }
    }
  }

  .warp-right {
    flex: 0 0 49%;

    .warp-right-top {
      flex: 0 0 30%;
      background-color: rgba(60, 68, 68, 0.5);

      .warp-card-icon {
        flex: 0 0 50px;
        height: 100%;
        line-height: 100%;

        .card-icon {
          color: var(--v-primary-base);
          font-size: 40px;
        }
      }

      .card-content {
        flex: 1;
        font-size: 16px;
        max-width: 500px;
        display: flex;
        align-items: center;
      }
    }

    .warp-right-bottom {
      flex: 1;
      background-color: rgba(60, 68, 68, 0.5);

      .carousel-card {
        height: 100%;

        .carousel-title {
          flex: 0 0 40px;

          .carousel-tips {
            font-size: 20px;
            font-weight: bold;
          }

          .carousel-page {
            font-size: 14px;
            font-weight: lighter;
            background: rgba(242, 242, 242, 0.20);
            color: #b2b2b2;
            height: 32px;
            line-height: 32px;
          }
        }

        .carousel-content {
          flex: 1;
          color: rgba(255, 255, 255, 0.698);
          display: flex;
          align-items: center;
        }
      }
    }
    .no-data-tip {
      width: 100%;
      height: calc(70% - 50px);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  ::v-deep .mdi-circle::before {
    font-size: 10px;
    color: #484a4a;
  }

  ::v-deep .v-btn--icon.v-size--small {
    width: 10px;
    height: 10px;
  }

  // .text-indent-2 {
  //     text-indent: 2em;
  // }
}
.text-hidden-overflow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

</style>
