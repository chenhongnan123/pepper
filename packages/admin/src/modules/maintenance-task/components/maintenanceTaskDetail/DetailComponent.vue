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
          `${taskDetail.schemaName || '-'}`
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
          <!-- <v-col cols="3">
            <div>
              {{ $t('maintenanceTask.table.target') }}
            </div>
            <div class="title white--text">
              {{ taskDetail.maintenanceLocationName || '-' }}
            </div>
          </v-col> -->
          <v-col cols="3">
            <div>
              {{ $t('maintenanceTask.table.type') }}
            </div>
            <div class="title white--text">
              {{ taskType || '-' }}
            </div>
          </v-col>
          <v-col cols="3">
            <div>
              {{ $t('maintenanceTask.table.planId') }}
            </div>
            <div class="title white--text">
              {{ taskDetail.planId || '-' }}
            </div>
          </v-col>
          <v-col cols="3">
            <div>
              {{ $t('maintenanceTask.table.planName') }}
            </div>
            <div class="title white--text">
              {{ taskDetail.planName || '-' }}
            </div>
          </v-col>
          <v-col cols="3">
            <div>
              {{ $t('maintenanceTask.table.maintenance') }}
            </div>
            <div class="title white--text">
              {{ taskDetail.schemaName || '-' }}
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
          outlined
          @click="addAttachmentDialog = true"
          :disabled="loading"
          v-if="(taskDetail.status === '0'
            || taskDetail.status === '2')
            && tab === 1
            && isBtnAccess('system:maintenaceTaskFile:upload')"
        >
          <v-icon left small>mdi-plus</v-icon>
          {{ $t('maintenance.btn.addAttachment') }}
        </v-btn>
      </div>
      <v-tabs-items v-model="tab" class="grey-thin-border rounded">
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
                :items="taskDetailList"
                dense
              >
                <!-- eslint-disable-next-line -->
                <template #item.checkItemDesc="{item}">
                  <span
                    class="d-inline-block text-truncate"
                    style="max-width: 240px;"
                    :title="item.checkItemDesc"
                  >{{item.checkItemDesc}}</span>
                </template>
                <!-- eslint-disable-next-line -->
                <template #item.theoreticalUpperLimit="{item}">
                  <span v-if="item.itemType === '1'">{{item.theoreticalUpperLimit}}</span>
                  <span v-else>-</span>
                </template>
                <!-- eslint-disable-next-line -->
                <template #item.theoreticalLowerBound="{item}">
                  <span v-if="item.itemType === '1'">{{item.theoreticalLowerBound}}</span>
                  <span v-else>-</span>
                </template>
                <!-- eslint-disable-next-line -->
                <template #item.actualValue="{item}">
                  <div v-if="item.itemType === '1'">
                    <span class="mr-1">{{item.actualValue}}</span>
                    <v-menu
                      :close-on-content-click="false"
                      :ref="`editMenu-${item.no}`"
                      offset-x
                      v-if="(taskDetail.status === '0'
                      || taskDetail.status === '2')
                      && isBtnAccess('basic:maintenance_task_item:edit')"
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
                  </div>
                  <span v-else>-</span>
                </template>
                <!-- eslint-disable-next-line -->
                <template #item.judgmentResult="{ item }">
                  <v-radio-group
                    v-model="item.judgmentResult"
                    row
                    dense
                    :disabled="(taskDetail.status !== '0'
                      && taskDetail.status !== '2'
                      && taskDetail.status !== '3')
                      || item.itemType === '1'
                      || !isBtnAccess('basic:maintenance_task_item:edit')"
                    @change="handleUpdateTaskDetail(item)"
                  >
                    <v-radio color="success" value="0">
                      <template v-slot:label>
                        <span :class="item.judgmentResult === '0' ? 'success--text' : ''">OK</span>
                      </template>
                    </v-radio>
                    <v-radio color="error" value="1">
                      <template v-slot:label>
                        <span :class="item.judgmentResult === '1' ? 'error--text' : ''">NG</span>
                      </template>
                    </v-radio>
                  </v-radio-group>
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
        rows="3"
        no-resize
        :rules="rules.over500"
        @change="handleUpdateTask('remark')"
        :disabled="taskDetail.status === '1'
          || taskDetail.status === '4'
          || !isBtnAccess('basic:maintenance_task:edit')"
      ></v-textarea>
    </v-card>
    <add-attachment-dialog
      :addDialog="addAttachmentDialog"
      :id="Number(taskId)"
      :docType="docType"
      @closeDialog="addAttachmentDialog = false"
      @getTableList="getAttachmentTableList"
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

