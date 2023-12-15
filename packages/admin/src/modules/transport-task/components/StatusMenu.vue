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
    ...mapState('transportTask', [
      'statusList',
    ]),
    moduleName() {
      return this.$route.name;
    },
    statusText() {
      const { params, statusList } = this;
      // console.log(params, 'parmas');
      if (params) {
        const status = statusList.find((item) => item.dictValue === params.value);
        return status ? status.dictLabel : '-';
      }
      return '-';
    },
    statusColor() {
      const { params, statusList } = this;
      // console.log(params, 'parmas');
      if (params) {
        const status = statusList.find((item) => item.dictValue === params.value);
        return status ? status.listClass : 'subtitle';
      }
      return 'subtitle';
    },
  },
  methods: {
  },
};
</script>
