<template>
  <div >
    <!-- 加载状态 -->
    <v-chip
      class=" justify-center"
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
      const { params: { data, field } } = this;
      const value = data[field];
      if (value === '0') {
        return this.$t('alarmMonitor.btn.loading');
      }
      if (value === '1') {
        return this.$t('alarmMonitor.btn.loadsuccess');
      }
      if (value === '2') {
        return this.$t('alarmMonitor.btn.loadfail');
      }
      return '--';
    },
    statusColor() {
      const { params: { data, field } } = this;
      const value = data[field];
      if (value === '0') {
        return 'primary';
      }
      if (value === '1') {
        return 'success';
      }
      if (value === '2') {
        return 'error';
      }
      return '-';
    },
  },
};
</script>
