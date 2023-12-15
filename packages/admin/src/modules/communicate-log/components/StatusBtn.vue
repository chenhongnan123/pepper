<template>
  <div>
    <v-btn
      text
      class="rounded justify-center"
      :color="statusColor"
      small
    >
      {{ statusText }}
    </v-btn>
  </div>
</template>

<script>
export default {
  computed: {
    statusText() {
      const {
        params: {
          data: { leve },
        },
      } = this;
      if (leve === '1') {
        return '连接成功';
      }
      if (leve === '2') {
        return '通讯异常';
      }
      if (leve === '3') {
        return '通讯断开';
      }
      return '-';
    },
    statusColor() {
      const {
        params: {
          data: { leve },
        },
      } = this;
      if (leve === '1') {
        return 'success';
      }
      if (leve === '2') {
        return 'warning';
      }
      if (leve === '3') {
        return 'error';
      }
      return '-';
    },
  },
};
</script>
