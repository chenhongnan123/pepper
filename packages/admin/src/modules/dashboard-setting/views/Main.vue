<template>
  <v-container fluid>
    <portal
      to="app-header"
      v-if="pagePortalMode.dashboardSetting"
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
    <portal to="page-header">
    </portal>
    <v-row no-gutters>
      <v-col>
        <v-card
          :height="tableHeight"
          class=""
          elevation="0"
          color="bg"
        >
          <div class="pa-4">
            <base-grid
              ref="dashboardSettingGrid"
              :elementName="elementName"
              :restoreColumn="true"
              :options="options"
              @updateRowOrder="updateRowOrder"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import TextBtn from '../components/TextBtn.vue';
import ActiveMenu from '../components/ActiveMenu.vue';
import ActionMenu from '../components/ActionMenu.vue';

export default {
  name: 'dashboardSetting',
  components: {
    BaseGrid,
    TextBtn,
    ActiveMenu,
    ActionMenu,
  },
  data() {
    return {
      elementName: 'dashboardSetting',
      clientHeight: document.body.clientHeight,
      tableHeight: document.body.clientHeight - 121,
      dashboardSettingGridApi: null,
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'dashboardSetting.table.no',
            index: 0,
            filter: false,
            floatingFilter: false,
            rowDrag: true,
          },
          {
            field: 'boardNumber',
            headerName: 'dashboardSetting.table.boardCode',
            filter: 'agTextColumnFilter',
            index: 1,
            cellRendererSelector: () => ({
              component: 'TextBtn',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'boardName',
            headerName: 'dashboardSetting.table.name',
            filter: 'agTextColumnFilter',
            index: 2,
          },
          {
            field: 'boardSort',
            headerName: 'dashboardSetting.table.sort',
            filter: 'agTextColumnFilter',
            index: 3,
          },
          {
            field: 'active',
            headerName: 'dashboardSetting.table.isBoard',
            index: 4,
            cellRendererSelector: () => ({
              component: 'ActiveMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'action',
            headerName: 'dashboardSetting.table.action',
            index: 5,
            cellRendererSelector: () => ({
              component: 'ActionMenu',
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
        height: document.body.clientHeight - 151,
        rowHeight: 35,
        pagination: false, // 不分页
      },
      addDialog: false,
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('dashboardSetting', [
      'dashboardSettingList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  mounted() {
    this.dashboardSettingGridApi = this.$refs.dashboardSettingGrid.gridApi;
    this.getTableList();
  },
  deactivated() {
    this.setPageHeader(false);
    // this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapActions('dashboardSetting', [
      'getDashboardSettingList',
      'updateBoardOrder',
    ]),
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    refresh() {
      this.resetSelect();
      this.getTableList();
    },
    resetSelect() {
      if (this.dashboardSettingGridApi) {
        this.dashboardSettingGridApi.deselectAll();
      }
    },
    async getTableList() {
      await this.getDashboardSettingList(true);
      this.options.rowData = this.dashboardSettingList;
    },
    // 拖拽更新顺序
    async updateRowOrder(rowData) {
      if (!this.isBtnAccess('basic:board:edit')) {
        this.refresh();
        return;
      }
      const payload = rowData.map((data, index) => {
        const obj = {
          id: data.id,
          boardNumber: data.boardNumber,
          boardSort: String(index + 1), // 按照排序更新顺序字段
        };
        return obj;
      });
      const result = await this.updateBoardOrder(payload);
      if (result) {
        this.refresh();
      }
    },
  },
};
</script>
