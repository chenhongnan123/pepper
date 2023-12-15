<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.maintenanceTask">
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
          <div class="d-flex align-center px-4" style="height:100%">
            <div class="d-flex mb-2">
              <span class="mr-1 primary--text text-subtitle-1">
                {{`${$t('maintenanceTask.table.scheduledStartDate')}:`}}
              </span>
              <DateTimeRangePicker
                v-model="dateFilter"
                dense
              />
            </div>
            <v-spacer></v-spacer>
            <v-btn
              small
              class="text-none mr-2"
              color="success"
              @click="handleBatchComplete"
              :disabled="selectedIncompleteTaskList.length === 0"
              v-if="isBtnAccess('basic:maintenance_task:batch_edit_status')"
            >
              {{ $t('maintenanceTask.btn.completeTask') }}
            </v-btn>
            <v-btn
              small
              class="text-none"
              color="primary"
              @click="addDialog = true"
              v-if="isBtnAccess('basic:maintenance_task:add')"
            >
              <v-icon left small>mdi-plus</v-icon>
              {{ $t('maintenanceTask.btn.addTempTask') }}
            </v-btn>
          </div>
        </v-card>
        <v-card
          :height="tableHeight"
          class="pa-4"
          elevation="0"
          color="bg"
        >
          <div class="d-flex">
            <tab-layout
              :items="[
                {tabName: $t('maintenanceTask.tab.maintenanceTask')},
                {tabName: $t('maintenanceTask.tab.repairTask')},
              ]"
              :tab="tab"
              @changeTab="handleChangeTab"
            />
            <v-spacer></v-spacer>
          </div>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-row no-gutters>
                <v-col>
                  <base-grid
                    ref="maintenanceTaskGrid"
                    :elementName="elementName"
                    :restoreColumn="true"
                    :options="mOptions"
                    v-model="selectedTableList"
                    key="maintenanceTaskGrid"
                  />
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
            <v-row no-gutters>
                <v-col>
                  <base-grid
                    ref="repairTaskGrid"
                    :elementName="elementName"
                    :restoreColumn="true"
                    :options="rOptions"
                    v-model="selectedTableList"
                    key="repairTaskGrid"
                  />
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
    <add-dialog
      :addDialog="addDialog"
      @closeDialog="addDialog = false"
      @getTableList="refresh"
    />
  </v-container>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import TabLayout from '@/components/commonUI/TabLayout.vue';
import DateTimeRangePicker from '@/components/commonUI/DateTimeRangePicker.vue';
import AddDialog from '../components/main/AddDialog.vue';
import DetailMenu from '../components/main/DetailMenu.vue';
import StatusMenu from '../components/main/StatusMenu.vue';

