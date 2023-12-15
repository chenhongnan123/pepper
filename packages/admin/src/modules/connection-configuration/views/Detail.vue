<template>
  <v-container
    fluid
    class="darkNoBgColor"
  >
    <portal
      to="app-header"
      v-if="pagePortalMode.connectionConfigurationDetail"
    >
      <v-btn
        class="mb-1"
        icon
        small
        @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
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
     <v-row no-gutters>
      <v-col cols="12">
        <v-card
          height="77"
          class="mb-3"
          elevation="0"
          color="bg"
        >
          <div class="d-flex align-center px-4" style="height:100%">
            <div class="d-flex flex-column" style="max-width:10%">
              <span
                class="text-body-2 info--text"
              >
                {{ $t('connectionConfiguration.table.deviceCode') }}
              </span>
              <span
                style="font-size: 18px; color: var(--v-primary-base)"
                class="text-truncate"
                :title="connectionDetail.connectionNumber"
              >
                {{ connectionDetail.connectionNumber || '-' }}
              </span>
            </div>
            <div class="d-flex flex-column ml-4" style="max-width:10%">
              <span
                class="text-body-2 info--text"
              >
                {{ $t('connectionConfiguration.table.deviceName') }}
              </span>
              <span
                style="font-size: 18px; color: var(--v-primary-base)"
                class="text-truncate"
                :title="connectionDetail.connectionName"
              >
                {{ connectionDetail.connectionName || '-' }}
              </span>
            </div>
            <div class="d-flex flex-column ml-4" style="max-width:10%">
              <span
                class="text-body-2"
                style="color: #7f7f7f"
              >
                {{ $t('connectionConfiguration.table.deviceDesc') }}
              </span>
              <span
                style="font-size: 18px; color: var(--v-primary-base)"
                class="text-truncate"
                :title="connectionDetail.connectionDescription"
              >
                {{ connectionDetail.connectionDescription || '-' }}
              </span>
            </div>
            <div class="d-flex flex-column ml-4" style="max-width:10%">
              <span
                class="text-body-2"
                style="color: #7f7f7f"
              >
                {{ $t('connectionConfiguration.table.deviceCommunicateType') }}
              </span>
              <span
                style="font-size: 18px; color: var(--v-primary-base)"
                class="text-truncate"
                :title="connectionType"
              >
                {{ connectionType }}
              </span>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              v-if="isBtnAccess('basic:parameter:removeBatch')"
              small
              outlined
              class="text-none mr-2"
              color="error"
              @click="handleDelete"
              :disabled="selectedTableList.length  === 0"
            >
              <v-icon left small>mdi-delete</v-icon>
              {{ $t('btn.delete') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('basic:parameter:edit')"
              small
              outlined
              class="text-none mr-2"
              color="success"
              @click="isAddNew = false,paramDialog = true"
              :disabled="selectedTableList.length > 1 || selectedTableList.length  === 0"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('btn.edit') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('basic:parameter:exportSample')"
              outlined
              small
              class="text-none mr-2"
              color="primary"
              @click="handleExportSample"
            >
              {{ $t('btn.exportSample') }}
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
              v-if="isBtnAccess('basic:parameter:import')"
              outlined
              small
              class="text-none mr-2"
              color="primary"
              @click="handleImportClick"
            >
              {{ $t('btn.import') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('basic:parameter:export')"
              outlined
              small
              class="text-none mr-2"
              color="primary"
              @click="handleExport"
              :disabled="selectedTableList.length  === 0"
            >
              {{ $t('btn.export') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('basic:parameter:insertList')"
              small
              color="primary"
              class="text-none mr-2"
              @click="syncParamDialog = true"
              :disabled="connectionDetail.connectionType !== '2'"
            >
              <v-icon left small>mdi-plus</v-icon>
              {{ $t('connectionConfiguration.btn.syncParams') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('basic:parameter:add')"
              small
              color="primary"
              class="text-none mr-2"
              @click="isAddNew = true,paramDialog = true"
            >
              <v-icon left small>mdi-plus</v-icon>
              {{ $t('btn.add') }}
            </v-btn>
            <v-btn
              small
              class="text-none"
              color="primary"
              :disabled="parameterList.length === 0 || monitTime !== -1"
              @click="handleMonitor"
            >
              {{ $t('btn.monitor') }} {{monitTime === -1 ? '' : monitTime}}
            </v-btn>
          </div>
        </v-card>
        <v-card
          :height="tableHeight"
          class=""
          elevation="0"
          color="bg"
        >
          <v-row no-gutters class="pa-4">
            <v-col>
              <base-grid
                ref="connectionParameterGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="options"
                v-model="selectedTableList"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <sync-param-dialog
      :syncParamDialog="syncParamDialog"
      :connection="connectionDetail"
      @closeDialog="syncParamDialog = false"
      @handleIgnore="handleIgnore"
      @getTableList="refresh"
    />
    <IngoreDialog
      :ignoreDialog="ignoreDialog"
      :ignoreList="ignoreList"
      @closeDialog="ignoreDialog = false"
    />
    <parameter-dialog
      :paramDialog="paramDialog"
      :isAddNew="isAddNew"
      :connection="connectionDetail"
      @closeDialog="paramDialog = false"
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
import ParameterDialog from '../components/Detail/ParameterDialog.vue';
import SyncParamDialog from '../components/Detail/syncParamDialog.vue';
import IngoreDialog from '../components/Detail/ignoreDialog.vue';
import CheckBox from '../components/Detail/CheckBox.vue';

export default {
  name: 'connectionConfigurationDetail',
  data() {
    return {
      moment,
      elementName: 'connectionParameterList',
      tableHeight: document.body.clientHeight - 210,
      selectedTableList: [],
      paramGridApi: null,
      isAddNew: true,
      // 1:snap7 2:OPCUA 3:Ethernetip 4:Melsec 5:Modbus
      headers: {
        1: [
          'no',
          'parameterNumber',
          'parameterName',
          'parameterDescription',
          'parameterDataType',
          'dbAddress',
          'startAddress',
          'size',
          'bitNumber',
          'maxDecimal',
          'monitor',
          'updateBy',
          'updateTime',
        ],
        2: [
          'no',
          'parameterNumber',
          'parameterName',
          'parameterDescription',
          'parameterDataType',
          'namespace',
          'identifierLabel',
          'maxDecimal',
          'monitor',
          'updateBy',
          'updateTime',
        ],
        3: [
          'no',
          'parameterNumber',
          'parameterName',
          'parameterDescription',
          'parameterDataType',
          'ethernetName',
          'monitor',
          'updateBy',
          'updateTime',
        ],
        4: [
          'no',
          'parameterNumber',
          'parameterName',
          'parameterDescription',
          'parameterDataType',
          'mcAddress',
          'size',
          'monitor',
          'updateBy',
          'updateTime',
        ],
        5: [
          'no',
          'parameterNumber',
          'parameterName',
          'parameterDescription',
          'parameterDataType',
          'modbusStartAddress',
          'size',
          'bitNumber',
          'monitor',
          'updateBy',
          'updateTime',
        ],
      },
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
      },
      paramDialog: false,
      syncParamDialog: false,
      ignoreDialog: false,
      ignoreList: [],
      monitTime: -1,
    };
  },
  components: {
    BaseGrid,
    AssignSwitch,
    SyncParamDialog,
    CheckBox,
    IngoreDialog,
    ParameterDialog,
  },
  activated() {
    this.init();
  },
  deactivated() {
  },
  created() {
  },
  mounted() {
    this.paramGridApi = this.$refs.connectionParameterGrid.gridApi;
  },
  beforeDestroy() {
    this.monitTime = 0;
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    ...mapMutations('connectionConfiguration', [
      'setParameterList',
    ]),
    ...mapActions('connectionConfiguration', [
      'getConnectionDetailById',
      'getParametersById',
      'getDataTypeList',
      'delParameter',
      'excelImport',
      'excelExport',
      'eportSampleExcel',
      'getMonitorValue',
    ]),
    goSettings() {
      this.$router.push({
        name: 'dataTypeSetting',
        params: {
          id: this.connectionId,
        },
      });
    },
    goBack() {
      this.$router.push({ name: 'connectionConfiguration' });
    },
    async refresh(type) {
      await this.getParamList(type, this.connectionDetail);
      this.resetSelect();
    },
    async init(type) {
      this.monitTime = -1;
      await this.getDataTypeList();
      const result = await this.getConnectionDetailById(this.connectionId);
      if (result && result.connectionId) {
        this.initTableHeaders();
        await this.getParamList(type, result);
      }
    },
    // 获取通讯下的参数列表
    async getParamList(isNotInit, connection) {
      const result = await this.getParametersById(connection);
      if (result) {
        // 并非初始加载表格数据，编辑/删除等操作后刷新表格，需要保留表格状态
        if (isNotInit) {
          this.paramGridApi.applyTransaction({ update: [...result] });
        } else {
          // 初始化表格数据
          this.options.rowData = result;
        }
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
      }
    },
    initTableHeaders() {
      let headers = [];
      const { connectionType } = this.connectionDetail;
      headers = this.headers[connectionType]?.map((item, index) => {
        const obj = {
          field: item,
          headerName: `connectionConfiguration.parameterTable.${item}`,
          index,
          filter: 'agTextColumnFilter',
          checkboxSelection: index === 0,
          headerCheckboxSelection: index === 0,
        };
        if (item === 'no') {
          obj.maxWidth = 100;
          obj.filter = false;
          // eslint-disable-next-line
          obj.valueGetter = (params) => params.node?.rowIndex + 1;
        }
        if (item === 'monitor') {
          obj.pinned = 'left';
        }
        if (item === 'moniEnabled') {
          obj.cellRendererSelector = () => ({
            component: 'CheckBox',
          });
        }
        if (item === 'parameterDataType') {
          obj.valueGetter = (params) => {
            if (params.data.parameterDataType) {
              const type = this.dataTypeList
                .find((m) => m.dictValue === String(params.data.parameterDataType));
              if (type) {
                return type.dictLabel;
              }
              return params.data.parameterDataType;
            }
            return '-';
          };
        }
        return obj;
      });
      this.options.headers = headers;
    },
    resetSelect() {
      if (this.paramGridApi) {
        this.paramGridApi.deselectAll();
      }
    },
    async handleDelete() {
      if (
        await this.$root.$confirm.open(
          this.$t('connectionConfiguration.dialog.deleterecord'),
          this.$t('connectionConfiguration.dialog.deleterecordconfirm'),
        )
      ) {
        const parameterIds = this.selectedTableList.map((item) => item.parameterId);
        const { connectionId } = this;
        const result = await this.delParameter({
          parameterIds,
          connectionId,
        });
        if (result) {
          this.refresh();
        }
      }
    },
    handleImportClick() {
      this.$refs.uploader.click();
    },
    async onFilesChanged(event) {
      const payload = new FormData();
      payload.append('file', event.target.files[0]);
      payload.append('connectionId', this.connectionId);
      const { excelUrl } = this;
      const result = await this.excelImport({
        excelUrl, payload,
      });
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
      const payload = new FormData();
      payload.append('connectionId', this.connectionId);
      this.eportSampleExcel(payload);
    },
    // 导出按钮点击事件
    async handleExport() {
      const ids = this.selectedTableList.map((item) => item.parameterId);
      this.excelExport({
        ids,
        connectionId: +this.connectionId,
      });
    },
    // 监控按钮点击事件
    async handleMonitor() {
      if (this.moduleName !== 'connectionConfigurationDetail') {
        return;
      }
      if (this.monitTime === 0) {
        this.monitTime = -1;
        return;
      }
      if (this.monitTime === -1) {
        this.monitTime = 10;
      }
      const monitorValues = await this.getMonitorValue('plcReadParam');
      if (monitorValues) {
        this.parameterList.forEach((item) => {
          const obj = {
            ...item,
          };
          // eslint-disable-next-line
          if (monitorValues[item.parameterId] || monitorValues[item.parameterId] === 0) {
            obj.monitor = monitorValues[item.parameterId];
          } else {
            obj.monitor = '';
          }
          if (monitorValues[item.parameterId] !== item.monitor) {
            this.paramGridApi.applyTransaction({ update: [obj] });
            item.monitor = monitorValues[item.parameterId];
          }
        });
      }
      this.monitTime -= 1;
      await this.$getTimeout(500);
      await this.handleMonitor();
    },
    handleIgnore(list) {
      this.ignoreList = list;
      this.ignoreDialog = true;
    },
  },
  computed: {
    ...mapState('connectionConfiguration', [
      'parameterList',
      'connectionDetail',
      'protocalList',
      'dataTypeList',
    ]),
    ...mapState('helper', ['currentLocale', 'pagePortalMode']),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
    rules() {
      return this.$getConnectionRules();
    },
    connectionType() {
      const { connectionDetail, protocalList } = this;
      const type = protocalList.find((item) => item.value === connectionDetail.connectionType);
      return type ? type.text : '-';
    },
    connectionId() {
      return this.$route.params.id;
    },
    excelUrl() {
      const { connectionType } = this.connectionDetail;
      let url = '';
      // 1：s7；2：opcua  3：ab；4：三菱；5：modbus
      if (connectionType === '1') {
        url = 'parameter/importSNAPExcel';
      }
      if (connectionType === '2') {
        url = 'parameter/importOPCUAExcel';
      }
      if (connectionType === '3') {
        url = 'parameter/importABOtherExcel';
      }
      if (connectionType === '4') {
        url = 'parameter/importMELSECOtherExcel';
      }
      if (connectionType === '5') {
        url = 'parameter/importMODBUSOtherExcel';
      }
      url += `?connectionId=${this.connectionId}`;
      return url;
    },
  },
};
</script>
