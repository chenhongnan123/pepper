<template>
  <div>
    <div class="d-flex align-end">
      <v-btn-toggle
        v-model="tabkey"
        tile
        group
        mandatory
        class="group-btn-tab"
      >
        <v-btn
          v-for="(item,index) in tabItems"
          :key="index"
          :value="item.dictValue"
          :width="`${(strLen(item.dictLabel) - 4) > 0
            ? 102 + (strLen(item.dictLabel) - 4) * 15
            : 102}px`"
          class="tab-item"
          :ripple="false"
        >
          <img
          v-if="item.dictValue === tabkey"
          :src="require('@/assets/icons/img/tpm-tab-item-active-dark.svg')"
          :width="`${(strLen(item.dictLabel) - 4) > 0
            ? 102 + (strLen(item.dictLabel) - 4) * 15: 102}px`"
          height="35px"
          alt=""
          class="item-background">
          <img
          v-else
          :src="require('@/assets/icons/img/tpm-tab-item-unactive-dark.svg')"
          :width="`${(strLen(item.dictLabel) - 4) > 0
            ? 102 + (strLen(item.dictLabel) - 4) * 15: 102}px`"
          height="35px"
          alt=""
          class="item-background">
          <span
            class="text-h6 font-weight-bold"
            :class="item.dictValue === tabkey? 'primary--text' : 'info--text'"
          >
          {{ item.dictLabel }}
          </span>
        </v-btn>
      </v-btn-toggle>
      <v-spacer></v-spacer>
    </div>
    <v-data-table
      fixed-header
      dense
      :headers="headers"
      disable-pagination
      :items="filterMaintenanceList"
      hide-default-footer
      :height="height - 90"
      class="mt-2 task-table"
    >
      <template #item.detail="{ item }">
        <v-btn
          icon
          @click="goDetails(item)"
        >
          <v-icon>mdi-dots-horizontal-circle-outline</v-icon>
        </v-btn>
      </template>
      <template #item.action="{ item }">
        <v-btn
          :text="filterMaintenanceId !== item.id"
          small
          :color="filterMaintenanceId === item.id?'primary':''"
          :outlined="filterMaintenanceId === item.id"
          @click="handleFilter(item)"
        >
          <v-icon class="mr-1" :size="18" color="primary">mdi-map-marker-outline</v-icon>
          <span>{{$t('maintenanceTask.filterTask')}}</span>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'MaintenanceList',
  data() {
    return {
      tabkey: 0,
      taskDialog: false,
    };
  },
  props: {
    height: {
      type: Number,
    },
  },
  components: {
  },
  computed: {
    ...mapState('maintenanceTask', [
      'maintenanceList',
      'selectedMaintenance',
      'maintenanceTypeList',
      'filterMaintenanceId',
    ]),
    tabItems() {
      return this.maintenanceTypeList.filter((item) => item.status === '0');
    },
    filterMaintenanceList() {
      const { tabkey, maintenanceList } = this;
      if (!tabkey || !maintenanceList.length) { return []; }
      return maintenanceList
        .filter((item) => item.schemaType === tabkey
        && Number(item.status) === 1)
        .map((item, index) => {
          const obj = {
            ...item,
            no: index + 1,
          };
          return obj;
        });
    },
    headers() {
      return [
        {
          text: 'No.',
          value: 'no',
          sortable: false,
          width: '60',
        },
        {
          text: this.$t('maintenanceTask.schemaCode'),
          value: 'schemaCode',
          sortable: false,
          width: '120',
        },
        {
          text: this.$t('maintenanceTask.schemaName'),
          value: 'schemaName',
          sortable: false,
          width: '150',
        },
        {
          text: this.$t('maintenanceTask.schemaDetail'),
          value: 'detail',
          sortable: false,
          width: '120',
        },
        {
          text: '',
          value: 'action',
          sortable: false,
          width: '80',
        },
      ];
    },
  },
  watch: {
  },
  methods: {
    ...mapMutations('maintenanceTask', ['setSelectedMaintenance', 'setMaintenanceDetailDialog', 'setFilterMaintenanceId']),
    init() {
    },
    goDetails(item) {
      this.setSelectedMaintenance(item);
      this.setMaintenanceDetailDialog(true);
      // console.log(item);
    },
    handleFilter(item) {
      const { filterMaintenanceId } = this;
      if (filterMaintenanceId === item.id) {
        // console.log(1);
        this.setFilterMaintenanceId(null);
      } else {
        this.setFilterMaintenanceId(item.id);
      }
    },
    strLen(str) {
      let count = 0;
      for (let i = 0; i < str.length; i += 1) {
        count += str.charCodeAt(i) <= 128 ? 1 : 2;
      }
      return count;
    },
  },
};
</script>
