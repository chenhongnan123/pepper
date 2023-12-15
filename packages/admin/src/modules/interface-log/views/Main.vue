<template>
  <v-container fluid>
    <portal
      to="app-header"
      v-if="pagePortalMode.interfaceLog"
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
          <div
            class="d-flex align-center px-4"
            style="height: 100%"
          >
            <DateTimeRangePicker
              v-model="dateFilter"
              @input="getTableList"
            />
          </div>
        </v-card>
        <v-card
          :height="tableHeight"
          class=""
          elevation="0"
          color="bg"
        >
          <v-row
            no-gutters
            class="pa-4"
          >
            <v-col>
              <async-grid
                ref="interfaceLogGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="options"
                :url="request.url"
                :parameters="request.params"
                method="basicGet"
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
  mapActions,
  mapMutations,
  mapGetters,
} from 'vuex';
import AsyncGrid from '@/components/aggrid/AsyncGrid.vue';
import DateTimeRangePicker from '@/components/commonUI/DateTimeRangePicker';
import ActionBtn from '../components/ActionBtn.vue';
import StatusBtn from '../components/StatusBtn.vue';

export default {
  name: 'interfaceLog',
  components: {
    AsyncGrid,
    DateTimeRangePicker,
    ActionBtn,
    StatusBtn,
  },
  data() {
    return {
      elementName: 'interfaceLog',
      logHeaders: [
        'no',
        'upperSystem',
        'interfaceName',
        'dispatchNumber',
        'deviceNumber',
        'status',
        'action',
        'createTime',
      ],
      tableHeight: document.body.clientHeight - 210,
      interfaceLogGrid: null,
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
      },
      dateFilter: [],
      request: {
        url: 'interfacelog/list',
        params: {
          beginTime: new Date().getTime(),
          endTime: new Date().getTime() + 1000 * 3600 * 24,
        },
      },
    };
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapState('interfaceLog', ['interfaceLogList']),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {
    this.interfaceLogGrid = this.$refs.interfaceLogGrid.gridApi;
  },
  created() {
    this.initTableHeaders();
  },
  deactivated() {},
  methods: {
    ...mapActions('interfaceLog', ['getInterfaceLogList']),
    ...mapMutations('helper', ['setAlert']),
    refresh() {
      this.getTableList();
    },
    async getTableList() {
      const [beginTime, endTime] = this.dateFilter;
      Object.assign(this.request.params, { beginTime, endTime });
      if (this.$refs.interfaceLogGrid) {
        this.$refs.interfaceLogGrid.init();
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successFetchData',
        });
      }
      // await this.getInterfaceLogList(this.dateFilter);
      // this.options.rowData = this.interfaceLogList;
    },
    initTableHeaders() {
      let headers = [];
      headers = this.logHeaders.map((item, index) => {
        const obj = {
          field: item,
          headerName: this.$t(`interfaceLog.table.${item}`),
          index,
          filter: 'agTextColumnFilter',
          // checkboxSelection: index === 0,
          // headerCheckboxSelection: index === 0,
        };
        if (item === 'no') {
          obj.valueGetter = 'node.rowIndex + 1';
          obj.filterParams = { readOnly: true };
        }
        if (item === 'status') {
          obj.cellRendererSelector = () => ({
            component: 'StatusBtn',
            params: {
              that: this,
              field: 'status',
            },
          });
        }
        if (item === 'action') {
          obj.cellRendererSelector = () => ({
            component: 'ActionBtn',
            params: {
              that: this,
            },
          });
        }
        return obj;
      });
      this.options.headers = headers;
    },
  },
};
</script>
