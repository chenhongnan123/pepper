<template>
  <v-container fluid>
    <portal
      to="app-header"
      v-if="pagePortalMode.recipeLog"
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
                ref="recipeLogGrid"
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
    <info-dialog
      :infoDialog="infoDialog"
      :recipeLogId="recipeLogId"
      @closeDialog="infoDialog = false"
    />
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
  name: 'recipeLog',
  components: {
    AsyncGrid,
    logFilter,
    StatusBtn,
    ActionBtn,
    InfoDialog,
  },
  data() {
    return {
      elementName: 'recipeLog',
      recipeLogHeaders: ['no', 'deviceName', 'recipeVersion', 'status', 'action', 'createTime'],
      tableHeight: document.body.clientHeight - 210,
      recipeLogGrid: null,
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        rowDataId: 'recipeLogId',
        height: document.body.clientHeight - 240,
        rowHeight: 35,
      },
      request: {
        url: 'recipelog/list',
        params: {
          beginTime: new Date().getTime(),
          endTime: new Date().getTime() + 1000 * 3600 * 24,
        },
      },
      infoDialog: false,
      recipeLogId: null,
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
    this.recipeLogGrid = this.$refs.recipeLogGrid.gridApi;
  },
  mounted() {
    this.initTableHeaders();
    this.getTableList();
  },
  deactivated() {},
  methods: {
    ...mapMutations('helper', ['setAlert']),
    refresh() {
      this.getTableList();
    },
    async getTableList() {
      if (this.$refs.recipeLogGrid) {
        this.$refs.recipeLogGrid.init();
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successFetchData',
        });
      }
    },
    searchLogList({ dateFilter, filterInfo }) {
      const params = {
        ...filterInfo,
        beginTime: dateFilter[0],
        endTime: dateFilter[1],
      };
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
      const { recipeLogId } = rowData;
      this.recipeLogId = recipeLogId;
      this.infoDialog = true;
    },
    initTableHeaders() {
      let headers = [];
      headers = this.recipeLogHeaders.map((item, index) => {
        const obj = {
          field: item,
          headerName: this.$t(`recipeLog.table.${item}`),
          index,
          filter: false,
          floatingFilter: false,
          // checkboxSelection: index === 0,
          // headerCheckboxSelection: index === 0,
        };
        if (item === 'no') {
          obj.valueGetter = 'node.rowIndex + 1';
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
