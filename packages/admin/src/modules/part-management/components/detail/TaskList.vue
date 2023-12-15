<template>
  <div
    class="custom-card"
    :height="height"
  >
    <v-card
      class="my-4"
      :height="height"
    >
      <v-card-title>
        <span>
          {{ $t('partManagement.label.maintenanceTask') }}
        </span>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <div class="d-flex justify-space-between">
              <span v-bind="attrs" v-on="on">
                <span style="font-size: 15px;">
                  {{ `(${inprogresslength}/${alltaskslength})` }}
                </span>
              </span>
            </div>
          </template>
          <span>
            {{ $t('partManagement.label.inprogressall') }}
            {{ `(${inprogresslength}/${alltaskslength})` }}
          </span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-text-field
          dense
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('partManagement.label.search')"
          single-line
          hide-details
          clearable
          style="max-width: 300px;"
        ></v-text-field>
      </v-card-title>
      <v-card-text :height="height - 64">
        <v-data-table
          fixed-header
          dense
          :items="tableList"
          :headers="headers"
          item-key="id"
          class="noborder"
          hide-default-footer
          item-class="text-truncate"
          :search="search"
          :height="height - 64"
          disable-sort
        >
          <!-- eslint-disable-next-line -->
          <template #item.taskStatus="{ item }">
            <v-chip
              small
              :color="getPlanStatus(item.taskStatusCode)"
              dark
              label
            >
              {{ item.taskStatus }}
            </v-chip>
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
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapActions,
} from 'vuex';
import moment from 'moment';

export default {
  name: 'TaskList',
  data() {
    return {
      moment,
      headers: [
        {
          text: this.$t('partManagement.maintenanceTable.status'),
          value: 'taskStatus',
          width: 60,
        },
        {
          text: this.$t('partManagement.maintenanceTable.taskCode'),
          value: 'taskNo',
          width: 80,
        },
        {
          text: this.$t('partManagement.maintenanceTable.taskName'),
          value: 'taskName',
          width: 80,
        },
        {
          text: this.$t('partManagement.maintenanceTable.taskType'),
          value: 'taskType',
          width: 80,
        },
        {
          text: this.$t('partManagement.maintenanceTable.taskCreatedTime'),
          value: 'taskCreationDate',
          width: 80,
        },
        {
          text: this.$t('partManagement.maintenanceTable.planStartTime'),
          value: 'scheduledStartDate',
          width: 80,
        },
        {
          text: this.$t('partManagement.maintenanceTable.planEndTime'),
          value: 'scheduledCompletionDate',
          width: 80,
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
    ...mapState('partManagement', [
      'taskList',
    ]),
    id() {
      return this.$route.params.id;
    },
    page() {
      return this.$route.params.page;
    },
    tableList() {
      if (this.taskList?.length) {
        const list = this.taskList.map((item) => {
          const obj = {
            ...item,
          };
          if (!item.taskCreationDate || item.taskCreationDate === '') {
            obj.taskCreationDate = '-';
          } else {
            obj.taskCreationDate = moment(item.taskCreationDate).format('YYYY-MM-DD HH:mm:ss');
          }
          if (!item.scheduledStartDate || item.scheduledStartDate === '') {
            obj.scheduledStartDate = '-';
          } else {
            obj.scheduledStartDate = moment(item.scheduledStartDate).format('YYYY-MM-DD HH:mm:ss');
          }
          if (!item.scheduledCompletionDate || item.scheduledCompletionDate === '') {
            obj.scheduledCompletionDate = '-';
          } else {
            obj.scheduledCompletionDate = moment(item.scheduledCompletionDate).format('YYYY-MM-DD HH:mm:ss');
          }
          return obj;
        });
        return list;
      }
      return [];
    },
    // 未完成任务数量
    inprogresslength() {
      // 1-未开始 2-进行中 7-逾期，表示未完成任务
      const list = this.taskList.filter((item) => item.taskStatusCode === 1
        || item.taskStatusCode === 2 || item.taskStatusCode === 7);
      return list.length;
    },
    alltaskslength() {
      return this.tableList.length;
    },
  },
  methods: {
    ...mapActions('partManagement', ['getMachineTaskList', 'getInProgressMachineTaskList']),
    getPlanStatus(statusCode) {
      switch (statusCode) {
        case 1:
          return 'primary'; // 未开始
        case 2:
          return 'primary'; // 进行中
        case 3:
          return 'success'; // 已完成
        case 5:
          return 'warn'; // 已取消
        case 7:
          return 'error'; // 逾期
        default:
          return 'primary';
      }
    },
    goToTaskDetail(item) {
      const { taskTypeCode, taskNo } = item;
      if (taskTypeCode === 3) { // 维保任务
        this.$router.push({
          name: 'maintenanceTaskDetail',
          params: {
            id: taskNo,
            page: 'maintenanceTask',
          },
        });
      } else if (taskTypeCode === 4) { // 维修任务
        this.$router.push({
          name: 'repairTaskDetail',
          params: {
            id: taskNo,
            page: 'maintenanceTask',
          },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .custom-card {
    ::v-deep .v-card__title {
      padding: 8px 16px 8px 16px;
    }
    ::v-deep .v-card__text {
      padding: 0px 16px 0px 16px;
    }
  }
</style>
