<template>
  <div
    v-if="!isDestroyed"
    id="aggrid"
    :style="`height: ${height}px;position: relative;`"
  >
    <div id="chart" :class="agGridTheme"
      v-show="showChart&&$route.name==='reportsManagement'"></div>
    <!-- 表格添加虚拟滚动条 -->
    <!-- :debounceVerticalScrollbar="true" -->
    <ag-grid-vue
      id="myGrid"
      ref="agGrid"
      :row-data="rowData"
      :rowGroupPanelShow="rowGroupPanelShow"
      :column-defs="headers"
      :class="agGridTheme"
      :animateRows="animateRows"
      :pivotPanelShow="pivotPanelShow"
      :enableCharts="enableCharts"
      :chartThemes="chartThemes"
      :multiSortKey="multiSortKey"
      :locale-text="agGridLocaleText"
      :style="`height:${pagination?height-32:height}px;`"
      :default-col-def="defaultColDef"
      :grid-options="gridOptions"
      :enableRangeSelection="enableRangeSelection"
      :on-first-data-rendered="onFirstDataRendered"
      :row-selection="rowSelection"
      :side-bar="sideBar"
      :suppress-row-click-selection="true"
      :pagination-auto-page-size="paginationAutoPageSize"
      :pagination="pagination"
      :pagination-page-size="paginationPageSize"
      :row-height="rowHeight"
      :get-row-node-id="getRowNodeId"
      @sort-changed="onStateChange"
      @row-selected="onRowSelected"
      @selection-changed="onSelectionChanged"
      :stopEditingWhenCellsLoseFocus="true"
      @cellValueChanged="onCellValueChanged"
      :rowClassRules="rowClassRules"
      :rowDragManaged="true"
      @rowDragEnd="onRowDragEnd"
      :autoGroupColumnDef="autoGroupColumnDef"
      @column-pinned="onStateChange"
      @column-visible="onStateChange"
      @column-resized="onStateChange"
      @column-moved="onStateChange"
      @column-pivot-changed="onStateChange"
      @column-row-group-changed="onStateChange"
      @column-value-changed="onStateChange"
      @first-data-rendered="visualizeData"
      :treeData="treeData"
      :getDataPath="getDataPath"
      :customChartThemes="customChartThemes"
      :suppressPaginationPanel="true"
      @filterChanged="onFilterChanged"
      @column-pivot-mode-changed="onPivotModeChange"
      :groupDisplayType="groupDisplayType"
      @grid-ready="onGridReady"
      @chart-created="onChartCreated"
      :createChartContainer="createChartContainer"
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
            @change="onPaginationPageSizeChanged"
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
import { mapGetters, mapMutations, mapState } from 'vuex';
import NumericCellEditor from './numericCellEditor.vue';

