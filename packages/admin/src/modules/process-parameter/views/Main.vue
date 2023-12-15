<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.processParameter">
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
              v-if="isBtnAccess('basic:param:remove')"
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
              v-if="isBtnAccess('basic:param:edit')"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('btn.edit') }}
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
              outlined
              small
              class="text-none mr-2"
              color="warning"
              @click="handleImportClick"
              v-if="isBtnAccess('basic:param:import')"
            >
              {{ $t('btn.import') }}
            </v-btn>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="warning"
              @click="handleExport"
              v-if="isBtnAccess('basic:param:templatedownload')"
            >
              <v-icon left small>mdi-download</v-icon>
              {{ $t('btn.downloadTemplate') }}
            </v-btn>
            <v-btn
              small
              class="text-none"
              color="primary"
              @click="isNew = true;addDialog = true"
              v-if="isBtnAccess('basic:param:add')"
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
                ref="processParameterGrid"
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
    />
  </v-container>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import AddDialog from '../components/AddDialog.vue';

export default {
  name: 'processParameter',
  components: {
    BaseGrid,
    AddDialog,
  },
  data() {
    return {
      elementName: 'processParameter',
      tableHeight: document.body.clientHeight - 210,
      processParameterGridApi: null,
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'processParameter.table.no',
            filter: 'agTextColumnFilter',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            // eslint-disable-next-line
            valueGetter: (params) => params.node?.rowIndex + 1,
          },
          {
            field: 'productNumber',
            headerName: 'processParameter.table.productNumber',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'processNumber',
            headerName: 'processParameter.table.processNumber',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'processParamLabel',
            headerName: 'processParameter.table.label',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'mesLabel',
            headerName: 'processParameter.table.mesLabel',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'type',
            headerName: 'processParameter.table.type',
            filter: 'agTextColumnFilter',
            valueFormatter: (params) => {
              if (params.value) {
                return this.$t(`processParameter.label.type.${params.value}`);
              }
              return '-';
            },
          },
          {
            field: 'updateBy',
            headerName: 'processParameter.table.modifyBy',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'updateTime',
            headerName: 'processParameter.table.modifyTime',
            filter: 'agTextColumnFilter',
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
    ]),
    ...mapState('processParameter', [
      'parameterList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {
    this.processParameterGridApi = this.$refs.processParameterGrid.gridApi;
  },
  created() {
    this.getTableList();
  },
  deactivated() {
  },
  methods: {
    ...mapActions('processParameter', [
      'getParameterList',
      'deleteProcessParam',
      'excelExport',
      'excelImport',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh() {
      this.getTableList();
      this.resetSelect();
      this.selectedTableList = [];
    },
    async getTableList() {
      await this.getParameterList(true);
      this.options.rowData = this.parameterList;
    },
    resetSelect() {
      if (this.processParameterGridApi) {
        this.processParameterGridApi.deselectAll();
      }
    },
    handleExport() {
      const filename = `${this.$t('processParameter.file.template')}_${new Date().getTime()}.xlsx`;
      this.excelExport(filename);
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
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        let processParamIds = '';
        this.selectedTableList.forEach((item) => {
          processParamIds += processParamIds ? `,${item.processParamId}` : item.processParamId;
        });
        const result = await this.deleteProcessParam(processParamIds);
        if (result) {
          this.refresh();
        }
      }
    },
  },
};
</script>
