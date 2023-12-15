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
  data() {
    return {
    };
  },
  mounted() {
    // console.log(this.params);
  },
  components: {
  },
  computed: {
    statusText() {
      const { params } = this;
      // console.log(params, 'parmas');
      if (params && params.data.onlineStatus === '1') {
        return this.$t('connectionConfiguration.table.online');
      }
      return this.$t('connectionConfiguration.table.offline');
    },
    statusColor() {
      const { params } = this;
      // console.log(params, 'parmas');
      if (params && params.data.onlineStatus === '1') {
        return 'success';
      }
      return 'info';
    },
  },
  methods: {
  },
};
</script>
