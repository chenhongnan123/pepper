<template>
  <div class="d-flex">
    <DateTimeRangePicker v-model="dateFilter" />
    <v-text-field
      class="ml-2"
      color="primary"
      v-model="filterInfo.dispatchNumber"
      :label="this.$t('eaLog.table.dispatchNumber')"
      outlined
      dense
      clearable
      hide-details
    ></v-text-field>
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
      v-model="filterInfo.event"
      label="事件"
      outlined
      dense
      clearable
      hide-details
      :items="eventList"
      item-text="value"
      item-value="key"
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
    ...mapState('eaLog', ['machineList', 'eventList']),
    searchDisabled() {
      return this.dateFilter.length === 0;
    },
  },
  async created() {
    await this.getMachineList();
    await this.getEventList();
  },
  methods: {
    ...mapActions('eaLog', ['getMachineList', 'getEventList']),
    searchLogList() {
      const { dateFilter, filterInfo } = this;
      this.$emit('searchLogList', { dateFilter, filterInfo });
    },
  },
};
</script>
