<template>
  <div class="warp pa-4">
    <div class="pl-6 pb-1">
      <v-btn v-for="item in tabData" :key="item.value"
      class="tab-btn pa-0 mr-4" @click="tabClick(item)">
        <img v-if="currentTab === item.value"
        src="@/assets/icons/img/fault-diagnosis/selected_btn.svg" alt="">
        <img v-else src="@/assets/icons/img/fault-diagnosis/normal_btn.svg" alt="">
        <span>
          {{ item.label }}
        </span>
      </v-btn>
    </div>
    <div v-if="currentTab === 'dataMonitoring'">
      <v-card class="card-warp bluecard rounded-xl" rounded>
        <DataMonitoring></DataMonitoring>
      </v-card>
    </div>
    <div v-if="currentTab === 'PLCAlarm'">
      <v-card class="card-warp bluecard rounded-xl" rounded>
        <PLCAlarm></PLCAlarm>
      </v-card>
    </div>
    <div v-if="currentTab === 'maintenanceTasks'">
      <v-card class="card-warp bluecard rounded-xl"
      style="overflow: auto;" rounded>
        <TaskList :height="taskHeight" :isShowTop="false"></TaskList>
      </v-card>
    </div>
    <maintenance-task-dialog />
    <maintenance-detail-dialog />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import TaskList from '@/components/performanceOptimization/maintenanceTask/TaskList.vue';
import MaintenanceTaskDialog from '@/components/performanceOptimization/maintenanceTask/maintenanceTaskDialog.vue';
import MaintenanceDetailDialog from '@/components/performanceOptimization/maintenanceTask/maintenanceDetailDialog.vue';
import DataMonitoring from './DataMonitoring.vue';
import PLCAlarm from './PLCAlarm.vue';

export default {
  name: 'WarnCard',
  data() {
    return {
      tabData: [{
        label: this.$t('repairSuggestionDetail.title.dataMonitor'),
        value: 'dataMonitoring',
      }, {
        label: this.$t('repairSuggestionDetail.title.PLCAlarm'),
        value: 'PLCAlarm',
      }, {
        label: this.$t('repairSuggestionDetail.title.maintenanceTask'),
        value: 'maintenanceTasks',
      }],
      currentTab: 'dataMonitoring',
      clientheight: document.body.clientHeight,
    };
  },
  components: {
    DataMonitoring,
    PLCAlarm,
    TaskList,
    MaintenanceTaskDialog,
    MaintenanceDetailDialog,
  },
  computed: {
    taskHeight() {
      return this.clientheight - 150 - 98 - 77 - 16;
    },
  },
  created() {
    this.getTableList();
  },
  methods: {
    ...mapActions('maintenanceTask', [
      'getTaskList',
      'getMaintenanceList',
      'getMaintenanceTypeList',
    ]),
    tabClick(item) {
      this.currentTab = item.value;
    },
    async getTableList() {
      if (this.isPageChaged) {
        return;
      }
      // await this.getTaskList();
      await this.getMaintenanceTypeList();
      await this.getMaintenanceList();
      await this.$getTimeout(5000);
      await this.getTableList();
    },
  },
};
</script>
<style lang="scss" scoped>
.warp {
  height: 420px;

  .tab-btn {
    position: relative;
    background: transparent;

    img {
      height: 30px;
      width: 120px;
    }

    span {
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0);
      color: var(--v-primary-base);
      font-weight: bold;
    }
  }
  .card-warp {
    height: 330px;
    width: 100%;
  }
}
</style>
