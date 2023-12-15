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
          `${taskDetail.expertiseName || '-'}|${taskDetail.partName || '-'}`
        }}
        <v-spacer></v-spacer>
        <v-chip
          label
          outlined
          color="white"
          class="rounded-lg"
        >
          <span class="mx-2">{{experienceTypeName || '-'}}</span>
        </v-chip>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <div>
              {{ $t('expertKnowledge.table.type') }}
            </div>
            <div class="title white--text">
              {{ experienceTypeName || '-' }}
            </div>
          </v-col>
          <v-col>
            <div>
              {{ $t('expertKnowledge.table.number') }}
            </div>
            <div class="title white--text">
              {{ taskDetail.expertiseNumber || '-' }}
            </div>
          </v-col>
          <v-col>
            <div>
              {{ $t('expertKnowledge.table.name') }}
            </div>
            <div class="title white--text">
              {{ taskDetail.expertiseName || '-' }}
            </div>
          </v-col>
          <v-col>
            <div>
              {{ $t('expertKnowledge.table.createdBy') }}
            </div>
            <div class="title white--text">
              {{ taskDetail.createBy || '-' }}
            </div>
          </v-col>
          <v-col>
            <div>
              {{ $t('expertKnowledge.table.createdTime') }}
            </div>
            <div class="title white--text">
              {{ taskDetail.createTime || '-' }}
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
          color="primary"
          outlined
          @click="addPartDialog = true"
          v-if="tab === 1 && isBtnAccess('basic:parts:addBatch')"
        >
          <v-icon left small>mdi-plus</v-icon>
          {{ $t('maintenanceTask.btn.addPart') }}
        </v-btn>
        <v-btn
          small
          class="text-none mr-2"
          color="primary"
          outlined
          @click="addAttachmentDialog = true"
          v-if="tab === 2 && isBtnAccess('system:expertiseFile:upload')"
        >
          <v-icon left small>mdi-plus</v-icon>
          {{ $t('maintenanceTask.btn.addAttachment') }}
        </v-btn>
      </div>
      <v-tabs-items v-model="tab" class="grey-thin-border rounded">
        <v-tab-item class="pa-3" >
          <v-row no-gutters class="my-2">
            <v-col cols="4" class="px-2">
              <v-autocomplete
                ref="alarmCodeId"
                outlined
                :label="`${$t('expertKnowledge.table.errorCode')}*`"
                v-model="taskDetail.alarmCodeId"
                :items="errorCodeList"
                item-text="alarmCode"
                item-value="alarmCodeId"
                hide-details
                @change="handleUpdate('alarmCodeId')"
                :disabled="!isBtnAccess('basic:expertise:edit')"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="8" class="px-2">
              <v-text-field
                outlined
                :label="`${$t('expertKnowledge.table.errorName')}`"
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
                :label="`${$t('maintenanceTask.table.symptom')}`"
                v-model="taskDetail.faultPhenomenon"
                no-resize
                :rules="rules.over500"
                rows="10"
                @change="handleUpdate('faultPhenomenon')"
                :disabled="!isBtnAccess('basic:expertise:edit')"
              ></v-textarea>
            </v-col>
            <v-col cols="4" class="px-2">
              <v-textarea
                ref="faultCause"
                class="mt-3"
                style="flex:initial"
                clearable
                outlined
                :label="`${$t('maintenanceTask.table.reason')}`"
                v-model="taskDetail.faultCause"
                no-resize
                :rules="rules.over500"
                rows="10"
                @change="handleUpdate('faultCause')"
                :disabled="!isBtnAccess('basic:expertise:edit')"
              ></v-textarea>
            </v-col>
            <v-col cols="4" class="px-2">
              <v-textarea
                ref="solutionMeasures"
                class="mt-3"
                style="flex:initial"
                clearable
                outlined
                :label="`${$t('maintenanceTask.table.solution')}`"
                v-model="taskDetail.solutionMeasures"
                no-resize
                :rules="rules.over500"
                rows="10"
                @change="handleUpdate('solutionMeasures')"
                hide-details
                :disabled="!isBtnAccess('basic:expertise:edit')"
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
                :items="partList"
                dense
              >
                <!-- eslint-disable-next-line -->
                <template #item.partCount="{item}">
                  <span class="mr-1">{{item.partCount}}</span>
                    <v-menu
                    :close-on-content-click="false"
                    :ref="`editMenu-${item.no}`"
                    offset-x
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        x-small
                        v-bind="attrs"
                        v-on="on"
                        color="primary"
                        v-if="isBtnAccess('basic:parts:edit')"
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
                    @click="handleDelete(item.id)"
                    v-if="isBtnAccess('basic:parts:remove')"
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
            :isAccessDownload="isBtnAccess('system:expertiseFile:download')"
            :isAccessPreview="isBtnAccess('system:expertiseFile:preview')"
            :isAccessDelete="isBtnAccess('system:expertiseFile:remove')"
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
        @change="handleUpdate('remark')"
        :disabled="!isBtnAccess('basic:expertise:edit')"
      ></v-textarea>
    </v-card>
    <add-attachment-dialog
      :addDialog="addAttachmentDialog"
      :id="expertiseId"
      :docType="docType"
      @closeDialog="addAttachmentDialog = false"
      @getTableList="getAttachmentTableList"
    />
    <add-part-dialog
      :addDialog="addPartDialog"
      :expertiseId="expertiseId"
      @closeDialog="addPartDialog = false"
      @getTableList="getTableList"
      @handleIgnore="handleIgnore"
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
import AddAttachmentDialog from '@/modules/maintenance-task/components/AddAttachmentDialog.vue';
import AddPartDialog from './AddPartDialog.vue';
import IgnorePartDialog from './ignoreDialog.vue';

