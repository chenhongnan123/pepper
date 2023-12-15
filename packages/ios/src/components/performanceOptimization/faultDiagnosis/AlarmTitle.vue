<template>
  <!-- 报警标题 -->
  <div class="alarm-title-box d-flex align-center justify-space-between">
    <div class="title font-weight-bold d-flex align-center">
      <img
        class="alarm-img"
        :src="require('@/assets/icons/img/fault-diagnosis/plcalarmicon.png')"
        alt=""
      />
      <span class="ml-2">{{ $t(`${title}`) }}</span>
    </div>
    <div class="count">{{ currentModel + 1 }} / {{ totalModel }}</div>
    <img class="line" :src="require('@/assets/icons/img/fault-diagnosis/line.png')" alt="">
  </div>
</template>
<script>
export default {
  name: 'AlarmTitle',
  props: {
    currentModel: {
      type: Number,
      default: 0,
    },
    totalModel: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: 'faultDiagnosis.plcAlarm',
    },
  },
};
</script>
<style scoped lang="scss">
.alarm-title-box {
  height: 40px;
  margin: 5px 0 10px;
  position: relative;
  .alarm-img {
    width: 18px;
  }
  .line {
    height: 6px;
    position: absolute;
    bottom: 0;
  }
  .count {
    height: 33px;
    line-height: 33px;
    padding: 0 8px;
    font-size: 12px;
    border-radius: 4px;
    color: #b2b2b2;
    color: #b2b2b2;
    text-align: center;
  }
}
</style>
