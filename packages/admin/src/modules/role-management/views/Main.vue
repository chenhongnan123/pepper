<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.roleManagement">
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
              small
              outlined
              class="text-none mr-2"
              color="error"
              @click="handleDelete"
              :disabled="selectedTableList.length === 0"
              v-if="isBtnAccess('system:role:remove')"
            >
              <v-icon left small>mdi-delete</v-icon>
              {{ $t('btn.delete') }}
            </v-btn>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="success"
              @click="isNew = false;addDialog = true"
              :disabled="selectedTableList.length !== 1"
              v-if="isBtnAccess('system:role:edit')"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('btn.edit') }}
            </v-btn>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="warning"
              @click="excelExport"
              v-if="isBtnAccess('system:role:export')"
            >
              <v-icon left small>mdi-download</v-icon>
              {{ $t('btn.export') }}
            </v-btn>
            <v-btn
              small
              class="text-none"
              color="primary"
              @click="isNew = true;addDialog = true"
              v-if="isBtnAccess('system:role:add')"
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
                ref="roleManagementGrid"
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
      :isNew="isNew"
      :selectedTableList="selectedTableList"
      @closeDialog="addDialog = false"
      @getTableList="refresh"
      :systemNameList="systemNameList"
    />
  </v-container>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import AddDialog from '../components/AddDialog.vue';
import ActiveMenu from '../components/ActiveMenu.vue';
import ActionMenu from '../components/ActionMenu.vue';

export default {
  name: 'roleManagement',
  components: {
    BaseGrid,
    AddDialog,
    ActiveMenu,
    ActionMenu,
  },
  data() {
    return {
      elementName: 'roleManagement',
      tableHeight: document.body.clientHeight - 210,
      roleManagementGridApi: null,
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'roleManagement.table.no',
            filter: 'agTextColumnFilter',
            checkboxSelection: true,
            headerCheckboxSelection: true,
          },
          {
            field: 'roleName',
            headerName: 'roleManagement.table.name',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'roleSort',
            headerName: 'roleManagement.table.sort',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'remark',
            headerName: 'roleManagement.table.remark',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'status',
            headerName: 'roleManagement.table.status',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'ActiveMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'createBy',
            headerName: 'roleManagement.table.createBy',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'createTime',
            headerName: 'roleManagement.table.createTime',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'action',
            headerName: 'roleManagement.table.action',
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
      },
      selectedTableList: [],
      addDialog: false,
      isNew: true,
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
      'systemConfigList',
    ]),
    ...mapState('roleManagement', [
      'roleList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
    systemNameList() {
      // 终端的值在系统参数中设置，取'sys.index.systemname01','sys.index.systemname02'
      return this.systemConfigList.filter((ele) => ['sys.index.systemname01', 'sys.index.systemname02'].indexOf(ele.configKey) > -1);
    },
  },
  activated() {
    this.roleManagementGridApi = this.$refs.roleManagementGrid.gridApi;
  },
  created() {
    this.getTableList();
  },
  deactivated() {
  },
  methods: {
    ...mapActions('roleManagement', [
      'getRoleList',
      'deleteRole',
      'excelExport',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    ...mapActions('helper', ['getSystemConfigList']),
    refresh() {
      this.getTableList();
      this.resetSelect();
    },
    async getTableList() {
      await this.getSystemConfigList();
      await this.getRoleList(true);
      this.options.rowData = this.roleList;
    },
    resetSelect() {
      if (this.roleManagementGridApi) {
        this.roleManagementGridApi.deselectAll();
      }
    },
    async handleDelete() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        let roleIds = '';
        this.selectedTableList.forEach((item) => {
          roleIds += roleIds ? `,${item.roleId}` : item.roleId;
        });
        const result = await this.deleteRole(roleIds);
        if (result) {
          this.refresh();
        }
      }
    },
  },
};
</script>
