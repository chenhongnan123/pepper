<template>
  <div class="darkNoBgColor">
    <v-card
      flat
      color="primary"
      class="mx-auto"
      rounded="lg"
      dark
      :height="cardHeight"
    >
      <v-card-title
        primary-title
        dark
      >
        {{
          `${taskDetail.maintenanceLocationName || '-'}`
        }}
        <v-spacer></v-spacer>
        <v-chip
          label
          outlined
          color="white"
          class="rounded-lg"
        >
          <span class="mx-2">{{taskStatus || '-'}}</span>
        </v-chip>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="3">
            <div>
              {{ $t('maintenanceTask.table.reportPosition') }}
            </div>
            <div class="title white--text">
              {{ taskDetail.maintenanceLocationName || '-' }}
            </div>
          </v-col>
          <v-col cols="3">
            <div>
              {{ $t('maintenanceTask.table.taskCreationDate') }}
            </div>
            <div class="title white--text">
              {{ taskDetail.createTime || '-' }}
            </div>
          </v-col>
          <v-col cols="3">
            <div>
              {{ $t('maintenanceTask.table.scheduledStartDate') }}
            </div>
            <div class="title white--text">
              {{ taskDetail.planStartTime || '-' }}
            </div>
          </v-col>
          <v-col cols="3">
            <div>
              {{ $t('maintenanceTask.table.scheduledCompletionDate') }}
            </div>
            <div class="title white--text">
              {{ taskDetail.planEndTime || '-' }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card
      class="pa-4 mt-3"
      elevation="0"
      color="bg"
    >
      <div class="d-flex">
        <tab-layout
          :items="[
            {tabName: $t('maintenanceTask.tab.taskContent')},
            {tabName: $t('maintenanceTask.tab.part')},
            {tabName: $t('maintenanceTask.tab.attachment')},
          ]"
          :tab="tab"
          @changeTab="handleChangeTab"
        />
        <v-spacer></v-spacer>
        <v-btn
          small
          class="text-none mr-2"
          color="warning"
          @click="handleStatus('4')"
          :disabled="loading"
          v-if="(taskDetail.status === '0'
            || taskDetail.status === '2')
            && isBtnAccess('basic:maintenance_task:edit')"
        >
          {{ $t('maintenanceTask.btn.cancelTask') }}
        </v-btn>
        <v-btn
          small
          class="text-none mr-2"
          color="primary"
          @click="handleStatus('2')"
          :disabled="loading"
          v-if="taskDetail.status === '0'
            && isBtnAccess('basic:maintenance_task:edit')"
        >
          {{ $t('maintenanceTask.btn.startTask') }}
        </v-btn>
        <v-btn
          small
          class="text-none mr-2"
          color="success"
          @click="handleStatus('1')"
          :disabled="loading"
          v-if="taskDetail.status === '2'
            && isBtnAccess('basic:maintenance_task:edit')"
        >
          {{ $t('maintenanceTask.btn.completeTask') }}
        </v-btn>
        <v-btn
          small
          class="text-none mr-2"
          color="primary"
          @click="viewExpertiseDialog = true"
          :disabled="loading"
          v-if="(taskDetail.status === '0'
            || taskDetail.status === '2')
            && isBtnAccess('basic:expertise:list')"
        >
          {{ $t('maintenanceTask.btn.expertise') }}
        </v-btn>
        <v-btn
          small
          class="text-none mr-2"
          color="primary"
          outlined
          @click="addPartDialog = true"
          :disabled="loading"
          v-if="(taskDetail.status === '0'
            || taskDetail.status === '2')
            && tab === 1
            && isBtnAccess('basic:replacement_parts:batch_add')"
        >
          <v-icon left small>mdi-plus</v-icon>
          {{ $t('maintenanceTask.btn.addPart') }}
        </v-btn>
        <v-btn
          small
          class="text-none mr-2"
          color="primary"
          outlined
          :disabled="loading"
          @click="addAttachmentDialog = true"
          v-if="(taskDetail.status === '0'
            || taskDetail.status === '2')
            && tab === 2
            && isBtnAccess('system:maintenaceTaskFile:upload')"
        >
          <v-icon left small>mdi-plus</v-icon>
          {{ $t('maintenanceTask.btn.addAttachment') }}
        </v-btn>
        <v-btn
          small
          class="text-none mr-2"
          color="primary"
          @click="createExpertiseDialog = true"
          :disabled="loading"
          v-if="taskDetail.status === '1'
          && isBtnAccess('basic:maintenance_task:generate_expertise')"
        >
          <v-icon left small>mdi-book-plus-outline</v-icon>
          {{ $t('maintenanceTask.btn.createExpertise') }}
        </v-btn>
      </div>
      <v-tabs-items v-model="tab" class="grey-thin-border rounded">
        <v-tab-item class="pa-3" >
          <v-row no-gutters class="my-2">
            <v-col cols="4" class="px-2">
              <v-text-field
                outlined
                :label="`${$t('maintenanceTask.table.errorCode')}`"
                v-model="taskDetail.faultCode"
                disabled
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="8" class="px-2">
              <v-text-field
                outlined
                :label="`${$t('maintenanceTask.table.errorName')}`"
                v-model="taskDetail.alarmName"
                disabled
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters class="mt-2">
            <v-col cols="4" class="px-2">
              <v-textarea
                ref="faultPhenomenon"
                class="mt-3"
                style="flex:initial"
                clearable
                outlined
                :label="`${$t('maintenanceTask.table.symptom')}*`"
                v-model="taskDetail.faultPhenomenon"
                no-resize
                :rules="rules.over500"
                rows="10"
                @change="handleUpdateTask('faultPhenomenon')"
                :disabled="taskDetail.status === '1'
                  || taskDetail.status === '4'
                  || !isBtnAccess('basic:maintenance_task:edit')"
              ></v-textarea>
            </v-col>
            <v-col cols="4" class="px-2">
              <v-textarea
                ref="faultReason"
                class="mt-3"
                style="flex:initial"
                clearable
                outlined
                :label="`${$t('maintenanceTask.table.reason')}*`"
                v-model="taskDetail.faultReason"
                no-resize
                :rules="rules.over500"
                rows="10"
                @change="handleUpdateTask('faultReason')"
                :disabled="taskDetail.status === '1'
                  || taskDetail.status === '4'
                  || !isBtnAccess('basic:maintenance_task:edit')"
              ></v-textarea>
            </v-col>
            <v-col cols="4" class="px-2">
              <v-textarea
                ref="solution"
                class="mt-3"
                style="flex:initial"
                clearable
                outlined
                :label="`${$t('maintenanceTask.table.solution')}*`"
                v-model="taskDetail.solution"
                no-resize
                :rules="rules.over500"
                rows="10"
                @change="handleUpdateTask('solution')"
                :disabled="taskDetail.status === '1'
                  || taskDetail.status === '4'
                  || !isBtnAccess('basic:maintenance_task:edit')"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <v-row no-gutters>
            <v-col>
              <v-data-table
                disable-filtering
                disable-pagination
                fixed-header
                :headers="taskContentHeaders"
                :height="tableHeight"
                hide-default-footer
                item-key="id"
                :items="repairPartList"
                dense
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
                        v-if="isBtnAccess('basic:replacement_parts:edit')"
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
                    v-if="(taskDetail.status === '0'
                      || taskDetail.status === '2')
                      && isBtnAccess('basic:replacement_parts:remove')"
                    @click="handleDelete(item.id)"
                  >
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <attachment-table
            :height="tableHeight"
            :attachmentList="attachmentList"
            :isAccessDownload="isBtnAccess('system:maintenaceTaskFile:download')"
            :isAccessPreview="isBtnAccess('system:maintenaceTaskFile:preview')"
            :isAccessDelete="isBtnAccess('system:maintenaceTaskFile:remove')"
            @getTableList="refresh"
          />
        </v-tab-item>
      </v-tabs-items>
      <v-textarea
        ref="remark"
        class="mt-3"
        style="flex:initial"
        clearable
        outlined
        :label="`${$t('maintenanceTask.table.remark')}`"
        v-model="taskDetail.remark"
        no-resize
        :rules="rules.over500"
        rows="3"
        @change="handleUpdateTask('remark')"
        :disabled="taskDetail.status === '1'
          || taskDetail.status === '4'
          || !isBtnAccess('basic:maintenance_task:edit')"
      ></v-textarea>
    </v-card>
    <add-attachment-dialog
      :addDialog="addAttachmentDialog"
      :id="taskId"
      :docType="docType"
      @closeDialog="addAttachmentDialog = false"
      @getTableList="getAttachmentTableList"
    />
    <add-part-dialog
      :addDialog="addPartDialog"
      :taskId="taskId"
      @closeDialog="addPartDialog = false"
      @getTableList="getTableList"
      @handleIgnore="handleIgnore"
    />
    <view-expert-knowledge-dialog
      :addDialog="viewExpertiseDialog"
      :taskDetail="taskDetail"
      :taskPage="pageName"
      @closeDialog="viewExpertiseDialog = false"
    />
    <create-expert-knowledge-dialog
      :addDialog="createExpertiseDialog"
      :taskId="taskId"
      @closeDialog="createExpertiseDialog = false"
    />
    <IgnorePartDialog
      :ignoreDialog="ignoreDialog"
      :ignoreList="ignoreList"
      @closeDialog="ignoreDialog = false"
    />
  </div>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
} from 'vuex';
import TabLayout from '@/components/commonUI/TabLayout.vue';
import AttachmentTable from '@/components/commonUI/attachmentTable/AttachmentTable.vue';
import AddAttachmentDialog from '../AddAttachmentDialog.vue';
import AddPartDialog from './AddPartDialog.vue';
import ViewExpertKnowledgeDialog from './ViewExpertKnowledgeDialog.vue';
import CreateExpertKnowledgeDialog from './CreateExpertKnowledgeDialog.vue';
import IgnorePartDialog from './ignoreDialog.vue';