let currentChartRef;
export default {
  name: 'BaseGrid',
  data() {
    return {
      gridApi: {},
      paginationHeight: 32, // 密集主题下分页高度为32
      pageOptions: [15, 25, 100, 1000, 'all'],
      paginationPageSize: 15,
      paginationAutoPageSize: false,
      curPage: 1,
      rowClassRules: {
        yellow: 'data.edited',
      },
      customChartThemes: null,
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
          headerCheckboxSelectionCurrentPageOnly: true,
        },
        gridOptions: {
          groupDefaultExpanded: 1,
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
        rowData: [],
        isNoAlertGrid: false,
        autoGroupColumnDef: null, // 分组列，传参方式可以参考菜单管理以及官方文档
        treeData: false, // 是否为树状结构，传参方式可以参考菜单管理以及官方文档
        getDataPath: null, // 树状路径，传参方式可以参考菜单管理以及官方文档
        chartThemes: [
          'ruhlamatTheme',
          'ag-default',
          'ag-material',
          'ag-pastel',
          'ag-vivid',
          'ag-solar',
        ],
        groupDisplayType: 'singleColumn', // 组显示模式，树状结构用singleColumn，其他分组用groupRows
      },
      isDestroyed: false,
      columnState: null,
    };
  },
  props: {
    options: {
      type: Object,
    },
    elementName: {
      type: String,
      required: true,
    }, // 表名
    restoreColumn: {
      type: Boolean,
    }, // 是否开启缓存表格列功能

  },
  components: {
    AgGridVue,
    NumericCellEditor,
  },
  beforeMount() {
    this.customChartThemes = {
      ruhlamatTheme: {
        baseTheme: 'ag-pastel',
        palette: {
          fills: [
            '#354493',
            '#21C77C',
            '#2A2F36',
            '#01C1E2',
            '#0172CA',
            '#5C68A8',
            '#4CD195',
            '#3E4249',
          ],
          strokes: ['black'],
        },
      },
    };
    // this.chartThemes = [
    //   'ruhlamatTheme',
    //   'ag-default',
    //   'ag-material',
    //   'ag-pastel',
    //   'ag-vivid',
    //   'ag-solar',
    // ];
  },
  computed: {
    ...mapGetters('helper', ['agGridLocaleText', 'agGridTheme']),
    ...mapState('reportsManagement', ['showChart', 'agChartId']),
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
    totalRecords() {
      if (this.rowData?.length) {
        return this.rowData.length;
      }
      return 0;
    },
    totalPages() {
      if (this.rowData?.length) {
        if (this.paginationPageSize) {
          return Math.ceil(this.rowData.length / this.paginationPageSize);
        }
      }
      return 0;
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
    // 表格数据
    rowData() {
      if (this.options?.rowData) {
        return this.options.rowData;
      }
      return this.defaultOptions.rowData;
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
    enableCharts() {
      if (this.options?.enableCharts) {
        return this.options.enableCharts;
      }
      return this.defaultOptions.enableCharts;
    },
    // showChart() {
    //   if (this.options?.showChart) {
    //     return this.options.showChart;
    //   }
    //   return this.defaultOptions.showChart;
    // },
    chartThemes() {
      if (this.options?.chartThemes) {
        return this.options.chartThemes;
      }
      return this.defaultOptions.chartThemes;
    },
    animateRows() {
      if (this.options?.animateRows) {
        return this.options.animateRows;
      }
      return this.defaultOptions.animateRows;
    },
    pivotPanelShow() {
      if (this.options?.pivotPanelShow) {
        return this.options.pivotPanelShow;
      }
      return this.defaultOptions.pivotPanelShow;
    },
    rowGroupPanelShow() {
      if (this.options?.rowGroupPanelShow) {
        return this.options.rowGroupPanelShow;
      }
      return this.defaultOptions.rowGroupPanelShow;
    },
    multiSortKey() {
      if (this.options?.multiSortKey) {
        return this.options.multiSortKey;
      }
      return this.defaultOptions.multiSortKey;
    },
    enableRangeSelection() {
      if (this.options?.enableRangeSelection) {
        return this.options.enableRangeSelection;
      }
      return this.defaultOptions.enableRangeSelection;
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
    groupDisplayType() {
      if (this.options?.groupDisplayType) {
        return this.options.groupDisplayType;
      }
      return this.defaultOptions.groupDisplayType;
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
    rowData: {
      handler(rowData) {
        // 每次 rowData 变化时，回到第一页
        if (this.gridApi.paginationGoToFirstPage) {
          this.gridApi.paginationGoToFirstPage();
          this.curPage = 1;
        }
        // 表格数据变化时清空表格过滤器
        if (this.gridApi.setFilterModel) {
          this.gridApi.setFilterModel(null);
        }
        // 表格每行页数选择全部时，设置表格每页行数为表格数据长度
        if (this.paginationPageSize === 0) {
          this.$nextTick(() => {
            if (this.gridApi.paginationSetPageSize) {
              this.gridApi.paginationSetPageSize(rowData.length);
            }
          });
        }
        // if (rowData.length > 0 && !this.isNoAlertGrid) {
        //   // if (this.gridApi.sizeColumnsToFit) {
        //   //   this.gridApi.sizeColumnsToFit();
        //   // }
        //   this.setAlert({
        //     show: true,
        //     type: 'success',
        //     message: 'successFetchData',
        //   });
        // }
      },
      immediate: true,
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
    paginationPageSize: {
      handler(val) {
        this.$nextTick(() => {
          if (val !== 0) {
            // 若每行页数被清空成null，则设置为默认值15
            this.paginationPageSize = this.paginationPageSize || 15;
          } // 排除0即选择全部的情况
        });
        if (this.gridApi.paginationSetPageSize) {
          if (val === 0) {
            // 选择全部时，设置表格每页行数为表格数据长度
            this.gridApi.paginationSetPageSize(this.rowData.length);
          } else {
            this.gridApi.paginationSetPageSize(val);
          }
        }
      },
      immediate: true,
    },
    report(val) {
      if (val) {
        this.aggFunc = val.aggFunc || null;
      }
      if (val && val.cols) {
        this.columnDefs = val.cols.map((col) => ({
          headerName: this.getHeaderName(col),
          field: col.name,
          colId: col.name,
          filter: this.getColumnFilter(col),
        }));
      }
      if (val && val.reportData) {
        this.rowData = val.reportData;
        this.visualizeData();
      }
    },
  },
  // beforeUpdate() {
  //   // 缓存列功能开启
  //   if (this.restoreColumn) {
  //     // 读取缓存中表格列状态
  //     const columnstate = localStorage.getItem(this.localKey);
  //     if (columnstate) {
  //       this.gridColumnApi.applyColumnState({
  //         state: JSON.parse(columnstate),
  //         applyOrder: true,
  //       });
  //     }
  //   }
  // },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.paginationPageSize = this.paginationPageSizeOptions[0].value;
  },
  // beforeDestroy() {
  //   // 缓存列功能开启
  //   if (this.restoreColumn) {
  //     // 缓存当前表格列状态
  //     const columnstate = this.gridColumnApi.getColumnState();
  //     localStorage.setItem(this.localKey, JSON.stringify(columnstate));
  //   }
  // },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('reportsManagement', ['setGridState', 'setIsPDFVisible', 'setAgChartId']),
    getRowNodeId(rowData) {
      // 自定义对象的唯一标识符
      this.gridApi.rowDataId = rowData[this.options.rowDataId] || rowData.id;
      return rowData[this.options.rowDataId] || rowData.id;
    },
    onSelectionChanged() {
      const selectedRows = this.gridApi.getSelectedRows();
      this.$emit('input', selectedRows);
    },
    onCellValueChanged(params) {
      // this.rowData[params.rowIndex].edited = true;
      // 重新渲染行
      // this.gridApi.redrawRows();
      this.$emit('cellValueChanged', params);
    },
    onPaginationPageSizeChanged() {
      if (this.paginationPageSize) {
        this.$nextTick(() => {
          if (this.gridApi.paginationSetPageSize) {
            this.gridApi.paginationSetPageSize(this.paginationPageSize);
          }
        });
      } else if (this.paginationPageSize === 0) {
        // 选择全部时，设置表格每页行数为当前表格数据长度
        this.$nextTick(() => {
          if (this.gridApi.paginationSetPageSize) {
            this.gridApi.paginationSetPageSize(this.rowData.length);
          }
        });
      }
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
      // console.log(params, 'params');
      // console.log(params.columnApi.getAllGridColumns());
      const columns = params.columnApi.getAllGridColumns();
      if (!columns.some((c) => c.colId === 'no')) {
        return;
      }
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
      // aggrid的第一页是0
      this.gridApi.paginationGoToPage(page - 1);
    },
    onPivotModeChange() {
      this.visualizeData();
    },
    onChartCreated(event) {
      this.setAgChartId(event.chartId);
    },
    // 主动保存状态
    getGridState() {
      // 缓存列功能开启
      if (this.restoreColumn) {
        // 缓存当前表格列状态
        return this.gridColumnApi.getColumnState();
      }
      return null;
    },
    // 主动保存charts状态
    getChartModels() {
      // 缓存列功能开启
      if (this.restoreColumn) {
        // 缓存当前表格列状态
        return this.gridApi.getChartModels();
      }
      return null;
    },
    // 回显表格数据
    showGridInfo(content) {
      // 读取缓存中表格列状态
      const columnstate = content;
      if (columnstate) {
        this.gridColumnApi.applyColumnState({
          state: JSON.parse(columnstate),
          applyOrder: true,
        });
        this.gridApi.collapseAll();
      }
    },
    // 回显charts数据
    restoreChart(content) {
      // 读取缓存中表格列状态
      const columnstate = content;
      if (columnstate) {
        this.gridApi.restoreChart(content);
      }
    },
    clearChart() {
      if (currentChartRef) {
        currentChartRef.destroyChart();
        currentChartRef = undefined;
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
    togglePDF() {
      const pivotColumns = this.gridColumnApi.getPivotColumns();
      if (pivotColumns.length) {
        this.setIsPDFVisible(false);
      } else {
        this.setIsPDFVisible(true);
      }
    },
    onStateChange() {
      this.togglePDF();
      const colState = this.gridColumnApi.getColumnState();
      const groupState = this.gridColumnApi.getColumnGroupState();
      const filterState = this.gridApi.getFilterModel();
      const isPivotMode = this.gridColumnApi.isPivotMode();
      const state = {
        colState,
        groupState,
        filterState,
        isPivotMode,
      };
      this.setGridState(JSON.stringify(state));
    },
    visualizeData() {
      this.clearChart();
      const chartContainer = document.getElementById('chart');
      chartContainer.innerHTML = '';
      chartContainer.style.height = 0;
      if (this.gridColumnApi.isPivotMode()) {
        this.createPivotChart(chartContainer);
      } else {
        this.createRangeChart(chartContainer);
      }
      chartContainer.style.height = '350px';
    },
    createRangeChart(chartContainer) {
      const param = {
        chartType: 'groupedColumn',
        cellRange: {
          columns: this.options.headers.map((c) => c.field),
        },
        aggFunc: this.aggFunc,
        chartThemeOverrides: {
          common: {
            background: {
              visible: false,
            },
            title: {
              enabled: false,
            },
            legend: { enabled: true },
            navigator: {
              enabled: true,
              height: 15,
            },
          },
        },
        chartContainer,
      };
      currentChartRef = this.gridApi.createRangeChart(param);
    },
    createPivotChart(chartContainer) {
      const param = {
        chartType: 'groupedColumn',
        chartThemeOverrides: {
          common: {
            background: {
              visible: false,
            },
            title: {
              enabled: false,
            },
            legend: { enabled: true },
            navigator: {
              enabled: true,
              height: 15,
            },
          },
        },
        chartContainer,
      };
      this.gridApi.createPivotChart(param);
    },
    getColumnFilter(col) {
      const type = col && col.type.toLowerCase();
      switch (type) {
        case 'long':
          return 'agNumberColumnFilter';
        case 'double':
          return 'agNumberColumnFilter';
        case 'number':
          return 'agNumberColumnFilter';
        case 'integer':
          return 'agNumberColumnFilter';
        default:
          return 'agTextColumnFilter';
      }
    },
    createChartContainer(chartRef) {
      if (currentChartRef) {
        currentChartRef.destroyChart();
      }
      const eChart = chartRef.chartElement;
      const eParent = document.querySelector('#chart');
      eParent.appendChild(eChart);
      currentChartRef = chartRef;
    },
  },
};
</script>

<style lang="scss">
@import url('@/assets/css/font.css');
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
    --ag-input-border-color: #D8D8D8;
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
    --ag-input-border-color: #D8D8D8;
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
</style>
