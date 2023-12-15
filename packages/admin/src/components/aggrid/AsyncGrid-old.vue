<template>
  <div
    v-if="!isDestroyed"
    id="aggrid"
    :style="`height: ${height}px;position: relative;`"
  >
    <!-- 表格添加虚拟滚动条 -->
    <!-- :debounceVerticalScrollbar="true" -->
    <ag-grid-vue
      id="myGrid"
      ref="agGrid"
      :class="agGridTheme"
      :column-defs="headers"
      :locale-text="agGridLocaleText"
      :style="`height:${pagination?height-32:height}px;`"
      :default-col-def="defaultColDef"
      :grid-options="gridOptions"
      :on-first-data-rendered="onFirstDataRendered"
      :row-selection="rowSelection"
      :side-bar="sideBar"
      :suppress-row-click-selection="true"
      :pagination-auto-page-size="paginationAutoPageSize"
      :pagination="false"
      :row-height="rowHeight"
      :get-row-node-id="getRowNodeId"
      rowModelType="serverSide"
      @row-selected="onRowSelected"
      @selection-changed="onSelectionChanged"
      :stopEditingWhenCellsLoseFocus="true"
      @cellValueChanged="onCellValueChanged"
      :rowClassRules="rowClassRules"
      :rowDragManaged="true"
      @rowDragEnd="onRowDragEnd"
      :autoGroupColumnDef="autoGroupColumnDef"
      :treeData="treeData"
      :getDataPath="getDataPath"
      :suppressPaginationPanel="true"
      @filterChanged="onFilterChanged"
    />
    <div
      v-if="pagination"
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
            @keyup.enter="curPageTextChange"
            @blur="curPageTextChange"
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
      curPage: 1,
      curPageText: 1,
      totalRecords: 0,
      rowData: [],
      rowClassRules: {
        // yellow: 'data.edited',
        // 'highlight-yellow': (params) => params.data.edited,
      },
      defaultOptions: {
        height: document.documentElement.clientHeight - 120,
        rowHeight: 35, // 默认行高
        rowSelection: 'multiple', // 默认多选
        pagination: true,
        defaultColDef: {
          flex: 1,
          minWidth: 150,
          filter: true,
          sortable: true,
          floatingFilter: true,
          resizable: true,
          // 设置勾选全部仅选中当前页面数据
          // headerCheckboxSelectionCurrentPageOnly: true, // serverSide模式下，不支持
        },
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
    },
    method: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    parameters: {
      type: Object,
      default: () => {},
    },
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
    paginationPageSizeOptions() {
      let sizeOptions = [];
      if (this.options.pageSizeOptions?.length) {
        sizeOptions = this.options.pageSizeOptions;
      } else {
        sizeOptions = this.pageOptions;
      }
      const optionArr = sizeOptions.map((item) => {
        if (item === 'all') {
          return {
            text: this.$t('aggrid.all'),
            value: 0, // 0表示全部，单独处理
          };
        }
        return {
          text: item.toString(),
          value: Number(item),
        };
      });
      return optionArr;
    },
    totalPages() {
      if (this.totalRecords) {
        if (this.paginationPageSize) {
          return Math.ceil(this.totalRecords / this.paginationPageSize);
        }
      }
      return 1; // 无数据时默认1页
    },
    // 缓存表格列key
    localKey() {
      const routename = this.$route.name;
      return `${routename}-${this.elementName}`;
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
    // 控制分页组件是否显示
    pagination() {
      if (this.options && this.options.pagination !== undefined) {
        return this.options.pagination;
      }
      return this.defaultOptions.pagination;
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
  },
  watch: {
    url: {
      handler() {
        // console.log('url');
        // url变更时，页码回到第一页
        this.curPage = 1;
        // 清空表格过滤器
        if (this.gridApi.setFilterModel) {
          this.gridApi.setFilterModel(null);
        }
        this.getTableRecords();
      },
      immediate: false,
    },
    parameters: {
      handler() {
        // console.log('parameters');
        // 查询参数变更后，页码也回到第一页
        this.curPage = 1;
        // 清空表格过滤器
        if (this.gridApi.setFilterModel) {
          this.gridApi.setFilterModel(null);
        }
        this.getTableRecords();
      },
      immediate: false,
      deep: true,
    },
    method: {
      handler() {
        // console.log('method');
        // 查询参数变更后，页码也回到第一页
        this.curPage = 1;
        // 清空表格过滤器
        if (this.gridApi.setFilterModel) {
          this.gridApi.setFilterModel(null);
        }
        this.getTableRecords();
      },
      immediate: false,
    },
    agGridLocaleText() {
      this.columnState = this.gridColumnApi.getColumnState();
      // 切换国际化时销毁表格再在下个事件循环中重建表格
      this.isDestroyed = true;
      this.$nextTick(() => {
        this.gridColumnApi.applyColumnState({
          state: this.columnState,
          applyOrder: true,
        });
        this.isDestroyed = false;
      });
    },
    curPage: {
      handler(val) {
        // console.log('curPage');
        this.curPageText = val;
        this.deselectAll();
        // 页码变化时，重载表格
        this.getTableRecords();
      },
      immediate: false,
    },
    paginationPageSize: {
      handler(val) {
        // console.log('paginationPageSize');
        this.$nextTick(() => {
          if (val !== 0) {
            // 若每行页数被清空成null，则设置为默认值15
            this.paginationPageSize = this.paginationPageSize || 15;
          } // 排除0即选择全部的情况
        });
        this.deselectAll();
        // 若当前页大于总页数，跳转到第一页
        if (this.totalPages < this.curPage) {
          this.curPage = 1;
        }
        // 每页选择条数变化时，重新查询数据
        this.getTableRecords();
      },
      immediate: false, // 避免初始化加载时调用
    },
  },
  beforeUpdate() {
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
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    // 设置默认页码
    this.paginationPageSize = this.paginationPageSizeOptions[0].value;
  },
  beforeDestroy() {
    // 缓存列功能开启
    if (this.restoreColumn) {
      // 缓存当前表格列状态
      const columnstate = this.gridColumnApi.getColumnState();
      localStorage.setItem(this.localKey, JSON.stringify(columnstate));
    }
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    // 表格数据初始化加载
    async init() {
      // console.log('init');
      this.curPage = 1;
      this.paginationPageSize = this.paginationPageSizeOptions[0].value;
      await this.getTableRecords();
    },
    getRowNodeId(rowData) {
      // 自定义对象的唯一标识符
      this.gridApi.rowDataId = rowData[this.options.rowDataId] || rowData.id;
      return rowData[this.options.rowDataId] || rowData.id;
    },
    onSelectionChanged() {
      // serverSide模式下，通过表头checkbox选择选项不支持getSelectedNodes或getSelectedRows方法
      // 因此改用getServerSideSelectionState和setServerSideSelectionState来获取和设置选择项
      const selectionStates = this.gridApi.getServerSideSelectionState();
      const { selectAll, toggledNodes } = selectionStates;
      const { rowData } = this;
      let selectedRows = [];
      // 全选
      if (selectAll) {
        selectedRows = rowData.map((item) => {
          const obj = {
            ...item,
          };
          return obj;
        });
      } else if (toggledNodes?.length) {
        const indArr = toggledNodes.map((node) => Number(node));
        selectedRows = rowData.filter((item, index) => indArr.includes(index + 1));
      }
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
    // 找到下一个具有相同 groupName 属性的行，如果已经选中，就清空选择；如果没有选中，就选中
    onRowSelected(param) {
      // 橱柜详情页表格选择逻辑
      if (this.elementName === 'warehouseDetail') {
        // 找到下一个行
        // const nextRow = this.gridApi.getRowNode(param.node.rowIndex + 1);
        const nextRow = this.gridApi.getDisplayedRowAtIndex(param.node.rowIndex + 1);
        if (!param.data.groupName && !nextRow?.data.groupName) {
          return;
        }
        // 判断和当前行是否具有相同的 groupName 属性
        if (nextRow?.data.groupName !== param.data.groupName) {
          return;
        }
        // 如果本行已经选中，就选中下一行；如果本行没有选中，下一行也不选中
        if (param.node.isSelected()) {
          nextRow?.setSelected(true);
        } else {
          nextRow?.setSelected(false);
        }
      }
    },
    onFirstDataRendered(params) {
      params.api.sizeColumnsToFit();
    },
    getHeaders(sourceHeaders) {
      const sourceheaders = sourceHeaders.concat();
      const headers = sourceheaders.map((item) => {
        let obj = {
          ...item,
          // 重写headerName，加入国际化，若未定义headerName则使用field
          headerName: item.headerName ? this.$t(`${item.headerName}`) : item.field,
          headerCheckboxSelectionFilteredOnly: true,
          comparator: this.customComparator, // 增加自定义排序方法
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
    onFilterChanged(params) {
      // 更新行号
      params.api.forEachNode((node, index) => {
        node.setDataValue('no', index + 1);
      });
      // 刷新数据，否则会出现首行消失的问题
      this.gridApi.setRowData(this.rowData);
    },
    onRowDragEnd() {
      const rowsNodeData = [];
      this.gridApi.forEachNode((node) => {
        rowsNodeData.push(node.data);
      });
      // console.log(rowsNodeData, 'rowsNodeData');
      this.$emit('updateRowOrder', rowsNodeData);
    },
    onPaginationInput(page) {
      this.curPage = page;
    },
    // 跳转页码变化，修改当前页
    curPageTextChange() {
      const val = this.curPageText;
      if (!Number(val)) {
        this.curPage = 1;
      } else if (Number(val) > this.totalPages) {
        this.curPage = this.totalPages;
      } else {
        this.curPage = Number(val);
      }
    },
    // 根据条件查询数据并写入表格
    async getTableRecords() {
      const { method, url, parameters } = this; // 接口地址和传参
      const { curPage, paginationPageSize, totalRecords } = this;
      let pageSize = paginationPageSize;
      // pageSize为0时，表示选择全部数据
      if (pageSize === 0) {
        // 选择全部时，设置表格每页行数为当前表格数据长度
        pageSize = totalRecords || 15;
      }
      let query = '';
      if (parameters && Object.keys(parameters).length) {
        // 将params中参数拼接
        query = `?${Object.keys(parameters).map((key) => `${key}=${parameters[key]}`).join('&')}`;
      }
      if (query === '') {
        query += `?pageNum=${curPage}&pageSize=${pageSize}`;
      } else {
        query += `&pageNum=${curPage}&pageSize=${pageSize}`;
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
        const { total } = result;
        this.totalRecords = total || 0;
        if (result.rows?.length) {
          // 保存查到的数据用作选择项筛选的数据源
          this.rowData = result.rows;
          const data = result.rows.map((item, index) => {
            const obj = {
              ...item,
              id: item.id || index + 1, // 必须添加id
              no: index + 1,
            };
            return obj;
          });
          // 设置表格数据
          this.gridApi.setServerSideDatasource({
            getRows: (params) => {
              params.success({
                rowData: data,
                rowCount: data.length, // lastRow,设置当前页数据量
              });
            },
            destroy() {
              // 在组件销毁时，执行清理操作
            },
            refreshCache() {
              // 在需要手动刷新缓存时调用，可选
            },
          });
        } else { // 无数据时清空表格
          this.rowData = [];
          this.gridApi.setServerSideDatasource({
            getRows: (params) => {
              params.successCallback([], total);
            },
          });
        }
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
        width: 80px;
      }

      .ag-rightWidth{
        min-width: 100px;
        width: 140px;
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
