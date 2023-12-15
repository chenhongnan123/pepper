<template>
  <!-- PLC报警 -->
  <div>
    <alarm-title
      :current-model="model"
      :total-model="carouselitemnum"
      title="faultDiagnosis.dataAlarm"
    />
    <v-card
      class="bluecard rounded-xl overflow-y-auto"
      rounded
    >
      <v-card-text class="pb-0">
        <v-carousel
          hide-delimiter-background
          hide-delimiters
          show-arrows-on-hover
          :cycle="carouselcycle"
          v-model="model"
          :height="height"
        >
          <!-- eslint-disable-next-line -->
          <v-carousel-item
            v-for="j in carouselitemnum"
            :key="j"
            @mouseover="carouselcycle = false"
            @mouseleave="carouselcycle = true"
          >
            <v-row
              class=" overflow-y-auto"
              :style="`height: ${height}px`"
            >
              <v-col
                cols="3"
                v-for="(alarm, key) in dataAlarmList.slice((j - 1) * 8, 8 * j)"
                :key="key"
              >
                <v-card
                  class="mx-4 rounded-lg py-1 alarm-item-warning"
                  @click="goDetails(alarm)"
                >
                  <v-list-item
                    two-line
                    style="display: flex; justify-content: space-between"
                  >
                    <v-list-item-icon class=" my-4 mr-4">
                      <img
                        :src="require('@/assets/icons/img/fault-diagnosis/warningbox.png')"
                        alt=""
                        class="data-warning-icon"
                      />
                    </v-list-item-icon>
                    <v-list-item-content style="flex: 1.7;" >
                      <v-list-item-subtitle
                        class="mb-2 text-subtitle-1 bd"
                        style="white-space:initial!important"
                      >
                        {{ alarm.eventName }}
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 error--text">
                        <div class="algorithm-type">{{ getType(alarm) }}</div>
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-content style="flex: 0.8">
                      <v-list-item-subtitle class="mb-2">
                        <div
                          class="bd count-box"
                          :class="iszh?'text-subtitle-1':'text-subtitle-2'"
                        >
                          {{ $t('faultDiagnosis.abnormalFluctuations') }}
                        </div>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6">
                        <div class="count-box">
                          <span class="number">{{ showValue(alarm.alarmCount) }}</span>
                          <div class="count">{{ $t('faultDiagnosis.count') }}</div>
                        </div>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-col>
            </v-row>
          </v-carousel-item>
        </v-carousel>
      </v-card-text>
      <v-card-actions class="pt-0 mt-n7">
        <v-spacer></v-spacer>
        <div>
          <v-icon
            x-small
            :color="i - 1 == model ? 'rgba(255,255,255,0.7)' : 'rgba(0, 0, 0, 0.5)'"
            v-for="i in carouselitemnum"
            :key="i"
            class="mx-1"
            >mdi-circle</v-icon
          >
        </div>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import AlarmTitle from './AlarmTitle.vue';

export default {
  name: 'AlarmInfo',
  data() {
    return {
      model: 0,
      carouselcycle: true,
      dictTypeList: [],
    };
  },
  props: {
    height: {
      type: Number,
    },
  },
  components: {
    AlarmTitle,
  },
  computed: {
    ...mapState('faultDiagnosis', ['dataAlarmList']),
    routename() {
      return this.$route.name;
    },
    carouselitemnum() {
      if (this.dataAlarmList.length > 0) {
        return Math.ceil(this.dataAlarmList.length / 8);
      }
      return 0;
    },
    iszh() {
      return this.$i18n.locale === 'zhHans';
    },
    isPageChaged() {
      return this.routename === 'faultDiagnosis';
    },
  },
  watch: {},
  async created() {
    this.init();
    this.dictTypeList = await this.getDictDataList('sys_algorithm');
  },
  methods: {
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapActions('faultDiagnosis', ['getDataAlarmList', 'getDictDataList']),
    async init() {
      this.getDataAlarmList();
      if (this.isPageChaged) {
        await this.$getTimeout(5000);
        this.init();
      }
    },
    async goDetails(task) {
      const { bomId, eventId } = task;
      const url = `/fault-diagnosis-alarm-detail/${eventId}/${bomId}`;
      this.$router.push(url);
    },
    getType(alarm) {
      const { type, algorithmType, algorithm } = alarm;
      if (type === '0') {
        // 标准算法 要显示单值 MR
        const value = this.dictTypeList.find((item) => item.dictValue === algorithmType);
        const baseStr = `${this.$t('faultDiagnosis.standardAlgorithm')}|${
          value?.remark
        }|${algorithm}`;
        return baseStr;
      }
      if (type === '1') {
        // 定制算法
        return this.$t('faultDiagnosis.customAlgorithms');
      }
      return '--';
    },
    showValue(value) {
      if (!value) return '-';
      return value > 99 ? '99+' : value;
    },
  },
};
</script>
<style scoped lang="scss">
.data-warning-icon {
  width: 65px;
  height: 65px;
}
.algorithm-type {
  font-size: 10px;
  height: 18px;
  padding: 2px 2px 2px 2px;
  border-radius: 16px;
  background-color: rgba(242, 242, 242, 0.2);
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
  color: #b2b2b2;
  text-align: center;
  line-height: normal;
}
.bd {
  background-color: rgba(255, 255, 255, 0);
  box-sizing: border-box;
  font-family: 'Arial Bold', 'Arial Normal', 'Arial', sans-serif;
  font-weight: 700;
  color: #34d3f3;
  text-align: left;
  line-height: normal;
  font-size: 20px;
}
.count-box {
  display: flex;
  justify-content: flex-end;
  .number {
    font-weight: bold;
    font-size: 24px;
    position: relative;
    top: 6px;
  }
  .count {
    font-size: 12px !important;
    margin-left: 5px;
    margin-top: 17px;
  }
}
</style>
