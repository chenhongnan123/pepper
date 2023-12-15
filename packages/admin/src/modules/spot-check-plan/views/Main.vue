<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.spotCheckPlan">
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
              v-if="isBtnAccess('basic:check:remove')"
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
              v-if="isBtnAccess('basic:check:edit')"
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
              v-if="isBtnAccess('basic:check:import')"
            />
            <v-btn
              outlined
              small
              class="text-none mr-2"
              color="warning"
              @click="handleImportClick(0)"
              v-if="isBtnAccess('basic:check:import')"
            >
              {{ $t('btn.import') }}
            </v-btn>
            <v-btn
              outlined
              small
              class="text-none mr-2"
              color="warning"
              @click="handleImportClick(1)"
              v-if="isBtnAccess('basic:check:import')"
            >
             追加导入
            </v-btn>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="warning"
              @click="excelExport"
              v-if="isBtnAccess('basic:check:template')"
            >
              <v-icon left small>mdi-download</v-icon>
              {{ $t('btn.templatedownload') }}
            </v-btn>
            <v-btn
              small
              class="text-none mr-2"
              color="primary"
              @click="
                isNew = true;
                addDialog = true;
              "
              v-if="isBtnAccess('basic:check:add')"
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
                ref="spotCheckPlanGrid"
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
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import AddDialog from '../components/main/AddDialog.vue';
import TextBtn from '../components/main/TextBtn.vue';

export default {
  name: 'spotCheckPlan',
  components: {
    BaseGrid,
    AddDialog,
    TextBtn,
  },
  data() {
    return {
      elementName: 'spotCheckPlan',
      tableHeight: document.body.clientHeight - 210,
      spotCheckHeaders: [
        'no',
        'checkName',
        'deviceNumber',
        'deviceName',
        'typeName',
        'spotCheckFrequency',
        'updateBy',
        'updateTime',
      ],
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        rowDataId: 'checkId', // 传递对象的唯一标识符
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        pagination: true,
      },
      selectedTableList: [],
      addDialog: false,
      isNew: true,
      append: null,
    };
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('spotCheckPlan', ['spotCheckPlanList']),
    moduleName() {
      return this.$route.name;
    },
  },
  created() {
    this.getTableList();
    this.initTableHeaders();
  },
  methods: {
    ...mapActions('spotCheckPlan', [
      'getSpotCheckPlanList',
      'deleteSpotCheckPlan',
      'excelExport',
      'excelImport',
    ]),
    ...mapMutations('helper', ['setAlert']),
    refresh() {
      this.getTableList();
    },
    async getTableList() {
      this.selectedTableList = [];
      await this.getSpotCheckPlanList();
      this.options.rowData = this.spotCheckPlanList;
    },
    async handleDelete() {
      if (
        await this.$root.$confirm.open(
          this.$t('dialog.deleterecord'),
          this.$t('dialog.deleterecordconfirm'),
        )
      ) {
        const idList = [];
        this.selectedTableList.forEach((item) => {
          idList.push(item.checkId);
        });
        const result = await this.deleteSpotCheckPlan(idList);
        if (result) {
          this.refresh();
        }
      }
    },
    initTableHeaders() {
      let headers = [];
      headers = this.spotCheckHeaders.map((item, index) => {
        const obj = {
          field: item,
          headerName: this.$t(`spotCheckPlan.table.${item}`),
          index,
          filter: 'agTextColumnFilter',
          checkboxSelection: index === 0,
          headerCheckboxSelection: index === 0,
        };
        if (item === 'no') {
          obj.valueGetter = 'node.rowIndex + 1';
        }
        if (item === 'checkName') {
          obj.cellRendererSelector = () => ({
            component: 'TextBtn',
            params: {
              that: this,
            },
          });
        }
        return obj;
      });
      this.options.headers = headers;
    },
    handleImportClick(append) {
      this.append = append;
      this.$refs.uploader.click();
    },
    // 上传excel文件
    async onFilesChanged(event) {
      const payload = new FormData();
      payload.append('file', event.target.files[0]);
      const result = await this.excelImport({
        payload,
        append: this.append,
      });
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
  },
};
</script>
