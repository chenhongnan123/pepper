<template>
  <v-container fluid class="darkNoBgColor">
    <portal to="app-header" v-if="pagePortalMode.partManagement">
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
        <div class="d-flex align-center px-4" style="height:100%">
        <v-spacer></v-spacer>
        <v-btn
          v-if="isBtnAccess('basic:part:removeBatch')"
          small
          outlined
          class="text-none mr-2"
          color="error"
          @click="handleDelete"
          :disabled="selectedtablelist.length === 0"
        >
          <v-icon left small>mdi-delete</v-icon>
          {{ $t('btn.delete') }}
        </v-btn>
        <v-btn
          v-if="isBtnAccess('basic:part:edit')"
          small
          outlined
          class="text-none mr-2"
          color="success"
          :disabled="selectedtablelist.length === 0 || selectedtablelist.length > 1"
          @click="editDialog = true"
        >
          <v-icon left small>mdi-pencil</v-icon>
          {{ $t('btn.edit') }}
        </v-btn>
        <v-btn
          v-if="isBtnAccess('basic:part:exportSample')"
          small
          outlined
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
          v-if="isBtnAccess('basic:part:import')"
          small
          outlined
          class="text-none mr-2"
          color="primary"
          @click="handleImport"
        >
          {{ $t('btn.import') }}
        </v-btn>
        <v-btn
          v-if="isBtnAccess('basic:part:export')"
          small
          outlined
          class="text-none mr-2"
          color="primary"
          @click="handleExport"
          :disabled="selectedtablelist.length === 0"
        >
          {{ $t('btn.export') }}
        </v-btn>
        <v-btn
          v-if="isBtnAccess('basic:part:insert')"
          small
          class="text-none"
          color="primary"
          @click="addDialog = true"
          :disabled="false"
        >
          <v-icon left small>mdi-plus</v-icon>
          {{ $t('btn.add') }}
        </v-btn>
      </div>
        </v-card>
        <v-card
          class=""
          elevation="0"
          color="bg"
        >
          <v-row no-gutters class="pa-4">
            <v-col>
              <base-grid
                @click.enter="handleClick"
                @keyup.enter="handleClick"
                ref="partGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="options"
                v-model="selectedtablelist"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <add-dialog
      :addDialog="addDialog"
      :rules="rules"
      @closeDialog="addDialog = false"
      @getTableList="refresh"
    />
    <edit-dialog
      :editDialog="editDialog"
      :selectedtablelist="selectedtablelist"
      :rules="rules"
      @closeDialog="editDialog = false"
      @getTableList="refresh"
    />
    <DeleteFailedDialog
      :isShowDialog="isShowDeleteFailedDialog"
      @closeDialog="isShowDeleteFailedDialog = false"
      :deleteFailedList="deleteFailedList"
      @getTableList="getTableList"
    />
  </v-container>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import DeleteFailedDialog from '@/components/commonUI/DeleteFailedDialog.vue';
import AddDialog from '../components/main/AddDialog.vue';
import EditDialog from '../components/main/EditDialog.vue';
import TextBtn from '../components/main/TextBtn.vue';

export default {
  name: 'partManagement',
  data() {
    return {
      clientheight: document.body.clientHeight,
      clientWidth: document.body.clientWidth,
      elementName: 'partList', // 区分页面
      partGridApi: null,
      headers: ['no', 'partNumber', 'partName', 'partDescription', 'partType', 'updateBy', 'updateTime'],
      options: {
        headers: [],
        rowData: [],
        rowDataId: 'partId',
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
      },
      selectedtablelist: [],
      addDialog: false,
      editDialog: false,
      isShowDeleteFailedDialog: false,
      deleteFailedList: [],
    };
  },
  components: {
    BaseGrid,
    DeleteFailedDialog,
    AddDialog,
    EditDialog,
    TextBtn,
  },
  created() {
    this.init();
    this.refresh();
  },
  mounted() {
    this.partGridApi = this.$refs.partGrid.gridApi;
  },
  activated() {
    // this.refresh();
    // this.init();
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
    ...mapActions('partManagement', [
      'getItemTypes',
      'getPartList',
      'deletePart',
      'excelImport',
      'eportSampleExcel',
      'excelExport',
    ]),
    init() {
      // 初始化零件列表表头
      this.initTableHeaders();
      // 加载零件类型列表
      this.getItemTypes();
    },
    refresh() {
      this.resetSelect();
      this.getTableList();
      this.setAlert({
        show: true,
        type: 'success',
        message: 'successAction',
      });
    },
    // 初始化表头
    initTableHeaders() {
      this.options.headers = this.headers.map((item, index) => {
        let obj = {
          field: item,
          headerName: this.$t(`partManagement.table.${item}`),
          index,
          checkboxSelection: index === 0,
          headerCheckboxSelection: index === 0,
          filter: 'agTextColumnFilter',
        };
        if (item === 'no') {
          obj = {
            ...obj,
            maxWidth: 100,
            filter: 'agTextColumnFilter',
          };
        }
        if (item === 'partNumber') {
          obj = {
            ...obj,
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'TextBtn',
              params: {
                that: this,
              },
            }), // 零件代码自定义单元格
          };
        }
        if (item === 'partType') {
          obj = {
            ...obj,
            valueGetter: (params) => {
              const { partType } = params.data;
              if (partType) {
                const type = this.itemTypeList.find((p) => (+p.dictValue) === partType);
                if (type) {
                  return type.dictLabel;
                }
              }
              return '-';
            },
          };
        }
        return obj;
      });
    },
    // 获取零件列表数据
    async getTableList() {
      await this.getPartList();
      if (this.partList?.length) {
        this.options.rowData = this.partList;
      } else {
        this.options.rowData = [];
      }
    },
    // 重置选择
    resetSelect() {
      if (this.partGridApi) {
        this.partGridApi.deselectAll();
      }
    },
    async handleDelete() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        let payload = {
          idList: this.selectedtablelist.map((item) => item.partId),
        };
        payload = payload.idList.join(',');
        const result = await this.deletePart(payload);
        if (!result) {
          return;
        }
        await this.getTableList();
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        const { ids } = result;
        if (!ids || ids.length === 0) {
          this.resetSelect();
          return;
        }

        this.$nextTick(() => {
          this.partGridApi.forEachNode((node) => {
            // 判断当前node节点有否有未删除的数据
            const isDeleteFailed = ids.includes(node.data.partId);
            if (isDeleteFailed) {
              // 给没删除的打勾
              node.setSelected(true);
            }
          });
        });
        this.setAlert({
          show: true,
          type: 'error',
          message: 'hasAssociateData',
        });
      }
    },
    // 导出模板
    async handleExportSample() {
      this.excelExport();
    },
    // 导入按钮点击事件
    handleImport() {
      this.$refs.uploader.click();
    },
    // 导入文件
    async onFilesChange(event) {
      const payload = new FormData();
      payload.append('file', event.target.files[0]);
      const result = await this.excelImport(payload);
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
      const ids = this.selectedtablelist.map((item) => item.partId);
      const result = await this.eportSampleExcel({
        ids,
      });
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.refresh();
      }
    },
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('partManagement', [
      'partList',
      'itemTypeList',
    ]),
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    rules() {
      return this.$getPartRules();
    },
    moduleName() {
      return this.$route.name;
    },
  },
};
</script>
<style lang="scss" scoped>
header{
    height: 77px!important;
    width: auto!important;
    margin: 0px 17px 17px 17px;
    border-radius: 4px!important;
    box-shadow: none!important;
}
.paginationPosition{
  background-color: #FFFFFF!important;
  padding-left: 17px!important
}
</style>
