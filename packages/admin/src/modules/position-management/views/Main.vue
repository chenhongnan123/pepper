<template>
  <v-container
    fluid
    class="darkNoBgColor"
  >
    <portal
      to="app-header"
      v-if="pagePortalMode.positionManagement"
    >
      {{ $t(`modules.${moduleName}`) }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="init"
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
              v-if="isBtnAccess('system:post:remove')"
              small
              outlined
              class="text-none mr-2"
              color="error"
              @click="handleDelete"
              :disabled="selectedTableList.length === 0"
            >
              <v-icon left small>mdi-delete</v-icon>
              {{ $t('btn.delete') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('system:post:edit')"
              small
              outlined
              class="text-none mr-2"
              color="success"
              :disabled="selectedTableList.length === 0 || selectedTableList.length > 1"
              @click="editDialog = true"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('btn.edit') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('system:post:export')"
              small
              outlined
              class="text-none mr-2"
              color="warning"
              @click="handleExport"
            >
              <v-icon left small>mdi-download</v-icon>
              {{ $t('btn.export') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('system:post:add')"
              small
              class="text-none"
              color="primary"
              @click="addDialog = true"
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
                ref="positionManagementGrid"
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
      @closeDialog="addDialog = false"
      @getTableList="init"
      :rules="rules"
    />
    <edit-dialog
      :editDialog="editDialog"
      @closeDialog="editDialog = false"
      @getTableList="init"
      :selectedTableList="selectedTableList"
      :rules="rules"
    />
  </v-container>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';
import moment from 'moment';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import AssignSwitch from '../components/AssignSwitch.vue';
import ActionMenu from '../components/ActionMenu.vue';
import AddDialog from '../components/AddPositionDialog.vue';
import EditDialog from '../components/EditPositionDialog.vue';

export default {
  name: 'positionManagement',
  data() {
    return {
      moment,
      elementName: 'positionList',
      clientHeight: document.body.clientHeight,
      tableHeight: document.body.clientHeight - 210,
      selectedTableList: [],
      gridApi: null,
      options: {
        headers: [
          {
            field: 'no',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            maxWidth: 100,
            headerName: 'positionManagement.table.number',
            valueGetter: 'node.rowIndex + 1',
            filter: 'agTextColumnFilter',
            index: 1,
          },
          {
            field: 'postCode',
            headerName: 'positionManagement.table.positionNumber',
            filter: 'agTextColumnFilter',
            index: 2,
          },
          {
            field: 'postName',
            headerName: 'positionManagement.table.positionName',
            filter: 'agTextColumnFilter',
            index: 3,
          },
          {
            field: 'postSort',
            headerName: 'positionManagement.table.sortNum',
            filter: 'agTextColumnFilter',
            index: 4,
          },
          {
            field: 'status',
            headerName: 'positionManagement.table.status',
            cellRendererSelector: () => ({
              component: 'AssignSwitch',
              params: {
                currowinfo: this,
                field: 'status',
                init: this.init,
              },
            }),
            filter: 'agTextColumnFilter',
            index: 5,
          },
          {
            field: 'createBy',
            headerName: 'positionManagement.table.createdBy',
            index: 6,
            filter: 'agTextColumnFilter',
          },
          {
            field: 'createTime',
            headerName: 'positionManagement.table.creationTime',
            index: 7,
            filter: 'agTextColumnFilter',
          },
          // {
          //   field: 'action',
          //   headerName: 'positionManagement.table.action',
          //   index: 8,
          //   cellRendererSelector: () => ({
          //     component: 'ActionMenu',
          //     params: {
          //       that: this,
          //     },
          //   }),
          // },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
      },
      addDialog: false,
      editDialog: false,
    };
  },
  components: {
    BaseGrid,
    AssignSwitch,
    ActionMenu,
    AddDialog,
    EditDialog,
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  created() {
    this.init();
  },
  mounted() {
    this.gridApi = this.$refs.positionManagementGrid.gridApi;
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    ...mapActions('positionManagement', [
      'getPositionList',
      'delPosition',
      'excelExport',
    ]),
    async init() {
      const result = await this.getPositionList();
      if (result) {
        setTimeout(() => {
          this.options.rowData = this.positionList;
        }, 400);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
      }
      this.resetSelect();
    },
    // 重置选择
    resetSelect() {
      if (this.gridApi) {
        this.gridApi.deselectAll();
      }
    },
    async handleDelete() {
      if (
        await this.$root.$confirm.open(
          this.$t('dialog.deleterecord'),
          this.$t('dialog.deleterecordconfirm'),
        )
      ) {
        const idArr = this.selectedTableList.map((item) => item.postId);
        const ids = idArr.join(',');
        const result = await this.delPosition(ids);
        if (result) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'successAction',
          });
          this.init();
        }
      }
    },
    // 导出岗位数据
    async handleExport() {
      await this.excelExport();
    },
  },
  computed: {
    ...mapState('positionManagement', ['positionList']),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('helper', ['pagePortalMode']),
    moduleName() {
      return this.$route.name;
    },
    rules() {
      return this.$getPositionRules();
    },
  },
};
</script>
