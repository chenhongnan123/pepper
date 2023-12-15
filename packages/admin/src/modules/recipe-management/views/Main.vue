<template>
  <v-container fluid>
    <portal to="app-header"
      v-if="pagePortalMode.recipeManagement">
      {{ $t(`modules.${moduleName}`) }}
      <v-btn icon small class="ml-2 mb-1" @click="refresh">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card height="77" class="mb-3" elevation="0" color="bg">
          <div class="d-flex align-center px-4" style="height: 100%">
            <tab-layout
              :items="tabItems"
              v-model="recipeType"
              @changeTab="handleChangeTab"
            />
            <v-spacer></v-spacer>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="error"
              @click="handleDelete"
              :disabled="selectedTableList.length === 0"
              v-if="isBtnAccess('basic:recipe:remove')"
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
                isEdit = true;
                addDialog = true;
              "
              :disabled="selectedTableList.length !== 1"
              v-if="isBtnAccess('basic:recipe:edit')"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('btn.edit') }}
            </v-btn>
            <v-btn
              small
              class="text-none mr-2"
              color="primary"
              @click="
                isCopy = true;
                addDialog = true;
              "
              :disabled="selectedTableList.length !== 1"
              v-if="isBtnAccess('basic:recipe:copy')"
            >
              <v-icon left small>mdi-content-duplicate</v-icon>
              {{ $t('btn.duplication') }}
            </v-btn>
            <v-btn
              small
              class="text-none mr-2"
              color="primary"
              v-if="recipeType === 1 && isBtnAccess('basic:recipe:download')"
              :disabled="selectedTableList.length === 0 || isUploading"
              @click="handleUploadRecipe"
            >
              <v-icon left small>mdi-upload</v-icon>
              {{ isUploading ? '下发中...' : $t('btn.uploadRecipe') }}
            </v-btn>
            <v-btn
              small
              class="text-none mr-2"
              color="primary"
              :disabled="recipeType === -1"
              @click="
                addDialog = true;
              "
              v-if="isBtnAccess('basic:recipe:add')"
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
      :isEdit="isEdit"
      :isCopy="isCopy"
      :selectedTableList="selectedTableList"
      :recipeType="recipeType"
      @closeDialog="addDialog = false, isEdit = false, isCopy = false"
      @getTableList="refresh"
    />
    <recipe-status
    :recipeStatusDialog="recipeStatusDialog"
    :uploadRecipeStatus="uploadRecipeStatus"
    @closeDialog="recipeStatusDialog = false"
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
import TabLayout from '@/components/commonUI/TabLayout.vue';
import AddDialog from '../components/AddDialog.vue';
import SwitchBtn from '../components/SwitchBtn.vue';
import TextBtn from '../components/TextBtn.vue';
import RecipeStatus from '../components/RecipeStatus.vue';

export default {
  name: 'recipeManagement',
  components: {
    BaseGrid,
    AddDialog,
    SwitchBtn,
    TextBtn,
    TabLayout,
    RecipeStatus,
  },
  data() {
    return {
      elementName: 'recipeManagement',
      // recipeType: -1, // 0坠头配方，1烧结配方
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
      isEdit: false,
      isCopy: false,
      isUploading: false,
      recipeStatusDialog: false,
      uploadRecipeStatus: [],
      recipeTransfer: 0,
    };
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
    fallheadPemssion() {
      return this.isBtnAccess('basic:recipe:fallhead');
    },
    sinteringPemssion() {
      return this.isBtnAccess('basic:recipe:sintering');
    },
    tabItems() {
      return [
        {
          tabName: this.$t('recipeManagement.table.recipeManagementFallhead'),
          disabled: !this.isBtnAccess('basic:recipe:fallhead'),
        },
        {
          tabName: this.$t('recipeManagement.table.recipeManagementSintering'),
          disabled: !this.isBtnAccess('basic:recipe:sintering'),
        },
      ];
    },
    recipeType: {
      get() {
        const {
          fallheadPemssion,
          sinteringPemssion,
        } = this;
        // 0 坠头配方，1 烧结配方,-1 没有权限
        if (!fallheadPemssion && !sinteringPemssion) {
          return -1;
        }
        if (fallheadPemssion && !sinteringPemssion) {
          return 0;
        }
        if (!fallheadPemssion && sinteringPemssion) {
          return 1;
        }
        return this.recipeTransfer;
      },
      set(val) {
        this.recipeTransfer = val;
      },
    },
  },
  activated() {
    this.recipeManagementGrid = this.$refs.recipeManagementGrid.gridApi;
  },
  async created() {
    await this.$getTimeout(200);
    this.getTableList();
    this.initTableHeaders();
  },
  deactivated() {},
  methods: {
    ...mapActions('recipeManagement', ['getBasicList', 'changeRecipeActive', 'deleteRecipe', 'uploadRecipe', 'getUploadRecipeStatus']),
    ...mapMutations('helper', ['setAlert']),
    refresh() {
      this.init();
    },
    init() {
      this.getTableList();
      this.resetSelect();
    },
    async handleChangeTab() {
      this.$nextTick(() => {
        this.init();
      });
    },
    async getTableList() {
      if (this.recipeType === -1) {
        return;
      }
      this.selectedTableList = [];
      const payload = {
        elementName: 'recipe',
        query: `&recipeType=${this.recipeType}`,
      };
      const recipeList = await this.getBasicList(payload);
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
        if (item === 'recipeVersion') {
          obj.cellRendererSelector = () => ({
            component: 'TextBtn',
            params: {
              that: this,
            },
          });
        }
        if (item === 'status') {
          obj.cellRendererSelector = () => ({
            component: 'SwitchBtn',
            params: {
              currowinfo: this, // 当前行的信息
              field: 'status', // 传入的字段
              init: this.refresh, // 重新获取列表
              changeStatus: this.changeRecipeActive, // 返回true或false
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
    async handleUploadRecipe() {
      if (this.selectedTableList.some(({ status }) => +status === 1)) {
        this.setAlert({
          show: true,
          type: 'error',
          message: '选中记录存在未启用数据',
        });
        return;
      }
      const recipeIds = this.selectedTableList.map(({ recipeId }) => recipeId);
      const result = await this.uploadRecipe({ recipeIds });
      if (result) {
        this.handleGetUploadRecipeStatus();
      }
    },
    async handleGetUploadRecipeStatus() {
      this.isUploading = true;
      const uploadRecipeStatus = await this.getUploadRecipeStatus();
      if (uploadRecipeStatus?.length === 0) {
        await this.$getTimeout(1000);
        this.handleGetUploadRecipeStatus();
        return;
      }
      // 0: 下发中，1: 下发成功， 2: 下发失败
      if (uploadRecipeStatus.some(({ status }) => status === '0')) {
        await this.$getTimeout(1000);
        this.handleGetUploadRecipeStatus();
        return;
      }
      this.isUploading = false;
      this.recipeStatusDialog = true;
      this.uploadRecipeStatus = uploadRecipeStatus;
    },
  },
  watch: {
    '$route.query.recipeType': {
      async handler(recipeType) {
        if (!recipeType) {
          return;
        }
        this.recipeType = +recipeType;
      },
      immediate: true,
    },
  },
};
</script>
