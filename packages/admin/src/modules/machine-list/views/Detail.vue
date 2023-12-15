<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.machineDetail">
      <v-btn
        icon
        small
        class="mr-2 mb-1"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ $t(`modules.${moduleName}`)  }}
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
            <div class="d-flex flex-column">
              <span class="text-body-2" style="color:#7f7f7f">
               {{ $t('machineList.table.deviceNumber') }}
              </span>
              <span style="font-size: 18px;">{{ machine.deviceNumber || '-' }}</span>
            </div>
            <div class="d-flex flex-column ml-4">
              <span class="text-body-2" style="color:#7f7f7f">
               {{ $t('machineList.table.deviceName') }}
              </span>
              <span style="font-size: 18px;">{{ machine.deviceName || '-' }}</span>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              small
              class="text-none"
              color="primary"
              :disabled="paramList.length === 0 || monitTime !== initialMonitTime"
              @click="handleMonitTime()"
            >
            {{ $t('btn.monitor') }}{{monitTime === initialMonitTime ? '' : monitTime }}
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
                ref="paramListGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="options"
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
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import ActionMenu from '../components/ActionMenu.vue';

const initialMonitTime = 15;
export default {
  name: 'machineDetail',
  components: {
    BaseGrid,
    ActionMenu,
  },
  data() {
    return {
      elementName: 'machineDetail',
      tableHeight: document.body.clientHeight - 210,
      paramHeaders: [
        'no',
        'onlineStatus',
        'parameterName', // 参数名称
        'parameterNumber', // 参数标签
        'categoryName', // 参数类型名称
        'parameterValue', // 参数值
      ],
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        rowDataId: 'parameterName', // 传递对象的唯一标识符
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        pagination: true,
      },
      paramGridApi: null,
      typeId: null,
      monitTime: initialMonitTime,
      initialMonitTime,
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('machineList', [
      'paramList',
      'machine',
    ]),
    moduleName() {
      return this.$route.name;
    },
    workshopId() {
      return this.$route.query.workshopId;
    },
    deviceId() {
      return this.$route.query.deviceId;
    },
  },
  mounted() {
    this.paramGridApi = this.$refs.paramListGrid.gridApi;
  },
  created() {
    this.init();
    this.initTableHeaders();
  },
  methods: {
    ...mapActions('machineList', [
      'getParamList',
      'getMachineById',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh() {
      this.getTableList();
    },
    goBack() {
      this.$router.push({
        name: 'machineList',
        params: {
          typeId: this.machine.typeId,
          workshopId: this.workshopId || null,
        },
      });
    },
    async init() {
      await this.getMachineById(this.deviceId);
      this.getTableList();
    },
    async getTableList() {
      this.getParamList({
        deviceName: this.machine.deviceName,
        deviceNumber: this.machine.deviceNumber,
        typeId: this.machine.typeId,
      });
      this.options.rowData = this.paramList;
      this.setAlert({
        show: true,
        type: 'success',
        message: 'successAction',
      });
    },
    async handleMonitTime() {
      if (this.monitTime === 0) {
        this.monitTime = this.initialMonitTime;
        return;
      }
      await this.$getTimeout(1000);
      this.monitTime -= 1;
      this.handleMonitTime();
      this.handleMonitor();
    },
    // 监控按钮点击事件
    async handleMonitor() {
      const payload = {
        deviceName: this.machine.deviceName,
        deviceNumber: this.machine.deviceNumber,
        typeId: this.machine.typeId,
      };
      const monitorValues = await this.getParamList(payload);
      if (monitorValues.length) {
        this.paramList.forEach((ele) => {
          const obj = {
            ...ele,
          };
          // eslint-disable-next-line
          const newValueList = monitorValues.find((valueItem) => valueItem.parameterName === ele.parameterName);
          if (newValueList?.onlineStatus) {
            obj.onlineStatus = newValueList.onlineStatus;
          } else {
            obj.onlineStatus = '';
          }
          this.paramGridApi.applyTransaction({ update: [obj] });
        });
        // this.setAlert({
        //   show: true,
        //   type: 'success',
        //   message: 'successAction',
        // });
      }
    },
    initTableHeaders() {
      let headers = [];
      headers = this.paramHeaders.map((item, index) => {
        const obj = {
          field: item,
          headerName: this.$t(`machineList.table.${item}`),
          index,
          filter: 'agTextColumnFilter',
          // checkboxSelection: index === 0,
          // headerCheckboxSelection: index === 0,
        };
        if (item === 'no') {
          obj.valueGetter = 'node.rowIndex + 1';
        }
        if (item === 'onlineStatus') {
          obj.cellRendererSelector = () => ({
            component: 'ActionMenu',
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
