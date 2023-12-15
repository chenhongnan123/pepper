<template>
  <div class="d-flex">
    <DateTimeRangePicker
      v-model="dateFilter"
      @input="dateChange"
    />
    <v-autocomplete
      class="ml-2"
      color="primary"
      v-model="bomParentId"
      :label="this.$t('alarmMonitor.label.foldername')"
      :items="bomList"
      item-text="bomName"
      item-value="bomId"
      outlined
      dense
      clearable
      hide-details
    >
      <template v-slot:item="{ item }">
        <div
          class="d-flex justify-space-between"
          style="width: 100%"
        >
          <v-list-item-content>
            <v-list-item-title v-text="item.bomName"></v-list-item-title>
            <v-list-item-subtitle v-text="item.bomNumber"></v-list-item-subtitle>
          </v-list-item-content>
        </div>
      </template>
    </v-autocomplete>
    <v-autocomplete
      class="ml-2"
      color="primary"
      v-model="bomId"
      :label="this.$t('alarmMonitor.label.partname')"
      :items="partList"
      :disabled="!bomParentId"
      item-text="bomName"
      item-value="bomName"
      outlined
      dense
      clearable
      hide-details
    >
      <template v-slot:item="{ item }">
        <div
          class="d-flex justify-space-between"
          style="width: 100%"
        >
          <v-list-item-content>
            <v-list-item-title v-text="item.bomName"></v-list-item-title>
            <v-list-item-subtitle v-text="item.bomNumber"></v-list-item-subtitle>
          </v-list-item-content>
        </div>
      </template>
    </v-autocomplete>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import _ from 'lodash';
import DateTimeRangePicker from '@/components/commonUI/DateTimeRangePicker.vue';

let that = this;
export default {
  name: 'SearchFilter',
  components: {
    DateTimeRangePicker,
  },
  data() {
    return {
      bomParentId: null, // 用于过滤报警监控的层级
      bomList: [],
      bomId: null, // 根据bomId过滤报警监控
      dateFilter: [],
    };
  },
  mounted() {
    this.init();
    that = this;
  },
  computed: {
    ...mapState('alarmMonitor', ['partList']),
  },
  methods: {
    ...mapActions('alarmMonitor', ['getBomList', 'getPartList']),
    async init() {
      const bomList = await this.getBomList();
      this.bomList = bomList;
    },
    refresh() {
      const beginTime = new Date().setHours(0, 0, 0, 0);
      const endTime = new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000;
      const initDateRange = [beginTime, endTime];
      this.dateFilter = initDateRange;
      this.bomParentId = '';
      this.bomId = '';
      this.emitQuery();
    },
    // 过滤对象里的null undefined ''
    filterObject(obj) {
      Object.keys(obj).forEach((k) => {
        // eslint-disable-next-line use-isnan
        if (!obj[k]) delete obj[k];
      });
      return obj;
    },
    emitQuery: _.debounce(() => {
      const {
        bomParentId,
        bomId,
        dateFilter: [beginTime, endTime],
      } = that;
      const obj = that.filterObject({
        bomParentId,
        bomName: bomId,
        beginTime,
        endTime,
      });
      that.$emit('input', obj);
    }, 90), // 90毫秒的防抖延迟
    dateChange() {
      this.emitQuery();
    },
  },
  watch: {
    bomParentId(bomParentId) {
      if (bomParentId) {
        this.getPartList(bomParentId);
      } else {
        this.bomId = '';
      }
      this.emitQuery();
    },
    bomId(bomId) {
      if (!bomId) {
        this.bomId = '';
      }
      this.emitQuery();
    },
  },
};
</script>
