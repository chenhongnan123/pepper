<template>
  <div>
    <div class="d-flex align-end" v-if="isShowTop">
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
          :width="`${(strLen(item.name) - 4) > 0 ? 102 + (strLen(item.name) - 4) * 15: 102}px`"
          class="tab-item"
          :ripple="false"
        >
          <img
          v-if="index === tabkey"
          :src="require('@/assets/icons/img/tpm-tab-item-active-dark.svg')"
          :width="`${(strLen(item.name) - 4) > 0 ? 102 + (strLen(item.name) - 4) * 15: 102}px`"
          height="35px"
          alt=""
          class="item-background">
          <img
          v-else
          :src="require('@/assets/icons/img/tpm-tab-item-unactive-dark.svg')"
          :width="`${(strLen(item.name) - 4) > 0 ? 102 + (strLen(item.name) - 4) * 15: 102}px`"
          height="35px"
          alt=""
          class="item-background">
          <span
            class="text-h6 font-weight-bold"
            :class="index === tabkey? 'primary--text' : 'info--text'"
          >
          {{ item.name }}
          </span>
        </v-btn>
      </v-btn-toggle>
      <v-spacer></v-spacer>
      <v-btn class="mx-1" outlined color="primary" rounded dense
        @click="isShowRepairDialog = true"
      >{{$t('maintenanceTask.submitMaintenanceTask')}}</v-btn>
    </div>
    <v-data-table
      fixed-header
      dense
      :headers="headers"
      disable-pagination
      :items="filterTaskList"
      hide-default-footer
      :height="height - 90"
      class="mt-2 task-table"
    >
      <template v-slot:item="{ item, index }">
          <tr class="pb-1">
            <td>
              <div class="text-truncate" style="width: 30px;">
                {{ index + 1 }}
              </div>
            </td>
            <!-- <td>
              <div
                class="text-truncate"
                style="width: 80px;"
                :title="item.bomParentName"
              >
                {{ item.bomParentName }}
              </div>
            </td> -->
            <!-- <td>
              <div
                class="text-truncate"
                style="width: 60px;"
                :title="item.maintenanceLocationName"
              >
                {{ item.maintenanceLocationName }}
              </div>
            </td> -->
            <td
              :class="item.status==='2'
                ?'inProgress-darken'
                :item.isDelay?'delay-darken':''"
            >
              <div
                class="text-truncate"
                style="width: 100px;"
                :title="item.taskName"
              >
                {{ item.taskName }}
              </div>
            </td>
            <td
              :class="item.status==='2'
                ?'inProgress-darken'
                :item.isDelay?'delay-darken':''"
            >
              <div
                class="text-truncate"
                style="width: 100px;"
                :title="getTaskGroupName(item.taskGroup)"
              >
                {{ getTaskGroupName(item.taskGroup) }}
              </div>
            </td>
            <td
              :class="item.status==='2'
                ?'inProgress-darken'
                :item.isDelay?'delay-darken':''"
            >
              <div
                class="text-truncate"
                style="width: 110px;"
                :title="item.schemaName || '-'"
              >
                {{ item.schemaName || '-' }}
              </div>
            </td>
            <td
              :class="item.status==='2'
                ?'inProgress-darken'
                :item.isDelay?'delay-darken':''"
            >
              <div
                class="text-truncate"
                style="width: 100px;"
                :title="getSchemaTypeName(item.schemaType) || '-'"
              >
                {{ getSchemaTypeName(item.schemaType) || '-' }}
              </div>
            </td>
            <td
              :class="item.status==='2'
                ?'inProgress-darken'
                :item.isDelay?'delay-darken':''"
            >
              <div
                class="text-truncate"
                style="width: 150px;"
                :title="item.planStartTime || '-'"
              >
                {{ item.planStartTime || '-' }}
              </div>
            </td>
            <td
              :class="item.status==='2'
                ?'inProgress-darken'
                :item.isDelay?'delay-darken':''"
            >
              <div
                class="text-truncate"
                style="width: 150px;"
                :title="item.planEndTime || '-'"
              >
                {{ item.planEndTime || '-' }}
              </div>
            </td>
            <td
              :class="item.status==='2'
                ?'inProgress-darken'
                :item.isDelay?'delay-darken':''"
              class="text-center"
            >
              <v-btn
                icon
                @click="goDetails(item)"
              >
                <v-icon>mdi-dots-horizontal-circle-outline</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
    </v-data-table>
    <SubmitRepairDialog
      :addDialog="isShowRepairDialog"
      @closeDialog="isShowRepairDialog = false"
    ></SubmitRepairDialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import SubmitRepairDialog from '../faultDiagnosis/SubmitRepairDialog.vue';