export default {
  name: 'repairTaskDetailComponent',
  data() {
    return {
      cardHeight: 200,
      tableHeight: document.body.clientHeight - 580,
      tab: 0,
      taskDetail: {},
      addAttachmentDialog: false,
      addPartDialog: false,
      viewExpertiseDialog: false,
      createExpertiseDialog: false,
      editvalue: null,
      docType: 'repairTask',
      loading: false,
      ignoreDialog: false,
      ignoreList: [],
    };
  },
  components: {
    TabLayout,
    AttachmentTable,
    AddAttachmentDialog,
    AddPartDialog,
    ViewExpertKnowledgeDialog,
    CreateExpertKnowledgeDialog,
    IgnorePartDialog,
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('maintenanceTask', [
      'repairPartList',
      'attachmentList',
      'statusList',
    ]),
    rules() {
      return this.$getMaintenanceRules();
    },
    // 模块名称
    moduleName() {
      return this.$route.name;
    },
    taskId() {
      return Number(this.$route.params.id);
    },
    taskStatus() {
      const { taskDetail, statusList } = this;
      if (taskDetail.status) {
        let status = {};
        if (taskDetail.isDelay) {
          status = statusList.find((s) => s.value === '3') || {};
        } else {
          status = statusList.find((s) => s.value === taskDetail.status) || {};
        }
        if (status.text) {
          return this.$t(`maintenanceTask.label.${status.text}`);
        }
      }
      return '-';
    },
    // 父页面名称
    pageName() {
      return this.$route.params.page;
    },
    taskContentHeaders() {
      return [
        {
          text: 'No.',
          value: 'no',
          sortable: false,
        },
        {
          text: this.$t('maintenanceTask.table.partCode'),
          value: 'partNumber',
          sortable: false,
        },
        {
          text: this.$t('maintenanceTask.table.partName'),
          value: 'partName',
          sortable: false,
        },
        {
          text: this.$t('maintenanceTask.table.partDesc'),
          value: 'partDescription',
          sortable: false,
        },
        {
          text: this.$t('maintenanceTask.table.partNum'),
          value: 'partCount',
          sortable: false,
        },
        {
          text: this.$t('maintenanceTask.table.action'),
          value: 'action',
          sortable: false,
        },
      ];
    },
  },
  async activated() {
    this.refresh();
  },
  deactivated() {
  },
  methods: {
    ...mapMutations('helper', [
      'setAlert',
    ]),
    ...mapActions('maintenanceTask', [
      'getTaskDetailById',
      'getRepairPartList',
      'getAttachmentList',
      'updateTask',
      'updateRepairPart',
      'deleteRepairPart',
      'getErrorCodeList',
    ]),
    async refresh() {
      await this.getErrorCodeList();
      await this.getTableList();
      await this.getAttachmentTableList();
    },
    async getTableList() {
      const { taskId } = this;
      this.taskDetail = await this.getTaskDetailById(taskId);
      await this.getRepairPartList(taskId);
    },
    // 获取附件列表
    async getAttachmentTableList() {
      await this.getAttachmentList({
        id: this.taskId,
        docType: this.docType,
      });
    },
    async handleUpdateTask(field) {
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
    async handleStatus(status) {
      this.loading = true;
      // console.log(status, 'taskStatus');
      const { taskId, repairPartList, taskDetail } = this;
      if (status === '4') {
        if (!await this.$root.$confirm.open(
          this.$t('dialog.cancelTask'),
          this.$t('dialog.cancelTaskConfirm'),
        )) {
          this.loading = false;
          return;
        }
        console.log('ok');
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
          this.setAlert({
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
        this.refresh();
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
    handleChangeTab(tab) {
      this.tab = tab;
    },
    handleIgnore(list) {
      this.ignoreList = list;
      this.ignoreDialog = true;
    },
    goBack() {
      if (this.pageName === 'maintenanceTask') {
        this.$router.push({ name: 'maintenanceTask' });
      } else if (this.pageName === 'partTaskDetail') {
        this.$router.push({ name: 'partTaskDetail', params: { id: this.$route.params.partId, page: this.$route.params.partPage } });
      }
    },
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>
</style>
