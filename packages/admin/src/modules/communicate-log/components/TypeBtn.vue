<template>
  <div>
    {{ statusText }}
  </div>
</template>

<script>
export default {
  name: 'TypeBtn',
  computed: {
    statusText() {
      const {
        params: {
          data: { connectionType },
        },
      } = this;
      if (connectionType === '1') {
        return 'SNAP7';
      }
      if (connectionType === '2') {
        return 'OPCUA3';
      }
      if (connectionType === '3') {
        return 'AB';
      }
      if (connectionType === '4') {
        return '三菱';
      }
      if (connectionType === '5') {
        return 'MODBUS';
      }
      return '-';
    },
  },
};
</script>
