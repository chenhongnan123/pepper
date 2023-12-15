<template>
  <div>
    <!-- 报警类型 -->
    <v-chip
      label
      class="rounded justify-center"
      :color="statusColor"
      small
    >
      {{ statusText }}
    </v-chip>
  </div>
</template>

<script>
export default {
  computed: {
    statusText() {
      const {
        params: {
          data: { alarmEndTimestamp },
        },
      } = this;
      // 没有报警时间，说明报警正在进行
      if (alarmEndTimestamp) {
        return this.$t('alarmMonitor.label.alarmend');
      }
      return this.$t('alarmMonitor.label.inalarm');
    },
    statusColor() {
      const {
        params: {
          data: { alarmEndTimestamp },
        },
      } = this;
      if (alarmEndTimestamp) {
        return 'info';
      }
      return 'error';
    },
  },
};
</script>
