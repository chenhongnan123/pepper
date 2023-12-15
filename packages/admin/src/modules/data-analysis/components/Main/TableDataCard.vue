<template>
  <div :style="`height: ${height}px;`">
    <v-card
      id="tableDataCard"
      :height="height"
    >
      <v-card-title
        dense
        style="background-color: var(--v-primary-base);"
      >
        <span style="color: white;">
          {{ $t('dataAnalysis.modules.data') }}
        </span>
      </v-card-title>
      <v-card-text class="pt-4">
        <ag-grid-vue
          :rowData="aglist"
          :columnDefs="headers"
          :class="`${agGridTheme}`"
          :localeText="agGridLocaleText"
          :style="`height:${height - 70}px;`"
          :defaultColDef="defaultColDef"
          :gridOptions="gridOptions"
          :rowSelection="multiple ? 'multiple':'single'"
          @selection-changed="onSelectionChanged"
          :customChartThemes="customChartThemes"
        ></ag-grid-vue>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import 'ag-grid-community/styles/agGridBalhamFont.css';
import { AgGridVue } from 'ag-grid-vue';
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      aglist: [],
      defaultColDef: {},
      gridOptions: {},
      gridApi: {},
      customChartThemes: null,
    };
  },
  props: ['headers', 'list', 'offset', 'multiple', 'reset', 'height'],
  components: {
    AgGridVue,
  },
  computed: {
    ...mapGetters('helper', ['agGridLocaleText', 'agGridTheme']),
  },
  created() {
    this.gridOptions = {
      groupDefaultExpanded: -1,
    };
    this.defaultColDef = {
      flex: 1,
      filter: false,
      sortable: true,
      resizable: true,
      enableValue: true,
      // floatingFilter: true,
    };
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    onSelectionChanged() {
      const selectedRows = this.gridApi.getSelectedRows();
      this.$emit('callback', selectedRows);
    },
    // 所有列自适应
    autoSizeAll() {
      const columnIds = this.headers.map((item) => {
        const id = item.colId;
        return id;
      });
      if (this.gridColumnApi?.autoSizeColumns) {
        this.gridColumnApi.autoSizeColumns(columnIds);
      }
    },
  },
  watch: {
    list: {
      handler(list) {
        this.aglist = list;
        // if (this.gridApi.sizeColumnsToFit) {
        //   this.gridApi.sizeColumnsToFit();
        // }
        this.autoSizeAll();
      },
      immediate: true,
      deep: true,
    },
    reset() {
      this.gridApi.deselectAll();
    },
  },
};
</script>
<style scoped>
  .highlight{
    background-color: var(--v-primary-base) !important;
  }

  #tableDataCard /deep/ .v-card__title{
    font-size: 1rem;
    line-height: 1rem;
    padding: 10px 16px 10px 16px;
  }
</style>
