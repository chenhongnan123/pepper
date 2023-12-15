<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.errorRepair">
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
    <portal to="page-header">
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
            <div class="d-flex mr-2">
              <span class="mr-2 mt-1 text-subtitle-1">
                {{`${$t('errorRepair.table.createTime')}:`}}
              </span>
              <DateTimeRangePicker
                v-model="dateFilter"
                @input="filterRecord"
              />
            </div>
            <div style="width:200px">
              <v-autocomplete
                :label="`${$t('errorRepair.label.status')}*`"
                v-model="statusFilter"
                :items="statusOptions"
                item-text="text"
                item-value="value"
                hide-details
                outlined
                dense
                @change="filterRecord"
              >
              </v-autocomplete>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              small
              class="text-none"
              color="primary"
              @click="addDialog = true"
              v-if="isBtnAccess('basic:fault_repair:add')"
            >
              <v-icon left small>mdi-plus</v-icon>
              {{ $t('btn.add') }}
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
              <!-- <async-grid
                ref="errorRepairGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="options"
                :method="'basicGet'"
                :url="request.url"
                :parameters="request?.parameters"
              /> -->
              <base-grid
                ref="errorRepairGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="options"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <add-dialog
      :addDialog="addDialog"
      :isNew="true"
      @closeDialog="addDialog = false"
      @getTableList="refresh"
    />
  </v-container>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
// import AsyncGrid from '@/components/aggrid/AsyncGrid.vue';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import DateTimeRangePicker from '@/components/commonUI/DateTimeRangePicker.vue';
import AddDialog from '../components/AddDialog.vue';
import StatusMenu from '../components/StatusMenu.vue';
import TextTooltip from '../components/TextTooltip.vue';
import BomMenu from '../components/BomMenu.vue';
import ActionMenu from '../components/ActionMenu.vue';

export default {
  name: 'errorRepair',
  components: {
    // AsyncGrid,
    BaseGrid,
    DateTimeRangePicker,
    AddDialog,
    StatusMenu,
    TextTooltip,
    BomMenu,
    ActionMenu,
  },
  data() {
    return {
      elementName: 'errorRepair',
      tab: 0,
      tableHeight: document.body.clientHeight - 210,
      statusFilter: '-1',
      dateFilter: [],
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'errorRepair.table.no',
            index: 0,
          },
          {
            field: 'status',
            headerName: 'errorRepair.table.status',
            index: 1,
            cellRendererSelector: () => ({
              component: 'StatusMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'taskName',
            headerName: 'errorRepair.table.name',
            filter: 'agTextColumnFilter',
            index: 2,
          },
          {
            field: 'faultPhenomenon',
            headerName: 'errorRepair.table.description',
            filter: 'agTextColumnFilter',
            index: 3,
            cellRendererSelector: () => ({
              component: 'TextTooltip',
              params: {
                that: this,
                field: 'faultPhenomenon',
              },
            }),
          },
          {
            field: 'faultCode',
            headerName: 'errorRepair.table.defectCode',
            filter: 'agTextColumnFilter',
            index: 4,
            minWidth: 190,
            cellRendererSelector: () => ({
              component: 'TextTooltip',
              params: {
                that: this,
                field: 'faultCode',
              },
            }),
          },
          {
            field: 'faultLocationName',
            headerName: 'errorRepair.table.reportPosition',
            filter: 'agTextColumnFilter',
            index: 5,
            cellRendererSelector: () => ({
              component: 'BomMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'action',
            headerName: 'errorRepair.table.action',
            index: 6,
            cellRendererSelector: () => ({
              component: 'ActionMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'createBy',
            headerName: 'errorRepair.table.createByName',
            filter: 'agTextColumnFilter',
            index: 7,
          },
          {
            field: 'createTime',
            headerName: 'errorRepair.table.createTime',
            filter: 'agTextColumnFilter',
            index: 8,
            minWidth: 160,
          },
          {
            field: 'updateBy',
            headerName: 'errorRepair.table.processByName',
            filter: 'agTextColumnFilter',
            index: 9,
          },
          {
            field: 'updateTime',
            headerName: 'errorRepair.table.processTime',
            filter: 'agTextColumnFilter',
            index: 10,
            minWidth: 160,
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
      },
      addDialog: false,
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('errorRepair', [
      'errorRepairList',
      'statusList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
    statusOptions() {
      const defaultObj = {
        text: this.$t('errorRepair.label.all'),
        value: '-1',
      }; // 默认选项
      if (this.statusList?.length) {
        const list = this.statusList.map((item) => {
          const obj = {
            text: item.dictLabel,
            value: item.dictValue,
          };
          return obj;
        });
        return [
          defaultObj,
          ...list,
        ];
      }
      return [defaultObj];
    },
    // 写入计算属性，方便更改查询条件
    request() {
      const { statusFilter } = this;
      if (statusFilter !== '-1') {
        return {
          url: 'fault_repair/list',
          parameters: {
            status: statusFilter,
          },
        };
      }
      return {
        url: 'fault_repair/list',
      };
    },
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  mounted() {
    this.init();
  },
  deactivated() {
    this.setPageHeader(false);
    // this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapActions('errorRepair', [
      'getErrorRepairList',
      'getStatusList',
    ]),
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    refresh() {
      this.statusFilter = '-1';
      this.initDate();
      this.filterRecord();
    },
    async init() {
      await this.getStatusList();
      this.statusFilter = '-1';
      this.initDate();
      await this.filterRecord();
    },
    // 初始化时间
    initDate() {
      const beginTime = new Date().setHours(0, 0, 0, 0);
      const endTime = new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000;
      const initDateRange = [beginTime, endTime];
      this.dateFilter = initDateRange;
    },
    // getTableList() {
    //   if (this.$refs.errorRepairGrid) {
    //     this.$refs.errorRepairGrid.init();
    //     this.setAlert({
    //       show: true,
    //       type: 'success',
    //       message: 'successAction',
    //     });
    //   }
    // },
    async filterRecord() {
      const { statusFilter } = this;
      let { dateFilter } = this;
      if (dateFilter.length < 2) {
        return;
      }
      const [startime, endtime] = dateFilter;
      // 时间格式转换
      dateFilter = [
        this.$getFormatDate(startime, 'yyyy-MM-DD HH:mm:ss'),
        this.$getFormatDate(endtime, 'yyyy-MM-DD HH:mm:ss'),
      ];
      await this.getErrorRepairList({
        dateFilter,
        statusFilter,
        needAlert: true,
      });
      this.options.rowData = this.errorRepairList;
    },
  },
};
</script>
