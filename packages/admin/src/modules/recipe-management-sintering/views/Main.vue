<template>
  <v-container fluid>
    <portal to="app-header"
      v-if="pagePortalMode.recipeManagementSintering">
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
            >
              {{ $t('btn.import') }}
            </v-btn>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="warning"
              @click="excelExport"
            >
              <v-icon left small>mdi-download</v-icon>
              {{ $t('productManagement.btn.templatedownload') }}
            </v-btn>
            <v-btn
              small
              class="text-none mr-2"
              color="primary"
              @click="
                isNew = true;
                addDialog = true;
              "
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
                ref="recipeManagementGrid"
                :elementName="elementName"
                :restoreColumn="false"
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
      :recipeType="recipeType"
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
import SwitchBtn from '../components/SwitchBtn.vue';

export default {
  name: 'recipeManagementSintering',
  components: {
    BaseGrid,
    AddDialog,
    SwitchBtn,
  },
  data() {
    return {
      elementName: 'recipe',
      recipeHeaders: [
        'no',
        'recipeVersion',
        'deviceNumber',
        'deviceName',
        'typeName',
        'status',
        'remark',
        'updateBy',
        'updateTime',
      ],
      tableHeight: document.body.clientHeight - 210,
      recipeManagementGrid: null,
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        rowDataId: 'recipeId',
      },
      selectedTableList: [],
      addDialog: false,
      isNew: true,
    };
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
    recipeType() {
      // 0:坠头配方，1: 烧结配方
      return this.$route.name === 'recipeManagementFallhead' ? 0 : 1;
    },
  },
  activated() {
    this.recipeManagementGrid = this.$refs.recipeManagementGrid.gridApi;
  },
  created() {
    console.log('created');
    this.getTableList();
    this.initTableHeaders();
  },
  deactivated() {},
  methods: {
    ...mapActions('recipeManagement', ['getRecipeList', 'editRecipe', 'deleteRecipe', 'excelExport', 'excelImport']),
    ...mapMutations('helper', ['setAlert']),
    refresh() {
      console.log(this.moduleName, 'moduleName');
      this.getTableList();
      this.resetSelect();
    },
    async getTableList() {
      this.selectedTableList = [];
      const payload = {
        elementName: 'recipe',
        query: `?recipeType=${this.recipeType}&delFlag=0`,
      };
      const recipeList = await this.getRecipeList(payload);
      if (recipeList) {
        this.options.rowData = recipeList;
      }
    },
    initTableHeaders() {
      let headers = [];
      headers = this.recipeHeaders.map((item, index) => {
        const obj = {
          field: item,
          headerName: this.$t(`recipeManagement.table.${item}`),
          index,
          filter: 'agTextColumnFilter',
          checkboxSelection: index === 0,
          headerCheckboxSelection: index === 0,
        };
        if (item === 'no') {
          obj.valueGetter = 'node.rowIndex + 1';
        }
        if (item === 'status') {
          obj.cellRendererSelector = () => ({
            component: 'SwitchBtn',
            params: {
              currowinfo: this, // 当前行的信息
              field: 'status', // 传入的字段
              init: this.refresh, // 重新获取列表
              changeStatus: this.editRecipe, // 返回true或false
            },
          });
        }
        return obj;
      });
      this.options.headers = headers;
    },
    resetSelect() {
      if (this.recipeManagementGrid) {
        this.recipeManagementGrid.deselectAll();
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
          ids += ids ? `,${item.recipeId}` : item.recipeId;
        });
        const result = await this.deleteRecipe(ids);
        if (result) {
          this.refresh();
        }
      }
    },
  },
};
</script>
