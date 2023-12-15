<template>
  <div
    style="color: #0055c2"
    class="mt-1"
  >
    {{ statusText }}
  </div>
</template>

<script>
export default {
  computed: {
    statusText() {
      const {
        params: { data, field },
      } = this;
      const value = data[field];
      if (value === '0') {
        return '写入中';
      }
      if (value === '1') {
        return '成功';
      }
      if (value === '2') {
        return '失败';
      }
      return '-';
    },
  },
};
</script>
