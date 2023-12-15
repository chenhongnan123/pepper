<template>
  <div>
    <v-card
      :height="77"
      class="mb-3"
      elevation="0"
      color="bg"
    >
      <div class="d-flex align-center px-4" style="height:100%">
        <v-spacer></v-spacer>
        <v-btn
          v-if="isBtnAccess('basic:bom:removeAndCheck')"
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
          v-if="isBtnAccess('basic:bom:edit')"
          small
          outlined
          class="text-none mr-2"
          color="success"
          :disabled="selectedtablelist.length === 0 || selectedtablelist.length > 1"
          @click="isAddNew = false;bomPartDialog = true"
        >
          <v-icon left small>mdi-pencil</v-icon>
          {{ $t('btn.edit') }}
        </v-btn>
        <v-btn
          v-if="isBtnAccess('basic:bom:export')"
          outlined
          small
          class="text-none mr-2"
          color="primary"
          @click="handleExportSample"
          :disabled="!isSelectedBom"
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
          @change="onFilesChanged"
        />
        <v-btn
          v-if="isBtnAccess('basic:bom:import')"
          outlined
          small
          class="text-none mr-2"
          color="primary"
          @click="handleImportClick"
          :disabled="!isSelectedBom"
        >
          {{ $t('btn.import') }}
        </v-btn>
        <v-btn
          v-if="isBtnAccess('basic:bom:export')"
          outlined
          small
          class="text-none mr-2"
          color="primary"
          @click="handleExport"
          :disabled="selectedtablelist.length===0"
        >
          {{ $t('btn.export') }}
        </v-btn>
        <v-btn
          v-if="isBtnAccess('basic:bom:add')"
          small
          class="text-none"
          color="primary"
          @click="isAddNew = true;bomPartDialog = true"
          :disabled="!isSelectedBom"
        >
          <v-icon left small>mdi-plus</v-icon>
          {{ $t('btn.add') }}
        </v-btn>
      </div>
    </v-card>
    <v-card
      :height="tableHeight - 77 - 12"
      elevation="0"
      color="bg"
    >
      <v-row
        class="pa-4"
        no-gutters
      >
        <v-col>
          <base-grid
            ref="partGrid"
            :elementName="elementName"
            :restoreColumn="true"
            :options="options"
            v-model="selectedtablelist"
          />
        </v-col>
      </v-row>
    </v-card>
    <bom-part-dialog
      :addDialog="bomPartDialog"
      :isAddNew="isAddNew"
      :selectedBom="selectedBom"
      :selectedtablelist="selectedtablelist"
      :rules="rules"
      @closeDialog="bomPartDialog = false"
      @getTableList="refresh"
    />
  </div>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import BomPartDialog from './BomPartDialog.vue';
import TextBtn from './TextBtn.vue';
import CheckBox from './CheckBox.vue';

