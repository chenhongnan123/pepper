<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.maintenancePlan">
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
            <tab-layout
              :items="[
                {tabName: $t('maintenancePlan.tab.byTime')},
                {tabName: $t('maintenancePlan.tab.byStatus')},
              ]"
              :tab="tab"
              @changeTab="handleChangeTab"
            />
            <v-spacer></v-spacer>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="error"
              @click="handleDelete"
              :disabled="!((tab === 0 && tbmSelectedTableList.length !== 0)
                || (tab === 1 && cbmSelectedTableList.length !== 0))"
              v-if="isBtnAccess('basic:maintenance_plan:remove')"
            >
              <v-icon left small>mdi-delete</v-icon>
              {{ $t('btn.delete') }}
            </v-btn>
            <v-btn
              small
              class="text-none"
              color="primary"
              @click="addDialog = true"
              v-if="isBtnAccess('basic:maintenance_plan:add')"
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
          <v-tabs-items v-model="tab">
            <v-tab-item class="pa-4">
              <base-grid
                ref="tbmGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="tbmOptions"
                v-model="tbmSelectedTableList"
                key="tbmGrid"
              />
            </v-tab-item>
            <v-tab-item class="pa-4">
              <base-grid
                ref="cbmGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="cbmOptions"
                v-model="cbmSelectedTableList"
                key="cbmGrid"
              />
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
import AddDialog from '../components/AddDialog.vue';
import TextTooltip from '../components/TextTooltip.vue';
import MaintenanceMenu from '../components/MaintenanceMenu.vue';
import BomMenu from '../components/BomMenu.vue';
import ActiveMenu from '../components/ActiveMenu.vue';

