<template>
  <v-container
    fluid
    class="darkNoBgColor"
  >
    <portal
      to="app-header"
      v-if="pagePortalMode.dataSourceDetail"
    >
      <v-btn
        class="mb-1"
        icon
        small
        @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ curDataSource.dataSourceName || '-' }}
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
            <DateTimeRangePicker v-model="dateFilter" />
            <v-spacer></v-spacer>
            <v-btn
              v-if="isBtnAccess('basic:transport:importDataSourceParamMongo')"
              outlined
              small
              class="text-none mr-2"
              color="primary"
              @click="handleImportClick"
              :disabled="curDataSource.active === '1'"
            >
              {{ $t('btn.import') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('system:param:exportBasicDataSourceParamList')"
              outlined
              small
              class="text-none mr-2"
              color="primary"
              @click="exportDialog = true"
            >
              {{ $t('btn.export') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('system:param:importTemplateDataSourceParam')"
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
              accept=".csv"
              ref="uploader"
              class="d-none"
              id="uploadFiles"
              @change="onFilesChanged"
            />
            <v-btn
              v-if="isBtnAccess('system:source:deleteBatchMongo')"
              small
              outlined
              class="text-none mr-2"
              color="error"
              @click="handleDelete"
              :disabled="selectedTableList.length === 0"
            >
              <v-icon left small>mdi-delete</v-icon>
              {{ $t('btn.delete') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('system:source:deleteAllMongo')"
              small
              class="text-none mr-2"
              color="error"
              @click="handleClean"
            >
              <v-icon left small>mdi-delete</v-icon>
              {{ $t('dataSource.btn.clean') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('system:param:updateBasicDataSourceList')"
              small
              class="text-none mr-2"
              color="warning"
              @click="editColumnDialog = true"
              :disabled="curDataSource.active === '1'"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('dataSource.btn.editColumn') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('system:source:batchAddBasicDataSourceParamAndCheck')"
              small
              color="primary"
              class="text-none mr-2"
              @click="addColumnDialog = true"
              :disabled="curDataSource.active === '1' || curDataSource.storageMode !== '1'"
            >
              <v-icon left small>mdi-plus</v-icon>
              {{ $t('dataSource.btn.addColumn') }}
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
              <async-grid
                ref="paramDataGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="options"
                v-model="selectedTableList"
                :url="url"
                :parameters="params"
                method="basicGet"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <add-column-dialog
      :addDialog="addColumnDialog"
      :dataSource="curDataSource"
      @closeDialog="addColumnDialog = false"
      @getTableList="init"
    />
    <edit-column-dialog
      :editDialog="editColumnDialog"
      :dataSource="curDataSource"
      @closeDialog="editColumnDialog = false"
      @getTableList="init"
    />
    <export-dialog
      :exportDialog="exportDialog"
      :dataSource="curDataSource"
      @closeDialog="exportDialog = false"
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
import AsyncGrid from '@/components/aggrid/AsyncGrid.vue';
import DateTimeRangePicker from '@/components/commonUI/DateTimeRangePicker.vue';
import AddColumnDialog from '../components/Detail/addColumnDialog.vue';
import EditColumnDialog from '../components/Detail/editColumnDialog.vue';
import ExportDialog from '../components/Detail/exportDialog.vue';

export default {
  name: 'dataSourceDetail',
  data() {
    return {
      moment,
      dateFilter: [],
      elementName: 'paramData',
      tableHeight: document.body.clientHeight - 210,
      selectedTableList: [],
      paramDataGridApi: null,
      headers: [
        'createdtimestamp',
        'year',
        'month',
        'day',
        'week',
        'hour',
        'ts',
      ],
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
      },
      addColumnDialog: false,
      editColumnDialog: false,
      exportDialog: false,
      url: 'source/detailsList',
      params: {
        collectionName: '',
        dateFrom: new Date().getTime(),
        dateTo: new Date().getTime() + 1000 * 3600 * 24,
      },
    };
  },
  components: {
    AsyncGrid,
    AddColumnDialog,
    EditColumnDialog,
    ExportDialog,
    DateTimeRangePicker,
  },
  activated() {
    this.init();
  },
  deactivated() {
  },
  created() {
  },
  mounted() {
    this.paramDataGridApi = this.$refs.paramDataGrid.gridApi;
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    ...mapMutations('dataSource', [
      'setParameterList',
    ]),
    ...mapActions('dataSource', [
      'getDataSourceById',
      'getDataParametersById',
      'deleteData',
      'cleanData',
      'excelImport',
      'excelExport',
    ]),
    goBack() {
      this.$router.push({ name: 'dataSource' });
    },
    async refresh() {
      // this.getTableList();
      if (this.$refs.paramDataGrid) {
        this.$refs.paramDataGrid.init();
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
      }
      this.resetSelect();
    },
    async init() {
      const dsResult = await this.getDataSourceById(this.dataSourceId);
      const dpResult = await this.getDataParametersById(this.dataSourceId);
      if (dsResult && dpResult) {
        this.initTableHeaders();
        // const time = {
        //   dateFrom: new Date().setHours(0, 0, 0, 0),
        //   dateTo: new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000,
        // };
        // this.dateFilter = [time.dateFrom, time.dateTo];
        this.getTableList();
      }
      this.resetSelect();
    },
    async getTableList() {
      const [dateFrom, dateTo] = this.dateFilter;
      const { dataSourceNumber } = this.curDataSource;
      // console.log(this.curDataSource, 'this.curDataSource');
      const params = this.filterObject({
        dateFrom,
        dateTo,
        collectionName: dataSourceNumber,
      });
      Object.assign(this.params, params);
      if (this.$refs.paramDataGrid) {
        // this.$refs.paramDataGrid.init();
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
      }
    },
    filterObject(obj) {
      Object.keys(obj).forEach((k) => {
        if (obj[k] == null || obj[k] === '') delete obj[k];
      });
      return obj;
    },
    initTableHeaders() {
      const that = this;
      const paramHeaders = this.dataParamList.map((item) => {
        const obj = {
          field: item.connectionParameterNumber,
          headerName: item.columnName,
        };
        return obj;
      });
      const defaultHeaders = this.headers.map((item) => {
        const obj = {
          field: item,
          headerName: `dataSource.table.${item}`,
        };
        if (item === 'createdtimestamp') {
          obj.valueGetter = (params) => {
            if (params.data.createdtimestamp) {
              return that.$getFormatDate(params.data.createdtimestamp, 'yyyy-MM-DD HH:mm:ss.SSS');
            }
            return '-';
          };
        }
        return obj;
      });
      const headers = [
        {
          field: 'no',
          headerName: 'dataSource.table.no',
          checkboxSelection: true,
          headerCheckboxSelection: true,
          // eslint-disable-next-line
          valueGetter: (params) => params.node?.rowIndex + 1,
        },
        ...paramHeaders,
        ...defaultHeaders,
      ];
      this.options.headers = headers;
    },
    resetSelect() {
      if (this.paramDataGridApi) {
        this.paramDataGridApi.deselectAll();
      }
    },
    handleImportClick() {
      this.$refs.uploader.click();
    },
    async onFilesChanged(event) {
      const payload = new FormData();
      payload.append('file', event.target.files[0]);
      payload.append('collection', this.curDataSource.dataSourceNumber);
      const result = await this.excelImport(payload);
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
    // 导出模板文件
    async handleExportSample() {
      await this.excelExport({ dataSourceId: +this.dataSourceId });
    },
    // 导出按钮点击事件
    handleExport() {
      console.log(123);
    },
    async handleDelete() {
      if (
        await this.$root.$confirm.open(
          this.$t('dialog.deleterecord'),
          this.$t('dialog.deleterecordconfirm'),
        )
      ) {
        const { dataSourceNumber } = this.curDataSource;
        // eslint-disable-next-line
        const dataIds = this.selectedTableList.map((item) => item._id);
        const payload = {
          dataIds,
          collectionName: dataSourceNumber,
        };
        const result = await this.deleteData(payload);
        if (result) {
          this.refresh();
        }
      }
    },
    async handleClean() {
      if (
        await this.$root.$confirm.open(
          this.$t('dialog.deleterecord'),
          this.$t('dataSource.dialog.confirmClean'),
        )
      ) {
        const { dataSourceNumber } = this.curDataSource;
        // eslint-disable-next-line
        const payload = {
          collectionName: dataSourceNumber,
        };
        const result = await this.cleanData(payload);
        if (result) {
          this.refresh();
        }
      }
    },
  },
  computed: {
    ...mapState('dataSource', [
      'curDataSource',
      'dataParamList',
      'dataList',
    ]),
    ...mapState('helper', ['currentLocale', 'pagePortalMode']),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
    dataSourceId() {
      return this.$route.params.id;
    },
    rules() {
      return this.$getConnectionRules();
    },
  },
  watch: {
    dateFilter() {
      console.log('ddd');
      const { dataSourceNumber } = this.curDataSource;
      if (!dataSourceNumber) { return; }
      this.getTableList();
    },
  },
};
</script>
