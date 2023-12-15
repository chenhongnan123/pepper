<template>
  <div >
    <v-chip
      label
      class="rounded justify-center"
      :color="statusColor"
      small
      style="width: 60px;"
    >
      {{ statusText }}
    </v-chip>
  </div>
</template>

<script>
export default {
  computed: {
    statusText() {
      // field 是 checkResult 或者 detailCheckResult
      const { params: { data, field } } = this;
      const value = data[field];
      if (value === '0') {
        return '不合格';
      }
      return '合格';
    },
    statusColor() {
      const { params: { data, field } } = this;
      const value = data[field];
      if (value === '0') {
        return 'error';
      }
      return 'success';
    },
  },
};
</script>