export default {
  name: 'maintenanceTaskDetailComponent',
  data() {
    return {
      cardHeight: 220,
      tableHeight: document.body.clientHeight - 600,
      tab: 0,
      taskDetail: {},
      addAttachmentDialog: false,
      editvalue: null,
      docType: 'maintainTask',
      loading: false,
    };
  },
  components: {
    TabLayout,
    AttachmentTable,
    AddAttachmentDialog,
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('maintenanceTask', [
      'taskDetailList',
      'attachmentList',
      'statusList',
      'typeList',
    ]),
    rules() {
      return this.$getMaintenanceRules();
    },
    // 模块名称
    moduleName() {
      return this.$route.name;
    },
    taskId() {
      return this.$route.params.id;
    },
    // 父页面名称
    pageName() {
      return this.$route.params.page;
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
          return this.$t(`maintenanceTask.label.${status.text}`) || '-';
        }
      }
      return '-';
    },
    taskType() {
      const { taskDetail, typeList } = this;
      if (taskDetail.taskType) {
        const type = typeList.find((s) => s.value === taskDetail.taskType) || {};
        if (type.text) {
          return this.$t(`maintenanceTask.label.typeList.${type.text}`) || '-';
        }
      }
      return '-';
    },
    taskContentHeaders() {
      return [
        {
          text: 'No.',
          value: 'no',
          width: '60',
          sortable: false,
        },
        {
          text: this.$t('maintenanceTask.table.checkItem'),
          value: 'checkItem',
          width: '100',
          sortable: false,
        },
        {
          text: this.$t('maintenanceTask.table.checkItemDescription'),
          value: 'checkItemDesc',
          width: '150',
          sortable: false,
        },
        {
          text: this.$t('maintenanceTask.table.relatedBom'),
          value: 'associateBomName',
          width: '100',
          sortable: false,
        },
        {
          text: this.$t('maintenanceTask.table.upperLimit'),
          value: 'theoreticalUpperLimit',
          width: '80',
          sortable: false,
        },
        {
          text: this.$t('maintenanceTask.table.lowerLimit'),
          value: 'theoreticalLowerBound',
          width: '80',
          sortable: false,
        },
        {
          text: this.$t('maintenanceTask.table.actualValue'),
          value: 'actualValue',
          width: '80',
          sortable: false,
        },
        {
          text: this.$t('maintenanceTask.table.result'),
          value: 'judgmentResult',
          width: '150',
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
      'getTaskDetailList',
      'getAttachmentList',
      'updateTask',
      'updateTaskDetail',
    ]),
    async refresh() {
      this.getTableList();
      this.getAttachmentTableList();
    },
    async getTableList() {
      const { taskId } = this;
      this.taskDetail = await this.getTaskDetailById(taskId);
      await this.getTaskDetailList(taskId);
    },
    // 获取附件列表
    async getAttachmentTableList() {
      await this.getAttachmentList({
        id: this.taskId,
        docType: this.docType,
      });
    },
    async handleUpdateTask(field) {
      // console.log(this.$refs[field], 'refs');
      // console.log(this.$refs[field].valid, 'refs');
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
    async handleUpdateTaskDetail(item) {
      this.loading = true;
      const {
        id,
        actualValue,
        judgmentResult,
      } = item;
      const payload = {
        id,
        actualValue,
        judgmentResult,
      };
      // 0 定性 1 定量
      if (item.itemType === '0') {
        delete payload.actualValue;
      }
      const result = await this.updateTaskDetail(payload);
      if (result) {
        await this.getTaskDetailList(this.taskId);
      }
      this.loading = false;
    },
    async handleStatus(status) {
      // console.log(taskStatus, 'taskStatus');
      this.loading = true;
      const { taskId, taskDetailList } = this;
      if (status === '1') {
        let flag = false;
        taskDetailList.forEach((item) => {
          if ((!item.actualValue && item.actualValue !== 0 && item.itemType === '1')
            || item.judgmentResult === '1') {
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
    changeValue(id) {
      // 浮点数 小于9999 大于0
      if (!/^(-?\d+)(\.\d+)?$/.test(this.editvalue)
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
      const taskDetailItem = this.taskDetailList.find((item) => item.id === id);
      if (!taskDetailItem) {
        return;
      }
      taskDetailItem.actualValue = this.editvalue;
      if (Number(this.editvalue) <= Number(taskDetailItem.theoreticalUpperLimit)
        && Number(this.editvalue) >= Number(taskDetailItem.theoreticalLowerBound)) {
        taskDetailItem.judgmentResult = '0';
      } else {
        taskDetailItem.judgmentResult = '1';
      }
      this.handleUpdateTaskDetail(taskDetailItem);
      this.editvalue = null;
    },
    handleChangeTab(tab) {
      this.tab = tab;
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
