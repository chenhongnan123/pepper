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
  },
  components: {
  },
  computed: {
    ...mapState('errorRepair', ['statusList']),
    rowData() {
      return this.params.data;
    },
    status() {
      const { params } = this;
      return params.value || '';
    },
    statusText() {
      const text = this.statusList.find((item) => item.dictValue === this.status)?.dictLabel;
      return text || '-';
    },
    statusColor() {
      const labelClass = this.statusList.find((item) => item.dictValue === this.status)?.listClass;
      return labelClass || 'subtitle';
    },
  },
  methods: {
  },
};
</script>