export default {
  name: 'maintenanceTask',
  components: {
    TabLayout,
    BaseGrid,
    AddDialog,
    DateTimeRangePicker,
    DetailMenu,
    StatusMenu,
  },
  data() {
    return {
      elementName: 'maintenanceTask',
      tableHeight: document.body.clientHeight - 210,
      tab: 0,
      dateFilter: [],
      planGridApi: null,
      mOptions: {
        headers: [
          {
            field: 'no',
            headerName: 'No.',
            filter: 'agTextColumnFilter',
            index: 0,
            checkboxSelection: (params) =>
              params.data.status !== '1' && params.data.status !== '4',
            headerCheckboxSelection: true,
            // eslint-disable-next-line
            valueGetter: (params) => params.node?.rowIndex + 1,
          },
          {
            field: 'status',
            headerName: 'maintenanceTask.table.status',
            index: 1,
            cellRendererSelector: () => ({
              component: 'StatusMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'taskNo',
            headerName: 'maintenanceTask.table.number',
            filter: 'agTextColumnFilter',
            index: 2,
            cellRendererSelector: () => ({
              component: 'DetailMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'taskName',
            headerName: 'maintenanceTask.table.name',
            filter: 'agTextColumnFilter',
            index: 3,
          },
          // {
          //   field: 'maintenanceLocationName',
          //   headerName: 'maintenanceTask.table.target',
          //   filter: 'agTextColumnFilter',
          //   index: 4,
          // },
          {
            field: 'taskType',
            headerName: 'maintenanceTask.table.type',
            filter: 'agTextColumnFilter',
            index: 5,
            valueGetter: (params) => {
              if (params.data.taskType) {
                const type = this.typeList.find((m) => m.value === params.data.taskType);
                if (type) {
                  return this.$t(`maintenanceTask.label.typeList.${type.text}`);
                }
                return params.data.taskType;
              }
              return '-';
            },
          },
          {
            field: 'createTime',
            headerName: 'maintenanceTask.table.taskCreationDate',
            filter: 'agTextColumnFilter',
            index: 6,
          },
          {
            field: 'planStartTime',
            headerName: 'maintenanceTask.table.scheduledStartDate',
            filter: 'agTextColumnFilter',
            index: 7,
          },
          {
            field: 'planEndTime',
            headerName: 'maintenanceTask.table.scheduledCompletionDate',
            filter: 'agTextColumnFilter',
            index: 8,
          },
          {
            field: 'updateBy',
            headerName: 'maintenanceTask.table.taskProcessOwner',
            filter: 'agTextColumnFilter',
            index: 9,
            valueGetter: (params) => {
              if (params.data.status === '0') {
                return '-';
              }
              return params.data.updateBy;
            },
          },
          {
            field: 'updateTime',
            headerName: 'maintenanceTask.table.taskProcessDate',
            filter: 'agTextColumnFilter',
            index: 10,
            valueGetter: (params) => {
              if (params.data.status === '0') {
                return '-';
              }
              return params.data.updateTime;
            },
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240 - 36,
        rowHeight: 35,
      },
      rOptions: {
        headers: [
          {
            field: 'no',
            headerName: 'No.',
            filter: 'agTextColumnFilter',
            index: 0,
            checkboxSelection: (params) =>
              params.data.status !== '1' && params.data.status !== '4',
            headerCheckboxSelection: true,
            // eslint-disable-next-line
            valueGetter: (params) => params.node?.rowIndex + 1,
          },
          {
            field: 'status',
            headerName: 'maintenanceTask.table.status',
            index: 1,
            cellRendererSelector: () => ({
              component: 'StatusMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'taskNo',
            headerName: 'maintenanceTask.table.number',
            filter: 'agTextColumnFilter',
            index: 2,
            cellRendererSelector: () => ({
              component: 'DetailMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'taskName',
            headerName: 'maintenanceTask.table.name',
            filter: 'agTextColumnFilter',
            index: 3,
          },
          {
            field: 'maintenanceLocationName',
            headerName: 'maintenanceTask.table.target',
            filter: 'agTextColumnFilter',
            index: 4,
          },
          {
            field: 'faultCode',
            headerName: 'maintenanceTask.table.errorCode',
            filter: 'agTextColumnFilter',
            index: 5,
          },
          {
            field: 'createTime',
            headerName: 'maintenanceTask.table.taskCreationDate',
            filter: 'agTextColumnFilter',
            index: 6,
          },
          {
            field: 'planStartTime',
            headerName: 'maintenanceTask.table.scheduledStartDate',
            filter: 'agTextColumnFilter',
            index: 7,
          },
          {
            field: 'planEndTime',
            headerName: 'maintenanceTask.table.scheduledCompletionDate',
            filter: 'agTextColumnFilter',
            index: 8,
          },
          {
            field: 'updateBy',
            headerName: 'maintenanceTask.table.taskProcessOwner',
            filter: 'agTextColumnFilter',
            index: 9,
            valueGetter: (params) => {
              if (params.data.status === '0') {
                return '-';
              }
              return params.data.updateBy;
            },
          },
          {
            field: 'updateTime',
            headerName: 'maintenanceTask.table.taskProcessDate',
            filter: 'agTextColumnFilter',
            index: 10,
            valueGetter: (params) => {
              if (params.data.status === '0') {
                return '-';
              }
              return params.data.updateTime;
            },
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240 - 36,
        rowHeight: 35,
      },
      selectedTableList: [],
      addDialog: false,
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('maintenanceTask', [
      'maintenanceTaskList',
      'repairTaskList',
      'typeList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
    selectedIncompleteTaskList() {
      return this.selectedTableList
        .filter((item) => item.status !== 1 && item.status !== 4);
    },
  },
  activated() {
    // if (this.dateFilter.length) {
    //   this.getTableList();
    // }
    this.getTableList();
  },
  created() {
    // this.refresh();
  },
  deactivated() {
  },
  methods: {
    ...mapActions('maintenanceTask', [
      'getTaskList',
      'updateTaskStatus',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh() {
      // const initDateRange = [
      //   new Date().setHours(0, 0, 0, 0),
      //   new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000,
      // ];
      if (this.dateFilter.length < 2) {
        // this.dateFilter = initDateRange;
      } else {
        this.getTableList();
      }
      this.resetSelect();
    },
    async getTableList() {
      this.filterRecord();
    },
    resetSelect() {
      if (this.tab) {
        if (this.$refs.repairTaskGrid) {
          this.$refs.repairTaskGrid.gridApi.deselectAll();
        }
      } else if (this.$refs.maintenanceTaskGrid) {
        this.$refs.maintenanceTaskGrid.gridApi.deselectAll();
      }
      this.selectedTableList = [];
      // if (this.planGridApi) {
      //   this.planGridApi.deselectAll();
      // }
    },
    async handleChangeTab(tab) {
      console.log('changetab');
      this.tab = tab;
      this.resetSelect();
      this.filterRecord();
    },
    async filterRecord() {
      const { dateFilter } = this;
      if (dateFilter.length < 2) {
        return;
      }
      await this.getTaskList({
        dateFilter,
        needAlert: true,
      });
      // console.log(dateFilter, 'dateFilter');
      if (!this.tab) {
        // console.log('保养');
        this.mOptions.rowData = this.maintenanceTaskList;
      } else {
        // console.log('维修');
        this.rOptions.rowData = this.repairTaskList;
      }
    },
    async handleBatchComplete() {
      const { selectedIncompleteTaskList } = this;
      if (!selectedIncompleteTaskList || !selectedIncompleteTaskList.length) { return; }
      const taskIds = selectedIncompleteTaskList.map((item) => item.id);
      const payload = {
        taskIds,
        status: '1',
      };
      const result = await this.updateTaskStatus(payload);
      if (result) {
        this.refresh();
      }
    },
  },
  watch: {
    dateFilter() {
      this.filterRecord();
    },
  },
};
</script>
