<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.machineAttribute">
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
              v-if="isBtnAccess('basic:attribute:remove')"
            >
              <v-icon left small>mdi-delete</v-icon>
              {{ $t('btn.delete') }}
            </v-btn>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="success"
              @click="
                isNew = false;
                addDialog = true;
              "
              :disabled="selectedTableList.length !== 1"
              v-if="isBtnAccess('basic:attribute:edit')"
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
              v-if="isBtnAccess('basic:attribute:import')"
            />
            <v-btn
              outlined
              small
              class="text-none mr-2"
              color="warning"
              @click="handleImportClick"
              v-if="isBtnAccess('basic:attribute:import')"
            >
              {{ $t('btn.import') }}
            </v-btn>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="warning"
              @click="excelExport"
              v-if="isBtnAccess('basic:attribute:template')"
            >
              <v-icon left small>mdi-download</v-icon>
              {{ $t('machineAttribute.btn.templatedownload') }}
            </v-btn>
            <v-btn
              small
              class="text-none mr-2"
              color="primary"
              @click="
                isNew = true;
                addDialog = true;
              "
              v-if="isBtnAccess('basic:attribute:add')"
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
                ref="machineAttributeGrid"
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
  mapState,
  mapActions,
  mapMutations,
  mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import AddDialog from '../components/AddDialog.vue';
import CheckBox from '../components/CheckBox.vue';

export default {
  name: 'machineAttribute',
  components: {
    BaseGrid,
    AddDialog,
    CheckBox,
  },
  data() {
    return {
      elementName: 'machineAttribute',
      workshopHeaders: [
        'no',
        'typeName',
        'processName',
        'transportName',
        'stayTime',
        'isGenerateTask',
        'isPullTask',
        'isAssignDevice',
        'updateBy',
        'updateTime',
      ],
      tableHeight: document.body.clientHeight - 210,
      machineAttributeGrid: null,
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        rowDataId: 'attributeId',
      },
      selectedTableList: [],
      addDialog: false,
      isNew: true,
    };
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapState('machineAttribute', ['machineAttributeList']),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {
    this.machineAttributeGrid = this.$refs.machineAttributeGrid.gridApi;
  },
  created() {
    this.getTableList();
    this.initTableHeaders();
  },
  deactivated() {},
  methods: {
    ...mapActions('machineAttribute', [
      'getMachineAttributeList',
      'deleteMachineAttribute',
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
      await this.getMachineAttributeList();
      this.options.rowData = this.machineAttributeList;
    },
    initTableHeaders() {
      let headers = [];
      headers = this.workshopHeaders.map((item, index) => {
        const obj = {
          field: item,
          headerName: this.$t(`machineAttribute.table.${item}`),
          index,
          filter: 'agTextColumnFilter',
          checkboxSelection: index === 0,
          headerCheckboxSelection: index === 0,
        };
        if (item === 'no') {
          obj.valueGetter = 'node.rowIndex + 1';
        }
        if (item === 'isGenerateTask') {
          obj.cellRendererSelector = () => ({
            component: 'CheckBox',
            params: {
              currowinfo: this,
              field: 'isGenerateTask',
            },
          });
        }
        if (item === 'isPullTask') {
          obj.cellRendererSelector = () => ({
            component: 'CheckBox',
            params: {
              currowinfo: this,
              field: 'isPullTask',
            },
          });
        }
        if (item === 'isAssignDevice') {
          obj.cellRendererSelector = () => ({
            component: 'CheckBox',
            params: {
              currowinfo: this,
              field: 'isAssignDevice',
            },
          });
        }
        return obj;
      });
      this.options.headers = headers;
    },
    resetSelect() {
      if (this.machineAttributeGrid) {
        this.machineAttributeGrid.deselectAll();
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
          ids += ids ? `,${item.attributeId}` : item.attributeId;
        });
        const result = await this.deleteMachineAttribute(ids);
        if (result) {
          this.refresh();
        }
      }
    },
  },
};
</script>
