<template>
  <div class="pa-4">
    <div class="d-flex">
      <div :style="`width: ${100}%;`">
        <Detail
          :data="{alarmInfo}"
          :bom-id="bomId"
          :alarm-monitor-id="alarmMonitorId"
          :alarm-code-id="alarmCodeId"
          @update="getBasicMonitorInfo"/>
      </div>
    </div>
  </div>
</template>

<script>
import Detail from '../components/performanceOptimization/faultDiagnosis/FaultDiagnosisDetail.vue';

export default {
  data() {
    return {
      bomId: '',
      alarmMonitorId: '',
      alarmCodeId: '',
      alarmInfo: {
        time: '-',
        code: '-',
        content: '-',
        lastTime: '-',
        ip: '-',
        port: '-',
        createTime: '-',
        cameraThoroughfare: '-',
        monitorLoadingStatus: -1,
        videoPath: '',
        cameraAccount: '',
        cameraPassword: '',
      },
    };
  },
  components: {
    Detail,
  },
  computed: {
    isPageChaged() {
      return this.$route.name !== 'faultDiagnosisDetail';
    },
  },
  methods: {
    // 获取报警监控详细信息
    async getBasicMonitorInfo() {
      const result = await this.$basicGet(`monitor/${this.alarmMonitorId}`);
      if (result && result.data) {
        const {
          alarmName,
          lastAlarmTime,
          alarmStartTimestamp,
          alarmCode,
          cameraIp,
          cameraPort,
          cameraThoroughfare,
          monitorLoadingStatus,
          createTime,
          videoPath,
          cameraAccount,
          cameraPassword,
        } = result.data;
        this.alarmInfo = {
          time: alarmStartTimestamp ? (new Date(alarmStartTimestamp)).toLocaleString().replace(/\//g, '-') : '-',
          code: alarmCode || '-',
          content: alarmName || '-',
          lastTime: lastAlarmTime ? (new Date(lastAlarmTime)).toLocaleString().replace(/\//g, '-') : '-',
          ip: cameraIp || '-',
          port: cameraPort || '-',
          createTime: createTime || '-',
          cameraThoroughfare: cameraThoroughfare || '-',
          monitorLoadingStatus: monitorLoadingStatus || -1,
          cameraAccount,
          cameraPassword,
          videoPath,
        };
        // 执行状态轮询
        this.getData();
      }
    },
    async getData() {
      if (this.isPageChaged) {
        return;
      }
      if (this.alarmInfo.monitorLoadingStatus === '0') {
        await this.$getTimeout(5000);
        await this.getBasicMonitorInfo();
      }
    },
  },
  created() {
    const { bomId, alarmMonitorId, alarmCodeId } = this.$route.query;
    this.bomId = bomId;
    this.alarmMonitorId = alarmMonitorId;
    this.alarmCodeId = alarmCodeId;
  },
  mounted() {
    this.getBasicMonitorInfo();
  },
};
</script>
