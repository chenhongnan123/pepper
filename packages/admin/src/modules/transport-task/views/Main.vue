<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.transportTask">
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
            <div style="min-width:200px;max-width: 400px;">
              <v-autocomplete
                :label="`${$t('transportTask.label.status')}`"
                v-model="statusFilter"
                :items="statusList"
                item-text="dictLabel"
                item-value="dictValue"
                hide-details
                outlined
                multiple
                dense
                @change="filterRecord"
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :color="data.item.listClass"
                    small
                    text-color="white"
                  >
                    {{ data.item.dictLabel }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </div>
            <div style="min-width:200px;max-width: 400px;" class="ml-2">
              <v-autocomplete
                :label="`${$t('transportTask.label.transport')}`"
                v-model="transportFilter"
                :items="transportList"
                item-text="transportName"
                item-value="transportId"
                hide-details
                outlined
                dense
                clearable
                @change="filterRecord"
              >
              </v-autocomplete>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              small
              class="text-none"
              color="primary"
              @click="viewIndex = 1 - viewIndex"
            >
              {{ viewIndex ? $t('transportTask.btn.listView'): $t('transportTask.btn.cardView')}}
            </v-btn>
          </div>
        </v-card>
        <v-card
          :height="tableHeight"
          class=""
          elevation="0"
          color="bg"
        >
          <v-row no-gutters class="pa-4" style="height:100%">
            <v-col>
              <v-tabs-items v-model="viewIndex" style="height:100%">
                <v-tab-item>
                  <base-grid
                    ref="transportTaskGrid"
                    :elementName="elementName"
                    :restoreColumn="true"
                    :options="options"
                  />
                </v-tab-item>
                <v-tab-item style="height:100%">
                  <card-view
                    :taskList="filterList"
                    :height="tableHeight - 30"
                  />
                </v-tab-item>
              </v-tabs-items>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import StatusMenu from '../components/StatusMenu.vue';
import CardView from '../components/cardView.vue';

export default {
  name: 'transportTask',
  components: {
    BaseGrid,
    StatusMenu,
    CardView,
  },
  data() {
    return {
      elementName: 'transportTask',
      tableHeight: document.body.clientHeight - 210,
      transportTaskGridApi: null,
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'transportTask.table.no',
            filter: 'agTextColumnFilter',
            // eslint-disable-next-line
            valueGetter: (params) => params.node?.rowIndex + 1,
          },
          {
            field: 'scheduleTaskStatus',
            headerName: 'transportTask.table.status',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'StatusMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'createTime',
            headerName: 'transportTask.table.createTime',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'transportNumber',
            headerName: 'transportTask.table.number',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'transportName',
            headerName: 'transportTask.table.name',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'startPointNumber',
            headerName: 'transportTask.table.startPointNumber',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'startPointName',
            headerName: 'transportTask.table.startPointName',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'endPointNumber',
            headerName: 'transportTask.table.endPointNumber',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'endPointName',
            headerName: 'transportTask.table.endPointName',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'dispatchNumber',
            headerName: 'transportTask.table.dispatchNumber',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'handleNumber',
            headerName: 'transportTask.table.handleNumber',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'coreNumber',
            headerName: 'transportTask.table.coreNumber',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'transportName',
            headerName: 'transportTask.table.name',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'lightRodNumber',
            headerName: 'transportTask.table.lightRodNumber',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'productNumber',
            headerName: 'transportTask.table.productNumber',
            filter: 'agTextColumnFilter',
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
      },
      viewIndex: 0, // 0列表视图 1卡片视图
      statusFilter: [],
      transportFilter: '',
      filterList: [],
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('transportTask', [
      'taskList',
      'transportList',
      'statusList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {
    this.transportTaskGridApi = this.$refs.transportTaskGrid.gridApi;
  },
  created() {
    this.getTableList();
  },
  deactivated() {
  },
  methods: {
    ...mapActions('transportTask', [
      'getTaskList',
      'getTransportList',
      'getStatusList',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh() {
      this.getTableList();
    },
    async getTableList() {
      await this.getStatusList();
      await this.getTransportList();
      await this.getTaskList(true);
      setTimeout(() => {
        this.filterRecord();
      }, 300);
    },
    filterRecord() {
      console.log('filterRecord');
      const { statusFilter, transportFilter, taskList } = this;
      let filterList = taskList;
      if (statusFilter.length > 0) {
        filterList = filterList
          .filter((item) => statusFilter.some((status) => status === item.scheduleTaskStatus));
      }
      if (transportFilter) {
        filterList = filterList.filter((item) => item.transportId === Number(transportFilter));
      }
      this.options.rowData = filterList;
      this.filterList = filterList;
    },
  },
};
</script>
