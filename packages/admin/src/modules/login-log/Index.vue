<template>
  <v-container fluid>
    <portal
      to="app-header"
      v-if="pagePortalMode.loginLog"
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
              v-if="isBtnAccess('system:logininfor:remove')"
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
              v-if="isBtnAccess('system:logininfor:remove')"
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
              v-if="isBtnAccess('system:logininfor:export')"
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
                ref="loginLogGrid"
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

export default {
  name: 'loginLog',
  data() {
    return {
      moment,
      elementName: 'loginLogList',
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
            headerName: 'loginLog.table.index',
            // filter: 'agTextColumnFilter',
            filter: false,
            floatingFilter: false,
            index: 1,
            maxWidth: 100,
            valueGetter: 'node.rowIndex + 1',
          },
          {
            field: 'loginServer',
            headerName: 'loginLog.table.tabletLogin',
            filter: 'agTextColumnFilter',
            valueFormatter: (params) => {
              let data;
              switch (params.value) {
                case '1':
                  data = this.systemNameList.find((ele) => ele.configKey === 'sys.index.systemname01')?.configValue || '-';
                  break;
                case '2':
                  data = this.systemNameList.find((ele) => ele.configKey === 'sys.index.systemname02')?.configValue || '-';
                  break;
                default:
                  data = '-';
                  break;
              }
              return data;
            },
          },
          {
            field: 'userName',
            headerName: 'loginLog.table.userName',
            // filter: 'agTextColumnFilter',
            filter: false,
            floatingFilter: false,
            index: 2,
          },
          {
            field: 'ipaddr',
            headerName: 'loginLog.table.ipAddress',
            // filter: 'agTextColumnFilter',
            filter: false,
            floatingFilter: false,
            index: 3,
          },
          {
            field: 'status',
            headerName: 'loginLog.table.status',
            // filter: 'agTextColumnFilter',
            filter: false,
            floatingFilter: false,
            index: 4,
            cellRendererSelector: () => ({
              component: 'labelChip',
              params: {
                field: 'status',
                that: this,
              },
            }),
          },
          {
            field: 'msg',
            headerName: 'loginLog.table.description',
            // filter: 'agTextColumnFilter',
            filter: false,
            floatingFilter: false,
            index: 5,
          },
          {
            field: 'accessTime',
            headerName: 'loginLog.table.accessTime',
            // filter: 'agTextColumnFilter',
            filter: false,
            floatingFilter: false,
            index: 6,
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
      },
      request: {
        url: 'logininfor/list',
        params: {},
      },
    };
  },
  components: {
    AsyncGrid,
    // DateRangePicker,
    labelChip,
  },
  created() {
    this.init();
  },
  mounted() {
    this.gridApi = this.$refs.loginLogGrid.gridApi;
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
    ...mapActions('loginLog', [
      'getLoginLogList',
      'getCommonStatusList',
      'delLoginLog',
      'cleanLoginLog',
      'excelExport',
    ]),
    ...mapActions('helper', ['getSystemConfigList']),
    // async refresh() {
    //   const [min, max] = this.currentDates;
    //   await this.getLogList(min, max);
    // },
    async init() {
      await this.getSystemConfigList();
      await this.getCommonStatusList();
      if (this.$refs.loginLogGrid) {
        this.$refs.loginLogGrid.init();
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
    // 重置选择
    resetSelect() {
      if (this.gridApi) {
        this.gridApi.deselectAll();
      }
    },
    async getLogList() {
      const result = await this.getLoginLogList();
      if (result) {
        this.resetSelect();
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.options.rowData = this.loginLogList;
      } else {
        this.options.rowData = [];
      }
    },
    // 删除日志
    async handleDelete() {
      if (
        await this.$root.$confirm.open(
          this.$t('dialog.deleterecord'),
          this.$t('dialog.deleterecordconfirm'),
        )
      ) {
        const idArr = this.selectedTableList.map((item) => item.infoId);
        const ids = idArr.join(',');
        const result = await this.delLoginLog(ids);
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
          this.$t('loginLog.dialog.tip'),
          this.$t('loginLog.dialog.confirmClean'),
        )
      ) {
        const result = await this.cleanLoginLog();
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
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('helper', ['pagePortalMode', 'systemConfigList']),
    ...mapState('loginLog', ['loginLogList']),
    moduleName() {
      return this.$route.name;
    },
    systemNameList() {
      // 终端的值在系统参数中设置，取'sys.index.systemname01','sys.index.systemname02'
      return this.systemConfigList.filter((ele) => ['sys.index.systemname01', 'sys.index.systemname02'].indexOf(ele.configKey) > -1);
    },
  },
};
</script>
