<template>
  <v-container fluid>
    <portal
      to="app-header"
      v-if="pagePortalMode.alarmRecords"
    >
      {{ $t(`modules.${moduleName}`) }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="init(), alarmGridApi.deselectAll()"
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
            <DateTimeRangePicker v-model="dateFilter" />
            <v-autocomplete
              class="ml-2"
              color="primary"
              v-model="filterInfo.deviceId"
              label="设备名称"
              :items="machineList"
              item-text="deviceName"
              item-value="deviceId"
              outlined
              dense
              clearable
              hide-details
            ></v-autocomplete>
            <v-autocomplete
              class="ml-2"
              color="primary"
              v-model="filterInfo.alarmType"
              label="报警类型"
              outlined
              dense
              clearable
              hide-details
              :items="alarmTypeList"
              item-text="value"
              item-value="key"
            ></v-autocomplete>
            <v-btn
              style="height: 40px"
              outlined
              color="primary"
              class="text-none ml-2"
              :disabled="dateFilter.length === 0"
              @click="getTableList"
            >
              搜索
            </v-btn>
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
                ref="alarmGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="options"
                :method="'basicGet'"
                :url="request.url"
                :parameters="request.params"
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
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import AsyncGrid from '@/components/aggrid/AsyncGrid.vue';
import DateTimeRangePicker from '@/components/commonUI/DateTimeRangePicker';

export default {
  name: 'alarmRecords',
  components: {
    AsyncGrid,
    DateTimeRangePicker,
  },
  data() {
    return {
      elementName: 'alarmRecords',
      tableHeight: document.body.clientHeight - 210,
      tableheaders: [
        'no',
        'deviceName',
        'alarmType',
        'alarmContent',
        'createTime',
      ],
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        pagination: true,
      },
      alarmGridApi: null,
      dateFilter: [],
      filterInfo: {},
      request: {
        url: 'alarmrecord/list',
        params: {
          beginTime: new Date().getTime(),
          endTime: new Date().getTime() + 1000 * 3600 * 24,
        },
      },
    };
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('alarmRecords', ['alarmRecordList', 'machineList']),
    moduleName() {
      return this.$route.name;
    },
    alarmTypeList() {
      const alarmTypeList = [
        {
          value: '点检报警',
          key: '0',
        },
        {
          value: '设备报警',
          key: '1',
        },
        {
          value: '通讯报警',
          key: '2',
        },
        {
          value: '质量参数报警',
          key: '3',
        },
      ];
      return alarmTypeList;
    },
  },
  mounted() {
    this.initTableHeaders();
    this.alarmGridApi = this.$refs.alarmGrid.gridApi;
    this.init();
    this.getMachineList();
  },
  methods: {
    ...mapActions('alarmRecords', [
      'getAlarmRecordList',
      'getMachineList',
    ]),
    ...mapMutations('helper', ['setAlert']),
    init() {
      const time = {
        beginTime: new Date().getTime(),
        endTime: new Date().getTime() + 1000 * 3600 * 24,
      };
      this.dateFilter = [time.beginTime, time.endTime];
      Object.assign(this.request.params, time);
      if (this.$refs.alarmGrid) {
        this.$refs.alarmGrid.init();
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
      }
    },
    async getTableList() {
      const [beginTime, endTime] = this.dateFilter;
      const { deviceId, alarmType } = this.filterInfo;
      const params = this.filterObject({
        beginTime,
        endTime,
        deviceId,
        alarmType,
      });
      Object.assign(this.request.params, params);
      this.init();
    },
    filterObject(obj) {
      Object.keys(obj).forEach((k) => {
        if (obj[k] == null || obj[k] === '') delete obj[k];
      });
      return obj;
    },
    initTableHeaders() {
      let headers = [];
      headers = this.tableheaders.map((item, index) => {
        const obj = {
          field: item,
          headerName: this.$t(`alarmRecords.table.${item}`),
          index,
          filter: false,
          floatingFilter: false,
          // filter: 'agTextColumnFilter',
          // checkboxSelection: index === 0,
          // headerCheckboxSelection: index === 0,
        };
        if (item === 'no') {
          obj.valueGetter = 'node.rowIndex + 1';
          obj.filterParams = { readOnly: true };
        }
        return obj;
      });
      this.options.headers = headers;
    },
  },
};
</script>
