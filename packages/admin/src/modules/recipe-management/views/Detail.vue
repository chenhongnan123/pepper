<template>
  <v-container fluid>
    <portal to="app-header"
      v-if="pagePortalMode.recipeManagementDetail">
      <v-btn
        icon
        small
        class="mr-2 mb-1"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ $t(`recipeManagement.table.${moduleName}`) }}
      <v-btn icon small class="ml-2 mb-1" @click="refresh">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card height="77" class="mb-3" elevation="0" color="bg">
          <div class="d-flex align-center px-4" style="height: 100%">
            <div class="d-flex">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                  style="width: 220px;"
                  class="mt-5 mr-4"
                  :label="`${$t('recipeManagement.table.recipeVersion')}`"
                  :value="recipe.recipeVersion"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
                </template>
                <span>{{recipe.recipeVersion}}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                  style="width: 100px;"
                  class="mt-5 mr-4"
                  :label="`${$t('recipeManagement.table.deviceNumber')}`"
                  :value="recipe.deviceNumber"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
                </template>
                <span>{{recipe.deviceNumber}}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                  style="width: 100px;"
                  class="mt-5 mr-4"
                  :label="`${$t('recipeManagement.table.deviceName')}`"
                  :value="recipe.deviceName"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
                </template>
                <span>{{recipe.deviceName}}</span>
              </v-tooltip>
            </div>
            <v-spacer></v-spacer>
            <!-- eslint-disable-next-line -->
            <input
            type="file"
            accept=".xlsx"
            ref="uploader"
            class="d-none"
            id="uploadFiles"
            v-if="isBtnAccess('basic:recipe:import')"
            @change="onFilesChanged">
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="success"
              @click="clickImportBtn"
              v-if="isBtnAccess('basic:recipe:import')"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('btn.import') }}
            </v-btn>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="success"
              @click="handleDownloadTemplate"
              v-if="isBtnAccess('basic:recipe:template')"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('btn.downloadTemplate') }}
            </v-btn>
            <v-btn
              small
              class="text-none mr-2"
              color="primary"
              :disabled="saveBtnDisabled"
              @click="handleSave"
            >
              <v-icon left small>mdi-plus</v-icon>
              {{ $t('btn.save') }}
            </v-btn>
          </div>
        </v-card>
        <v-card :height="tableHeight" class="" elevation="0" color="bg">
          <v-row no-gutters class="pa-4">
            <v-col>
              <base-grid
                class="recipeManagementDetail"
                ref="recipeManagementDetailGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="options"
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
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';

