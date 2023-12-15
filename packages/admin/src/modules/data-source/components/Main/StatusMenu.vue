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
import {
  mapState,
} from 'vuex';

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
    ...mapState('dataSource', [
      'statusList',
    ]),
    statusText() {
      const { params } = this;
      // console.log(params, 'parmas');
      if (params) {
        // const status = statusList.find((s) => s.value === params.data.active) || {};
        // return status.text || '-';
        return this.$t(`dataSource.label.statusList.${params.data.active}`);
      }
      return '-';
    },
    statusColor() {
      const { params, statusList } = this;
      // console.log(params, 'parmas');
      if (params) {
        const status = statusList.find((s) => s.value === params.data.active) || {};
        return status.color || 'subtitle';
      }
      return 'subtitle';
    },
  },
  methods: {
  },
};
</script>
