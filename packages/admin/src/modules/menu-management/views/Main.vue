<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.menuManagement">
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
            <v-spacer></v-spacer>
            <v-btn
              outlined
              small
              class="text-none mr-2"
              color="primary"
              @click="handleExpand"
            >
              <v-icon left small>mdi-swap-vertical</v-icon>
              {{ $t('btn.extendOrFold') }}
            </v-btn>
            <v-btn
              small
              class="text-none"
              color="primary"
              @click="addDialog = true"
              v-if="isBtnAccess('system:menu:add')"
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
              <base-grid
                ref="menuManagementGrid"
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
      :isNew="true"
      :parentId="0"
      menuType="B"
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
import AddDialog from '../components/AddDialog.vue';
import ActionMenu from '../components/ActionMenu.vue';
import MenuIcon from '../components/MenuIcon.vue';
import StatusMenu from '../components/StatusMenu.vue';

export default {
  name: 'menuManagement',
  components: {
    BaseGrid,
    AddDialog,
    ActionMenu,
    MenuIcon,
    StatusMenu,
  },
  data() {
    return {
      elementName: 'menuManagement',
      tableHeight: document.body.clientHeight - 210,
      options: {
        headers: [
          {
            field: 'icon',
            headerName: 'menuManagement.table.icon',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'MenuIcon',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'orderNum',
            headerName: 'menuManagement.table.sort',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'component',
            headerName: 'menuManagement.table.component',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'menuType',
            headerName: 'menuManagement.table.type',
            filter: 'agTextColumnFilter',
            valueGetter: (params) => {
              const { menuType } = params.data;
              if (menuType) {
                const type = this.menuTypeList.find((m) => m.value === menuType);
                if (type) {
                  return this.$t(`menuManagement.label.${type.text}`);
                }
                return menuType;
              }
              return '-';
            },
          },
          {
            field: 'visible',
            headerName: 'menuManagement.table.visible',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'StatusMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'perms',
            headerName: 'menuManagement.table.permission',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'action',
            headerName: 'menuManagement.table.action',
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
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        pagination: false,
        autoGroupColumnDef: {
          headerName: 'menuManagement.table.name',
          filter: 'agTextColumnFilter',
          cellRendererParams: {
            suppressCount: true,
          },
          valueGetter: (params) => {
            if (params.data) {
              if (this.iszh) {
                return params.data.menuName || '-';
              }
              return params.data.menuNameEn || '-';
            }
            return '-';
          },
        },
        treeData: true,
        getDataPath: (data) => data.menuIdInTree,
      },
      selectedTableList: [],
      addDialog: false,
      expand: true,
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('menuManagement', [
      'menuList',
      'menuTypeList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
    iszh() {
      return this.$i18n.locale === 'zhHans';
    },
  },
  activated() {
  },
  created() {
    this.getTableList();
  },
  deactivated() {
  },
  methods: {
    ...mapActions('menuManagement', [
      'getMenuList',
      'getVisibleList',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh(type) {
      this.getTableList(type);
      this.expand = true;
    },
    deleteRefresh(selectedNodes) {
      this.$refs.menuManagementGrid.gridApi.applyTransaction({ remove: [selectedNodes] });
    },
    async getTableList(type) {
      await this.getVisibleList();
      await this.getMenuList(true);
      if (type) {
        this.$refs.menuManagementGrid.gridApi.applyTransaction({ update: [...this.menuList] });
      } else {
        this.options.rowData = this.menuList;
      }
    },
    handleExpand() {
      if (this.expand) {
        this.$refs.menuManagementGrid.gridApi.collapseAll();
      } else {
        this.$refs.menuManagementGrid.gridApi.expandAll();
      }
      this.expand = !this.expand;
    },
  },
};
</script>
