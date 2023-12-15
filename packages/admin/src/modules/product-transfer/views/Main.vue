<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.productTransfer">
      {{ $t(`modules.${moduleName}`) }}
      <v-btn icon small class="ml-2 mb-1" @click="refresh">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card height="77" class="mb-3" elevation="0" color="bg">
          <div class="d-flex align-center px-4" style="height: 100%">
            <v-spacer></v-spacer>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="error"
              @click="handleDelete"
              :disabled="selectedTableList.length === 0"
              v-if="isBtnAccess('basic:relation:remove')"
            >
              <v-icon left small>mdi-delete</v-icon>
              {{ $t('btn.delete') }}
            </v-btn>
            <!-- <v-btn
              small
              outlined
              class="text-none mr-2"
              color="success"
              @click="
                isNew = false;
                addDialog = true;
              "
              :disabled="selectedTableList.length !== 1"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('btn.edit') }}
            </v-btn> -->
            <!-- eslint-disable-next-line -->
            <input
              type="file"
              accept=".xlsx"
              ref="uploader"
              class="d-none"
              id="uploadFiles"
              @change="onFilesChanged"
              v-if="isBtnAccess('basic:relation:import')"
            />
            <v-btn
              outlined
              small
              class="text-none mr-2"
              color="warning"
              @click="handleImportClick"
              v-if="isBtnAccess('basic:relation:import')"
            >
              {{ $t('btn.import') }}
            </v-btn>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="warning"
              @click="excelExport"
              v-if="isBtnAccess('basic:relation:template')"
            >
              <v-icon left small>mdi-download</v-icon>
              {{ $t('productTransfer.btn.templatedownload') }}
            </v-btn>
            <v-btn
              small
              class="text-none mr-2"
              color="primary"
              @click="$router.push('/product-transfer/add')"
              v-if="isBtnAccess('basic:relation:add')"
            >
              <v-icon left small>mdi-plus</v-icon>
              {{ $t('btn.add') }}
            </v-btn>
          </div>
        </v-card>
        <v-card :height="tableHeight" class="" elevation="0" color="bg">
          <v-row no-gutters class="pa-4">
            <v-col>
              <base-grid
                ref="productTransferGrid"
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
  </v-container>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
  mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';

export default {
  name: 'productTransfer',
  components: {
    BaseGrid,
  },
  data() {
    return {
      elementName: 'productTransfer',
      transfertHeaders: [
        'no',
        'deviceName',
        'deviceNumber',
        'productName',
        'productNumber',
        'productModel',
        'updateBy',
        'updateTime',
      ],
      tableHeight: document.body.clientHeight - 210,
      productTransferGrid: null,
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        rowDataId: 'relationId',
      },
      selectedTableList: [],
      addDialog: false,
      isNew: true,
    };
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('productTransfer', ['productTransferList']),
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {
    console.log('main-activated');
    this.productTransferGrid = this.$refs.productTransferGrid.gridApi;
  },
  created() {
    this.getTableList();
    this.initTableHeaders();
  },
  deactivated() {},
  methods: {
    ...mapActions('productTransfer', [
      'getProductTransferList',
      'deleteTransfer',
      'excelExport',
      'excelImport',
    ]),
    ...mapMutations('helper', ['setAlert']),
    refresh() {
      this.getTableList();
      this.resetSelect();
    },
    async getTableList() {
      this.selectedTableList = [];
      await this.getProductTransferList();
      this.options.rowData = this.productTransferList;
    },
    initTableHeaders() {
      let headers = [];
      headers = this.transfertHeaders.map((item, index) => {
        const obj = {
          field: item,
          headerName: this.$t(`productTransfer.table.${item}`),
          index,
          filter: 'agTextColumnFilter',
          checkboxSelection: index === 0,
          headerCheckboxSelection: index === 0,
        };
        if (item === 'no') {
          obj.valueGetter = 'node.rowIndex + 1';
        }
        return obj;
      });
      this.options.headers = headers;
    },
    resetSelect() {
      if (this.productTransferGrid) {
        this.productTransferGrid.deselectAll();
      }
    },
    handleImportClick() {
      this.$refs.uploader.click();
    },
    // 上传excel文件
    async onFilesChanged(event) {
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
    async handleDelete() {
      if (
        await this.$root.$confirm.open(
          this.$t('dialog.deleterecord'),
          this.$t('dialog.deleterecordconfirm'),
        )
      ) {
        let ids = '';
        this.selectedTableList.forEach((item) => {
          ids += ids ? `,${item.relationId}` : item.relationId;
        });
        const result = await this.deleteTransfer(ids);
        if (result) {
          this.refresh();
        }
      }
    },
  },
};
</script>
