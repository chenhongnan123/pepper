<template>
  <v-card
    :height="height"
    elevation="0"
    color="bg"
    class="mr-3"
  >
    <v-card-title>
      <div class="font-weight-bold d-flex flex-column mt-n2" style="width: 100%;">
        <span class="text-hidden-overflow" :title="mainDevice?.deviceName">
          {{ mainDevice?.deviceName || '-' }}
        </span>
        <span :title="mainDevice?.deviceNumber"
          class="subtitle-2 grey--text text-hidden-overflow">
          {{ mainDevice?.deviceNumber || '-' }}
        </span>
      </div>
    </v-card-title>
    <v-card-text>
      <v-row no-gutters class="mt-n3">
        <!-- 设备图片展示 -->
        <v-col cols="6">
          <v-img
            :alt="$t('statePrediction.label.equipmentPicture')"
            :height="contentHeight"
            :width="'100%'"
            cover
            :src="mainDevice.devicePic"
            style="border-radius: 2px;"
          ></v-img>
        </v-col>
        <!-- 提示信息 -->
        <v-col
          cols="6"
          class="tipContainer pl-2"
          :style="`height: ${contentHeight}px;`"
        >
          <div
            class="greyBorder tipText pa-1 mb-2"
            style="height: 30%;overflow-y: auto;line-height: 20px;"
          >
            {{ getDeviceTipByStatus(deviceStatus()) }}
          </div>
          <div
            class="greyBorder pa-1"
            style="height: calc(70% - 8px);overflow: hidden;"
          >
            <div class="pa-1">
              <!-- 提示 -->
              <div class="d-flex">
                <div class="tipText mr-auto">
                  {{ `${$t('statePrediction.label.tips')}：` }}
                </div>
                <!-- 分页 -->
                <div class="paginationRight ml-auto">
                  <v-btn
                    icon
                    x-small
                    @click="prePage"
                    :disabled="currentPage === 1"
                  >
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <span class="paginationText mx-1">
                    <span class="mr-1">{{ suggestionList?.length ? currentPage : 0 }}</span>/
                    <span class="ml-1">{{ totalPage }}</span>
                  </span>
                  <v-btn
                    icon
                    x-small
                    @click="nextPage"
                    :disabled="currentPage === totalPage || totalPage === 0"
                  >
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </div>
              </div>
              <!-- 提示内容 -->
              <div
                class="tipContent"
                :style="`height: ${tipContentHeight}px;overflow-y: auto;`"
              >
                <div style="line-height: 20px;font-size: 12px;line-height: 14px;"
                  v-show="suggestionList?.length"
                  :title="suggestionList[currentPage - 1]?.tips">
                  {{ suggestionList[currentPage - 1]?.tips }}
                </div>
              </div>
              <!-- 详情按钮 -->
              <div class="d-flex justify-end custom-detail-btn mt-1">
                <v-btn v-show="suggestionList?.length"
                  x-small
                  dense
                  outlined
                  color="primary"
                  @click="goStateDetail(suggestionList[currentPage - 1])"
                >
                <!-- {{  suggestionList[currentPage - 1] }} -->
                  {{ $t('statePrediction.btn.viewDetail') }}
                </v-btn>
              </div>
            </div>
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

export default {
  name: 'DeviceInfo',
  components: {
  },
  data() {
    return {
      clientHeight: document.body.clientHeight,
      currentPage: 1,
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
    ...mapState('statePrediction', ['mainDeviceInfo', 'suggestionList', 'mainDevice', 'partList',
      'bomList',
      'deviceHealthInfo',
      'healthAverage',
    ]),
    contentHeight() {
      return this.height - 64 - 16;
    },
    tipContentHeight() {
      return this.contentHeight * 0.68 - 28 - 50;
    },
    moduleName() {
      return this.$route.name;
    },
    deviceInfo() {
      return {
        id: 1,
        name: this.$t('statePrediction.title.deviceName'),
        code: this.$t('statePrediction.title.deviceNumber'),
        picUrl: 'https://picsum.photos/id/11/500/300',
      };
    },
    totalPage() {
      if (this.suggestionList?.length) {
        return this.suggestionList?.length;
      }
      return 0;
    },
    partStatus() {
      return [
        {
          partName: '电机1',
          partNumber: 'EM01',
          score: 80,
        },
        {
          partName: '电机2',
          partNumber: 'EM02',
          score: 38,
        },
        {
          partName: '电机8',
          partNumber: 'EM08',
          score: 30,
        },
      ];
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
            // return this.$t('statePrediction.tips.partTip',
            // { number: bomNumber, name: bomName, status });
            return {
              bomId,
              partId,
              bomName,
              tips: this.$t('statePrediction.tips.partTip', { number: bomNumber, name: bomName, status }),
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
          text: this.$t('statePrediction.tips.healthy'),
        },
        {
          status: 2,
          text: this.$t('statePrediction.tips.relativelyHealthy'),
        },
        {
          status: 3,
          text: this.$t('statePrediction.tips.subHealthy'),
        },
        {
          status: 4,
          text: this.$t('statePrediction.tips.earlyWarning'),
        },
        {
          status: 5,
          text: this.$t('statePrediction.tips.fault'),
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
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions('statePrediction', [
      'getMainDeviceInfo',
      'getDeviceSuggestions',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    init() {
    },
    getDeviceTipByStatus(status) {
      const { tips } = this;
      const tip = tips.find((item) => item.status === status);
      return tip ? tip.text : '';
    },
    getStatusNameByScore(score) {
      if (score <= 30) {
        return this.$t('statePrediction.label.fault');
      }
      if (score > 30 && score <= 50) {
        return this.$t('statePrediction.label.earlyWarning');
      }
      if (score > 50 && score <= 70) {
        return this.$t('statePrediction.label.subHealthy');
      }
      if (score > 70 && score <= 90) {
        return this.$t('statePrediction.label.relativelyHealthy');
      }
      return this.$t('statePrediction.label.healthy');
    },
    prePage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPage) {
        this.currentPage += 1;
      }
    },
    goStateDetail(item) {
      // const id = this.partsList[this.currentPage - 1].partId;
      // this.$router.push({
      //   name: 'statePartDetail',
      //   params: { id, page: this.moduleName },
      // });
      this.$router.push({
        name: 'statePredictionDetail',
        params: {
          id: item.bomId,
          partId: item.partId,
        },
        query: {
          bomName: item.bomName,
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
.grid-r-3{
  display: grid;
  grid-template-columns: repeat(3,1fr);
}
  .tipContainer {
    .greyBorder {
      border: 1px solid #e0e0e0;
      border-radius: 6px;
    }
    .tipText {
      color: #b2b2b2;
      font-size: 12px;
      text-align: left;
    }
    .paginationRight {
      text-align: right;
      .paginationText {
        font-size: 12px;
        color: #b2b2b2;
        text-align: left;
        line-height: normal;
      }
    }
    .tipContent {
      font-size: 14px;
      color: #333333;
    }
    .custom-detail-btn {
      ::v-deep() .v-btn {
        height: 28px;
        font-size: 0.75rem;
      }
    }
  }
.text-hidden-overflow{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
