<template>
  <div class="d-flex">
    <DateTimeRangePicker v-model="dateFilter" />
    <v-autocomplete
      class="ml-2"
      color="primary"
      v-model="filterInfo.deviceId"
      :label="this.$t('eaLog.table.deviceName')"
      :items="machineList"
      item-text="deviceName"
      item-value="deviceId"
      outlined
      dense
      clearable
      hide-details
    ></v-autocomplete>
    <v-autocomplete
      class="ml-2"
      color="primary"
      v-model="filterInfo.recipeVersion"
      label="版本号"
      outlined
      dense
      clearable
      hide-details
      :items="recipeVersionList"
      item-text="recipeVersion"
      item-value="recipeVersion"
      :disabled="!filterInfo.deviceId"
    ></v-autocomplete>
    <v-btn
      style="height: 40px"
      outlined
      color="primary"
      class="text-none ml-2"
      :disabled="searchDisabled"
      @click="searchLogList"
    >
      搜索
    </v-btn>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import DateTimeRangePicker from '@/components/commonUI/DateTimeRangePicker';

export default {
  name: 'logFilter',
  components: {
    DateTimeRangePicker,
  },
  data() {
    return {
      dateFilter: [],
      filterInfo: {},
    };
  },
  computed: {
    ...mapState('recipeLog', ['machineList', 'recipeVersionList']),
    searchDisabled() {
      return this.dateFilter.length === 0;
    },
  },
  async created() {
    await this.getMachineList();
  },
  methods: {
    ...mapActions('recipeLog', ['getMachineList', 'getRecipeVersionList']),
    searchLogList() {
      const { dateFilter, filterInfo } = this;
      this.$emit('searchLogList', { dateFilter, filterInfo });
    },
  },
  watch: {
    'filterInfo.deviceId': {
      async handler(deviceId) {
        if (!deviceId) return;
        await this.getRecipeVersionList(deviceId);
      },
    },
  },
};
</script>
