<template>
  <div
    v-if="!isDestroyed"
    id="aggrid"
    :style="`height: ${height}px;position: relative;`"
  >
    <ag-grid-vue
      id="myGrid"
      ref="agGrid"
      :row-data="rowData"
      :class="agGridTheme"
      :column-defs="headers"
      :locale-text="agGridLocaleText"
      :style="`height:${height-paginationHeight}px;`"
      :default-col-def="defaultColDef"
      :grid-options="gridOptions"
      :on-first-data-rendered="onFirstDataRendered"
      :row-selection="rowSelection"
      :side-bar="sideBar"
      :suppress-row-click-selection="true"
      :pagination-auto-page-size="paginationAutoPageSize"
      :pagination="false"
      :pagination-page-size="paginationPageSize"
      :row-height="rowHeight"
      :get-row-node-id="getRowNodeId"
      @selection-changed="onSelectionChanged"
      :stopEditingWhenCellsLoseFocus="true"
      @cellValueChanged="onCellValueChanged"
      :autoGroupColumnDef="autoGroupColumnDef"
      :treeData="treeData"
      :getDataPath="getDataPath"
      :suppressPaginationPanel="true"
      @filterChanged="onFilterChanged"
    />
    <div
      class="paginationPosition"
    >
      <div
        class="ag-pagination d-flex align-center"
        :style="`height: ${paginationHeight}px;`"
      >
        <div class="agText">
          {{ `${$t('aggrid.total', { num: totalRecords })} ` }}
        </div>
        <div class="agText ag-leftWidth">
          {{ `${$t('aggrid.rowsperpage')}: ` }}
        </div>
        <div class="">
          <v-select
            v-model="paginationPageSize"
            :items="paginationPageSizeOptions"
            :menu-props="{ top: true, offsetY: true }"
            dense
            outlined
            small
            hide-details
            width="80"
            class="ag-select align-self-center"
          />
        </div>
        <v-spacer></v-spacer>
        <v-pagination
          v-model="curPage"
          :length="totalPages"
          :total-visible="7"
          color="primary"
          navigation-color="pagenav"
          @input="onPaginationInput"
        ></v-pagination>
        <div class="agText ag-rightWidth ml-6 d-flex align-center">
          <span class="mr-1">{{$t('aggrid.stepTo')}}</span>
          <v-text-field
            outlined
            class="ag-input"
            dense
            hide-details
            v-model="curPageText"
          ></v-text-field>
          <span class="ml-1">{{$t('aggrid.page')}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css'; // aggrid改为密集主题
import 'ag-grid-community/styles/agGridBalhamFont.css';
import { AgGridVue } from 'ag-grid-vue';
import { mapGetters, mapMutations } from 'vuex';
import NumericCellEditor from './numericCellEditor.vue';

export default {
  name: 'AsyncGrid',
  data() {
    return {
      gridApi: {},
      paginationHeight: 32, // 密集主题下分页高度为32
      // pageOptions: [15, 25, 100, 1000, 'all'],
      pageOptions: [15, 25, 100, 1000],
      paginationPageSize: 15,
      paginationAutoPageSize: false,
      curPage: 1, // 当前页
      totalRecords: 0, // 总条数
      totalPages: 0, // 总页数
      rowData: [], // 表格数据
      defaultOptions: {
        height: document.documentElement.clientHeight - 120,
        rowHeight: 35, // 默认行高
        rowSelection: 'multiple', // 默认多选
        pagination: false,
        defaultColDef: {
          flex: 1,
          minWidth: 150,
          filter: true,
          sortable: true,
          floatingFilter: true,
          resizable: true,
          // 设置勾选全部仅选中当前页面数据
          headerCheckboxSelectionCurrentPageOnly: true,
        },
        enableRangeSelection: true,
        gridOptions: {
          groupDefaultExpanded: -1,
          // 禁用表格编辑功能
          getRowStyle(params) {
            if (params?.data?.disableEdit) {
              return { 'pointer-events': 'none', opacity: 0.5 };
            }
            return null;
          },
        },
        sideBar: {
          toolPanels: [
            {
              id: 'columns',
              labelDefault: 'Columns',
              labelKey: 'columns',
              iconKey: 'columns',
              toolPanel: 'agColumnsToolPanel',
              toolPanelParams: {
                suppressPivots: false,
                suppressPivotMode: false,
                suppressRowGroups: false,
                suppressValues: false,
                suppressColumnFilter: false,
                suppressColumnSelectAll: false,
                suppressColumnExpandAll: false,
              },
            },
            {
              id: 'filters',
              labelDefault: 'Filters',
              labelKey: 'filters',
              iconKey: 'filter',
              toolPanel: 'agFiltersToolPanel',
            },
          ],
          position: 'right',
          defaultToolPanel: 'columns',
        },
        isNoAlertGrid: false,
        autoGroupColumnDef: null, // 分组列，传参方式可以参考菜单管理以及官方文档
        treeData: false, // 是否为树状结构，传参方式可以参考菜单管理以及官方文档
        getDataPath: null, // 树状路径，传参方式可以参考菜单管理以及官方文档
      },
      isDestroyed: false,
      columnState: null,
    };
  },
  props: {
    options: {
      type: Object,
    }, // 表格配置
    method: {
      type: String,
      required: true,
    }, // 请求方法
    url: {
      type: String,
      required: true,
    }, // 请求地址
    parameters: {
      type: Object,
      default: () => {},
    }, // 请求参数
    elementName: {
      type: String,
      required: false,
    }, // 表名
    restoreColumn: {
      type: Boolean,
    }, // 是否开启缓存表格列功能
  },
  components: {
    AgGridVue,
    NumericCellEditor,
  },
  computed: {
    ...mapGetters('helper', ['agGridLocaleText', 'agGridTheme']),
    // 每页行数下拉选项
    paginationPageSizeOptions() {
      let sizeOptions = [];
      if (this.options.pageSizeOptions?.length) {
        sizeOptions = this.options.pageSizeOptions;
      } else {
        sizeOptions = this.pageOptions;
      } // 用户未定义时，使用默认
      const optionArr = sizeOptions.map((item) => {
        if (item === 'all') {
          return {
            text: this.$t('aggrid.all'),
            value: 0, // 0表示全部，单独处理
          };
        } // 真分页目前不支持全部
        return {
          text: item.toString(),
          value: Number(item),
        };
      });
      return optionArr;
    },
    // 缓存表格列key
    localKey() {
      // const routename = this.$route.name;
      // return `${routename}-${this.elementName}`;
      return this.elementName;
    },
    // 表头设置
    headers: {
      get() {
        if (this.options?.headers) {
          return this.getHeaders(this.options.headers);
        }
        return [];
      },
      set(val) {
        this.headers = val;
      },
    },
    // 表格行选择方式
    rowSelection() {
      if (this.options?.rowSelection) {
        return this.options.rowSelection;
      }
      return this.defaultOptions.rowSelection;
    },
    height() {
      if (this.options?.height) {
        return this.options.height;
      }
      return this.defaultOptions.height;
    },
    defaultColDef() {
      if (this.options?.defaultColDef) {
        return {
          ...this.defaultOptions.defaultColDef,
          ...this.options.defaultColDef,
        };
      }
      return {
        ...this.defaultOptions.defaultColDef,
      };
    },
    gridOptions() {
      if (this.options?.gridOptions) {
        return {
          ...this.defaultOptions.gridOptions,
          ...this.options.gridOptions,
        };
      }
      return {
        ...this.defaultOptions.gridOptions,
      };
    },
    sideBar() {
      if (this.options?.sideBar) {
        return this.options.sideBar;
      }
      return this.defaultOptions.sideBar;
    },
    rowHeight() {
      if (this.options?.rowHeight) {
        return this.options.rowHeight;
      }
      return this.defaultOptions.rowHeight;
    },
    isNoAlertGrid() {
      if (this.options?.isNoAlertGrid) {
        return this.options.isNoAlertGrid;
      }
      return this.defaultOptions.isNoAlertGrid;
    },
    autoGroupColumnDef() {
      if (this.options?.autoGroupColumnDef) {
        return {
          ...this.options.autoGroupColumnDef,
          headerName: this.options.autoGroupColumnDef.headerName ? this.$t(`${this.options.autoGroupColumnDef.headerName}`) : '',
        };
      }
      return this.defaultOptions.autoGroupColumnDef;
    },
    treeData() {
      if (this.options?.treeData) {
        return this.options.treeData;
      }
      return this.defaultOptions.treeData;
    },
    getDataPath() {
      if (this.options?.getDataPath) {
        return this.options.getDataPath;
      }
      return this.defaultOptions.getDataPath;
    },
    curPageText: {
      get() {
        return this.curPage;
      },
      set(val) {
        if (!Number(val)) {
          this.gridApi.paginationGoToPage(0);
          this.curPage = 1;
        } else if (Number(val) > this.totalPages) {
          this.gridApi.paginationGoToPage(this.totalPages - 1);
          this.curPage = this.totalPages;
        } else {
          this.gridApi.paginationGoToPage(Number(val) - 1);
          this.curPage = Number(val);
        }
      },
    },
  },
  watch: {
    // 监听请求地址
    url: {
      handler() {
        // url变更时，页码回到第一页
        this.curPage = 1;
        // 清空表格过滤器
        if (this.gridApi.setFilterModel) {
          this.gridApi.setFilterModel(null);
        }
        // 重新加载表格数据
        this.getTableRecords();
      },
      immediate: false, // 避免初始化加载时调用
    },
    // 监听请求参数
    parameters: {
      handler() {
        // 查询参数变更后，页码也回到第一页
        this.curPage = 1;
        // 清空表格过滤器
        if (this.gridApi.setFilterModel) {
          this.gridApi.setFilterModel(null);
        }
        this.getTableRecords();
      },
      immediate: false, // 避免初始化加载时调用
      deep: true,
    },
    // 监听请求方式
    method: {
      handler() {
        // 请求方式变更后，页码也回到第一页
        this.curPage = 1;
        // 清空表格过滤器
        if (this.gridApi.setFilterModel) {
          this.gridApi.setFilterModel(null);
        }
        this.getTableRecords();
      },
      immediate: false, // 避免初始化加载时调用
    },
    agGridLocaleText() {
      // this.columnState = this.gridColumnApi.getColumnState();
      // // 切换国际化时销毁表格再在下个事件循环中重建表格
      // this.isDestroyed = true;
      // this.$nextTick(() => {
      //   this.gridColumnApi.applyColumnState({
      //     state: this.columnState,
      //     applyOrder: true,
      //   });
      //   this.isDestroyed = false;
      // });
    },
    // 监听当前页码
    curPage: {
      handler() {
        // 页码变化时，取消选中，重载表格
        this.deselectAll();
        this.getTableRecords();
      },
      immediate: false, // 避免初始化加载时调用
    },
    // 监听每页显示条数
    paginationPageSize: {
      handler(val) {
        this.$nextTick(() => {
          if (val !== 0) {
            // 若每行页数被清空成null，则设置为默认值15
            this.paginationPageSize = this.paginationPageSize || 15;
          } // 排除0即选择全部的情况
        });
        this.deselectAll();
        // 每页选择条数变化时，重新查询数据
        this.getTableRecords();
      },
      immediate: false, // 避免初始化加载时调用
    },
  },
  beforeUpdate() {
    this.hanldeRestoreColumn();
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    // 设置默认页码
    this.paginationPageSize = this.paginationPageSizeOptions[0].value;
    this.hanldeRestoreColumn();
    window.addEventListener('beforeunload', () => {
      this.hanldeStoreColumn();
    });
  },
  beforeDestroy() {
    this.hanldeStoreColumn();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    // 表格数据初始化加载
    async init() {
      this.curPage = 1;
      this.paginationPageSize = this.paginationPageSizeOptions[0].value;
      await this.getTableRecords();
    },
    // 计算分页数据
    initPagination(total) {
      if (total && this.paginationPageSize) {
        this.totalPages = Math.ceil(total / this.paginationPageSize);
      } else {
        this.totalPages = 0;
      }
      // 若当前页大于总页数，跳转到第一页
      if (this.totalPages < this.curPage) {
        this.curPage = 1;
      }
    },
    getRowNodeId(rowData) {
      // 自定义对象的唯一标识符
      this.gridApi.rowDataId = rowData[this.options.rowDataId] || rowData.id;
      return rowData[this.options.rowDataId] || rowData.id;
    },
    // 选中行变化事件
    onSelectionChanged() {
      const selectedRows = this.gridApi.getSelectedRows();
      this.$emit('input', selectedRows);
    },
    // 取消全选
    deselectAll() {
      if (this.gridApi.deselectAll) {
        this.gridApi.deselectAll();
      }
    },
    onCellValueChanged(params) {
      // this.rowData[params.rowIndex].edited = true;
      // 重新渲染行
      // this.gridApi.redrawRows();
      this.$emit('cellValueChanged', params);
    },
    onFirstDataRendered(params) {
      params.api.sizeColumnsToFit();
    },
    getHeaders(sourceHeaders) {
      const sourceheaders = sourceHeaders.concat();
      const headers = sourceheaders.map((item) => {
        const headerName = item.headerName ? this.$t(`${item.headerName}`) : item.field;
        // 把单个中文字符转换成两个其他字符
        // const headerLength = headerName.replace(/[\u4e00-\u9fa5]/g, '00').length;
        let obj = {
          ...item,
          // 重写headerName，加入国际化，若未定义headerName则使用field
          headerName,
          headerCheckboxSelectionFilteredOnly: true,
          comparator: this.customComparator, // 增加自定义排序方法
          // 根据字符长度设置最小列宽
          // minWidth: headerLength < 10 ? 120 : headerLength * 12,
        };
        obj = {
          ...obj,
          cellStyle: { textAlign: item.align || 'left' }, // 单元格默认左对齐
        };
        // 序号根据当前行索引编号
        if (item.field === 'no') {
          obj = {
            ...obj,
            filter: false,
            minWidth: 100,
            // eslint-disable-next-line
            valueGetter: (params) => {
              return params.node.rowIndex + 1;
            },
          };
        }
        // 如果是数字类型，加入数字编辑器
        if (item.editable && item.cellType === 'number') {
          obj = {
            ...obj,
            cellEditor: 'NumericCellEditor',
          };
        }
        return obj;
      });
      return headers || [];
    },
    customComparator(valueA, valueB) {
      // 将值转为实际数字进行比较
      const numberA = parseFloat(valueA);
      const numberB = parseFloat(valueB);
      // 非数字
      if (Number.isNaN(numberA) || Number.isNaN(numberB)) {
        if (valueA === valueB) {
          return 0;
        }
        return (valueA > valueB) ? 1 : -1;
      }
      // 数字判断
      return numberA - numberB;
    },
    onFilterChanged() {
      // 刷新数据，否则会出现首行消失的问题
      this.gridApi.setRowData(this.rowData);
      // 获取筛选后全部数据
      const tableRows = this.gridApi.getModel().rowsToDisplay;
      this.initPagination(tableRows.length);
    },
    onPaginationInput(page) {
      this.curPage = page;
    },
    // 根据条件查询数据并写入表格
    async getTableRecords() {
      const { method, url, parameters } = this; // 接口地址和传参
      const { curPage, paginationPageSize } = this;
      let query = '';
      if (parameters && Object.keys(parameters).length) {
        // 将params中参数拼接
        query = `?${Object.keys(parameters).map((key) => `${key}=${parameters[key]}`).join('&')}`;
      }
      if (query === '') {
        query += `?pageNum=${curPage}&pageSize=${paginationPageSize}`;
      } else {
        query += `&pageNum=${curPage}&pageSize=${paginationPageSize}`;
      }
      const completeUrl = `${url}${query}`;
      let result = null;
      // 默认使用get请求查询表格数据
      if (method === 'basicGet') {
        result = await this.$basicGet(completeUrl);
      } else {
        result = await this.$systemGet(completeUrl);
      }
      if (result) {
        const { total, rows } = result;
        // 获取总条数
        this.totalRecords = total || 0;
        if (rows?.length) {
          // 获取数据写入表格
          const list = rows.map((item, index) => {
            const obj = {
              ...item,
              id: item.id || index + 1, // 必须添加id
              no: index + 1,
            };
            return obj;
          });
          this.rowData = list;
          // 加载表格后初始化分页数据
          this.initPagination(total);
        } else { // 无数据时清空表格
          this.rowData = [];
          this.initPagination(0);
        }
      } else {
        this.rowData = [];
        this.initPagination(0);
      }
    },
    hanldeRestoreColumn() {
      // 缓存列功能开启
      if (this.restoreColumn) {
        // 读取缓存中表格列状态
        const columnstate = localStorage.getItem(this.localKey);
        if (columnstate) {
          this.gridColumnApi.applyColumnState({
            state: JSON.parse(columnstate),
            applyOrder: true,
          });
        }
      }
    },
    hanldeStoreColumn() {
      // 缓存列功能开启
      if (this.restoreColumn) {
        // 缓存当前表格列状态
        const columnstate = this.gridColumnApi.getColumnState();
        localStorage.setItem(this.localKey, JSON.stringify(columnstate));
      }
    },
  },
};
</script>
<style lang="scss">
  .ag-theme-balham {
    --ag-balham-active-color: var(--v-primary-base);
    --ag-background-color: var(--v-bg-base);
    --ag-data-color: #55575B;
    --ag-header-foreground-color: #303133;
    --ag-header-background-color: var(--v-active-base);
    --ag-odd-row-background-color: var(--v-bg-base);
    --ag-row-hover-color: var(--v-tag2-base);
    --ag-selected-row-background-color: var(--v-selected-base);
    --ag-border-color: transparent;
    --ag-row-border-color: #EDEDF5;
     --ag-input-disabled-background-color: #EEEEF0;
    --ag-input-disabled-border-color: #EEEEF0;
    --ag-input-border-color: #8797CF;
    --ag-secondary-foreground-color: #606266;
    --ag-font-family: siyuanheiti;
    --ag-font-size: 14px;
  }

  .ag-theme-balham-dark {
    --ag-balham-active-color: var(--v-primary-base);
    --ag-background-color: var(--v-bg-base);
    --ag-data-color: #EDEDED;
    --ag-header-foreground-color: #FFFFFF;
    --ag-header-background-color: var(--v-active-base);
    --ag-odd-row-background-color: var(--v-bg-base);
    --ag-row-hover-color: var(--v-bg-lighten1);
    --ag-selected-row-background-color: var(--v-selected-base);
    --ag-border-color: transparent;
    --ag-row-border-color: #434354;
    --ag-input-disabled-background-color: #484F68;
    --ag-input-disabled-border-color: #484F68;
    --ag-input-border-color: #8797CF;
    --ag-font-family: siyuanheiti;
    --ag-font-size: 14px;
  }

  .ag-header-row-column-filter {
    background-color: var(--v-bg-base) !important;
    .ag-floating-filter-button {
      color: var(--v-subtitle-base) !important;
    }
  }

  .aggrid-container {
    border: 1px solid #babfc7;
    border-top: none;
  }

  .theme--dark .aggrid-container {
    border: 1px solid #68686e;
    border-top: none;
  }

  .alignRight {
    text-align: center;
    float: right;
  }

  .agPageText {
    max-width: 100px;
    min-width: 55px;
    width: auto;
  }

  .disabledColor {
    color: rgba(24,29,31,.5);
  }

  .weightColor {
    font-weight: 700;
  }

  .theme--dark .disabledColor {
    color: rgba(255,255,255,.5);
  }

  .paginationPosition {
    position: absolute;
    bottom: 0px;
    width: 100%;
    .ag-pagination {
      .v-text-field {
        margin-top: 0px!important;
      }
      .agText {
        text-align: center;
        line-height: 32px;/* 与ag-grid分页的高度保持一致 */
        font-size: 14px;
        cursor: default;
      }

      .ag-leftWidth{
        min-width: 60px;
        // width: 80px;
        text-align: right;
        padding-right: 10px;
        padding-left: 10px;
      }

      .ag-rightWidth{
        min-width: 100px;
        width: 150px;
      }

      .ag-select {
        height: 24px;
        line-height: 24px;/* 与ag-grid分页的高度保持一致 */
        min-width: 60px;
        max-width: 90px;
        .v-select__selection {
          font-size: 13px!important;
        }
        .v-input__control {
          height: 24px;
          .v-input__slot {
            min-height: 24px !important;
            .v-input__append-inner {
              margin-top: 1px !important;
            }
          }
        }
      }
      .v-pagination {
        .v-pagination__item {
          background-color: var(--v-pagenav-base);
          height: 24px;
          min-width: 24px;
          font-size: 0.85rem;
          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0),
            0px 2px 2px 0px rgba(0, 0, 0, 0),
            0px 1px 5px 0px rgba(0, 0, 0, 0);
        }
        .v-pagination__navigation {
          height: 24px;
          width: 24px;
          margin: 0.3rem 4px;
          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0),
            0px 2px 2px 0px rgba(0, 0, 0, 0),
            0px 1px 5px 0px rgba(0, 0, 0, 0);
        }
      }
      .ag-input {
        height: 24px;
        min-width: 30px;
        max-width: 50px;
        .v-text-field__slot {
          font-size: 13px!important;
        }
        .v-input__control {
          height: 24px;
          .v-input__slot {
            min-height: 24px !important;
            .v-input__append-inner {
              margin-top: 1px !important;
            }
          }
        }
      }
    }
  }

  .highlight-yellow {
    background-color: yellow;
  }
</style>
