<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.progressDetail">
      {{ $t(`modules.${moduleName}`) }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="refresh"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card
          height="77"
          class="mb-3"
          elevation="0"
          color="bg"
        >
          <div class="d-flex align-center px-4" style="height:100%">
            <v-spacer></v-spacer>
            <v-btn
              small
              class="text-none mr-2"
              color="primary"
              @click="isNew = false;addDialog = true"
              :disabled="selectedTableList.length !== 1"
              v-if="isBtnAccess('basic:progress:edit')"
            >
              {{ $t('progressDetail.btn.edit') }}
            </v-btn>
          </div>
        </v-card>
        <v-card
          :height="tableHeight"
          class=""
          elevation="0"
          color="bg"
        >
          <v-row no-gutters class="pa-4">
            <v-col>
              <base-grid
                ref="progressDetailGrid"
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
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import AddDialog from '../components/AddDialog.vue';

export default {
  name: 'progressDetail',
  components: {
    BaseGrid,
    AddDialog,
  },
  data() {
    return {
      elementName: 'progressDetail',
      tableHeight: document.body.clientHeight - 210,
      progressDetailGridApi: null,
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'progressDetail.table.no',
            filter: 'agTextColumnFilter',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            // eslint-disable-next-line
            valueGetter: (params) => params.node?.rowIndex + 1,
          },
          {
            field: 'priority',
            headerName: 'progressDetail.table.priority',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'productNumber',
            headerName: 'progressDetail.table.productNumber',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'productName',
            headerName: 'progressDetail.table.productName',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'specifications',
            headerName: 'progressDetail.table.specifications',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'dispatchNumber',
            headerName: 'progressDetail.table.dispatchNumber',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'handleNumber',
            headerName: 'progressDetail.table.handleNumber',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'coreNumber',
            headerName: 'progressDetail.table.coreNumber',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'lightRodNumber',
            headerName: 'progressDetail.table.lightRodNumber',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'deviceName',
            headerName: 'progressDetail.table.deviceName',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'processName',
            headerName: 'progressDetail.table.processName',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'finalReportedDeviceName',
            headerName: 'progressDetail.table.finalReportedDeviceName',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'finalReportedTime',
            headerName: 'progressDetail.table.finalReportedTime',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'generateTransportScheduleTask',
            headerName: 'progressDetail.table.generateTransportScheduleTask',
            filter: 'agTextColumnFilter',
            valueFormatter: (params) => {
              if (params.value) {
                return this.$t(`progressDetail.label.generateTransportScheduleTask.${params.value}`);
              }
              return '-';
            },
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
      },
      selectedTableList: [],
      addDialog: false,
      isNew: true,
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('progressDetail', [
      'progressList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {
    this.progressDetailGridApi = this.$refs.progressDetailGrid.gridApi;
  },
  created() {
    this.getTableList();
  },
  deactivated() {
  },
  methods: {
    ...mapActions('progressDetail', [
      'getProgressList',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh() {
      this.getTableList();
      this.resetSelect();
    },
    async getTableList() {
      await this.getProgressList(true);
      this.options.rowData = this.progressList;
    },
    resetSelect() {
      if (this.progressDetailGridApi) {
        this.progressDetailGridApi.deselectAll();
      }
    },
  },
};
</script>
