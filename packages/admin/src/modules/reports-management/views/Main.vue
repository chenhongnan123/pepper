<style lang="scss" scoped>
  .complete-width{
    width: 40%;
    align-items: center;
  }
</style>
<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.reportsManagement">
      {{ menuName || $t(`modules.${moduleName}`) }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="handleSearch"
        :disabled="isDisabled"
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
            <div style="max-width: 24%;">
              <v-autocomplete dense
                v-show="!this.$route.query.id" hide-details
                :label="$t('reportsManagement.label.dataSource')"
                return-object item-name="dataSourceName" item-text="dataSourceName"
                :items="dataListOptions()" v-model="queryObj.sourceKey"
                outlined @change="handleChangeSourceKey"
              >
                <template #item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.dataSourceName }}</v-list-item-title>
                    <v-list-item-title>{{ item.dataSourceNumber }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </div>
            <div class="ml-3">
              <DateTimeRangePicker style="height: 40px;"
                v-model="currentDates" @input="getDateRange" />
            </div>
            <v-btn
              class="text-none ml-3"
              color="primary" height="39"
              @click="handleSearch"
              :disabled="isDisabled"
            >
              {{ $t('reportsManagement.table.query') }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              small
              :disabled="isDisabled"
              v-show="this.$route.query?.id"
              class="text-none"
              color="primary"
              @click="saveCurrent"
              v-if="isBtnAccess('basic:grid:add')"
            >
              {{ $t('reportsManagement.btn.saveCurrent') }}
            </v-btn>
            <v-btn
              small :disabled="isDisabled"
              class="text-none ml-2"
              color="primary"
              @click="addDialog = true"
              v-if="isBtnAccess('basic:grid:add')"
            >
              {{ this.$route.query?.id ?
              $t('reportsManagement.btn.saveAs') :
              $t('reportsManagement.btn.saveReport') }}
            </v-btn>
            <export-report @on-export="onExport"
              v-if="!isDisabled && isBtnAccess('basic:grid:export')" />
            <v-btn small outlined class="text-none ml-2"
              color="primary" v-show="options.rowData?.length"
              @click="setShowChart(!showChart)">
              <v-icon left small>
                {{showChart?'mdi mdi-eye-off-outline':'mdi mdi-eye-outline'}}
              </v-icon>
              {{ chartsStateText }}
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
              <pdf-export-panel ref="pdfExport" />
              <report-base-grid
                ref="reportsManagementGrid"
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
    <add-dialog
      :addDialog="addDialog"
      :isNew="isNew" ref="addDialog"
      :selectedTableList="selectedTableList"
      @closeDialog="addDialog = false"
      @getTableList="refresh" @save="handleSaveReport"
    />
  </v-container>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import ReportBaseGrid from '@/components/aggrid/ReportBaseGrid.vue';
import DateTimeRangePicker from '@/components/commonUI/DateTimeRangePicker.vue';
import AddDialog from '../components/AddDialog.vue';
import ExportReport from '../components/ExportReport.vue';
import PdfExportPanel from '../components/PdfExportPanel.vue';

export default {
  name: 'reportsManagement',
  components: {
    ReportBaseGrid,
    DateTimeRangePicker,
    AddDialog,
    ExportReport,
    PdfExportPanel,
  },
  data() {
    return {
      elementName: 'reportsManagement',
      showGrid: false,
      tableHeight: document.body.clientHeight - 210,
      reportsManagementGridApi: null,
      totalRecords: 0,
      queryObj: {
        sourceKey: {},
        dateFrom: null,
        dateTo: null,
      },
      currentDates: [],
      headers: [
        'year',
        'month',
        'day',
        'week',
        'hour',
        'ts',
        'createdtimestamp',
      ],
      options: {
        headers: [],
        rowData: [],
        pagination: false,
        sideBar: {
          toolPanels: ['columns', 'filters'],
          position: 'right',
          defaultToolPanel: false,
        },
        showChart: true,
        animateRows: true,
        multiSortKey: 'ctrl',
        enableRangeSelection: true,
        rowGroupPanelShow: 'always',
        pivotPanelShow: 'always',
        defaultColDef: {
          filter: true,
          sortable: true,
          resizable: true,
          enableValue: true,
          enablePivot: true,
          enableRowGroup: true,
          floatingFilter: true,
          // 设置勾选全部仅选中当前页面数据
          headerCheckboxSelectionCurrentPageOnly: true,
        },
        enableCharts: true,
        height: document.body.clientHeight - 240,
        rowHeight: 35,
      },
      selectedTableList: [],
      addDialog: false,
      isNew: true,
      menuName: null,
      agChartContent: null,
      routeQuery: null,
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('reportsManagement', [
      'sourceList',
      'reportList',
      'reportDetail',
      'reportMapping',
      'dateRange',
      'reportsTableList',
      'reportsTableHeaderList',
      'showChart',
      'reportsTableTotal',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
    ...mapGetters('reportsManagement', ['reportTitle']),
    dateFrom() {
      // 获取当前日期对象
      const today = new Date();
      // 将时分秒设置为0，毫秒数设置为0
      today.setHours(0, 0, 0, 0);
      // 获取不带时分秒的时间戳
      const timestamp = today.getTime();
      return timestamp;
    },
    dateTo() {
      // 获取当前日期对象
      const today = new Date();
      // 将时分秒设置为0，毫秒数设置为0
      today.setHours(23, 59, 59, 59);
      // 获取不带时分秒的时间戳
      const timestamp = today.getTime() + 1000;
      return timestamp;
    },
    isDisabled() {
      const { id } = this.$route.query;
      const { sourceKey } = this.queryObj;
      if (id) {
        return this.currentDates?.length === 0;
      }
      return this.currentDates?.length === 0 || !sourceKey.dataSourceNumber;
    },
    // 显示或隐藏图表按钮的文案
    chartsStateText() {
      const text = this.showChart ? 'hideChart' : 'showChart';
      return this.$t(`reportsManagement.table.${text}`);
    },
  },
  activated() {
    this.reportsManagementGridApi = this.$refs.reportsManagementGrid.gridApi;
  },
  created() {
    this.getSelectList();
  },
  deactivated() {},
  mounted() {
    const routeQuery = this.$route.query.id;
    if (routeQuery) {
      this.getReportInfo(routeQuery);
    } else {
      this.options.headers = [];
      this.options.rowData = [];
      this.setReportView({
        reportViewName: this.$t(`modules.${this.moduleName}`),
      });
    }
    // this.initTableHeaders();
  },
  watch: {
    async $route(to, from) {
      const routeQuery = to.query.id;
      // 1.报表之间的跳转刷新
      // 2.报表与其他页面之间的跳转返回当前报表保持不刷新，返回其他报表保持刷新
      if (to.name === from.name || (to.name !== from.name && routeQuery !== this.routeQuery)) {
        this.routeQuery = routeQuery;
        this.$refs.reportsManagementGrid.showGridInfo(null);
        this.$refs.reportsManagementGrid.clearChart();
        this.agChartContent = null;
        this.options.headers = [];
        this.options.rowData = [];
        this.queryObj.dateFrom = null;
        this.queryObj.dateTo = null;
        this.queryObj.sourceKey = {};
        this.setShowChart(false);
        this.currentDates = [this.dateFrom, this.dateTo];
        if (routeQuery) {
          this.getReportInfo(routeQuery);
        }
      }
      if (routeQuery) {
        await this.getReportDetail(routeQuery, true);
        const agGridContent = JSON.parse(this.reportDetail.agGridContent);
        this.menuName = agGridContent.menuName;
      } else {
        this.menuName = null;
      }
      this.setReportView({
        reportViewName: this.menuName || this.$t(`modules.${this.moduleName}`),
      });
    },
  },
  methods: {
    ...mapActions('reportsManagement', [
      'getSourceList',
      'getReportsTableList',
      'getReportsTableHeaderList',
      'getReportList',
      'getReportDetail',
      'addReportMenu',
      'putReportMenu',
      'deleteRole',
      'excelExport',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    ...mapMutations('reportsManagement', [
      'setShowChart',
      'setReportView',
    ]),
    initTableHeaders() {
      const that = this;
      const defaultHeaders = this.headers.map((item) => {
        const obj = {
          field: item,
          headerName: `dataSource.table.${item}`,
        };
        if (item === 'createdtimestamp') {
          obj.valueFormatter = (params) => {
            if (params.value) {
              return that.$getFormatDate(params.value, 'yyyy-MM-DD HH:mm:ss.SSS');
            }
            return '-';
          };
        }
        return obj;
      });
      const headers = [
        // {
        //   field: 'no',
        //   headerName: 'dataSource.table.no',
        //   checkboxSelection: true,
        //   headerCheckboxSelection: true,
        //   // eslint-disable-next-line
        //   valueGetter: (params) => params.node?.rowIndex + 1,
        // },
        ...defaultHeaders,
      ];
      return headers;
    },
    // 时间选择后操作
    async getDateRange(range) {
      this.options.rowData = [];
      const [dateFrom, dateTo] = range;
      this.queryObj.dateFrom = Number(dateFrom);
      this.queryObj.dateTo = Number(dateTo);
      // eslint-disable-next-line max-len
      // const payload = `collectionName=${queryObj.sourceKey.dataSourceNumber}&dateFrom=${queryObj.dateFrom || ''}&dateTo=${queryObj.dateTo || ''}`;
      // await this.getReportsTableList(payload, true);
      // this.$nextTick(async () => {
      //   this.options.rowData = this.reportsTableList;
      //   await this.$getTimeout(1000);
      //   this.$refs.reportsManagementGrid.visualizeData();
      // });
    },
    // 获取报表数据回显
    async getReportInfo(id) {
      await this.getReportDetail(id, true);
      const agGridContent = JSON.parse(this.reportDetail.agGridContent);
      await this.getReportsTableHeaderList(agGridContent.dataSourceId, true);
      this.queryObj.sourceKey.dataSourceNumber = agGridContent.dataSourceNumber;
      this.queryObj.sourceKey.dataSourceId = agGridContent.dataSourceId;
      this.queryObj.dateFrom = agGridContent.dateFilter.dateFrom;
      this.queryObj.dateTo = agGridContent.dateFilter.dateTo;
      this.currentDates = agGridContent.dateFilter;
      this.menuName = agGridContent.menuName;
      this.setReportView({
        reportViewName: this.menuName || this.$t(`modules.${this.moduleName}`),
      });
      const headerList = this.reportsTableHeaderList.map((item) => {
        // const ifShow = !index;
        const obj = {
          colId: item.connectionParameterNumber,
          field: item.connectionParameterNumber,
          headerName: item.columnName,
          filter: 'agTextColumnFilter',
          // checkboxSelection: ifShow,
          // headerCheckboxSelection: ifShow,
        };
        return obj;
      });
      this.initTableHeaders();
      this.options.headers = [...headerList, ...this.initTableHeaders()];
      // this.$nextTick(async () => {
      //   this.options.rowData = this.reportsTableList;
      //   await this.$getTimeout(1000);
      //   this.$refs.reportsManagementGrid.visualizeData();
      // });
      this.agChartContent = agGridContent.tableContent.agChartContent;
      this.handleSearch(agGridContent.showChart, () => {
        // eslint-disable-next-line max-len
        this.$refs.reportsManagementGrid.showGridInfo(JSON.stringify(agGridContent.tableContent.aggridContent));
      });
    },
    refresh() {
      // this.getTableList();
      this.resetSelect();
    },
    // 获取数据源下拉列表
    async getSelectList() {
      await this.getSourceList(false);
    },
    // 获取表格数据
    async getTableList() {
      await this.getReportList(true);
      this.options.rowData = this.reportList;
    },
    resetSelect() {
      if (this.reportsManagementGridApi) {
        this.reportsManagementGridApi.deselectAll();
      }
    },
    // 获取数据表清单
    dataListOptions() {
      let options = [];
      options = this.sourceList.map((item) => {
        const obj = {
          dataSourceName: `${item.dataSourceName}`, // 数据源名称
          // text: `${item.dataSourceNumber}-${item.dataSourceName}`, // 数据源名称
          dataSourceNumber: item.dataSourceNumber, // 数据源编号
          dataSourceId: item.dataSourceId, // 数据源编号
        };
        return obj;
      });
      return options;
    },
    // 点击按钮查询数据
    // async handleSearch(datatable) {
    async handleSearch(showChart, callback) {
      // if (!this.$route.query.id) {
      //   this.options.headers = [];
      //   this.initTableHeaders();
      //   const headerList = this.reportsTableHeaderList.map((item) => {
      //     // const ifShow = !index;
      //     const obj = {
      //       colId: item.connectionParameterNumber,
      //       field: item.connectionParameterNumber,
      //       headerName: item.columnName,
      //       filter: 'agTextColumnFilter',
      //       // checkboxSelection: ifShow,
      //       // headerCheckboxSelection: ifShow,
      //     };
      //     return obj;
      //   });
      //   this.options.headers = [...headerList, ...this.initTableHeaders()];
      // }
      // this.options.headers = [];
      this.options.rowData = [];
      let dateFrom = null;
      let dateTo = null;
      const { queryObj, currentDates } = this;
      // const [dateFrom, dateTo] = currentDates;
      // dateFrom = dateFrom
      if (!queryObj.dateFrom || !queryObj.dateTo) {
        [dateFrom, dateTo] = currentDates;
      } else {
        dateFrom = queryObj.dateFrom;
        dateTo = queryObj.dateTo;
      }
      // queryObj.dateFrom = this.dateFrom;
      // queryObj.dateTo = this.dateTo;
      // eslint-disable-next-line max-len
      // const payload = `collectionName=${datatable.dataSourceNumber}&dateFrom=${queryObj.dateFrom}&dateTo=${queryObj.dateTo}`;
      const payload = `collectionName=${queryObj.sourceKey.dataSourceNumber}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
      // await this.getReportsTableHeaderList(queryObj.sourceKey.dataSourceId, true);
      await this.getReportsTableList(payload, true);
      if (this.reportsTableTotal > 10000) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'limitThan10000',
        });
        return;
      }
      this.options.rowData = this.reportsTableList;
      this.setShowChart(showChart);
      this.$refs.reportsManagementGrid.visualizeData();
      this.$nextTick(async () => {
        if (callback) callback();
        if (this.agChartContent) {
          await this.$getTimeout(0);
          this.$refs.reportsManagementGrid.restoreChart(this.agChartContent);
        }
      });
    },
    async handleChangeSourceKey(sourceKey) {
      this.$refs.reportsManagementGrid.showGridInfo(null);
      this.options.headers = [];
      this.options.rowData = [];
      // this.initTableHeaders();
      await this.getReportsTableHeaderList(sourceKey.dataSourceId, true);
      const headerList = this.reportsTableHeaderList.map((item) => {
        // const ifShow = !index;
        const obj = {
          colId: item.connectionParameterNumber,
          field: item.connectionParameterNumber,
          headerName: item.columnName,
          filter: 'agTextColumnFilter',
          // checkboxSelection: ifShow,
          // headerCheckboxSelection: ifShow,
        };
        return obj;
      });
      this.options.headers = [...headerList, ...this.initTableHeaders()];
    },
    async handleSaveReport(data) {
      // eslint-disable-next-line no-unreachable
      const aggridContent = this.$refs.reportsManagementGrid.getGridState();
      const agChartContentList = this.$refs.reportsManagementGrid.getChartModels();
      const agChartContent = agChartContentList?.pop() || {};
      this.$refs.addDialog.dialog = false;
      // debugger;
      // const storageKey = `${this.elementName}-${this.$route.name}`;
      // const aggridContent = localStorage.getItem(storageKey);
      const content = {
        dataSourceId: this.queryObj.sourceKey.dataSourceId,
        dataSourceNumber: this.queryObj.sourceKey.dataSourceNumber,
        menuName: data.menuName,
        dateFilter: this.currentDates,
        showChart: this.showChart,
        tableContent: {
          aggridContent: {
            ...aggridContent,
            menuName: data.menuName,
          },
          agChartContent,
        },
      };
      const urlPath = this.$route.path;
      const modifiedUrl = urlPath;
      const payload = {
        menuName: data.menuName,
        path: modifiedUrl,
        component: this.$route.name,
        agGridContent: JSON.stringify(content),
      };
      const result = await this.addReportMenu(payload);
      if (result) {
        this.$refs.addDialog.dialog = false;
        window.location.reload();
      }
    },
    // 保存当前报表
    async saveCurrent() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.saveCurrent'),
        this.$t('dialog.saveCurrentConfirm'),
      )) {
        const aggridContent = this.$refs.reportsManagementGrid.getGridState();
        const agChartContentList = this.$refs.reportsManagementGrid.getChartModels();
        const agChartContent = agChartContentList?.pop() || {};
        const content = {
          dataSourceId: this.queryObj.sourceKey.dataSourceId,
          dataSourceNumber: this.queryObj.sourceKey.dataSourceNumber,
          menuName: this.menuName,
          dateFilter: this.currentDates,
          showChart: this.showChart,
          tableContent: {
            aggridContent,
            agChartContent,
          },
        };
        const payload = {
          agGridId: this.$route.query.id,
          agGridContent: JSON.stringify(content),
        };
        const result = await this.putReportMenu(payload);
        if (result) {
          // window.location.reload();
          this.getSelectList();
          const routeQuery = this.$route.query.id;
          if (routeQuery) {
            this.getReportInfo(routeQuery);
          } else {
            this.options.headers = [];
            this.options.rowData = [];
            this.setReportView({
              reportViewName: this.$t(`modules.${this.moduleName}`),
            });
          }
          // this.initTableHeaders();
        }
      }
    },
    onExport(e) {
      const name = this.menuName || this.$t(`modules.${this.moduleName}`);
      const params = {
        fileName: `${name}${this.$t('reportsManagement.table.statement')}`,
      };
      switch (e) {
        case 'gridCSV':
          this.$refs.reportsManagementGrid.gridApi.exportDataAsCsv(params);
          break;
        case 'pdf':
          this.$refs.pdfExport.submitFormHandler({
            agGridApi: this.$refs.reportsManagementGrid.gridApi,
            agColumnApi: this.$refs.reportsManagementGrid.gridColumnApi,
          });
          break;
        default:
          this.$refs.reportsManagementGrid.gridApi.exportDataAsExcel(params);
          break;
      }
    },
  },
};
</script>
