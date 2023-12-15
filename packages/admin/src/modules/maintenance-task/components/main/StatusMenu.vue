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
import { mapState } from 'vuex';

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
    ...mapState('maintenanceTask', [
      'statusList',
    ]),
    moduleName() {
      return this.$route.name;
    },
    statusText() {
      const { params, statusList } = this;
      if (params) {
        let status = {};
        if (params.data.isDelay) {
          status = statusList.find((s) => s.value === '3') || {};
        } else {
          status = statusList.find((s) => s.value === params.data.status) || {};
        }
        if (status.text) {
          return this.$t(`maintenanceTask.label.${status.text}`) || '-';
        }
      }
      return '-';
    },
    statusColor() {
      const { params, statusList } = this;
      // console.log(params, 'parmas');
      if (params) {
        let status = {};
        if (params.data.isDelay) {
          status = statusList.find((s) => s.value === '3') || {};
        } else {
          status = statusList.find((s) => s.value === params.data.status) || {};
        }
        return status.color || 'info';
      }
      return 'info';
    },
  },
  methods: {
  },
};
</script>
