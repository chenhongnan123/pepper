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
      const { params: { data, field } } = this;
      const value = data[field];
      if (value === 0) {
        return '成功';
      }
      return '失败';
    },
    statusColor() {
      const { params: { data, field } } = this;
      const value = data[field];
      if (value === 0) {
        return 'success';
      }
      return 'error';
    },
  },
};
</script>
