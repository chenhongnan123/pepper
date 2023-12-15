<template>
  <div class="task-view">
    <alarm-info
      :height="alarmHeight"
    />
    <!-- <div class="d-flex align-center justify-center mx-2 task-model"
      :style="`--top:${10}px;`"
    >
      <digital-model
        :height="alarmHeight + modelHeight + taskHeight"
      />
    </div> -->
    <v-row no-gutters  class="table-list mt-3">
      <v-col cols="5" class="pr-2">
        <maintenance-list
          :height="taskHeight"
        />
      </v-col>
      <v-col cols="7" class="px-0">
        <task-list
          :height="taskHeight"
        />
      </v-col>
    </v-row>
    <maintenance-task-dialog />
    <maintenance-detail-dialog />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AlarmInfo from './AlarmInfo.vue';
import MaintenanceList from './MaintenanceList.vue';
import TaskList from './TaskList.vue';
import MaintenanceTaskDialog from './maintenanceTaskDialog.vue';
import MaintenanceDetailDialog from './maintenanceDetailDialog.vue';

export default {
  name: 'MaintenanceTask',
  data() {
    return {
      clientheight: document.body.clientHeight,
    };
  },
  components: {
    AlarmInfo,
    MaintenanceList,
    TaskList,
    MaintenanceTaskDialog,
    MaintenanceDetailDialog,
  },
  props: {
  },
  created() {
    // this.getTableList();
    this.init();
    this.getTimeoutWithFunc({
      time: 5000,
      pushNum: this.routerPushNum,
      func: async () => {
        await this.getTaskList();
        await this.getMaintenanceTypeList();
        await this.getMaintenanceList();
      },
    });
  },
  computed: {
    ...mapState('helper', [
      'routerPushNum',
    ]),
    alarmHeight() {
      return 150;
      // return (this.clientheight - 230) * 0.2;
    },
    // modelHeight() {
    //   return (this.clientheight - 150 - 125) / 2;
    //   // return (this.clientheight - 230) * 0.4;
    // },
    taskHeight() {
      return this.clientheight - 150 - 98 - 77 - 16;
      // return (this.clientheight - 230) * 0.4;
    },
    iszh() {
      return this.$i18n.locale === 'zhHans';
    },
    routename() {
      return this.$route.name;
    },
    isPageChaged() {
      return this.routename !== 'maintenanceTask';
    },
  },
  watch: {
  },
  methods: {
    ...mapActions('maintenanceTask', [
      'getTaskList',
      'getMaintenanceList',
      'getMaintenanceTypeList',
    ]),
    ...mapActions('helper', [
      'getTimeoutWithFunc',
    ]),
    async getTableList() {
      if (this.isPageChaged) {
        return;
      }
      await this.getTaskList();
      await this.getMaintenanceTypeList();
      await this.getMaintenanceList();
      await this.$getTimeout(5000);
      await this.getTableList();
    },
    async init() {
      await this.getTaskList();
      await this.getMaintenanceTypeList();
      await this.getMaintenanceList();
    },
  },
};
</script>
