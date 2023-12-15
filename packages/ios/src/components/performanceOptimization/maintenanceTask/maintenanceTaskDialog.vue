<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="moreInfo?'1600px':'1000px'"
    transition="dialog-transition"
  >
    <v-row no-gutters>
      <v-col :cols="moreInfo?'7':'12'">
        <div class="app-dialog pa-1">
          <v-card class="rounded-lg" style="min-height: 600px;">
            <div
              v-for="i in 5"
              :key="i"
              :class="`rectangle-${i}`"
            ></div>
            <v-card-title primary-title class="mt-2 pb-0">
              <span class="text-h5">
                {{ `${taskDetail.schemaName}` }}
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
            <v-card-text class="pt-3">
              <div class="d-flex align-center">
                <v-btn-toggle
                  v-model="tabkey"
                  tile
                  group
                  class="group-btn-tab"
                >
                  <v-btn
                    v-for="(item,index) in leftTab"
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
                  color="warning"
                  class="rounded-xl ml-2"
                  min-width="100px"
                  v-if="taskDetail.status === '0'
                    || taskDetail.status === '2'"
                  :disabled="loading"
                  @click="cancelTask"
                >
                  <span>
                    {{$t('maintenanceTask.cancel')}}
                  </span>
                </v-btn>
                <v-btn
                  color="primary2"
                  class="rounded-xl ml-2"
                  min-width="100px"
                  v-if="taskDetail.status === '0'"
                  :disabled="loading"
                  @click="startTask"
                >
                  <span>
                    {{$t('maintenanceTask.start')}}
                  </span>
                </v-btn>
              </div>
              <v-data-table
                fixed-header
                item-key="_id"
                :headers="headers"
                disable-pagination
                disable-sort
                :items="maintenanceTaskDetailList"
                hide-default-footer
                height="300"
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
                <template #item.upperLimit="{item}">
                  <span v-if="item.itemType === '1'">{{item.upperLimit}}</span>
                  <span v-else>-</span>
                </template>
                <!-- eslint-disable-next-line -->
                <template #item.lowerLimit="{item}">
                  <span v-if="item.itemType === '1'">{{item.lowerLimit}}</span>
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
                      v-if="taskDetail.status === '0'
                      || taskDetail.status === '2'"
                      :disabled="loading"
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
                        @change="changeValue(item.id)"
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
                      && taskDetail.status !== '2')
                      || item.itemType === '1'
                      || loading"
                    @change="handleUpdateTaskDetail(item)"
                  >
                    <v-radio color="success" value="1">
                      <template v-slot:label>
                        <span :class="item.judgmentResult === '1' ? 'success--text' : ''">OK</span>
                      </template>
                    </v-radio>
                    <v-radio color="error" value="2">
                      <template v-slot:label>
                        <span :class="item.judgmentResult === '2' ? 'error--text' : ''">NG</span>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </template>
              </v-data-table>
              <div class="d-flex align-center">
                <span class="">{{$t('maintenanceTask.comment')}}</span>
                <v-spacer></v-spacer>
                <span class="primary--text mr-4">{{$t('maintenanceTask.schemaImg')}}</span>
                <v-btn icon @click="moreInfo = !moreInfo" x-small>
                  <v-icon  v-if="moreInfo" size="22" color="primary">
                    {{'mdi-menu-open'}}
                  </v-icon>
                  <img v-else :src="require('@/assets/icons/img/btn-moreinfo-active.svg')" alt="" />
                </v-btn>
              </div>
              <v-textarea
                ref="remark"
                class="my-3 blueinput"
                outlined
                dense
                hide-details
                v-model="taskDetail.remark"
                no-resize
                :rules="rules.over500"
                rows="3"
                @change="handleUpdateTask('remark')"
                :disabled="taskDetail.status === '1'
                  || taskDetail.status === '4'
                  || loading"
              ></v-textarea>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
      <v-col v-if="moreInfo" cols="5" class="ml-n1">
        <div class="app-dialog pa-1 ml-n2">
          <v-card class="rounded-lg" style="min-height: 600px;">
            <div
              v-for="i in 5"
              :key="i"
              :class="`rectangle-${i}`"
            ></div>
            <v-card-text>
              <div class="d-flex align-center">
                <v-btn-toggle
                  v-model="tabkey"
                  tile
                  group
                  class="group-btn-tab"
                >
                  <v-btn
                    v-for="(item,index) in rightTab"
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
              </div>
              <template v-if="attachmentList.length">
                <div class="d-flex align-center">
                  <span class="page-text info--text" style="margin-left: 84px !important;">
                    {{
                      `${attachmentList[pageNum].fileName}`
                    }}
                  </span>
                </div>
                <div class="d-flex align-center" style="width: 100%;height: 450px">
                  <v-btn
                    height="196px"
                    width="27px"
                    x-small
                    class="high-blue-btn"
                    :disabled="pageNum <= 0"
                    @click="pageNum -= 1"
                  >
                    <v-icon size="70px" color="primary">mdi-menu-left</v-icon>
                  </v-btn>
                  <div
                    class="d-flex "
                    style="width: 80%"
                  >
                    <img
                      height="auto"
                      width="80%"
                      style="margin: 0 auto;display: block;"
                      :src="attachmentList[pageNum].filePath"
                      alt="Preview image"
                    >
                  </div>
                  <v-btn
                    height="196px"
                    width="27px"
                    x-small
                    class="high-blue-btn"
                    :disabled="pageNum >= attachmentList.length - 1"
                    @click="pageNum += 1"
                  >
                    <v-icon size="70px" color="primary">mdi-menu-right</v-icon>
                  </v-btn>
                </div>
                <div class="d-flex justify-center">
                  <span class="page-text info--text">
                    {{`${pageNum + 1}/${attachmentList.length}`}}
                  </span>
                </div>
              </template>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
    <!-- eslint-disable-next-line -->
  </v-dialog>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'MaintenanceTaskDialog',
  data() {
    return {
      moreInfo: true,
      taskDetail: {},
      tabkey: 0,
      pageNum: 0,
      attachmentList: [],
      saveDisabled: true,
      editvalue: null,
      loading: false,
    };
  },
  components: {
  },
  computed: {
    ...mapState('maintenanceTask', ['maintenanceTaskDialog', 'taskInfo', 'maintenanceTaskDetailList']),
    dialog: {
      get() {
        return this.maintenanceTaskDialog;
      },
      set() {
        this.setMaintenanceTaskDialog(false);
      },
    },
    rules() {
      return {
        getOver500: [
          (v) => (String(v).length <= 500 || String(v).length === 0) || `${this.$t('verification.lengthlessthan', { num: 500 })}`,
        ],
      };
    },
    taskId() {
      return Number(this.taskInfo?.id) || 0;
    },
    leftTab() {
      return [
        {
          name: this.$t('maintenanceTask.taskContent'),
        },
      ];
    },
    rightTab() {
      return [
        {
          name: this.$t('maintenanceTask.schemaImg'),
        },
      ];
    },
    headers() {
      return [
        {
          text: 'No.',
          value: 'no',
        },
        {
          text: this.$t('maintenanceTask.checkitemname'),
          value: 'checkItem',
        },
        {
          text: this.$t('maintenanceTask.checkitemdescription'),
          value: 'checkItemDesc',
        },
        {
          text: this.$t('maintenanceTask.associateBomName'),
          value: 'associateBomName',
        },
        {
          text: this.$t('maintenanceTask.upperLimit'),
          value: 'theoreticalUpperLimit',
        },
        {
          text: this.$t('maintenanceTask.lowerLimit'),
          value: 'theoreticalLowerBound',
        },
        {
          text: this.$t('maintenanceTask.value'),
          value: 'actualValue',
        },
        {
          text: this.$t('maintenanceTask.result'),
          value: 'judgmentResult',
        },
      ];
    },
  },
  methods: {
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapMutations('maintenanceTask', ['setMaintenanceTaskDialog', 'setMaintenanceTaskDetailList']),
    ...mapActions('setting', ['HANDLE_AUTHACTION']),
    ...mapActions('maintenanceTask', [
      'getTaskDetailList',
      'getTaskDetailById',
      'getAttachmentList',
      'updateTask',
      'updateTaskDetail',
    ]),
    async init() {
      const { id, schemaId } = this.taskInfo;
      const files = await this.getAttachmentList({
        id: schemaId,
        docType: 'maintenanceDetail',
      });
      // console.log(files, 'files');
      this.attachmentList = files.filter((file) => file.fileExtension === '.img'
        || file.fileExtension === '.png'
        || file.fileExtension === '.jpg'
        || file.fileExtension === '.jpeg');
      this.taskDetail = await this.getTaskDetailById(id);
      await this.getTaskDetailList(id);
    },
    strLen(str) {
      let count = 0;
      for (let i = 0; i < str.length; i += 1) {
        count += str.charCodeAt(i) <= 128 ? 1 : 2;
      }
      return count;
    },
    changeValue(id) {
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
      const taskDetailItem = this.maintenanceTaskDetailList.find((item) => item.id === id);
      if (!taskDetailItem) {
        return;
      }
      taskDetailItem.actualValue = this.editvalue;
      if (Number(this.editvalue) <= Number(taskDetailItem.theoreticalUpperLimit)
        && Number(this.editvalue) >= Number(taskDetailItem.theoreticalLowerBound)) {
        taskDetailItem.judgmentResult = '1';
      } else {
        taskDetailItem.judgmentResult = '2';
      }
      this.handleUpdateTaskDetail(taskDetailItem);
      this.editvalue = null;
    },
    startTask() {
      this.handleTask('2');
    },
    async completeTask() {
      this.handleTask('1');
    },
    cancelTask() {
      this.handleTask('4');
    },
    async handleTask(status) {
      this.loading = true;
      const { taskDetail, maintenanceTaskDetailList } = this;
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
        maintenanceTaskDetailList.forEach((item) => {
          if ((!item.actualValue && item.actualValue !== 0 && item.itemType === '1')
            || item.judgmentResult === '2') {
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
        id: taskDetail.id,
        status,
      };
      const result = await this.updateTask(payload);
      if (result) {
        this.init();
      }
      this.loading = false;
    },
    async handleUpdateTask(field) {
      if (this.loading) { return; }
      if (!this.$refs[field].valid) {
        return;
      }
      console.log(111);
      this.loading = true;
      const { taskDetail } = this;
      const payload = {
        id: taskDetail.id,
      };
      payload[field] = taskDetail[field] || '';
      const result = await this.updateTask(payload);
      if (result) {
        this.taskDetail = await this.getTaskDetailById(taskDetail.id);
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
  },
  watch: {
    dialog(dialog) {
      if (!dialog) {
        return;
      }
      this.tabkey = 0;
      this.pageNum = 0;
      this.init();
    },
  },
};
</script>
