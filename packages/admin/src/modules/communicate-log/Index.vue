<template>
  <v-container fluid>
    <portal
      to="app-header"
      v-if="pagePortalMode.communicateLog"
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
            <date-time-range-picker
              v-model="dateFilter"
              @input="filterRecord"
            />
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
                ref="communicateLogGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="options"
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
import { mapState, mapGetters, mapMutations } from 'vuex';
import AsyncGrid from '@/components/aggrid/AsyncGrid.vue';
import DateTimeRangePicker from '@/components/commonUI/DateTimeRangePicker.vue';
import ActionBtn from './components/ActionBtn.vue';
import StatusBtn from './components/StatusBtn.vue';
import TypeBtn from './components/TypeBtn.vue';

export default {
  name: 'communicateLog',
  data() {
    return {
      elementName: 'communicateLogList',
      clientHeight: document.body.clientHeight,
      tableHeight: document.body.clientHeight - 210,
      dateFilter: [],
      selectedTableList: [],
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'communicateLog.table.no',
            filter: false,
            floatingFilter: false,
            index: 1,
            maxWidth: 100,
            valueGetter: 'node.rowIndex + 1',
          },
          {
            field: 'createTime',
            headerName: 'communicateLog.table.createTime',
            filter: false,
            floatingFilter: false,
            index: 2,
          },
          {
            field: 'connectionName',
            headerName: 'communicateLog.table.connectionName',
            filter: false,
            floatingFilter: false,
            index: 3,
          },
          {
            field: 'connectionType',
            headerName: 'communicateLog.table.connectionType',
            filter: false,
            floatingFilter: false,
            index: 4,
            cellRendererSelector: () => ({
              component: 'TypeBtn',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'ip',
            headerName: 'communicateLog.table.ip',
            filter: false,
            floatingFilter: false,
            index: 5,
            // valueGetter: (params) => {
            //   if (params.data.eventContent) {
            //     const type = this.eventContentTypeList.find(
            //       (m) => m.dictValue === params.data.eventContent,
            //     );
            //     if (type) {
            //       return type.dictLabel;
            //     }
            //   }
            //   return params.data.eventContent;
            // },
          },
          {
            field: 'leve',
            headerName: 'communicateLog.table.leve',
            filter: false,
            floatingFilter: false,
            index: 6,
            cellRendererSelector: () => ({
              component: 'StatusBtn',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'content',
            headerName: 'communicateLog.table.content',
            filter: false,
            floatingFilter: false,
            index: 7,
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
      },
      request: {
        url: 'connlog/list',
        params: {},
      },
      moreInfo: {},
    };
  },
  components: {
    AsyncGrid,
    DateTimeRangePicker,
    ActionBtn,
    StatusBtn,
    TypeBtn,
  },
  mounted() {
    this.gridApi = this.$refs.communicateLogGrid.gridApi;
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('helper', ['pagePortalMode']),
    ...mapState('communicateLog', ['eventContentTypeList']),
    moduleName() {
      return this.$route.name;
    },
  },
  methods: {
    ...mapMutations('helper', ['setPageHeader', 'setAppHeaderHeight', 'setAlert']),
    refresh() {
      const fromDate = new Date().setHours(0, 0, 0, 0);
      const toDate = new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000;
      this.dateFilter = [fromDate, toDate];
      Object.assign(this.request.params, {
        fromDate: this.$getFormatDate(fromDate, 'YYYY-MM-DD HH:mm:ss'),
        toDate: this.$getFormatDate(toDate, 'YYYY-MM-DD HH:mm:ss'),
      });
      this.getLogList();
    },
    // 重置选择
    resetSelect() {
      if (this.gridApi) {
        this.gridApi.deselectAll();
      }
    },
    filterRecord([fromDate, toDate]) {
      fromDate = this.$getFormatDate(fromDate, 'YYYY-MM-DD HH:mm:ss');
      toDate = this.$getFormatDate(toDate, 'YYYY-MM-DD HH:mm:ss');
      console.log(fromDate, toDate);
      Object.assign(this.request.params, { fromDate, toDate });
      this.getLogList();
    },
    getLogList() {
      if (this.$refs.communicateLogGrid) {
        this.$refs.communicateLogGrid.init();
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successFetchData',
        });
      }
    },
  },
};
</script>
