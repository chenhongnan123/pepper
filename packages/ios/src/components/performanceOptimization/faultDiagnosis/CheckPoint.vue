<template>
  <div class="pa-1">
    <div
      class="tile-bluecard d-flex align-center"
      :style="`height: ${height}px;width: 100%`"
      tile
    >
      <div
        v-for="i in 6"
        :key="i"
        :class="`rectangle-${i}`"
      ></div>
      <div class="check-point d-flex align-center justify-end mr-4">
        <img
          :src="require('@/assets/icons/img/check-point-normal-dark.png')"
          alt=""
          height="64px"
          class="background-img"
        />
        <div class="d-flex flex-column justify-center align-center alarm-num">
          <span class="label-title mb-n1 text-truncate">{{ $t('header.normal') }}</span>
          <span class="primary--text num">{{ normalNum }}</span>
        </div>
      </div>
      <div class="check-point d-flex align-center justify-end mx-4">
        <img
          :src="require('@/assets/icons/img/check-point-abnormal-dark.png')"
          alt=""
          height="64px"
          class="background-img"
        />
        <div class="d-flex flex-column justify-center align-center alarm-num">
          <span class="label-title mb-n1 text-truncate">{{ $t('header.dataWarnNum') }}</span>
          <span class="warning--text num">{{ dataWarnNum }}</span>
        </div>
      </div>
      <div class="check-point d-flex align-center justify-end mx-4">
        <img
          :src="require('@/assets/icons/img/check-point-alarm-dark.png')"
          alt=""
          height="64px"
          class="background-img"
        />
        <div class="d-flex flex-column justify-center align-center alarm-num">
          <span class="label-title mb-n1 text-truncate">{{ $t('header.alarmWarnNum') }}</span>
          <span class="error--text num">{{ alarmWarnNum }}</span>
        </div>
      </div>
      <!-- 非测点 -->
      <div class="check-point d-flex align-center justify-end mx-4">
        <img
          :src="require('@/assets/icons/img/check-point-alarm-white.png')"
          alt=""
          height="64px"
          class="background-img"
        />
        <div class="d-flex flex-column justify-center align-center alarm-num">
          <span class="label-title mb-n1 text-truncate">{{ $t('header.noMonitorNum') }}</span>
          <span class="num">{{ noMonitorNum }}</span>
        </div>
      </div>
      <v-spacer></v-spacer>
      <v-card
        class="alarm-record d-flex align-center justify-center mr-12"
        @click="alarmLogDialog = true"
        :ripple="false"
      >
        <img
          :src="require('@/assets/icons/img/alarm-record-background-dark.svg')"
          alt=""
          class="background-img"
        />
        <img
          :src="require('@/assets/icons/img/alarm-record-icon-dark.png')"
          alt=""
          class="background-icon"
        />
        <div class="d-flex flex-column justify-center align-center">
          <div class="d-flex align-end">
            <span class="num primary--text">{{ alarmTotalCount.faultNum || 0 }}</span>
            <span class="label-title">{{ $t('header.records') }}</span>
          </div>
          <span class="label-title">{{ $t('header.alarmlog') }}</span>
        </div>
      </v-card>
    </div>
    <alarm-log-dialog
      :alarmLogDialog="alarmLogDialog"
      @closeDialog="alarmLogDialog = false"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AlarmLogDialog from './AlarmLogDialog.vue';

export default {
  name: 'CheckPoint',
  data() {
    return {
      alarmLogDialog: false,
      alarmPoint: [],
    };
  },
  props: {
    height: {
      type: Number,
    },
  },
  components: {
    AlarmLogDialog,
  },
  computed: {
    ...mapState('faultDiagnosis', ['alarmTotalCount']),
    normalNum() {
      return this.alarmPoint.normalNum;
    },
    dataWarnNum() {
      return this.alarmPoint.dataWarnNum;
    },
    alarmWarnNum() {
      return this.alarmPoint.alarmWarnNum;
    },
    // 非测点报警
    noMonitorNum() {
      return this.alarmPoint.noMonitorNum;
    },
    routename() {
      return this.$route.name;
    },
    isPageChaged() {
      return (
        this.routename !== 'faultDiagnosis'
        && this.routename !== 'statusMonitor'
        && this.routename !== 'repairSuggestion'
      );
    },
  },
  watch: {},
  created() {
    this.getAlarmRecord();
    this.getAlarmCount();
  },
  methods: {
    ...mapActions('faultDiagnosis', ['getCountInfo', 'getAlarmTotalCount']),
    async getAlarmRecord() {
      if (this.isPageChaged) {
        return;
      }
      this.alarmPoint = await this.getCountInfo();
      await this.$getTimeout(10000);
      this.getAlarmRecord();
    },
    getAlarmCount() {
      this.getAlarmTotalCount();
    },
  },
};
</script>
