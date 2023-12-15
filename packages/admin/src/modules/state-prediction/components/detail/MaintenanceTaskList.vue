<template>
  <div
    :style="`height: ${height}px;overflow: hidden;`"
    class="mt-2"
  >
    <div class="fill-height">
      <div class="d-flex mb-2" style="height: 38px;">
        <v-text-field
          dense
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('statePrediction.maintenanceTask.search')"
          single-line
          hide-details
          clearable
          style="max-width: 300px;"
          class="ml-auto"
        ></v-text-field>
      </div>
      <div :style="`height: ${contentHeight}px;`">
        <!-- disable-pagination / hide-default-footer -->
        <v-data-table
          fixed-header
          dense
          :items="inprogressTaskList"
          :headers="headers"
          item-key="id"
          :items-per-page="10"
          item-class="text-truncate"
          :search="search"
          :height="tableHeight"
          disable-sort
          style="width: 100%;"
        >
          <!-- eslint-disable-next-line -->
          <template #item.status="{ item }">
            <v-chip
              small
              :color="getStatusColor(item)"
              dark
              label
            >
              {{ getStatusText(item) }}
            </v-chip>
          </template>
          <!-- eslint-disable-next-line -->
          <template #item.taskGroup="{ item }">
            <span v-if="item.taskGroup === '0'">
              {{ $t('statePrediction.maintenanceTask.maintenance') }}
            </span>
            <span v-if="item.taskGroup === '1'">
              {{ $t('statePrediction.maintenanceTask.repair') }}
            </span>
          </template>
          <!-- eslint-disable-next-line -->
          <template #item.taskNo="{ item }">
            <!-- eslint-disable-next-line -->
            <span
              class="primary--text text-decoration-underline"
              style="cursor: pointer"
              @click="goToTaskDetail(item)"
            >{{ item.taskNo }}</span>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import moment from 'moment';

export default {
  name: 'MaintenanceTaskList',
  components: {
  },
  data() {
    return {
      moment,
      clientHeight: document.body.clientHeight,
      clientWidth: document.body.clientWidth,
      headers: [
        {
          text: this.$t('partManagement.maintenanceTable.status'),
          value: 'status',
          width: 60,
        },
        {
          text: this.$t('partManagement.maintenanceTable.taskCode'),
          value: 'taskNo',
          width: 90,
        },
        {
          text: this.$t('partManagement.maintenanceTable.taskName'),
          value: 'taskName',
        },
        {
          text: this.$t('partManagement.maintenanceTable.taskType'),
          value: 'taskGroup',
          width: 90,
        },
        {
          text: this.$t('partManagement.maintenanceTable.taskCreatedTime'),
          value: 'createTime',
          width: 200,
        },
        {
          text: this.$t('partManagement.maintenanceTable.planStartTime'),
          value: 'planStartTime',
          width: 200,
        },
        {
          text: this.$t('partManagement.maintenanceTable.planEndTime'),
          value: 'planEndTime',
          width: 200,
        },
      ],
      search: '',
    };
  },
  props: {
    height: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('statePrediction', ['maintenanceTaskList', 'taskStatusList']),
    contentHeight() {
      return this.height - 30;
    },
    tableHeight() {
      return this.contentHeight - 65;
    },
    // 未完成的维保任务（0: 未开始 1: 已完成 2: 进行中 3: 逾期 4: 已取消）
    inprogressTaskList() {
      const { maintenanceTaskList } = this;
      return maintenanceTaskList.filter((i) => i.status === '0'
        || i.status === '2');
    },
  },
  created() {
  },
  mounted() {
    // this.init();
  },
  methods: {
    ...mapActions('statePrediction', []),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    getStatusText(item) {
      const { taskStatusList } = this;
      const { isDelay, status } = item;
      if ((status === '0' || status === '2') && isDelay) {
        return taskStatusList.find((i) => i.dictValue === '3')?.dictLabel || '-';
      }
      return taskStatusList.find((i) => i.dictValue === status)?.dictLabel || '-';
    },
    getStatusColor(item) {
      const { taskStatusList } = this;
      const { isDelay, status } = item;
      if ((status === '0' || status === '2') && isDelay) {
        return taskStatusList.find((i) => i.dictValue === '3')?.listClass || 'primary';
      }
      const obj = taskStatusList.find((i) => i.dictValue === status);
      return obj.listClass || 'primary';
    },
    goToTaskDetail(item) {
      const { taskGroup, taskName, id } = item;
      if (taskGroup === '0') { // 维保任务
        this.$router.push({
          name: 'stateMaintenanceTaskDetail',
          params: {
            id,
            page: 'stateMaintenanceTaskDetail',
            name: taskName,
          },
        });
      } else if (taskGroup === '1') { // 维修任务
        this.$router.push({
          name: 'StateRepairTaskDetail',
          params: {
            id,
            page: 'StateRepairTaskDetail',
            name: taskName,
          },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
