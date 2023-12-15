<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.departmentManagement">
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
              v-if="isBtnAccess('system:dept:add')"
              :disabled="!!departmentList.length"
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
                ref="departmentManagementGrid"
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
      type="0"
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
import ActiveMenu from '../components/ActiveMenu.vue';

export default {
  name: 'departmentManagement',
  components: {
    BaseGrid,
    AddDialog,
    ActionMenu,
    ActiveMenu,
  },
  data() {
    return {
      elementName: 'departmentManagement',
      tableHeight: document.body.clientHeight - 210,
      options: {
        headers: [
          {
            field: 'deptName',
            headerName: 'departmentManagement.table.name',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'orderNum',
            headerName: 'departmentManagement.table.sort',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'type',
            headerName: 'departmentManagement.table.type',
            filter: 'agTextColumnFilter',
            valueFormatter: (params) => {
              if (params.value) {
                const type = this.deptTypeList.find((m) => m.value === params.value);
                if (type) {
                  return this.$t(`departmentManagement.label.${type.text}`);
                }
                return params.value;
              }
              return '-';
            },
          },
          {
            field: 'leader',
            headerName: 'departmentManagement.table.leader',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'status',
            headerName: 'departmentManagement.table.status',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'ActiveMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'action',
            headerName: 'departmentManagement.table.action',
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
          headerName: 'departmentManagement.table.number',
          filter: 'agTextColumnFilter',
          cellRendererParams: {
            suppressCount: true,
          },
          valueFormatter: (params) => {
            if (params.data) {
              return params.data.deptCode;
            }
            return '-';
          },
        },
        treeData: true,
        getDataPath: (data) => data.deptIdInTree,
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
    ...mapState('departmentManagement', [
      'departmentList',
      'deptTypeList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
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
    ...mapActions('departmentManagement', [
      'getDepartmentList',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh() {
      this.getTableList();
      this.expand = true;
    },
    async getTableList() {
      await this.getDepartmentList(true);
      this.options.rowData = this.departmentList;
    },
    handleExpand() {
      if (this.expand) {
        this.$refs.departmentManagementGrid.gridApi.collapseAll();
      } else {
        this.$refs.departmentManagementGrid.gridApi.expandAll();
      }
      this.expand = !this.expand;
    },
  },
};
</script>