export default {
  name: 'expertKnowledgeDetailComponent',
  data() {
    return {
      cardHeight: 200,
      tableHeight: document.body.clientHeight - 580,
      tab: 0,
      taskDetail: {},
      addAttachmentDialog: false,
      addPartDialog: false,
      createExpertiseDialog: false,
      editvalue: null,
      docType: 'experience',
      ignoreDialog: false,
      ignoreList: [],
    };
  },
  components: {
    TabLayout,
    AttachmentTable,
    AddAttachmentDialog,
    AddPartDialog,
    IgnorePartDialog,
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('errorRepair', ['errorCodeList']),
    ...mapState('expertKnowledge', [
      'expertKnowledgeTypeList',
      'partList',
      'attachmentList',
    ]),
    rules() {
      return this.$getMaintenanceRules();
    },
    // 模块名称
    moduleName() {
      return this.$route.name;
    },
    expertiseId() {
      return Number(this.$route.params.id);
    },
    experienceTypeName() {
      const { taskDetail, expertKnowledgeTypeList } = this;
      if (taskDetail.expertiseType) {
        const type = expertKnowledgeTypeList
          .find((s) => s.dictValue === taskDetail.expertiseType) || {};
        return type.dictLabel || taskDetail.expertiseType;
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
          value: 'partId',
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
    ...mapActions('expertKnowledge', [
      'getCurExpertKnowledge',
      'getPartList',
      'getAttachmentList',
      'getExpertKnowledgeTypeList',
      'updateExpertKnowledge',
      'updatePart',
      'deletePart',
    ]),
    ...mapActions('errorRepair', ['getErrorCodeList']),
    async refresh() {
      await this.getErrorCodeList();
      await this.getExpertKnowledgeTypeList();
      await this.getTableList();
      await this.getAttachmentTableList();
      this.saveDisabled = true;
    },
    async getTableList() {
      const { expertiseId } = this;
      this.taskDetail = await this.getCurExpertKnowledge(expertiseId);
      await this.getPartList(expertiseId);
    },
    // 获取附件列表
    async getAttachmentTableList() {
      await this.getAttachmentList({
        id: this.expertiseId,
        docType: this.docType,
      });
    },
    async handleUpdate(field) {
      if (!this.$refs[field].valid) {
        return;
      }
      const { expertiseId, taskDetail } = this;
      const payload = {
        expertiseId,
      };
      payload[field] = taskDetail[field] || '';
      const result = await this.updateExpertKnowledge(payload);
      if (result) {
        this.taskDetail = await this.getCurExpertKnowledge(expertiseId);
      }
    },
    async handleUpdatePart(item) {
      const {
        id,
        partCount,
      } = item;
      const payload = {
        id,
        partCount,
      };
      const result = await this.updatePart(payload);
      if (result) {
        await this.getPartList(this.expertiseId);
      }
    },
    async handleDelete(id) {
      const result = await this.deletePart(id);
      if (result) {
        await this.getPartList(this.expertiseId);
      }
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
      const part = this.partList.find((item) => item.id === id);
      part.partCount = this.editvalue;
      this.handleUpdatePart(part);
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
      if (this.pageName === 'expertKnowledge') {
        this.$router.push({ name: 'expertKnowledge' });
      } else if (this.pageName === 'repairTaskDetail') {
        this.$router.push({ name: 'repairTaskDetail', params: { id: this.$route.params.taskId, page: this.$route.params.taskPage, name: this.$route.params.taskName } });
      }
    },
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>
</style>
