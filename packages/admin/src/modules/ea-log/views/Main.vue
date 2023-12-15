<template>
  <v-container fluid>
    <portal
      to="app-header"
      v-if="pagePortalMode.eaLog"
    >
      {{ $t(`modules.${moduleName}`) }}
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
          <div
            class="d-flex align-center px-4"
            style="height: 100%"
          >
            <log-filter @searchLogList="searchLogList" />
          </div>
        </v-card>
        <v-card
          :height="tableHeight"
          class=""
          elevation="0"
          color="bg"
        >
          <v-row
            no-gutters
            class="pa-4"
          >
            <v-col>
              <async-grid
                ref="eaLogGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="options"
                :url="request.url"
                :parameters="request.params"
                method="basicGet"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <info-dialog :infoDialog="infoDialog"  :logId="logId" @closeDialog="infoDialog=false" />
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import AsyncGrid from '@/components/aggrid/AsyncGrid.vue';
import logFilter from '../components/LogFilter.vue';
import StatusBtn from '../components/StatusBtn.vue';
import ActionBtn from '../components/ActionBtn.vue';
import InfoDialog from '../components/InfoDialog';

export default {
  name: 'eaLog',
  components: {
    AsyncGrid,
    logFilter,
    StatusBtn,
    ActionBtn,
    InfoDialog,
  },
  data() {
    return {
      elementName: 'eaLog',
      eaLogHeaders: [
        'no',
        'dispatchNumber',
        'deviceName',
        'event',
        'status',
        'action',
        'createTime',
      ],
      tableHeight: document.body.clientHeight - 210,
      eaLogGrid: null,
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        rowDataId: 'logId',
        height: document.body.clientHeight - 240,
        rowHeight: 35,
      },
      request: {
        url: 'ealog/list',
        params: {
          beginTime: new Date().getTime(),
          endTime: new Date().getTime() + 1000 * 3600 * 24,
        },
      },
      infoDialog: false,
      logId: null,
    };
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {
    this.eaLogGrid = this.$refs.eaLogGrid.gridApi;
  },
  mounted() {
    this.initTableHeaders();
    this.getTableList();
  },
  deactivated() {},
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('eaLog', ['toggleDrawer']),
    refresh() {
      this.getTableList();
    },
    async getTableList() {
      if (this.$refs.eaLogGrid) {
        this.$refs.eaLogGrid.init();
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successFetchData',
        });
      }
    },
    searchLogList({ dateFilter, filterInfo }) {
      const params = this.filterObject({
        ...filterInfo,
        beginTime: dateFilter[0],
        endTime: dateFilter[1],
      });
      Object.assign(this.request.params, params);
      this.getTableList();
    },
    // 过滤对象里的null undefined ''
    filterObject(obj) {
      Object.keys(obj).forEach((k) => {
        if (obj[k] == null || obj[k] === '') delete obj[k];
      });
      return obj;
    },
    showDialog(rowData) {
      const { logId } = rowData;
      this.logId = logId;
      this.infoDialog = true;
    },
    initTableHeaders() {
      let headers = [];
      headers = this.eaLogHeaders.map((item, index) => {
        const obj = {
          field: item,
          headerName: this.$t(`eaLog.table.${item}`),
          index,
          filter: false,
          floatingFilter: false,
          // checkboxSelection: index === 0,
          // headerCheckboxSelection: index === 0,
        };
        if (item === 'no') {
          obj.valueGetter = 'node.rowIndex + 1';
        }
        if (item === 'event') {
          obj.valueFormatter = (params) => {
            const { value } = params;
            if (value === '0') {
              return '开工';
            }
            if (value === '1') {
              return '报工';
            }
            if (value === '2') {
              return '主动推送任务';
            }
            if (value === '3') {
              return '自动要取任务';
            }
            if (value === '4') {
              return '行车任务执行';
            }
            if (value === '5') {
              return '获取光棒编号';
            }
            return null;
          };
        }
        if (item === 'status') {
          obj.cellRendererSelector = () => ({
            component: 'StatusBtn',
            params: {
              that: this,
              field: 'status',
            },
          });
        }
        if (item === 'action') {
          obj.cellRendererSelector = () => ({
            component: 'ActionBtn',
            params: {
              currentRowInfo: this,
            },
          });
        }
        return obj;
      });
      this.options.headers = headers;
    },
  },
};
</script>
