<template>
  <v-container
    fluid
    class="darkNoBgColor"
  >
    <portal
      to="app-header"
      v-if="pagePortalMode.alarmConfiguration"
    >
      {{ $t(`modules.${moduleName}`) }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="goSettings"
      >
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="refresh"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <portal
      to="page-header"
    ></portal>
    <v-toolbar
      id="topToolBar"
      flat
      dense
      class="pa-0 nopadding"
      style="width: 100%;"
    >
      <div style="display: flex;width: 50%;">
        <div id="tabpage" style="width: 100%">
          <v-tabs
            center-active
            show-arrows
            class="pa-0"
            v-model="tab"
            @change="handleChangeTab"
            :key="`tab_${tab}`"
          >
            <v-tab
              v-for="(item, index) in items"
              :key="index"
            >
              {{ item.text }}
            </v-tab>
          </v-tabs>
        </div>
      </div>
      <v-spacer></v-spacer>
      <v-btn
        small
        outlined
        class="text-none mr-2"
        color="error"
        @click="handleDelete"
        :disabled="!selectedTableList[tab] || selectedTableList[tab].length === 0"
      >
        <v-icon left small>mdi-delete</v-icon>
        {{ $t('btn.delete') }}
      </v-btn>
      <v-btn
        small
        outlined
        class="text-none mr-2"
        color="success"
        @click="editBtnClick"
        :disabled="!selectedTableList[tab]
        || selectedTableList[tab].length === 0
        || selectedTableList[tab].length > 1"
      >
        <v-icon left small>mdi-pencil</v-icon>
        {{ $t('btn.edit') }}
      </v-btn>
      <!-- eslint-disable-next-line -->
      <input
        type="file"
        accept=".xlsx"
        ref="uploader"
        class="d-none"
        id="uploadFiles"
        @change="onFilesChanged"
      />
      <v-btn
        outlined
        small
        class="text-none mr-2"
        color="primary"
        @click="handleImportClick"
      >
        {{ $t('btn.import') }}
      </v-btn>
      <v-btn
        outlined
        small
        class="text-none mr-2"
        color="primary"
        @click="handleExportSample"
      >
        {{ $t('btn.exportSample') }}
      </v-btn>
      <v-btn
        outlined
        small
        class="text-none mr-2"
        color="primary"
        @click="handleExport"
      >
        {{ $t('btn.export') }}
      </v-btn>
      <v-btn
        small
        class="text-none"
        color="primary"
        @click="addBtnClick"
      >
        <v-icon left small>mdi-plus</v-icon>
        {{ $t('btn.add') }}
      </v-btn>
    </v-toolbar>
    <div>
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="(item, key) in items"
          :key="`tab_item_${key}`"
          :eager="true"
        >
          <v-row
            class="text-center mt-3"
            no-gutters
          >
            <v-col :id="`aggrid_${item.text}`">
              <base-grid
                ref="alarmGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="options"
                v-model="selectedTableList[tab]"
              />
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </div>
    <!-- 设备报警配置弹窗 -->
    <device-dialog
      :deviceDialog="deviceDialog"
      :isAddNew="isAddNew"
      @closeDialog="deviceDialog = false"
      @getTableList="refresh"
      :selectedTableList="selectedTableList"
      :rules="rules"
    />
    <!-- 参数监控报警配置弹窗 -->
    <param-monitor-dialog
      :eventDialog="eventDialog"
      :isAddNew="isAddNew"
      @closeDialog="eventDialog = false"
      @getTableList="refresh"
      :selectedTableList="selectedTableList"
      :rules="rules"
    />
    <!-- SPC报警配置弹窗 -->
    <SPC-dialog
      :spcDialog="spcDialog"
      :isAddNew="isAddNew"
      @closeDialog="spcDialog = false"
      @getTableList="refresh"
      :selectedTableList="selectedTableList"
      :rules="rules"
    />
  </v-container>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';
import moment from 'moment';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import AssignSwitch from '../components/Main/AssignSwitch.vue';
import CheckBox from '../components/Main/CheckBox.vue';
import DeviceDialog from '../components/Main/DeviceDialog.vue';
import ParamMonitorDialog from '../components/Main/ParamMonitorDialog.vue';
import SPCDialog from '../components/Main/SPCDialog.vue';

export default {
  name: 'alarmConfiguration',
  data() {
    return {
      moment,
      elementName: 'alarmConfiguration',
      clientWidth: document.body.clientWidth,
      clientHeight: document.body.clientHeight,
      tab: 0, // 当前选中的tab
      selectedTableList: [], // 选中的表格数据
      gridApi: null,
      isAddNew: true, // 是否新增
      deviceAlarmHeaders: [
        'no',
        'alarmNumber',
        'alarmName',
        'componentNumber',
        'componentName',
        'description',
        'categoryName',
        'status',
        'createBy',
        'CREATION_DATE',
        'updateBy',
        'updateTime',
      ], // 设备报警表头
      paramMonitorHeaders: [
        'no',
        'eventNumber',
        'eventName',
        'description',
        'componentNumber',
        'componentName',
        'isDashboardShow',
        'dashboardPosition',
        'communicationMode',
        'parameterName',
        // 'upperLimitEnabled',
        // 'lowerLimitEnabled',
        // 'warningValueEnabled',
        // 'triggerNumberEnabled',
        'triggerCondition',
        'upperLimit',
        'upperLimitWarnValue',
        'lowerLimit',
        'lowerLimitWarnValue',
        'triggerNumber',
        'status',
        'createBy',
        'CREATION_DATE',
        'updateBy',
        'updateTime',
      ], // 参数监控报警表头
      spcAlarmHeaders: [
        'no',
        'eventNumber',
        'eventName',
        'description',
        'isDashboardShow',
        'dashboardPosition',
        'communicationMode',
        'parameterName',
        'algorithm',
        'status',
        'createBy',
        'CREATION_DATE',
        'updateBy',
        'updateTime',
      ], // SPC报警表头
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 220,
      },
      deviceDialog: false, // 设备报警配置弹窗
      eventDialog: false, // 参数监控报警配置弹窗
      spcDialog: false, // SPC报警配置弹窗
    };
  },
  components: {
    BaseGrid,
    AssignSwitch,
    CheckBox,
    DeviceDialog,
    ParamMonitorDialog,
    SPCDialog,
  },
  activated() {
    this.initTableHeaders();
    // this.init();
    this.resetSelect();
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  created() {
  },
  computed: {
    ...mapState('alarmConfiguration', [
      'deviceAlarmList',
      'paramMonitorAlarmList',
      'spcAlarmList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('helper', ['pagePortalMode']),
    moduleName() {
      return this.$route.name;
    },
    rules() {
      return this.$getAlarmRules();
    },
    // tab页签
    items() {
      return [
        {
          text: this.$t('alarmConfiguration.label.deviceAlarm'),
        },
        {
          text: this.$t('alarmConfiguration.label.paramMonitorAlarm'),
        },
        {
          text: this.$t('alarmConfiguration.label.spcAlarm'),
        },
      ];
    },
  },
  watch: {
    tab: {
      handler(oldVal, newVal) {
        // 切换页签，表格去选中
        if (oldVal || oldVal === 0) {
          this.selectedTableList[oldVal] = [];
        }
        if (newVal || newVal === 0) {
          this.selectedTableList[newVal] = [];
        }
        // 切换tab页，重新加载表头、查询表格数据
        this.initTableHeaders();
        this.init();
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    ...mapActions('alarmConfiguration', [
      'getDeviceMainItem',
      'getDeviceAlarmList',
      'getParamMonitorAlarmList',
      'getSpcAlarmList',
      'delDeviceAlarm',
      'delParamMonitorAlarm',
      'delSpcAlarm',
      'excelImport',
      'eportSampleExcel',
      'excelExport',
    ]),
    // 前往报警类型设置页面
    goSettings() {
      this.$router.push({ name: 'alarmTypeSetting' });
    },
    // tab页签切换事件
    handleChangeTab(tab) {
      this.$nextTick(() => {
        if (this.$refs.alarmGrid[tab]) {
          this.gridApi = this.$refs.alarmGrid[tab].gridApi;
        }
      });
    },
    // 刷新当前页签表格数据
    refresh() {
      this.init();
      this.resetSelect();
    },
    // 初始化表头
    initTableHeaders() {
      let headers = [];
      // eslint-disable-next-line
      const sourceHeaders = (this.tab === 0)
        ? this.deviceAlarmHeaders : ((this.tab === 1)
          ? this.paramMonitorHeaders : this.spcAlarmHeaders);
      headers = sourceHeaders.map((item, index) => {
        const obj = {
          field: item,
          headerName: `alarmConfiguration.table.${item}`,
          index,
          filter: 'agTextColumnFilter',
          checkboxSelection: index === 0,
          headerCheckboxSelection: index === 0,
        };
        if (item === 'no') {
          obj.maxWidth = 120;
        }
        if (item === 'status') {
          obj.cellRendererSelector = () => ({
            component: 'AssignSwitch',
            params: {
              currowinfo: this,
              field: 'enabledFlag',
              init: this.refresh,
            },
          });
        }
        // 是否显示在看板，使用checkbox组件
        if (item === 'isDashboardShow') {
          // delete obj.filter;
          obj.cellRendererSelector = () => ({
            component: 'CheckBox',
            params: {
              currowinfo: this,
              field: 'enabledFlag',
              init: this.refresh,
            },
          });
        }
        return obj;
      });
      this.options.headers = headers;
    },
    // 初始化加载表格数据
    async init() {
      this.handleChangeTab();
      let result = null;
      if (this.tab === 0) {
        // 获取设备报警列表
        result = await this.getDeviceAlarmList();
      } else if (this.tab === 1) {
        // 获取参数监控报警列表
        result = await this.getParamMonitorAlarmList();
      } else {
        // 获取SPC报警列表
        result = await this.getSpcAlarmList();
      }
      if (result) {
        let sourceData = [];
        if (this.tab === 0) {
          sourceData = this.deviceAlarmList;
        } else if (this.tab === 1) {
          sourceData = this.paramMonitorAlarmList;
        } else {
          sourceData = this.spcAlarmList;
        }
        // 处理表格数据后赋值
        this.options.rowData = this.processTableData(sourceData);
        // 刷新表格，去掉选中状态
        this.selectedTableList[this.tab] = [];
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
      } else {
        this.options.rowData = [];
      }
    },
    // 处理获得的表格数据
    processTableData(list) {
      return list.map((item, index) => {
        const obj = {
          ...item,
          no: index + 1,
          id: item.serialColumn, // 用于表格选中，做唯一标识
        };
        const condition = [];
        if (item.upperLimitEnabled) {
          condition.push('upperLimit');
        }
        if (item.lowerLimitEnabled) {
          condition.push('lowerLimit');
        }
        if (item.warningValueEnabled) {
          condition.push('warnValue');
        }
        if (item.triggerNumberEnabled) {
          condition.push('triggerNumber');
        }
        // 触发条件拼接
        let str = '';
        for (let i = 0; i < condition.length; i += 1) {
          // eslint-disable-next-line
          str = `${str}${i !== 0 ? ',' : ''}${this.$t(`alarmConfiguration.table.${condition[i]}`)}`;
        }
        obj.triggerCondition = str;
        if (item.CREATION_DATE) {
          obj.CREATION_DATE = moment(item.CREATION_DATE).format('YYYY-MM-DD HH:mm:ss');
        }
        if (item.lastUpdateDate) {
          obj.lastUpdateDate = moment(item.lastUpdateDate).format('YYYY-MM-DD HH:mm:ss');
        }
        return obj;
      });
    },
    // 重置选中
    resetSelect() {
      if (this.gridApi) {
        this.gridApi.deselectAll();
      }
    },
    // 删除、批量删除
    async handleDelete() {
      if (
        await this.$root.$confirm.open(
          this.$t('alarmConfiguration.dialog.deleterecord'),
          this.$t('alarmConfiguration.dialog.deleterecordconfirm'),
        )
      ) {
        const payload = {
          serialColumns: this.selectedTableList.map((item) => item.serialColumn),
        };
        let result = null;
        if (this.tab === 0) {
          result = await this.delDeviceAlarm(payload);
        } else if (this.tab === 1) {
          result = await this.delParamMonitorAlarm(payload);
        } else {
          result = await this.delSpcAlarm(payload);
        }
        if (result) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'successAction',
          });
          this.refresh();
        }
      }
    },
    // 编辑按钮点击事件
    editBtnClick() {
      this.isAddNew = false;
      if (this.tab === 0) {
        this.deviceDialog = true;
      } else if (this.tab === 1) {
        this.eventDialog = true;
      } else {
        this.spcDialog = true;
      }
    },
    // 新增按钮点击事件
    addBtnClick() {
      this.isAddNew = true;
      if (this.tab === 0) {
        this.deviceDialog = true;
      } else if (this.tab === 1) {
        this.eventDialog = true;
      } else {
        this.spcDialog = true;
      }
    },
    // 导入按钮点击事件
    handleImportClick() {
      this.$refs.uploader.click();
    },
    // 上传excel文件
    async onFilesChanged(event) {
      const payload = new FormData();
      payload.append('file', event.target.files[0]);
      let result = null;
      if (this.tab === 0) {
        result = await this.excelImport(payload);
      } else if (this.tab === 1) {
        result = await this.excelImport(payload);
      } else {
        result = await this.excelImport(payload);
      }
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.refresh();
      }
      document.getElementById('uploadFiles').value = null;
    },
    // 导出模板文件url查询
    async handleExportSample() {
      const payload = {
        API_ROUTE_PATH: 'GET_FILES_FORMATS',
        AdvCondition: [{
          param_name: 'formatName',
          condition: 'COMM_IMPORT_FORMAT', // 通讯参数导出模板
        }],
      };
      let result = null;
      if (this.tab === 0) {
        result = await this.eportSampleExcel(payload);
      } else if (this.tab === 1) {
        result = await this.eportSampleExcel(payload);
      } else {
        result = await this.eportSampleExcel(payload);
      }
      if (result) {
        const { formatPath } = result;
        // 定义文件名
        let fileName = '';
        if (this.tab === 0) {
          fileName = this.$t('alarmConfiguration.fileName.deviceAlarmSampleFile');
        } else if (this.tab === 1) {
          fileName = this.$t('alarmConfiguration.fileName.paramMonitorAlarmSampleFile');
        } else {
          fileName = this.$t('alarmConfiguration.fileName.spcAlarmSampleFile');
        }
        this.$downloadByUrl(formatPath, fileName);
      } else {
        this.setAlert({
          type: 'error',
          message: 'noFilePath',
        });
      }
    },
    // 导出按钮点击事件
    async handleExport() {
      const exportList = this.selectedTableList.map((item) => {
        const obj = {
          ...item,
        };
        // 删除之前手动添加的字段
        delete obj.no;
        delete obj.id;
        return obj;
      });
      const payload = {
        data: exportList,
      };
      let result = null;
      if (this.tab === 0) {
        result = await this.excelExport(payload);
      } else {
        result = await this.excelExport(payload);
      }
      if (result) {
        const filePath = result;
        let fileName = '';
        if (this.tab === 0) {
          fileName = this.$t('alarmConfiguration.fileName.deviceAlarmExportFile');
        } else if (this.tab === 1) {
          fileName = this.$t('alarmConfiguration.fileName.paramMonitorAlarmExportFile');
        } else {
          fileName = this.$t('alarmConfiguration.fileName.spcAlarmExportFile');
        }
        this.$downloadByUrl(filePath, fileName);
        this.resetSelect();
      } else {
        this.setAlert({
          type: 'error',
          message: 'noFilePath',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  #topToolBar {
    ::v-deep() .v-toolbar__content {
      padding: 4px 0px;
    }
  }
</style>
