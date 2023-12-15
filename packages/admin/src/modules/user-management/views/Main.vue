<template>
  <v-container
    fluid
    class="darkNoBgColor"
  >
    <portal
      to="app-header"
      v-if="pagePortalMode.userManagement"
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
    <v-row dense class="ml-2">
      <v-col cols="2">
        <v-card
          :height="clientHeight - 120"
          elevation="0"
          color="bg"
          class="mr-1 px-4"
        >
          <div
            class="card-title pt-4"
          >
            {{$t('userManagement.label.organization')}}
          </div>
          <div class="d-flex mt-1">
            <v-text-field
              v-model="searchVal"
              append-icon="mdi-magnify"
              hide-details
              clearable
              :label="$t('userManagement.label.search')"
              @click:clear="getDeptTree"
            ></v-text-field>
          </div>
          <div
            style="width: 100%; overflow-x: auto;"
            class="mt-2"
          >
            <v-treeview
              v-if="openall"
              :open-all="openall"
              :style="`height: ${treeHeight}px;width: 350px;overflow-y: auto;cursor: pointer;`"
              dense
              item-key="id"
              item-text="label"
              :active.sync="activefloder"
              activatable
              return-object
              :search="searchVal"
              :items="deptTree"
              @update:active="handleActive"
            >
              <template v-slot:label="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        class="d-flex justify-space-between"
                      >
                        <span
                          v-bind="attrs"
                          v-on="on"
                          class="text-truncate"
                        >
                          {{ item.label || item.id }}
                        </span>
                      </div>
                    </template>
                    <div>
                      {{ item.label }}
                    </div>
                  </v-tooltip>
              </template>
            </v-treeview>
          </div>
        </v-card>
      </v-col>
      <v-col cols="10">
        <v-card
          height="77"
          class="mb-3"
          elevation="0"
          color="bg"
        >
          <div class="d-flex align-center px-4" style="height:100%">
            <v-spacer></v-spacer>
            <v-btn
              v-if="isBtnAccess('system:user:remove')"
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
              v-if="isBtnAccess('system:user:edit')"
              small
              outlined
              class="text-none mr-2"
              color="success"
              :disabled="selectedTableList.length === 0 || selectedTableList.length > 1"
              @click="isNew = false, addDialog = true"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('btn.edit') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('system:user:exportSample')"
              outlined
              small
              class="text-none mr-2"
              color="primary"
              @click="handleExportSample"
            >
              <v-icon left small>mdi-download</v-icon>
              {{ $t('btn.exportSample') }}
            </v-btn>
            <!-- eslint-disable-next-line -->
            <input
              type="file"
              accept=".xlsx"
              ref="uploader"
              class="d-none"
              id="uploadFiles"
              @change="onFilesChanged"
            />
            <v-btn
              v-if="isBtnAccess('system:user:import')"
              outlined
              small
              class="text-none mr-2"
              color="primary"
              @click="handleImportClick"
            >
              <v-icon left small>mdi-upload</v-icon>
              {{ $t('btn.import') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('system:user:export')"
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
            v-if="isBtnAccess('system:user:add')"
              small
              class="text-none"
              color="primary"
              @click="isNew = true, addDialog = true"
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
                ref="userManagementGrid"
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
      @closeDialog="addDialog = false"
      @getTableList="refreshTableList"
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
// eslint-disable-next-line
import AddDialog from '../components/addDialog.vue';

let timer = null;
export default {
  name: 'userManagement',
  data() {
    return {
      moment,
      elementName: 'userList',
      clientHeight: document.body.clientHeight,
      openall: false,
      activefloder: [], // 选中的部门
      searchVal: '',
      tableHeight: document.body.clientHeight - 210,
      treeHeight: document.body.clientHeight - 270,
      selectedTableList: [],
      gridApi: null,
      options: {
        headers: [
          {
            field: 'no',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            maxWidth: 100,
            headerName: 'userManagement.table.number',
            valueGetter: 'node.rowIndex + 1',
            filter: 'agTextColumnFilter',
            index: 1,
          },
          {
            field: 'userName',
            headerName: 'userManagement.table.userAccount',
            filter: 'agTextColumnFilter',
            index: 2,
          },
          {
            field: 'nickName',
            headerName: 'userManagement.table.userNickname',
            filter: 'agTextColumnFilter',
            index: 3,
          },
          {
            field: 'deptName',
            headerName: 'userManagement.table.deptmentName',
            filter: 'agTextColumnFilter',
            index: 4,
          },
          {
            field: 'phonenumber',
            headerName: 'userManagement.table.phoneNumber',
            filter: 'agTextColumnFilter',
            index: 5,
          },
          {
            field: 'status',
            headerName: 'userManagement.table.status',
            cellRendererSelector: () => ({
              component: 'AssignSwitch',
              params: {
                currowinfo: this,
                field: 'status',
                init: this.init,
              },
            }),
            filter: 'agTextColumnFilter',
            index: 6,
            maxWidth: 100,
          },
          {
            field: 'createBy',
            headerName: 'userManagement.table.createdBy',
            index: 6,
            filter: 'agTextColumnFilter',
          },
          {
            field: 'createTime',
            headerName: 'userManagement.table.creationTime',
            index: 7,
            filter: 'agTextColumnFilter',
          },
          {
            field: 'action',
            headerName: 'userManagement.table.action',
            index: 8,
            minWidth: 200,
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
      },
      isNew: true,
      addDialog: false,
      editDialog: false,
    };
  },
  components: {
    BaseGrid,
    AssignSwitch,
    ActionMenu,
    AddDialog,
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
    // 清除延时器
    if (timer) {
      clearTimeout(timer);
    }
  },
  created() {
    this.init();
  },
  mounted() {
    this.gridApi = this.$refs.userManagementGrid.gridApi;
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    ...mapMutations('userManagement', ['setUserList']),
    ...mapActions('userManagement', [
      'getDeptTree',
      'getUserList',
      'deleteUser',
      'excelExport',
      'excelImport',
      'downloadTemplateFile',
    ]),
    async init() {
      // 获取左侧部门树形列表
      await this.getDeptTree();
      // 初始化清空选中的部门
      this.activefloder = [];
      if (this.deptTree?.length) {
        this.handleActive();
        this.openall = true; // 展开所有节点
      }
      // 获取全部用户列表
      await this.getTableList();
    },
    // 刷新用户列表，若已选部门，则直接按部门id刷新用户列表
    refreshTableList() {
      if (this.activefloder.length > 0) {
        const { id } = this.activefloder[0];
        this.getTableList(id);
      } else {
        this.getTableList();
      }
    },
    handleActive() {
      if (this.activefloder.length > 0) {
        const { id } = this.activefloder[0];
        this.getTableList(id);
      } else {
        this.setUserList([]);
      }
    },
    // 获取用户列表接口
    async getTableList(deptId) {
      const result = await this.getUserList(deptId);
      if (result) {
        timer = setTimeout(() => {
          this.options.rowData = this.userList;
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
        const idArr = this.selectedTableList.map((item) => item.userId);
        const ids = idArr.join(',');
        const result = await this.deleteUser(ids);
        if (result) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'successAction',
          });
          this.refreshTableList();
        }
      }
    },
    // 下载模板文件
    async handleExportSample() {
      await this.downloadTemplateFile();
    },
    // 点击导入按钮
    handleImportClick() {
      this.$refs.uploader.click();
    },
    // 文件上传
    async onFilesChanged(event) {
      const payload = new FormData();
      payload.append('file', event.target.files[0]);
      payload.append('updateSupport', 0); // 表示更新已存在的用户数据
      const result = await this.excelImport(payload);
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.init();
      }
      document.getElementById('uploadFiles').value = null;
    },
    // 导出岗位数据
    async handleExport() {
      await this.excelExport();
    },
  },
  computed: {
    ...mapState('userManagement', ['deptTree', 'userList']),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('helper', ['pagePortalMode']),
    moduleName() {
      return this.$route.name;
    },
    rules() {
      return this.$getUserRules();
    },
  },
};
</script>

<style lang="scss" scoped>
  .card-title {
    font-size: 18px;
    font-weight: 500;
    line-height: 18px;
    letter-spacing: 0.0125em !important;
  }
</style>
