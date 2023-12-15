<template>
  <div class="darkNoBgColor topToolBar">
    <portal to="app-header" v-if="pagePortalMode.dataTableSetting">
      <v-btn
        icon
        small
        class="mr-2 mb-1"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ $t('modules.dataTableSetting') }}
    </portal>
    <portal
      to="settings-header-left"
      v-if="pagePortalMode.dataTableSetting"
    >
      <v-btn
        icon
        small
        class="ml-2"
        @click="init"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <v-toolbar
      flat
      dense
    >
      <v-spacer></v-spacer>
      <v-btn
        small
        class="text-none mr-2"
        color="error"
        outlined
        @click="handleDelete"
        :disabled="selectedTableList.length===0||selectedTableList.length>1"
      >
        <v-icon left small>mdi-delete</v-icon>
        {{ $t('btn.delete') }}
      </v-btn>
      <v-btn
        small
        class="text-none mr-2"
        color="primary"
        outlined
        @click="addDialog = true"
        :disabled="!(selectedTableList.length===1)"
      >
        <v-icon left small>mdi-pencil</v-icon>
        {{ $t('btn.edit') }}
      </v-btn>
      <v-btn
        outlined
        small
        class="text-none mr-2"
        color="primary"
        @click="handleExportSample"
        >
        {{ $t('btn.exportSample') }}
      </v-btn>
      <!-- eslint-disable-next-line -->
      <input
        type="file"
        accept=".xlsx"
        ref="uploader"
        class="d-none"
        id="uploadFiles"
        @change="onFilesChange"
      >
      <v-btn
        outlined
        small
        class="text-none mr-2"
        color="primary"
        @click="handleImport"
      >
        {{ $t('spc.btn.import') }}
      </v-btn>
      <v-btn
        outlined
        small
        class="text-none mr-2"
        color="primary"
        @click="handleExport"
      >
        {{ $t('btn.export') }}
      </v-btn>
      <v-btn
        small
        class="text-none"
        color="primary"
        @click="addDialog = true"
      >
        <v-icon left small>mdi-plus</v-icon>
        {{ $t('btn.add') }}
      </v-btn>
    </v-toolbar>
    <v-row
      class="text-center"
      no-gutters
    >
      <v-col :cols="12">
        <base-grid
          ref="dataTableGrid"
          :elementName="elementName"
          :restoreColumn="true"
          :options="options"
          v-model="selectedTableList"
        />
      </v-col>
    </v-row>
    <add-dialog
      :addDialog="addDialog"
      @closeDialog="addDialog = false"
      :selectedTableList="selectedTableList"
      :tablelist="tableList"
      @getTableList="initialTable"
      :rules="rules"
    />
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations,
} from 'vuex';
import moment from 'moment';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import AddDialog from './AddDataTableDialog.vue';

export default {
  name: 'dataTableSetting',
  data() {
    return {
      moment,
      elementName: 'dataTableList',
      clientheight: document.body.clientHeight,
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 260,
      },
      gridApi: null,
      headers: [
        'no',
        'meaning', // 编号
        'lookup_code', // 名称
        'description', // 描述
        'last_update_by',
        'last_update_date',
        'created_by',
        'creation_date',
      ],
      selectedTableList: [],
      addDialog: false,
    };
  },
  components: {
    BaseGrid,
    AddDialog,
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapState('spc', ['dataTableList', 'elements']),
    ...mapGetters('user', ['isBtnAccess']),
    rules() {
      return this.$getSpcRules();
    },
    tableList() {
      if (this.dataTableList.length === 0) {
        return [];
      }
      return this.dataTableList.map((item, index) => {
        const obj = {
          ...item,
          no: index + 1,
          id: item.lookup_id, // 唯一标识
        };
        if (item.last_update_date) {
          obj.last_update_date = moment(item.last_update_date).format('YYYY-MM-DD HH:mm:ss');
        }
        if (item.creation_date) {
          obj.creation_date = moment(item.creation_date).format('YYYY-MM-DD HH:mm:ss');
        }
        return obj;
      });
    },
  },
  created() {
    this.initTableHeaders();
    this.init();
  },
  mounted() {
    this.gridApi = this.$refs.dataTableGrid.gridApi;
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    ...mapActions('spc', [
      'getElements',
      'getDataTableList',
      'deleteTableColumn',
      'exportDataTableSample',
      'excelImportDataTable',
      'excelExportDataTable',
    ]),
    init() {
      this.initialTable();
    },
    resetSelect() {
      if (this.gridApi) {
        this.gridApi.deselectAll();
      }
    },
    // 加载表格数据
    async initialTable() {
      await this.getElements();
      this.resetSelect();
      const result = await this.getDataTableList();
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.options.rowData = this.tableList;
      }
      this.selectedTableList = [];
    },
    // 初始化表头
    initTableHeaders() {
      const headers = this.headers.map((item, index) => {
        const obj = {
          field: item,
          headerName: `spc.table.datatable.${item}`,
          index,
          filter: 'agTextColumnFilter',
          checkboxSelection: index === 0,
          headerCheckboxSelection: index === 0,
        };
        if (item === 'no') {
          obj.maxWidth = 120;
        }
        return obj;
      });
      this.options.headers = headers;
    },
    async handleDelete() {
      if (await this.$root.$confirm.open(
        this.$t('spc.dialog.deleterecord'),
        this.$t('spc.dialog.deleterecordconfirm'),
      )) {
        const {
          selectedTableList,
        } = this;
        // const ids = selectedTableList.map((item) => item.lookup_id);
        const id = selectedTableList[0].lookup_id; // 单个删除
        const result = await this.deleteTableColumn(id);
        if (result) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'successAction',
          });
          this.initialTable();
        }
      }
    },
    // 导出模板文件url查询
    async handleExportSample() {
      const result = await this.exportDataTableSample();
      if (result) {
        const { formatPath } = result;
        // 定义文件名
        const fileName = this.$t('spc.filename.datatabletemplate');
        this.$downloadByUrl(formatPath, fileName);
      } else {
        this.setAlert({
          type: 'error',
          message: 'noFilePath',
        });
      }
    },
    // 导入按钮点击事件
    handleImport() {
      this.$refs.uploader.click();
    },
    // 导入文件
    async onFilesChange(event) {
      const payload = new FormData();
      payload.append('file', event.target.files[0]);
      const result = await this.excelImportDataTable(payload);
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.refresh();
      }
      document.getElementById('uploadFiles').value = null;
    },
    // 导出按钮点击事件
    async handleExport() {
      const exportList = this.selectedTableList.map((item) => {
        const obj = {
          ...item,
        };
        delete obj.no;
        delete obj.id; // 删除不需要导出的字段
        return obj;
      });
      const payload = {
        data: exportList,
      };
      const result = await this.excelExportDataTable(payload);
      if (result) {
        const filePath = result;
        const fileName = this.$t('spc.filename.datatable');
        this.$downloadByUrl(filePath, fileName);
        this.resetSelect();
      } else {
        this.setAlert({
          type: 'error',
          message: 'noFilePath',
        });
      }
    },
    // 返回spc页面
    goBack() {
      this.$router.push({
        name: 'spc',
      });
    },
  },
};
</script>
<style scoped>
  .noborder th{
    border-bottom: unset!important;
  }
 .mdi-filter{
    font-size: 16px!important;
  }
</style>
<style lang="scss" scoped>
  .topToolBar {
    ::v-deep() .v-toolbar__content {
      padding: 4px 0px;
    }
  }
</style>
