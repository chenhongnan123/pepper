<template>
  <v-container
    fluid
    class="darkNoBgColor"
  >
    <portal
      to="app-header"
      v-if="pagePortalMode.dataSource"
    >
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
              v-if="isBtnAccess('system:source:addDataSourceAndParam')"
              small
              color="primary"
              class="text-none"
              @click="addDialog = true"
            >
              <v-icon left small>mdi-plus</v-icon>
              {{ $t('btn.add') }}
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
                ref="dataSourceGrid"
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
      @closeDialog="addDialog = false"
      @getTableList="refresh"
      :isNew="true"
    />
  </v-container>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';
import moment from 'moment';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import TextBtn from '../components/Main/TextBtn.vue';
import TextTooltip from '../components/Main/TextTooltip.vue';
import AssignSwitch from '../components/Main/AssignSwitch.vue';
import CheckBox from '../components/Main/CheckBox.vue';
import StatusMenu from '../components/Main/StatusMenu.vue';
import ActionMenu from '../components/Main/ActionMenu.vue';
import addDialog from '../components/Main/addDialog.vue';

export default {
  // eslint-disable-next-line
  name: 'dataSource',
  data() {
    return {
      moment,
      elementName: 'dataSourceList',
      tableHeight: document.body.clientHeight - 210,
      selectedTableList: [],
      dataSourceGridApi: null,
      options: {
        headers: [
          {
            field: 'no',
            // checkboxSelection: true,
            // headerCheckboxSelection: true,
            maxWidth: 100,
            headerName: 'dataSource.table.no',
            filter: false,
            // eslint-disable-next-line
            valueGetter: (params) => params.node?.rowIndex + 1,
          },
          {
            field: 'status',
            headerName: 'dataSource.table.status',
            filter: 'agTextColumnFilter',
            valueGetter: (params) => {
              if (params.data.active) {
                return this.$t(`dataSource.label.statusList.${params.data.active}`);
              }
              return '-';
            },
            cellRendererSelector: () => ({
              component: 'StatusMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'dataSourceNumber',
            headerName: 'dataSource.table.dataSourceNumber',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'TextBtn',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'dataSourceName',
            headerName: 'dataSource.table.dataSourceName',
            filter: 'agTextColumnFilter',
            minWidth: 200,
            cellRendererSelector: () => ({
              component: 'TextTooltip',
              params: {
                that: this,
                field: 'dataSourceName',
              },
            }),
          },
          {
            field: 'storageFrequency',
            headerName: 'dataSource.table.storageFrequency',
            filter: 'agTextColumnFilter',
            valueGetter: (params) => {
              if (params.data.storageFrequency) {
                const type = this.storageFrequencyList
                  .find((m) => m.value === params.data.storageFrequency);
                if (type) {
                  return type.text;
                }
                return params.data.storageFrequency;
              }
              return '-';
            },
          },
          {
            field: 'storageDuration',
            headerName: 'dataSource.table.storageDuration',
            filter: 'agTextColumnFilter',
            valueGetter: (params) => {
              if (params.data.storageDuration) {
                // const type = this.storageDurationList
                //   .find((m) => m.value === params.data.storageDuration);
                // if (type) {
                //   return type.text;
                // }
                // return params.data.storageDuration;
                return this.$t(`dataSource.label.storageDurationList.${params.data.storageDuration}`);
              }
              return '-';
            },
          },
          {
            field: 'needBackup',
            headerName: 'dataSource.table.needBackup',
            cellRendererSelector: () => ({
              component: 'CheckBox',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'storageRule',
            headerName: 'dataSource.table.storageRule',
            cellRendererSelector: () => ({
              component: 'ActionMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'storageMode',
            headerName: 'dataSource.table.storageMode',
            filter: 'agTextColumnFilter',
            valueGetter: (params) => {
              if (params.data.storageMode) {
                return this.$t(`dataSource.label.storageModeList.${params.data.storageMode}`);
              }
              return '-';
            },
          },
          {
            field: 'active',
            headerName: 'dataSource.table.active',
            cellRendererSelector: () => ({
              component: 'AssignSwitch',
              params: {
                that: this,
                field: 'active',
              },
            }),
          },
          {
            field: 'updateBy',
            headerName: 'dataSource.table.updateBy',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'updateTime',
            headerName: 'dataSource.table.updateTime',
            filter: 'agTextColumnFilter',
            minWidth: 160,
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
      },
      addDialog: false,
    };
  },
  components: {
    BaseGrid,
    TextBtn,
    TextTooltip,
    AssignSwitch,
    StatusMenu,
    CheckBox,
    ActionMenu,
    addDialog,
  },
  activated() {
  },
  deactivated() {
  },
  created() {
    this.init();
  },
  mounted() {
    this.dataSourceGridApi = this.$refs.dataSourceGrid.gridApi;
  },
  beforeDestroy() {
  },
  methods: {
    ...mapMutations('helper', [
      'setAlert',
    ]),
    ...mapActions('dataSource', [
      'getDataSourceList',
    ]),
    refresh() {
      this.init();
      this.resetSelect();
    },
    async init() {
      await this.getDataSourceList(true);
      this.options.rowData = this.dataSourceList;
    },
    // 重置选择
    resetSelect() {
      if (this.dataSourceGridApi) {
        this.dataSourceGridApi.deselectAll();
      }
    },
  },
  computed: {
    ...mapState('dataSource', ['dataSourceList', 'storageModeList', 'storageDurationList', 'storageFrequencyList', 'statusList']),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('helper', ['pagePortalMode']),
    moduleName() {
      return this.$route.name;
    },
  },
};
</script>
