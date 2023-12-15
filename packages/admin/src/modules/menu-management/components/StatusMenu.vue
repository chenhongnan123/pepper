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
    ...mapState('menuManagement', [
      'visibleList',
    ]),
    statusText() {
      const { params, visibleList } = this;
      // console.log(params, 'parmas');
      if (params) {
        const status = visibleList.find((s) => s.dictValue === params.value) || {};
        return status.dictLabel || '-';
      }
      return '-';
    },
    statusColor() {
      const { params, visibleList } = this;
      // console.log(params, 'parmas');
      if (params) {
        const status = visibleList.find((s) => s.dictValue === params.value) || {};
        return status.listClass || 'subtitle';
      }
      return 'subtitle';
    },
  },
  methods: {
  },
};
</script>