export default {
  name: 'maintenancePlan',
  components: {
    TabLayout,
    BaseGrid,
    AddDialog,
    TextTooltip,
    MaintenanceMenu,
    BomMenu,
    ActiveMenu,
  },
  data() {
    return {
      elementName: 'maintenancePlan',
      tableHeight: document.body.clientHeight - 210,
      tab: 0,
      planGridApi: null,
      tbmOptions: {
        headers: [
          {
            field: 'no',
            headerName: 'maintenancePlan.table.no',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            filter: false,
          },
          // {
          //   field: 'maintenanceObjectName',
          //   headerName: 'maintenancePlan.table.maintenanceTarget',
          //   filter: 'agTextColumnFilter',
          //   cellRendererSelector: () => ({
          //     component: 'BomMenu',
          //     params: {
          //       that: this,
          //     },
          //   }),
          // },
          {
            field: 'planCode',
            headerName: 'maintenancePlan.table.number',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'planName',
            headerName: 'maintenancePlan.table.name',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'TextTooltip',
              params: {
                that: this,
                field: 'planName',
              },
            }),
          },
          {
            field: 'schemaName',
            headerName: 'maintenancePlan.table.maintenance',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'MaintenanceMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'estimatedWork',
            headerName: 'maintenancePlan.table.estimatedTime',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'scheduleName',
            headerName: 'maintenancePlan.table.cycle',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'status',
            headerName: 'maintenancePlan.table.active',
            cellRendererSelector: () => ({
              component: 'ActiveMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'updateBy',
            headerName: 'maintenancePlan.table.modifyBy',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'updateTime',
            headerName: 'maintenancePlan.table.modifyTime',
            filter: 'agTextColumnFilter',
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
      },
      cbmOptions: {
        headers: [
          {
            field: 'no',
            headerName: 'No.',
            checkboxSelection: true,
            headerCheckboxSelection: true,
          },
          // {
          //   field: 'maintenanceObjectName',
          //   headerName: 'maintenancePlan.table.maintenanceTarget',
          //   filter: 'agTextColumnFilter',
          //   cellRendererSelector: () => ({
          //     component: 'BomMenu',
          //     params: {
          //       that: this,
          //     },
          //   }),
          // },
          {
            field: 'planCode',
            headerName: 'maintenancePlan.table.number',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'planName',
            headerName: 'maintenancePlan.table.name',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'TextTooltip',
              params: {
                that: this,
                field: 'planName',
              },
            }),
          },
          {
            field: 'schemaName',
            headerName: 'maintenancePlan.table.maintenance',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'MaintenanceMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'triggerConditionName',
            headerName: 'maintenancePlan.table.trigger',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'triggerCount',
            headerName: 'maintenancePlan.table.triggerNum',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'estimatedWork',
            headerName: 'maintenancePlan.table.estimatedTime',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'status',
            headerName: 'maintenancePlan.table.active',
            cellRendererSelector: () => ({
              component: 'ActiveMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'updateBy',
            headerName: 'maintenancePlan.table.modifyBy',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'updateTime',
            headerName: 'maintenancePlan.table.modifyTime',
            filter: 'agTextColumnFilter',
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
      },
      tbmSelectedTableList: [],
      cbmSelectedTableList: [],
      addDialog: false,
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('maintenancePlan', [
      'tbmPlanList',
      'cbmPlanList',
      'maintenanceSchemaList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
    triggerConditionList() {
      return [
        {
          text: this.$t('maintenancePlan.label.count'),
          value: '0',
        },
        {
          text: this.$t('maintenancePlan.label.timing'),
          value: '1',
        },
      ];
    },
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  created() {
  },
  mounted() {
    this.init();
  },
  deactivated() {
    this.setPageHeader(false);
    // this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapActions('maintenancePlan', [
      'getTbmPlanList',
      'getCbmPlanList',
      'getMaintenanceSchemaList',
      'deleteMaintenancePlan',
    ]),
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    async refresh() {
      await this.getMaintenanceSchema();
      this.resetSelect();
      await this.init();
    },
    // 查询维保方案列表，用作表格中维保方案名称展示
    async getMaintenanceSchema() {
      await this.getMaintenanceSchemaList();
    },
    async init() {
      await this.getMaintenanceSchema();
      await this.getTbmPlanList(true);
      if (this.tbmPlanList?.length) {
        this.tbmOptions.rowData = this.tbmPlanList.map((item) => {
          const obj = {
            ...item,
            // 维保方案名称
            schemaName: this.maintenanceSchemaList?.find((schema) =>
              schema.id === item.schemaId)?.schemaName || '',
          };
          return obj;
        });
      } else {
        this.tbmOptions.rowData = [];
      }
      // 获取维保方案列表
      await this.getCbmPlanList(true);
      if (this.cbmPlanList?.length) {
        this.cbmOptions.rowData = this.cbmPlanList.map((item) => {
          const obj = {
            ...item,
            // 维保方案名称
            schemaName: this.maintenanceSchemaList?.find((schema) =>
              schema.id === item.schemaId)?.schemaName || '',
            triggerConditionName: this.triggerConditionList?.find((con) =>
              con.value === item.triggerCondition)?.text || '',
          };
          return obj;
        });
      } else {
        this.cbmOptions.rowData = [];
      }
    },
    resetSelect() {
      if (this.tab) {
        this.$refs.cbmGrid.gridApi.deselectAll();
      } else {
        this.$refs.tbmGrid.gridApi.deselectAll();
      }
      this.tbmSelectedTableList = [];
      this.cbmSelectedTableList = [];
    },
    async handleDelete() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        const idList = [];
        if (this.tab) {
          this.cbmSelectedTableList.forEach((item) => {
            idList.push(item.id);
          });
        } else {
          this.tbmSelectedTableList.forEach((item) => {
            idList.push(item.id);
          });
        }
        const ids = idList.join(',');
        const result = await this.deleteMaintenancePlan(ids);
        if (result) {
          this.refresh();
        }
      }
    },
    handleChangeTab(tab) {
      this.tab = tab;
    },
  },
};
</script>
