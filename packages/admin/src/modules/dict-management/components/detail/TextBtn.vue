<template>
  <div >
    <v-chip
      label
      class="rounded"
      :color="statusColor"
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
      const { dictLabel } = data;
      if (data && dictLabel) {
        return dictLabel;
      }
      return '-';
    },
    statusColor() {
      const { params: { data } } = this;
      const { listClass } = data;
      if (listClass === 'danger') return 'error';
      if (listClass === 'default') return 'transparent';
      return listClass;
    },
  },
};
</script>
