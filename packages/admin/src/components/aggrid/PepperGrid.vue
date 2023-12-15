<template>
  <ag-grid-vue
    :rowData="rowData"
    :columnDefs="headers"
    :class="agGridTheme"
    :localeText="agGridLocaleText"
    :style="`height:${height};`"
    :defaultColDef="defaultColDef"
    :gridOptions="gridOptions"
    :rowSelection="rowSelection"
    @selection-changed="onSelectionChanged"
    :suppressRowClickSelection="true"
    :pagination="pagination"
    :paginationPageSize="paginationPageSize"
    :paginationAutoPageSize="!paginationPageSize"
  ></ag-grid-vue>
</template>

<script>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
// import '@/assets/styles/aggrid/ag-theme-material.css';
// import '@/assets/styles/aggrid/ag-theme-material-dark.css';
// import 'ag-grid-community/styles/ag-theme-material.css';
import { AgGridVue } from 'ag-grid-vue';
import { mapGetters } from 'vuex';

export default {
  name: 'PepperGrid',
  data() {
    return {
      gridApi: {},
    };
  },
  props: {
    options: {
      type: Object,
    },
    value: {
      options: {
        type: Array,
      },
    },
  },
  components: {
    AgGridVue,
  },
  computed: {
    ...mapGetters('helper', ['agGridLocaleText', 'agGridTheme']),
    headers() {
      return this.options.headers || [];
    },
    rowData() {
      return this.options.rowData || [];
    },
    rowSelection() {
      return this.options.rowSelection || 'multiple';
    },
    height() {
      return this.options.height || `${document.documentElement.clientHeight - 100}px`;
    },
    pagination() {
      return this.options.pagination || true;
    },
    paginationPageSize() {
      return this.options.paginationPageSize || null;
    },
    defaultColDef() {
      return {
        flex: 1,
        minWidth: 150,
        filter: true,
        sortable: true,
        floatingFilter: true,
        ...this.options.defaultColDef,
      };
    },
    gridOptions() {
      return {
        groupDefaultExpanded: -1,
        ...this.options.gridOptions,
      };
    },
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  methods: {
    onSelectionChanged() {
      const selectedRows = this.gridApi.getSelectedRows();
      this.$emit('input', selectedRows);
    },
  },
  watch: {
    rowData: {
      handler(rowData) {
        if (rowData.length > 0) {
          if (this.gridApi.sizeColumnsToFit) {
            this.gridApi.sizeColumnsToFit();
          }
        }
      },
      immediate: true,
    },
  },
};
</script>