export default {
  name: 'TaskList',
  data() {
    return {
      selectedTask: null,
      tabkey: 0,
    };
  },
  props: {
    height: {
      type: Number,
    },
    // 是否显示表格头部按钮，健康评估详情的维保任务模块不需要头部按钮
    isShowTop: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    SubmitRepairDialog,
  },
  computed: {
    ...mapState('maintenanceTask', [
      'taskList',
      'filterMaintenanceId',
      'maintenanceTypeList',
    ]),
    isShowRepairDialog: {
      get() {
        return this.$store.state.faultDiagnosis.isShowRepairDialog;
      },
      set(val) {
        this.$store.commit('faultDiagnosis/SET_ISSHOWREPAIRDIALOG', val);
      },
    },
    tabItems() {
      return [
        {
          name: this.$t('maintenanceTask.taskIncomplete'),
        },
      ];
    },
    filterTaskList() {
      const { filterMaintenanceId, taskList } = this;
      return filterMaintenanceId
        ? taskList.filter((task) => task.schemaId === filterMaintenanceId)
        : taskList;
    },
    headers() {
      return [
        {
          text: 'No.',
          value: 'no',
          sortable: false,
          width: '50',
        },
        // {
        //   text: '层级',
        //   value: 'bomParentName',
        //   sortable: false,
        // },
        // {
        //   text: '部件',
        //   value: 'maintenanceLocationName',
        //   sortable: false,
        // },
        {
          text: this.$t('maintenanceTask.taskname'),
          value: 'taskName',
          sortable: false,
        },
        {
          text: this.$t('maintenanceTask.tasktype'),
          value: 'taskGroup',
          sortable: false,
        },
        {
          text: this.$t('maintenanceTask.schemaName'),
          value: 'schemaName',
          sortable: false,
        },
        {
          text: this.$t('maintenanceTask.schemaType'),
          value: 'schemaType',
          sortable: false,
        },
        {
          text: this.$t('maintenanceTask.planstarttime'),
          value: 'planStartTime',
          sortable: false,
        },
        {
          text: this.$t('maintenanceTask.planendtime'),
          value: 'planEndTime',
          sortable: false,
        },
        {
          text: this.$t('maintenanceTask.detail'),
          value: 'detail',
          sortable: false,
        },
      ];
    },
  },
  watch: {
  },
  methods: {
    ...mapMutations('maintenanceTask', ['setMaintenanceTaskDialog', 'setRepairTaskDialog', 'setTaskInfo']),
    init() {
    },
    getTaskGroupName(taskGroup) {
      if (taskGroup === '0') {
        return this.$t('maintenanceTask.maintenance');
      }
      if (taskGroup === '1') {
        return this.$t('maintenanceTask.repair');
      }
      return '-';
    },
    getSchemaTypeName(type) {
      const { maintenanceTypeList } = this;
      const SchemaType = maintenanceTypeList.find((item) => item.dictValue === type);
      if (SchemaType) {
        return SchemaType.dictLabel;
      }
      return type;
    },
    goDetails(task) {
      this.setTaskInfo(task);
      if (task.taskGroup === '0') {
        this.setMaintenanceTaskDialog(true);
      } else {
        this.setRepairTaskDialog(true);
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
