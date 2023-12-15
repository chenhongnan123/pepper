<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="1200px"
    transition="dialog-transition"
  >
    <div class="app-dialog pa-1 d-flex justify-center">
      <v-card class="rounded-lg" style="min-height: 600px;min-width:800px">
        <div
          v-for="i in 5"
          :key="i"
          :class="`rectangle-${i}`"
        ></div>
        <v-card-title primary-title class="mt-2 pb-0">
          <span class="text-h5">
            {{ taskDetail.taskName }}
          </span>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon class="text-h4">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <!-- 标题分割线 -->
        <div class="d-flex align-center px-5">
          <img
            :src="require('@/assets/icons/img/dialog-circle-big-dark.svg')"
            alt=""
            class="mr-2"
          />
          <img
            :src="require('@/assets/icons/img/dialog-circle-small-dark.svg')"
            alt=""
          />
          <v-divider></v-divider>
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
        </div>
        <v-card-text>
          <div class="d-flex align-center">
            <v-btn-toggle
              v-model="tabkey"
              tile
              group
              class="group-btn-tab"
            >
              <v-btn
                v-for="(item,index) in tabItems"
                :key="index"
                :width="`${(strLen(item.name) - 6) > 0
                  ? 102 + (strLen(item.name) - 6) * 15
                  : 102}px`"
                class="tab-item"
                :ripple="false"
              >
                <img
                v-if="index === tabkey"
                :src="require('@/assets/icons/img/tpm-tab-item-active-dark.svg')"
                :width="`${(strLen(item.name) - 6) > 0
                  ? 102 + (strLen(item.name) - 6) * 15
                  : 102}px`"
                height="35px"
                alt=""
                class="item-background">
                <img
                v-else
                :src="require('@/assets/icons/img/tpm-tab-item-unactive-dark.svg')"
                :width="`${(strLen(item.name) - 6) > 0
                  ? 102 + (strLen(item.name) - 6) * 15
                  : 102}px`"
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
            <v-btn
              color="warning"
              class="rounded-xl ml-2"
              min-width="100px"
              :disabled="loading"
              v-if="taskDetail.status === '0'
                || taskDetail.status === '2'"
              @click="cancelTask"
            >
              {{$t('maintenanceTask.cancel')}}
            </v-btn>
            <v-btn
              color="success"
              class="rounded-xl ml-2"
              min-width="100px"
              v-if="taskDetail.status === '2'"
              :disabled="loading"
              @click="completeTask"
            >
              {{$t('maintenanceTask.complete')}}
            </v-btn>
            <v-btn
              color="primary2"
              class="rounded-xl ml-2"
              min-width="100px"
              :disabled="loading"
              v-if="taskDetail.status === '0'"
              @click="startTask"
            >
              {{$t('maintenanceTask.start')}}
            </v-btn>
            <v-btn
              color="primary2"
              class="rounded-xl ml-2"
              min-width="100px"
              v-if="(taskDetail.status === '0'
                || taskDetail.status === '2')
                && tabkey === 2"
              @click="addPartDialog = true"
            >
              {{$t('maintenanceTask.replacematerial')}}
            </v-btn>
            <v-btn
              color="primary"
              outlined
              class="rounded-xl ml-2 primary-oulined-btn"
              min-width="100px"
              @click="knowledgeDialog = true"
              v-if="taskDetail.status === '0'
                || taskDetail.status === '2'"
            >
              {{ $t('maintenanceTask.expertknowledge') }}
            </v-btn>
          </div>
          <!-- 报修内容 -->
          <div v-if="tabkey === 0" style="height:300px">
            <v-row no-gutters class="my-2">
              <v-col cols="12" class="px-2">
                <span class="text-h6 mt-3">
                  {{ $t('maintenanceTask.faultsite') }}
                </span>
                <v-text-field
                  class="blueinput"
                  outlined
                  dense
                  v-model="taskDetail.maintenanceLocationName"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters class="my-2">
              <v-col cols="4" class="px-2">
                <span class="text-h6 mt-3">
                  {{ $t('maintenanceTask.alarmCode') }}
                </span>
                <v-text-field
                  class="blueinput"
                  outlined
                  dense
                  :value="taskDetail.faultCode"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="8" class="px-2">
                <span class="text-h6 mt-3">
                  {{ $t('maintenanceTask.alarmName') }}
                </span>
                <v-text-field
                  class="blueinput"
                  outlined
                  dense
                  v-model="taskDetail.alarmName"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters class="my-2">
              <v-col cols="12" class="px-2">
                <span class="text-h6 mt-3">
                  {{ $t('maintenanceTask.faultPhenomenon') }}
                </span>
                <v-textarea
                  ref="faultPhenomenon"
                  class="blueinput"
                  outlined
                  dense
                  v-model="taskDetail.faultPhenomenon"
                  no-resize
                  :rules="rules.over500"
                  rows="6"
                  @change="handleUpdateTask('faultPhenomenon')"
                  :disabled="taskDetail.status === '1'
                    || taskDetail.status === '4'"
                ></v-textarea>
              </v-col>
            </v-row>
          </div>
          <!-- 任务内容 -->
          <div v-if="tabkey === 1" style="height:300px">
            <v-row no-gutters class="my-2">
              <v-col cols="6" class="px-2">
                <span class="text-h6 mt-3">
                  {{ $t('maintenanceTask.faultreason') }}
                </span>
                <v-textarea
                  ref="faultReason"
                  class="blueinput"
                  outlined
                  dense
                  v-model="taskDetail.faultReason"
                  no-resize
                  :rules="rules.over500"
                  rows="8"
                  @change="handleUpdateTask('faultReason')"
                  :disabled="taskDetail.status === '1'
                    || taskDetail.status === '4'"
                ></v-textarea>
              </v-col>
              <v-col cols="6" class="px-2">
                <span class="text-h6 mt-3">
                  {{ $t('maintenanceTask.repairsolution') }}
                </span>
                <v-textarea
                  ref="solution"
                  class="blueinput"
                  outlined
                  dense
                  v-model="taskDetail.solution"
                  no-resize
                  :rules="rules.over500"
                  rows="8"
                  @change="handleUpdateTask('solution')"
                  :disabled="taskDetail.status === '1'
                    || taskDetail.status === '4'"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row no-gutters class="my-2">
              <v-col cols="12" class="px-2">
                <span class="text-h6 mt-3">
                  {{ $t('maintenanceTask.comment') }}
                </span>
                <v-textarea
                  ref="remark"
                  class="blueinput"
                  outlined
                  dense
                  v-model="taskDetail.remark"
                  no-resize
                  :rules="rules.over500"
                  rows="3"
                  @change="handleUpdateTask('remark')"
                  :disabled="taskDetail.status === '1'
                    || taskDetail.status === '4'"
                ></v-textarea>
              </v-col>
            </v-row>
          </div>
          <!-- 零件更换 -->
          <div v-if="tabkey === 2" style="height:300px">
            <v-row no-gutters>
              <v-col>
                <v-data-table
                  disable-filtering
                  disable-pagination
                  fixed-header
                  :headers="taskContentHeaders"
                  hide-default-footer
                  :height="400"
                  item-key="id"
                  :items="repairPartList"
                  dense
                  class="mt-2"
                >
                  <!-- eslint-disable-next-line -->
                  <template #item.partCount="{item}">
                    <span class="mr-1">{{item.partCount}}</span>
                      <v-menu
                      :close-on-content-click="false"
                      :ref="`editMenu-${item.no}`"
                      offset-x
                      v-if="taskDetail.status === '0'
                        || taskDetail.status === '2'"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          x-small
                          v-bind="attrs"
                          v-on="on"
                          color="primary"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                      <v-text-field
                        clearable
                        dense
                        hide-details
                        v-model="editvalue"
                        color="primary"
                        @keydown.enter="changeValue(item.id)"
                        autofocus
                        style="width:100px"
                      ></v-text-field>
                    </v-menu>
                  </template>
                  <!-- eslint-disable-next-line -->
                  <template #item.action="{ item }">
                    <v-btn
                      small
                      icon
                      class="text-none"
                      color="error"
                      v-if="taskDetail.status === '0'
                        || taskDetail.status === '2'"
                      @click="handleDelete(item.id)"
                    >
                      <v-icon>mdi-trash-can-outline</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <knowledge-dialog
      :knowledgeDialog="knowledgeDialog"
      :taskDetail="taskDetail"
      @closeDialog="knowledgeDialog = false"
    />
    <add-part-dialog
      :addDialog="addPartDialog"
      :taskId="taskId"
      @closeDialog="addPartDialog = false"
      @getTableList="init"
    />
  </v-dialog>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import KnowledgeDialog from './KnowledgeDialog.vue';
import AddPartDialog from './AddPartDialog.vue';

export default {
  name: 'RepairTaskDialog',
  data() {
    return {
      tabkey: 0,
      taskDetail: {},
      attachmentList: [],
      knowledgeDialog: false,
      addPartDialog: false,
      editvalue: null,
      loading: false,
    };
  },
  components: {
    KnowledgeDialog,
    AddPartDialog,
  },
  computed: {
    ...mapState('maintenanceTask', ['repairTaskDialog', 'taskInfo', 'errorCodeList', 'repairPartList']),
    dialog: {
      get() {
        return this.repairTaskDialog;
      },
      set() {
        this.setRepairTaskDialog(false);
      },
    },
    tabItems() {
      return [
        {
          name: this.$t('maintenanceTask.repairContent'),
        },
        {
          name: this.$t('maintenanceTask.taskContent'),
        },
        {
          name: this.$t('maintenanceTask.replacematerial'),
        },
      ];
    },
    taskContentHeaders() {
      return [
        {
          text: 'No.',
          value: 'no',
        },
        {
          text: this.$t('maintenanceTask.materialnumber'),
          value: 'partNumber',
        },
        {
          text: this.$t('maintenanceTask.materialname'),
          value: 'partName',
        },
        {
          text: this.$t('maintenanceTask.materialdesc'),
          value: 'partDescription',
        },
        {
          text: this.$t('maintenanceTask.quantity'),
          value: 'partCount',
        },
        {
          text: this.$t('common.action'),
          value: 'action',
        },
      ];
    },
    taskId() {
      return this.taskDetail.id || 0;
    },
    page() {
      return this.$route.path || '';
    },
    rules() {
      return {
        getOver500: [
          (v) => (String(v).length <= 500 || String(v).length === 0) || `${this.$t('verification.lengthlessthan', { num: 500 })}`,
        ],
      };
    },
  },
  methods: {
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapMutations('maintenanceTask', ['setRepairTaskDialog', 'setTaskInfo', 'setRepairPartList']),
    ...mapActions('setting', ['HANDLE_AUTHACTION']),
    ...mapActions('maintenanceTask', [
      'getRepairPartList',
      'getTaskDetailById',
      'updateTask',
      'updateRepairPart',
      'deleteRepairPart',
    ]),
    async init() {
      const { id } = this.taskInfo;
      this.taskDetail = await this.getTaskDetailById(id);
      await this.getRepairPartList(id);
    },
    strLen(str) {
      let count = 0;
      for (let i = 0; i < str.length; i += 1) {
        count += str.charCodeAt(i) <= 128 ? 1 : 2;
      }
      return count;
    },
    async handleUpdateTask(field) {
      if (this.loading) { return; }
      if (!this.$refs[field].valid) {
        return;
      }
      this.loading = true;
      const { taskId, taskDetail } = this;
      const payload = {
        id: taskId,
      };
      payload[field] = taskDetail[field] || '';
      const result = await this.updateTask(payload);
      if (result) {
        this.taskDetail = await this.getTaskDetailById(taskId);
      }
      this.loading = false;
    },
    startTask() {
      this.handleTask('2');
    },
    completeTask() {
      this.handleTask('1');
    },
    cancelTask() {
      this.handleTask('4');
    },
    async handleTask(status) {
      this.loading = true;
      const { taskId, repairPartList, taskDetail } = this;
      if (status === '4') {
        if (!await this.$root.$confirm.open(
          this.$t('alert.cancelTask'),
          this.$t('alert.cancelTaskConfirm'),
        )) {
          this.loading = false;
          return;
        }
      }
      if (status === '1') {
        let flag = false;
        if (!taskDetail.faultPhenomenon || !taskDetail.faultReason || !taskDetail.solution) {
          flag = true;
        }
        repairPartList.forEach((item) => {
          if (!item.partCount && item.partCount !== 0) {
            flag = true;
          }
        });
        if (flag) {
          this.SET_ALERT({
            show: true,
            type: 'error',
            message: 'completeTaskError',
          });
          this.loading = false;
          return;
        }
      }
      const payload = {
        id: taskId,
        status,
      };
      const result = await this.updateTask(payload);
      if (result) {
        this.init();
      }
      this.loading = false;
    },
    async handleDelete(id) {
      this.loading = true;
      const result = await this.deleteRepairPart(id);
      if (result) {
        await this.getRepairPartList(this.taskId);
      }
      this.loading = false;
    },
    async handleUpdateRepairPart(item) {
      this.loading = true;
      const {
        id,
        partCount,
      } = item;
      const payload = {
        id,
        partCount,
      };
      const result = await this.updateRepairPart(payload);
      if (result) {
        await this.getRepairPartList(this.taskId);
      }
      this.loading = false;
    },
    changeValue(id) {
      // 整数 小于9999 大于0
      if (!/^(\d+)?$/.test(this.editvalue)
        || Number(this.editvalue) > 9999
        || Number(this.editvalue) <= 0
      ) {
        this.editvalue = null;
        this.setAlert({
          show: true,
          type: 'error',
          message: 'limitFrom1To9999',
        });
        return;
      }
      const repairPart = this.repairPartList.find((item) => item.id === id);
      repairPart.partCount = this.editvalue;
      this.handleUpdateRepairPart(repairPart);
      this.editvalue = null;
    },
  },
  watch: {
    dialog(dialog) {
      if (!dialog) {
        return;
      }
      this.tabkey = 0;
      this.init();
    },
  },
};
</script>
