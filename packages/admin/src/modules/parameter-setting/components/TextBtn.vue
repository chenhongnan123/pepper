<template>
  <div >
    <v-chip
      label
      class="rounded"
      :color="statusColor"
      text-color="white"
      small
    >
      {{statusText}}
    </v-chip>
  </div>
</template>

<script>
export default {
  computed: {
    statusText() {
      const { params: { data } } = this;
      if (data && data.configType === 'Y') {
        return this.$t('parameterSetting.btn.yes');
      }
      if (data && data.configType === 'N') {
        return this.$t('parameterSetting.btn.no');
      }
      return '-';
    },
    statusColor() {
      const { params: { data } } = this;
      if (data && data.configType === 'Y') {
        return 'success';
      }
      if (data && data.configType === 'N') {
        return 'warning';
      }
      return 'success';
    },
  },
};
</script>
