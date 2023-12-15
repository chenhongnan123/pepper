<template>
  <div class="fault-diagnosis-detail">
    <div class="detail-head">
      <WarningDetailCard :bom-id="bomId" :data="data.alarmInfo" class="detail-warning"/>
    </div>
    <div class="detail-body">
      <div ref="dom" class="detail-body-left">
        <assembly-detail
          :bomId="bomId"
          :width="detailWidth"
          :cardHeight="detailHeight"
        />
      </div>
      <div class="detail-body-right">
        <div class="detail-body-right-top">
          <ExpertAdvice :alarm-code-id="alarmCodeId" :bomId="bomId"/>
        </div>
        <div class="detail-body-right-bottom">
          <CCTVMonitor
            :data="data.alarmInfo"
            :alarm-monitor-id="alarmMonitorId"
            :alarm-code-id="alarmCodeId"
            :bom-id="bomId"
            @update="$emit('update')"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AssemblyDetail from './AssemblyDetail.vue';
import WarningDetailCard from './components/WarningDetailCard.vue';
import ExpertAdvice from './components/ExpertAdvice.vue';
import CCTVMonitor from './components/CCTVMonitor.vue';

export default {
  name: 'FaultDiagnosisDetail',
  props: {
    bomId: {
      type: String,
      default: '',
    },
    alarmCodeId: {
      type: String,
      default: '',
    },
    alarmMonitorId: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default() {
        return {
          alarmInfo: {},
        };
      },
    },
  },
  data() {
    return {
      detailWidth: 0,
      detailHeight: 0,
      machinebomdetail: {},
    };
  },
  components: {
    WarningDetailCard,
    ExpertAdvice,
    CCTVMonitor,
    AssemblyDetail,
  },
  watch: {
  },
  mounted() {
    const doms = this.$refs.dom.getClientRects();
    if (doms[0]) {
      this.detailWidth = doms[0].width - 32;
      this.detailHeight = doms[0].height - 60;
    }
  },
};
</script>

<style lang="scss" scoped>
.fault-diagnosis-detail {
  position: absolute;
  left: 0;
  right: 0;
  top: 10px;
  bottom: 62px;
  padding: 0 60px;
  margin: 16px 0;
  .detail-head {
    height: 160px;
    .detail-warning {
      position: relative;
      top: -5px;
    }
  }
  .detail-body {
    height: calc(100% - 142px);
    display: flex;
    &-left {
      position: relative;
      width: 50%;
      min-width: 720px;
      height: calc(100% - 42px);
    }
    &-right {
      flex: 1;
      width: 50%;
      &-bottom {
        padding-top: 32px;
        height: 260px;
      }
    }
  }
}
</style>
