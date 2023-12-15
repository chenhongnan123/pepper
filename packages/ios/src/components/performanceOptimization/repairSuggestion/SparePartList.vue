<template>
  <div :style="`height: ${contentHeight}px;width: 100%;`">
    <div
      class="mx-4 mt-2"
      v-if="showType === 'card'"
      :style="`height: ${contentHeight}px;width: 100%;`"
    >
      <v-row
        ref="scroll"
        style="width: 100%; overflow-y: auto; height: 100%"
        @scroll="handleScroll">
        <v-col
          v-for="(item, index) in bomdetailList"
          :key="index"
          :cols="4"
          class="pb-0"
        >
          <v-card
            :style="`height: ${cardHeight}px; overflow-y: scroll !important`"
            class="mt-2 ma-1 elevation-4 rounded-xl bluecard d-flex flex-column no-scrollbar pa-4"
            @click="goDetail(item)"
          >
          <div class="d-flex align-center" style="font-weight: bold;">
            <v-btn
              class=" mr-1"
              icon
              small
              color="primary"
            >
              <v-icon>mdi-cog</v-icon>
            </v-btn>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <div
                  v-bind="attrs"
                  v-on="on"
                  class="subtitle no-scrollbar text-hidden-overflow"
                  style="overflow: scroll; font-size: 1rem;"
                >
                  {{ item.bomName || '--' }}
                </div>
              </template>
              <span class="topTitle">{{ item.bomName || '--' }}</span>
            </v-tooltip>
          </div>
            <div
              style="
                width: 100%;
                height: 95%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              "
              class="mt-3 mr-1"
            >
            <span>
              <v-card-title
                primary-title
                class="pa-0 no-scrollbar"
                style="overflow: scroll;"
              >
              <div class="d-flex justify-space-between ml-8" style="width: 100%">
                <!-- 零件编号 测点 -->
                <div
                  class="topTitle text-truncate"
                >
                  <div class="d-flex align-center">
                    <span
                      class="body-2 greyColor alarm-type"
                      style="vertical-align: bottom"
                    >
                      {{ getPartType(item.partType) }}
                    </span>
                  </div>
                  <div
                    :class="`point-${item.alarmTag}`"
                    class="body-2 point no-scrollbar mt-2"
                  >
                    <img
                      :src="
                        require(`@/assets/icons/img/repairSuggestion/point-${item.alarmTag}.svg`)
                      "
                      alt=""
                    />
                    <span>{{ getAlarmText(item.alarmTag) }}</span>
                  </div>
                </div>
                <!-- 分数 -->
                <div
                  class="subtitle greyColor text-truncate score"
                  style="width: 200px;"
                >
                  <div class="d-flex flex-column align-center score-text">
                    <span>{{ $t('repairSuggestion.healthScore') }}</span>
                    <span class="d-flex align-center">
                      {{ item.healthScore || '-' }}
                      <div class="block"
                    :style="`background-color: ${getColorByStatus(item.healthScore).blockColor};`">
                    </div>
                    </span>
                  </div>
                  <div class="health"
      :style="`background-color: ${getColorByStatus(item.healthScore).bgColor};font-size: 14px;`">
                    <!-- <img
                      :src="require('@/assets/icons/img/repairSuggestion/leaf.svg')"
                      alt=""
                    /> -->
                    <v-icon
                      small
                      :style="`color: ${getColorByStatus(item.healthScore).color};`"
                    >{{ getColorByStatus(item.healthScore).icon }}</v-icon>
                    <span
                    :style="`color: ${getColorByStatus(item.healthScore).color};`">
                      {{ getColorByStatus(item.healthScore).status }}</span>
                  </div>
                </div>
              </div>
              </v-card-title>
              <!-- :style="`height: ${cardHeight - 120}px;`" -->
              <div class="img-time-life mt-0">
                <div class="part-img mr-2">
                  <!-- <img src="https://picsum.photos/id/11/1500/1300" alt=""> -->
                  <img :src="item.partPic"
      :alt="`${$t('repairSuggestionDetail.label.partPicture')}`">
                </div>
                <div class="part-time-life">
                  <v-card-text class="pa-0">
                    <v-row
                      v-if="item.sparePartLifeType !== '0'"
                      class="ma-0"
                    >
                      <v-col
                        :cols="6"
                        align="start"
                        class="pa-0"
                      >
                        <div class="greyColor">
                          {{ $t('repairSuggestion.servicelife') }}
                        </div>
                        <!-- 1计次 2计时 0无 -->
                        <div v-if="item.sparePartLifeType === '1'">
                          <span class="usedTimes primary--text">
                            {{ item.serviceLife || '-' }}{{ $t('repairSuggestion.count') }}
                          </span>
                        </div>
                        <div v-if="item.sparePartLifeType === '2'">
                          <span class="usedTimes primary--text">
                            {{ getUsedTimes(item) }}{{ $t('repairSuggestion.hour') }}
                          </span>
                        </div>
                      </v-col>
                      <v-col
                        :cols="6"
                        align="end"
                        class="pa-0"
                      >
                        <div  class="greyColor">
                          {{ $t('repairSuggestion.restlife') }}
                        </div>
                        <!-- 1计次 2计时 0无 -->
                        <div v-if="item.sparePartLifeType === '1'">
                          <span class="usedTimes primary--text">
                            {{ item.residualLife || '-' }}{{ $t('repairSuggestion.count') }}
                          </span>
                        </div>
                        <div v-if="item.sparePartLifeType === '2'">
                          <span class="usedTimes primary--text">
                            {{ item.residualLife || '-' }}{{ $t('repairSuggestion.hour') }}
                          </span>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-text
                    class="pa-0 pt-1"
                  >
                    <span class="d-flex align-center justify-space-between">
                      <div
                        v-if="item.sparePartLifeType !== '0'"
                        class="progress-bar"
                        :style="`
                          height: ${progressBarHeight}px;
                          position: relative; overflow:hidden;
                          width:90%
                        `"
                      >
                        <div :style="`opacity: .2;`">
                          <ProgressGap
                            v-for="k in 100"
                            :key="k"
                            :color="'#5D5D5D'"
                          />
                        </div>
                        <div :style="`width: ${getSchedule(item)}%`">
                          <ProgressGap
                            v-for="k in 100"
                            :key="k"
                            :color="'#08A6FF'"
                          />
                        </div>
                      </div>
                      <div
                        v-if="item.sparePartLifeType !== '0'"
                        style="text-align: right"
                      >
                        {{ getSchedule(item).toFixed(0) + '%' }}
                      </div>
                    </span>

                    <v-row
                      dense
                    >
                      <v-col
                        :cols="6"
                        align="start"
                        class="d-flex flex-column"
                      >
                        <span class="subtitle greyColor">
                          {{ $t('repairSuggestion.lastReplacementTime') }}
                        </span>
                        <span class="subtitle greyColor">
                          {{
                            item.lastReplaceTime
                              ? moment(item.lastReplaceTime).format('YYYY-MM-DD HH:mm:ss')
                              : '-'
                          }}
                        </span>
                      </v-col>
                      <v-col
                        :cols="6"
                        align="end"
                        class="d-flex flex-column"
                      >
                        <span class="subtitle greyColor">
                          {{ $t('repairSuggestion.replacementTime') }}
                        </span>
                        <span class="subtitle greyColor">
                          {{
                            item.nextReplaceTime
                              ? moment(item.nextReplaceTime).format('YYYY-MM-DD HH:mm:ss')
                              : '-'
                          }}
                        </span>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <div class="d-flex justify-end mt-2 mb-2">
                    <v-btn
                  color="primary"
                  class="mr-2"
                  text
                  @click.stop="setRecordDialog(item)"
                >
                  {{ $t('repairSuggestion.switchrecord') }}
                </v-btn>
                <div class="bluebtn">
                  <v-btn
                    small
                    @click.stop="setDialog(item)"
                  >
                    {{ $t('repairSuggestion.switchbtn') }}
                  </v-btn>
                </div>
                  </div>
                </div>
              </div>
              </span>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <switch-dialog
      :addDialog="addDialog"
      @closeDialog="addDialog = false"
      :machineBomDetail="selectedMachineBom"
      @getTableList="init"
    />
    <record-dialog
      :recordDialog="recordDialog"
      @closeDialog="recordDialog = false"
      :machineBomDetail="selectedMachineBom"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import moment from 'moment';
import SwitchDialog from './dialog/SwitchDialog.vue';
import RecordDialog from './dialog/RecordDialog.vue';
import ProgressGap from './ProgressGap.vue';

export default {
  name: 'SparePartList',
  data() {
    return {
      moment,
      clientheight: document.body.clientHeight,
      clientwidth: document.body.clientWidth,
      showType: 'card',
      addDialog: false,
      recordDialog: false,
      selectedMachineBom: {},
      bomdetailList: [],
      progressBarHeight: 15,
    };
  },
  components: {
    SwitchDialog,
    ProgressGap,
    RecordDialog,
  },
  props: {
    details: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState('setting', ['mainProduct']),
    ...mapState('repairSuggestion', ['partTypeList']),
    contentHeight() {
      return this.clientheight - 310;
    },
    cardHeight() {
      return (this.contentHeight - 100) / 2.3;
    },
    grapHeight() {
      return (this.cardHeight - 100) / 1.6;
    },
  },
  watch: {
    $route: {
      handler(to, from) {
        if (from.name !== 'healthAssessmentDetail') {
          delete sessionStorage.sparePartListScrollTop;
        }
      },
      deep: true,
      immediate: true,
    },
    details: {
      handler(val) {
        if (val) {
          this.init();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapActions('repairSuggestion', ['getNextBomList', 'getDeviceHealthInfo']),
    ...mapActions('statePrediction', [
      'getDeviceBomDetailInfo',
    ]),
    handleScroll(e) {
      if (!this.noScroll) {
        sessionStorage.setItem('sparePartListScrollTop', e.target.scrollTop);
      } else {
        this.noScroll = false;
      }
    },
    handleClickAppviewBtn() {
      this.showType = 'card';
    },
    handleClickListviewBtn() {
      this.showType = 'list';
    },
    async init() {
      if (this.details.bomId) {
        const healthInfo = await this.getDeviceHealthInfo();
        const bomdetailList = await this.getNextBomList(this.details.bomId);
        bomdetailList.forEach((item) => {
          item.healthScore = healthInfo[item.bomId].partHealth;
        });
        this.bomdetailList = bomdetailList;
        this.$nextTick(() => {
          const sparePartListScrollTop = sessionStorage.getItem('sparePartListScrollTop');
          if (sparePartListScrollTop) {
            delete sessionStorage.sparePartListScrollTop;
            this.noScroll = true;
            this.$refs.scroll.scrollTop = Number(sparePartListScrollTop);
          }
        });
      }
    },
    // 获取使用时间
    getUsedTimes(item) {
      if (!item.sparePartLife || !item.serviceLife) {
        return 0; // 字段是null 直接返回0
      }
      // sparePartLifeType === 2 计时
      if (item.sparePartLifeType === '2') {
        // 使用寿命 serviceLife 毫秒/次，需要转换成小时，所以没用这个字段
        // 总寿命 sparePartLife 单位小时或者次
        // 剩余寿命 residualLife 单位小时或者次
        const usedTimes = item.sparePartLife - item.residualLife;
        return usedTimes;
      }
      // 计次
      return Number(item.serviceLife);
    },
    // 获取进度
    getSchedule(item) {
      // 处理总寿命为null的情况
      if (!item.sparePartLife) return 0;
      const usedTimes = this.getUsedTimes(item);
      const value = (usedTimes / item.sparePartLife) * 100;
      return value;
    },
    getAlarmText(alarmTag) {
      if (alarmTag === '0') return this.$t('header.normal');
      if (alarmTag === '1') return this.$t('header.dataWarnNum');
      if (alarmTag === '2') return this.$t('header.alarmWarnNum');
      if (alarmTag === '3') return this.$t('header.noMonitorNum');
      return alarmTag;
    },
    getPartType(partType) {
      const type = this.partTypeList.find((item) => item.dictValue === partType);
      if (type) {
        return type.dictLabel;
      }
      return '-';
    },
    getTimeBoxHeight(item) {
      const { sparePartLifeType } = item;
      if (sparePartLifeType === '0') return this.cardHeight - 152;
      return this.cardHeight - 200;
    },
    setDialog(item) {
      this.selectedMachineBom = item;
      this.addDialog = true;
    },
    setRecordDialog(item) {
      this.selectedMachineBom = item;
      this.recordDialog = true;
    },
    async getDeviceBomDetailInfoByBomId(bomId) {
      await this.getDeviceBomDetailInfo(bomId);
    },
    async goDetail(item) {
      await this.getDeviceBomDetailInfoByBomId(item.bomId);
      this.$router.push({
        name: 'healthAssessmentDetail',
        params: {
          id: item.bomId,
          partId: item.partId,
        },
      });
    },
    getColorByStatus(score) {
      switch (true) {
        case this.isInRange(score, 90, 100):
          return {
            status: this.$t('repairSuggestionDetail.label.healthy'),
            statusCode: 1,
            icon: 'mdi-leaf',
            color: 'rgba(5,96,42,1)',
            bgColor: 'rgba(76, 178, 28, 1)',
            blockColor: 'rgba(76, 178, 28, 1)',
            active: this.isInRange(score, 90, 100),
          }; // 健康
        case this.isInRange(score, 70, 90):
          return {
            status: this.$t('repairSuggestionDetail.label.relativelyHealthy'),
            statusCode: 2,
            icon: 'mdi-check',
            color: 'rgba(74, 121, 2, 1)',
            bgColor: 'rgba(176, 203, 13, 1)',
            blockColor: 'rgba(164, 186, 30, 1)',
            active: this.isInRange(score, 70, 90),
          }; // 比较健康
        case this.isInRange(score, 50, 70):
          return {
            status: this.$t('repairSuggestionDetail.label.subHealthy'),
            statusCode: 3,
            icon: 'mdi-minus',
            color: 'rgba(203, 207, 8, 1)',
            bgColor: 'rgba(255, 255, 0, 0.5)',
            blockColor: 'rgba(217, 222, 14, 1)',
            active: this.isInRange(score, 50, 70),
          }; // 亚健康
        case this.isInRange(score, 30, 50):
          return {
            status: this.$t('repairSuggestionDetail.label.earlyWarning'),
            statusCode: 4,
            icon: 'mdi-alert-circle-outline',
            color: 'rgba(255,152,0,1)',
            bgColor: 'rgba(255, 152, 0, 0.5)',
            blockColor: 'rgba(217, 125, 16, 1)',
            active: this.isInRange(score, 30, 50),
          }; // 预警
        case this.isInRange(score, 0, 30):
          return {
            status: this.$t('repairSuggestionDetail.label.fault'),
            statusCode: 5,
            icon: 'mdi-close',
            color: 'rgba(211, 6, 31,1)',
            bgColor: 'rgba(217, 0, 27, 0.5)',
            blockColor: 'rgba(201, 14, 36, 1)',
            active: this.isInRange(score, 0, 30),
          }; // 报警
        default:
          return {
            status: this.$t('repairSuggestionDetail.label.healthy'),
            statusCode: 1,
            icon: 'mdi-leaf',
            color: 'rgba(5,96,42,1)',
            bgColor: 'rgba(76, 178, 28, 1)',
            blockColor: 'rgba(76, 178, 28, 1)',
            active: this.isInRange(score, 90, 100),
          };
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
.no-scrollbar::-webkit-scrollbar {
  display: none;
  width: 0 !important;
}
.point {
  display: flex;
  align-items: center;
  height: 30px;
  border-radius: 2px;
  padding: 2px 8px;
  font-family: 'Arial', sans-serif;
  img {
    width: 80%;
    height: 80%;
  }
  span {
    margin-left: 5px;
  }
}
// 正常测点
.point-0 {
  background-color: rgba(52, 211, 243, 0.2);
}
// 数据告警
.point-1 {
  background-color: rgba(245, 154, 35, 0.2);
}
// plc告警
.point-2 {
  background-color: rgba(245, 154, 35, 0.2);
}
// 非测点
.point-3 {
  background-color: rgba(215, 215, 215, 0.2);
}
.alarm-type {
  padding: 0 5px;
  border-radius: 4px;
  background-color: rgba(242, 242, 242, 0.2);
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
  color: #b2b2b2;
  text-align: center;
  line-height: normal;
  // background-color: #55cb23;
}
.img-time-life {
  display: flex;
  align-items: center;
  .part-img {
    flex: 0 0 120px;
    height: 120px;
    width: 120px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .part-time-life {
    flex: 1;
    min-height: 170px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
.text-hidden-overflow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
// 分数
.score {
  width: 100%;
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 5px;
  background-color: #383e3e;
  .score-text {
    line-height: 20px;
  }
  .block {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-left: 4px;
  }
  .health {
    width: 121px;
    height: 35px;
    padding: 2px;
    margin-left: 5px;
    border-radius: 2px;
    // background-color: rgba(76, 178, 28, 0.2);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      margin-left: 2px;
      font-size: 12px;
    }
  }
}
.card-height {
  height: 140px;
  border: 1px solid red;
}
.progress-bar {
  > div {
    height: 100%;
    overflow: hidden;
    position: absolute;
    text-wrap: nowrap;
  }
}
.topTitle {
  font-size: 1.5rem;
  font-weight: 700;
}

.subtitle {
  font-size: 0.875rem;
}

.greyColor {
  color: rgba(255, 255, 255, 0.7);
}

.bluebtn {
  ::v-deep() .v-btn {
    background-color: rgba(50, 197, 255, 0.1);
    color: #00ffff;
    border-radius: 20px;
    border: 1px solid;
    height: 32px;
    width: 80px;
    font-size: 14px;
  }
}

.usedTimes {
  font-size: 1.25rem;
  font-weight: 700;
}

.icontext {
  position: relative;
  left: -6px;
  top: -4px;
  font-size: 16px;
}

.darktable {
  ::v-deep() .v-data-table-header th {
    background-color: #5b5b5f !important;
    color: var(--v-icon-base) !important;
  }
  ::v-deep() tbody {
    color: rgba(255, 255, 255, 0.6);
  }
}
.gradient-card {
  border: solid 1px transparent;
  border-radius: 16px !important;
  background-origin: border-box;
  background-clip: content-box, border-box;
  background-image: linear-gradient(#162831, #162831),
    linear-gradient(0deg, #23789a, #e5ecf1 25%, #a5c9db 26%, #23789a);
  ::v-deep .v-card {
    background-color: transparent;
    box-shadow: none;
  }
}
</style>
