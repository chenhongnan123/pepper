<template>
  <div >
    <v-chip
      label
      class="rounded"
      :color="statusColor"
      small
    >
      {{text}}
    </v-chip>
  </div>
</template>

<script>
export default {
  computed: {
    text() {
      const { params: { data } } = this;
      const { onlineStatus } = data;
      if (onlineStatus === '1') {
        return '在线';
      }
      return '离线';
    },
    statusColor() {
      const { params: { data } } = this;
      const { onlineStatus } = data;
      if (onlineStatus === '1') return 'success';
      return 'error';
    },
  },
};
</script>