export default {
  name: 'recipeManagementDetail',
  data() {
    return {
      elementName: 'recipeManagementDetail',
      tableHeight: document.body.clientHeight - 210,
      keyWrapper: {
        componentKey: 0,
      },
      recipe: {},
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        rowDataId: 'recipeId',
        pageSize: 15,
        pagination: false,
        defaultColDef: {
          minWidth: 10,
          flex: 0,
          filter: false,
          floatingFilter: false,
          resizable: true,
          suppressMenu: true,
          sortable: false,
          editable: true,
        },
      },
      recipeManagementDetailGrid: null,
      saveBtnDisabled: true,
      showCellClass: false, // 是否展示红色背景
    };
  },
  components: {
    BaseGrid,
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.isFallhead ? 'recipeManagementFallheadDetail' : 'recipeManagementSinteringDetail';
    },
    recipeType() {
      // 0:坠头配方，1: 烧结配方
      return +this.$route.query.recipeType;
    },
    recipeId() {
      return this.$route.params.recipeId;
    },
    jsonFileName() {
      return this.isFallhead ? 'fallhead' : 'sintering';
    },
    isFallhead() {
      return this.recipeType === 0;
    },
  },
  mounted() {
    this.recipeManagementDetailGrid = this.$refs.recipeManagementDetailGrid.gridApi;
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions('recipeManagement', ['getFileJson', 'getItem', 'getSystemList', 'addRecipeDetail', 'getBasicList']),
    ...mapMutations('helper', ['setAlert']),
    refresh() {
      this.init();
    },
    async init() {
      this.isInitializing = true;
      this.saveBtnDisabled = true;
      this.showCellClass = false;
      await this.getRecipe();
      await this.initTableHeaders();
      await this.initTableRows();
      await this.getParameterRangeList();
      this.isInitializing = false;
    },
    async getRecipe() {
      const payload = {
        elementName: `recipe/${this.recipeId}`,
      };
      const recipe = await this.getItem(payload);
      if (recipe) {
        this.recipe = recipe;
      }
    },
    clickImportBtn() {
      this.$refs.uploader.click();
    },
    async onFilesChanged(event) {
      const file = event.target.files[0];
      this.$importXlsxData(file, (excelDataList) => {
        // 对于坠头 excelTableHeaderObj = { A: 'A', …… , k: 'k' }
        // 对于烧结 excelTableHeaderObj = { A: 'A', …… , BB: 'BB' }
        const excelTableHeaderObj = excelDataList.find((item) => item.A === 'A');
        // 过滤掉坠头、烧结配方的表头，烧结配方的修改范围
        const excelTableDataList = excelDataList.filter((item) => this.$getIsNumber(item.A));
        if (!excelTableHeaderObj || excelTableDataList.length === 0) {
          this.setAlert({
            show: true,
            type: 'error',
            message: '表格数据存在问题',
          });
          document.getElementById('uploadFiles').value = null;
          return;
        }
        const tableDataList = [];
        excelTableDataList.forEach((item) => {
          const keys = Object.keys(excelTableHeaderObj);
          const tableDataObj = {};
          for (let k = 0; k < keys.length; k += 1) {
            tableDataObj[excelTableHeaderObj[keys[k]]] = item[keys[k]];
          }
          tableDataList.push(tableDataObj);
        });
        const rowData = [...this.options.rowData];
        this.options.rowData = rowData.map((rowItem) => {
          const excelTableItem = tableDataList.find(({ A }) => rowItem.A === A);
          if (excelTableItem) {
            return {
              ...rowItem,
              ...excelTableItem,
            };
          }
          return rowItem;
        });
        this.saveBtnDisabled = false;
        document.getElementById('uploadFiles').value = null;
      });
    },
    handleDownloadTemplate() {
      const params = {
        fileName: `${this.$t(`recipeManagement.table.${this.moduleName}`)}模板.xlsx`,
      };
      this.recipeManagementDetailGrid.exportDataAsExcel(params);
    },
    async handleSave() {
      this.showCellClass = true;
      this.options.rowData = [...this.options.rowData];
      await this.$getTimeout(100);
      const cellRuleResult = this.vertifyCellRule(this.options.rowData);
      if (!cellRuleResult.every((i) => i)) {
        this.setAlert({
          show: true,
          type: 'error',
          message: '表格数据必须为数字',
        });
        return;
      }
      const {
        recipe: {
          recipeId,
        },
        recipeType,
      } = this;
      const rowData = JSON.parse(JSON.stringify(this.options.rowData))
        .filter(({ A }) => !!A);
      this.removeCellRuleTag(rowData);
      const tablePositionJson = JSON.stringify(rowData);
      const payload = {
        recipeId,
        tablePositionJson,
      };
      const addResult = await this.addRecipeDetail(payload);
      if (addResult) {
        this.saveBtnDisabled = true;
        this.$router.push({ path: `/recipe-management/detail/${addResult.data}?recipeType=${recipeType}` });
        this.$nextTick(() => {
          this.init();
        });
      }
    },
    vertifyCellRule(rowData) {
      const cellRuleResult = rowData.map((item) => {
        const keys = Object.keys(item);
        for (let k = 0; k < keys.length; k += 1) {
          if (keys[k].includes('compare')) {
            const compareValue = item[keys[k]];
            if (!compareValue) {
              return false;
            }
          }
        }
        return true;
      });
      return cellRuleResult;
    },
    // 删除对象中的compare、origin开头的字段
    removeCellRuleTag(rowData) {
      rowData.forEach((item) => {
        const keys = Object.keys(item);
        for (let k = 0; k < keys.length; k += 1) {
          if (keys[k].includes('origin') || keys[k].includes('compare')) {
            delete item[keys[k]];
          }
        }
      });
    },
    goBack() {
      this.$router.push({ name: 'recipeManagement', query: { recipeType: this.recipeType } });
    },
    cellRenderer(params) {
      const {
        data, // 当前行数据
        colDef,
        rowIndex, // 当前的索引
      } = params;
      const value = typeof params.value === 'undefined' ? '' : params.value;
      const { rowData } = this.options;
      const { field } = colDef;
      const originValue = data[`origin${field}`]; // 取出原始值
      const style = 'background-color: var(--v-error-lighten3);';
      const cellHtml = `<div style="${style};width:100%;height:100%;">${value}</div>`;
      if (!this.showCellClass) {
        data[`compare${field}`] = true;
        return value;
      }
      if (this.isFallhead) {
        if (!this.$getIsNumber(value)) {
          data[`compare${field}`] = false;
          return cellHtml;
        }
        data[`compare${field}`] = true; // 坠头配方返回true，不进行对比
        return value;
      }
      // 烧结配方，排除第一行修改范围，输入非数字返回红色背景，用于提示
      if (!this.$getIsNumber(value) && rowIndex !== 0) {
        data[`compare${field}`] = false;
        return cellHtml;
      }
      // 修改范围这一行，不做限制
      if (rowIndex === 0) {
        return value;
      }
      if (!this.$getIsNumber(originValue)) {
        data[`compare${field}`] = true;
        return value;
      }
      if (!rowData[0][field]) {
        data[`compare${field}`] = true;
        return value;
      }
      // 如果修改的值大于修改的范围，需要带上红色背景，并把compare设为false
      if (Math.abs(+originValue - +value) > rowData[0][field]) {
        data[`compare${field}`] = false;
        return cellHtml;
      }
      data[`compare${field}`] = true;
      return value;
    },
    preventDefaultFirstRow() {
      // 不可编辑状态，通过键盘上下键+回车仍可编辑
      // 阻止键盘点击事件
      const agRowFirst = document.querySelector('.recipeManagementDetail .ag-row-first');
      if (agRowFirst) {
        agRowFirst.addEventListener('keydown', (event) => {
          event.preventDefault();
        });
      }
    },
    async initTableHeaders() {
      const fallheadHeaderJson = await this.getFileJson(`config/recipe-${this.jsonFileName}-header.json`);
      this.options.headers = this.setHeaderFormat(fallheadHeaderJson);
    },
    setHeaderFormat(fallheadHeaderJson) {
      for (let i = 0; i < fallheadHeaderJson.length; i += 1) {
        if (fallheadHeaderJson[i].children) {
          this.setHeaderFormat(fallheadHeaderJson[i].children);
          // 过滤 A、B两列
        } else if (fallheadHeaderJson[i].field !== 'A' && fallheadHeaderJson[i].field !== 'B') {
          fallheadHeaderJson[i].cellRenderer = this.cellRenderer;
        }
      }
      return fallheadHeaderJson;
    },
    async initTableRows() {
      const rows = [];
      const fallheadRowJson = await this.getFileJson(`config/recipe-${this.jsonFileName}-row.json`);
      const { step, rowKeys } = fallheadRowJson;
      for (let i = 0; i < step.length; i += 1) {
        const rowItem = {};
        for (let k = 0; k < rowKeys.length; k += 1) {
          if (rowKeys[k] === 'A') {
            rowItem[rowKeys[k]] = i + 1; // A列，赋值为 索引+1
          } else if (rowKeys[k] === 'B') {
            rowItem[rowKeys[k]] = step[i]; // B列，赋值为 步骤一、二等
          } else {
            rowItem[rowKeys[k]] = ''; // C1-BB23列赋值为 ''
          }
        }
        rows.push(rowItem);
      }
      this.options.rowData = rows;
      this.initTableData();
    },
    async initTableData() {
      const tableDataList = await this.getBasicList({
        elementName: 'table',
        query: `&recipeId=${this.recipeId}`,
      });
      if (!tableDataList) {
        return;
      }
      if (!tableDataList[0]) {
        return;
      }
      const [{ tablePositionJson }] = tableDataList;
      if (!this.$getIsJson(tablePositionJson)) {
        return;
      }
      const tableData = JSON.parse(tablePositionJson);
      if (tableData.length === 0) {
        return;
      }
      const rowData = this.options.rowData.map((item) => {
        // A是序号，根据序号找到对应的一行数据
        const matchItem = tableData.find(({ A }) => +item.A === +A);
        if (matchItem) {
          const obj = {
            ...item,
            ...matchItem,
          };
          const keys = Object.keys(obj);
          keys.forEach((key) => {
            // originA 是初次从接口获取的
            obj[`origin${key}`] = obj[key];
          });
          return obj;
        }
        return item;
      });
      this.options.rowData = rowData;
    },
    async getParameterRangeList() {
      if (this.isFallhead) {
        await this.$getTimeout(100);
        this.saveBtnDisabled = true;
        return;
      }
      // 烧结配方需要有参数的修改范围
      const payload = {
        elementName: 'dict/data',
        query: '&dictType=recipe_management_fallhead',
      };
      // 获取参数修改范围
      const parameterRangeList = await this.getSystemList(payload);
      const parameterRange = {
        B: '修改范围',
        disableEdit: true,
      };
      if (parameterRangeList) {
        parameterRangeList.forEach(({ dictLabel, dictValue }) => {
          parameterRange[dictLabel] = +dictValue;
        });
      }
      this.options.rowData.unshift(parameterRange);
      this.saveBtnDisabled = true;
      await this.$getTimeout(2000);
      this.preventDefaultFirstRow();
    },
  },
  watch: {
    'options.rowData': {
      handler() {
        if (!this.isInitializing) {
          this.saveBtnDisabled = false;
        }
      },
      deep: true,
    },
  },
};
</script>
