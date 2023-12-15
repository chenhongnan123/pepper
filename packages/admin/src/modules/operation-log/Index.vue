<template>
  <v-container fluid>
    <portal
      to="app-header"
      v-if="pagePortalMode.operationLog"
    >
      {{ $t(`modules.${moduleName}`) }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="init"
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
            <!-- <div>
              <date-range-picker
                @getDateRange="getDateRange"
                :currentDates="currentDates"
              />
            </div> -->
            <v-spacer></v-spacer>
            <v-btn
              v-if="isBtnAccess('system:operlog:remove')"
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
              v-if="isBtnAccess('system:operlog:remove')"
              small
              outlined
              class="text-none mr-2"
              color="error"
              @click="handleClear"
            >
              <v-icon left small>mdi-delete</v-icon>
              {{ $t('btn.clear') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('system:operlog:export')"
              small
              outlined
              class="text-none mr-2"
              color="warning"
              @click="handleExport"
            >
              <v-icon left small>mdi-download</v-icon>
              {{ $t('btn.export') }}
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
                ref="operationLogGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="options"
                v-model="selectedTableList"
                :url="request.url"
                :parameters="request.params"
                method="systemGet"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';
import moment from 'moment';
import AsyncGrid from '@/components/aggrid/AsyncGrid.vue';
// import DateRangePicker from '@/components/commonUI/DateRangePicker.vue';
import labelChip from './components/labelChip.vue';
import actionBtn from './components/actionBtn.vue';

export default {
  name: 'operationLog',
  data() {
    return {
      moment,
      elementName: 'operationLogList',
      clientHeight: document.body.clientHeight,
      tableHeight: document.body.clientHeight - 210,
      // currentDates: [],
      selectedTableList: [],
      options: {
        headers: [
          {
            field: 'no',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            maxWidth: 100,
            headerName: 'operationLog.table.no',
            // filter: 'agTextColumnFilter',
            filter: false,
            floatingFilter: false,
            valueGetter: 'node.rowIndex + 1',
            index: 0,
          },
          {
            field: 'title',
            headerName: 'operationLog.table.systemModule',
            // filter: 'agTextColumnFilter',
            filter: false,
            floatingFilter: false,
            index: 1,
          },
          {
            field: 'businessType',
            headerName: 'operationLog.table.operationType',
            // filter: 'agTextColumnFilter',
            filter: false,
            floatingFilter: false,
            index: 2,
            cellRendererSelector: () => ({
              component: 'labelChip',
              params: {
                field: 'businessType',
                that: this,
              },
            }),
          },
          {
            field: 'operName',
            headerName: 'operationLog.table.operatorName',
            // filter: 'agTextColumnFilter',
            filter: false,
            floatingFilter: false,
            index: 3,
          },
          {
            field: 'operIp',
            headerName: 'operationLog.table.ip',
            // filter: 'agTextColumnFilter',
            filter: false,
            floatingFilter: false,
            index: 5,
          },
          {
            field: 'status',
            headerName: 'operationLog.table.status',
            // filter: 'agTextColumnFilter',
            filter: false,
            floatingFilter: false,
            index: 7,
            cellRendererSelector: () => ({
              component: 'labelChip',
              params: {
                field: 'status',
                that: this,
              },
            }),
          },
          {
            field: 'operTime',
            headerName: 'operationLog.table.operationTime',
            // filter: 'agTextColumnFilter',
            filter: false,
            floatingFilter: false,
            index: 8,
          },
          {
            field: 'action',
            headerName: 'operationLog.table.action',
            index: 9,
            maxWidth: 100,
            // filter: 'agTextColumnFilter',
            filter: false,
            floatingFilter: false,
            cellRendererSelector: () => ({
              component: 'actionBtn',
              params: {
                that: this,
              },
            }),
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
      },
      request: {
        url: '/operlog/list',
        params: {
          orderByColumn: 'operTime',
          isAsc: 'descending',
        },
      },
      gridApi: null,
    };
  },
  components: {
    AsyncGrid,
    // DateRangePicker,
    labelChip,
    actionBtn,
  },
  created() {
    this.init();
  },
  mounted() {
    this.gridApi = this.$refs.operationLogGrid.gridApi;
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    ...mapActions('operationLog', [
      'getOperationLogList',
      'getOperTypeDictList',
      'getCommonStatusList',
      'delOperationLog',
      'cleanOperationLog',
      'excelExport',
    ]),
    async init() {
      await this.getCommonStatusList();
      await this.getOperTypeDictList();
      if (this.$refs.operationLogGrid) {
        this.$refs.operationLogGrid.init();
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successFetchData',
        });
      }
      this.gridApi.deselectAll();
      // this.initDate();
      // const [min, max] = this.currentDates;
      // await this.getLogList(min, max);
      // await this.getLogList();
    },
    // async refresh() {
    //   const { currentDates } = this;
    //   let [min, max] = currentDates;
    //   min = this.$getFormatDate(min, 'yyyy-MM-DD');
    //   max = this.$getFormatDate(max, 'yyyy-MM-DD');
    //   await this.getLogList(min, max);
    //   await this.getLogList();
    // },
    // 重置选择
    resetSelect() {
      if (this.gridApi) {
        this.gridApi.deselectAll();
      }
    },
    async getLogList() {
      const result = await this.getOperationLogList();
      if (result) {
        this.resetSelect();
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.options.rowData = this.operationLogList;
      } else {
        this.options.rowData = [];
      }
    },
    // async getDateRange(data) {
    //   let [min, max] = data;
    //   min = this.$getFormatDate(min, 'yyyy-MM-DD');
    //   max = this.$getFormatDate(max, 'yyyy-MM-DD');
    //   this.currentDates = [min, max];
    //   await this.getLogList(min, max);
    // },
    // initDate() {
    //   let min = new Date().getTime();
    //   let max = new Date().getTime() + 1000 * 3600 * 24;
    //   min = this.$getFormatDate(min, 'yyyy-MM-DD');
    //   max = this.$getFormatDate(max, 'yyyy-MM-DD');
    //   this.currentDates = [min, max];
    // },
    // 删除日志
    async handleDelete() {
      if (
        await this.$root.$confirm.open(
          this.$t('dialog.deleterecord'),
          this.$t('dialog.deleterecordconfirm'),
        )
      ) {
        const idArr = this.selectedTableList.map((item) => item.operId);
        const ids = idArr.join(',');
        const result = await this.delOperationLog(ids);
        if (result) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'successAction',
          });
          this.init();
        }
      }
    },
    // 清空日志
    async handleClear() {
      if (
        await this.$root.$confirm.open(
          this.$t('operationLog.dialog.tip'),
          this.$t('operationLog.dialog.confirmClean'),
        )
      ) {
        const result = await this.cleanOperationLog();
        if (result) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'successAction',
          });
          this.init();
        }
      }
    },
    // 导出日志数据
    async handleExport() {
      await this.excelExport();
    },
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('helper', ['pagePortalMode']),
    ...mapState('operationLog', ['operationLogList']),
    moduleName() {
      return this.$route.name;
    },
  },
};
</script>
