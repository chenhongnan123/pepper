<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.transportManagement">
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
              v-if="isBtnAccess('basic:transport:remove')"
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
              v-if="isBtnAccess('basic:transport:edit')"
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
              v-if="isBtnAccess('basic:transport:import')"
            />
            <v-btn
              outlined
              small
              class="text-none mr-2"
              color="warning"
              @click="handleImportClick"
              v-if="isBtnAccess('basic:transport:import')"
            >
              {{ $t('btn.import') }}
            </v-btn>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="warning"
              @click="excelExport"
              v-if="isBtnAccess('basic:transport:template')"
            >
              <v-icon left small>mdi-download</v-icon>
              {{ $t('transportManagement.btn.templatedownload') }}
            </v-btn>
            <v-btn
              small
              class="text-none mr-2"
              color="primary"
              @click="
                isNew = true;
                addDialog = true;
              "
              v-if="isBtnAccess('basic:transport:add')"
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
                ref="transportManagementGrid"
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
import ActionMenu from '../components/ActionMenu.vue';
import LinkBtn from '../components/LinkBtn.vue';

export default {
  name: 'transportManagement',
  components: {
    BaseGrid,
    AddDialog,
    ActionMenu,
    LinkBtn,
  },
  data() {
    return {
      elementName: 'transportManagement',
      drivingHeaders: [
        'no',
        'onlineStatus',
        'transportNumber',
        'transportName',
        'workshopName', // 车间，新增的字段
        'transportDesc',
        'updateBy',
        'updateTime',
      ],
      tableHeight: document.body.clientHeight - 210,
      transportManagementGrid: null,
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        rowDataId: 'transportId',
      },
      selectedTableList: [],
      addDialog: false,
      isNew: true,
    };
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapState('transportManagement', ['transportList']),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {
    this.transportManagementGrid = this.$refs.transportManagementGrid.gridApi;
  },
  created() {
    this.getTableList();
    this.initTableHeaders();
  },
  deactivated() {},
  methods: {
    ...mapActions('transportManagement', ['getTansportList', 'deleteTransport', 'excelExport', 'excelImport']),
    ...mapMutations('helper', ['setAlert']),
    refresh() {
      this.getTableList();
      this.resetSelect();
    },
    async getTableList() {
      this.selectedTableList = [];
      await this.getTansportList();
      this.options.rowData = this.transportList;
    },
    initTableHeaders() {
      let headers = [];
      headers = this.drivingHeaders.map((item, index) => {
        const obj = {
          field: item,
          headerName: this.$t(`transportManagement.table.${item}`),
          index,
          filter: 'agTextColumnFilter',
          checkboxSelection: index === 0,
          headerCheckboxSelection: index === 0,
        };
        if (item === 'no') {
          obj.valueGetter = 'node.rowIndex + 1';
        }
        if (item === 'onlineStatus') {
          obj.cellRendererSelector = () => ({
            component: 'ActionMenu',
            params: {
              that: this,
            },
          });
        }
        if (item === 'transportNumber') {
          obj.cellRendererSelector = () => ({
            component: 'LinkBtn',
            params: {
              that: this,
            },
          });
        }
        return obj;
      });
      this.options.headers = headers;
    },
    resetSelect() {
      if (this.transportManagementGrid) {
        this.transportManagementGrid.deselectAll();
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
          ids += ids ? `,${item.transportId}` : item.transportId;
        });
        const result = await this.deleteTransport(ids);
        if (result) {
          this.refresh();
        }
      }
    },
  },
};
</script>