export default {
  name: 'PartList',
  data() {
    return {
      tableHeight: document.body.clientHeight - 210,
      elementName: 'machineBomDetail',
      partGridApi: null,
      clientheight: document.body.clientHeight,
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'machineBom.table.no',
            maxWidth: 120,
            filter: false,
            checkboxSelection: true,
            headerCheckboxSelection: true,
          },
          {
            field: 'bomName',
            headerName: 'machineBom.table.bomName',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'partNumber',
            headerName: 'machineBom.table.productCode',
            cellRendererSelector: () => ({
              component: 'TextBtn',
              params: {
                that: this,
              },
            }), // 零件代码自定义单元格
            filter: 'agTextColumnFilter',
          },
          {
            field: 'partName',
            headerName: 'machineBom.table.productName',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'partDescription',
            headerName: 'machineBom.table.description',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'partType',
            headerName: 'machineBom.table.productType',
            filter: 'agTextColumnFilter',
            valueGetter: (params) => {
              if (params.data.partType) {
                const type = this.partTypeList.find((m) => m.dictValue === params.data.partType);
                if (type) {
                  return type.dictLabel;
                }
                return params.data.partType;
              }
              return '-';
            },
          },
          {
            field: 'partQty',
            headerName: 'machineBom.table.productNumber',
            filter: 'agTextColumnFilter',
          },
          // {
          //   field: 'positionNumber',
          //   headerName: 'machineBom.table.positionNum',
          //   filter: 'agTextColumnFilter',
          // },
          {
            field: 'electricSymbol',
            headerName: 'machineBom.table.elecSymbol',
            filter: 'agTextColumnFilter',
          },
          // {
          //   field: 'keyPart',
          //   headerName: 'machineBom.table.isKeyPart',
          //   cellRendererSelector: () => ({
          //     component: 'CheckBox',
          //     params: {
          //       field: 'keyPart',
          //     },
          //   }),
          // },
          // {
          //   field: 'maintenance',
          //   headerName: 'machineBom.table.isMaintenance',
          //   cellRendererSelector: () => ({
          //     component: 'CheckBox',
          //     params: {
          //       field: 'maintenance',
          //     },
          //   }),
          // },
          // {
          //   field: 'sparePart',
          //   headerName: 'machineBom.table.isBackup',
          //   cellRendererSelector: () => ({
          //     component: 'CheckBox',
          //     params: {
          //       field: 'sparePart',
          //     },
          //   }),
          // },
          {
            field: 'sparePartLife',
            headerName: 'machineBom.table.restLife',
            filter: 'agTextColumnFilter',
            valueGetter: (params) => {
              if (params.data.sparePartLife) {
                const { sparePartLifeType } = params.data;
                if (sparePartLifeType === '0') {
                  return '-';
                }
                return params.data.sparePartLife;
              }
              return '-';
            },
          },
          {
            field: 'warningRatio',
            headerName: 'machineBom.table.warnPercent',
            filter: 'agTextColumnFilter',
            valueGetter: (params) => {
              if (params.data.warningRatio) {
                const { sparePartLifeType } = params.data;
                if (sparePartLifeType === '0') {
                  return '-';
                }
                return params.data.warningRatio;
              }
              return '-';
            },
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240 - 77 - 12,
      },
      selectedtablelist: [],
      bomPartDialog: false,
      isAddNew: true,
    };
  },
  props: {
    activefloder: {
      type: Array,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
  },
  components: {
    BaseGrid,
    BomPartDialog,
    TextBtn,
    CheckBox,
  },
  mounted() {
    this.partGridApi = this.$refs.partGrid.gridApi;
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('machineBom', [
      'bomDetailList',
      'partTypeList',
    ]),
    selectedBom() {
      return this.activefloder[0] || {};
    },
    isSelectedBom() {
      if (this.activefloder?.length) {
        if (this.activefloder[0]?.bomLevel) {
          return this.activefloder[0].bomLevel !== 0;
        }
      }
      return false;
    },
  },
  created() {
  },
  watch: {
    bomDetailList: {
      handler(arr) {
        if (arr && arr.length > 0) {
          this.options.rowData = arr.map((item, index) => {
            const obj = {
              ...item,
              no: index + 1,
              id: item.bomId, // 用于ag-grid的id，唯一标识
            };
            return obj;
          });
        } else {
          this.options.rowData = [];
        }
      },
      deep: true,
      immediate: true,
    },
    'selectedBom.bomId': {
      handler() {
        this.partGridApi.setFilterModel(null);
      },
    },
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    ...mapActions('machineBom', [
      'getBomTableList',
      'deleteBom',
      'excelImport',
      'eportSampleExcel',
      'excelExport',
    ]),
    init() {
      this.resetSelect();
    },
    async refresh() {
      this.resetSelect();
      await this.getTableList();
      this.$emit('refresh');
    },
    async getTableList() {
      this.resetSelect();
      const result = await this.getBomTableList(this.selectedBom.bomId);
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
      }
    },
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
        let bomIds = '';
        console.log(this.selectedtablelist, 'this.selectedtablelist');
        this.selectedtablelist.forEach((item) => {
          bomIds += bomIds ? `,${item.bomId}` : item.bomId;
        });
        const result = await this.deleteBom(bomIds);
        if (result) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'successAction',
          });
          this.refresh();
        }
      }
    },
    handleImportClick() {
      this.$refs.uploader.click();
    },
    async onFilesChanged(event) {
      const payload = new FormData();
      payload.append('file', event.target.files[0]);
      payload.append('bomParentId', this.selectedBom.bomId);
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
    // 导出模板文件url查询
    async handleExportSample() {
      this.excelExport();
    },
    // 导出按钮点击事件
    async handleExport() {
      console.log(12131212);
      const ids = this.selectedtablelist.map((item) => item.bomId);
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
};
</script>
<style lang="scss" scoped>
</style>
