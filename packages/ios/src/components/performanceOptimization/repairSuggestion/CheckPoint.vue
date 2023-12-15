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
        <div class="d-flex flex-column justify-center align-center">
          <span class="label-title mb-n1">{{$t('repairSuggestion.normal')}}</span>
          <span class="primary--text num">{{normalCount}}</span>
        </div>
      </div>
      <div class="check-point d-flex align-center justify-end mx-4">
        <img
          :src="require('@/assets/icons/img/check-point-abnormal-dark.png')"
          alt=""
          height="64px"
          class="background-img"
        />
        <div class="d-flex flex-column justify-center align-center">
          <span class="label-title mb-n1">{{$t('repairSuggestion.abnormal')}}</span>
          <span class="warning--text num">{{warningCount}}</span>
        </div>
      </div>
      <div class="check-point d-flex align-center justify-end mx-4">
        <img
          :src="require('@/assets/icons/img/check-point-alarm-dark.png')"
          alt=""
          height="64px"
          class="background-img"
        />
        <div class="d-flex flex-column justify-center align-center">
          <span class="label-title mb-n1">{{$t('repairSuggestion.alarm')}}</span>
          <span class="error--text num">{{alarmCount}}</span>
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
            <span class="num primary--text">{{alarmRecordCount}}</span>
            <span class="label-title">{{$t('repairSuggestion.records')}}</span>
          </div>
          <span class="label-title">{{$t('repairSuggestion.alarmlog')}}</span>
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
import { mapState, mapActions } from 'vuex';
import AlarmLogDialog from './AlarmLogDialog.vue';

export default {
  name: 'CheckPoint',
  data() {
    return {
      alarmLogDialog: false,
      alarmRecordCount: 0,
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
    ...mapState('faultDiagnosis', [
      'alarmDetail',
      'pointCount',
    ]),
    normalCount() {
      const normal = this.pointCount.find((item) => item.key === 'NORMAL')?.value || 0;
      const defult = this.pointCount.find((item) => item.key === 'DEFULT')?.value || 0;
      return normal + defult;
    },
    warningCount() {
      const warning = this.pointCount.find((item) => item.key === 'WARRNING')?.value || 0;
      return warning;
    },
    alarmCount() {
      const error = this.pointCount.find((item) => item.key === 'ERROR')?.value || 0;
      return error;
    },
    // alarmRecordCount() {
    //   return this.alarmDetail.length || '0';
    // },
    routename() {
      return this.$route.name;
    },
    isPageChaged() {
      return this.routename !== 'faultDiagnosis' && this.routename !== 'statusMonitor'
        && this.routename !== 'repairSuggestion';
    },
  },
  watch: {
  },
  created() {
    this.getAlarmCount();
  },
  methods: {
    ...mapActions('maintenanceTask', [
      'getTableRecords',
    ]),
    async getAlarmCount() {
      if (this.isPageChaged) {
        return;
      }
      const list = await this.getTableRecords({
        API_ROUTE_PATH: 'GET_WARNING_ERROR_LIST',
      });
      if (list?.length) {
        this.alarmRecordCount = list.length;
      }
      await this.$getTimeout(5000);
      await this.getAlarmCount();
    },
  },
};
</script>
