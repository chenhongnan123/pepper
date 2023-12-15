<template>
  <v-container fluid>
    <portal
      to="app-header"
      v-if="pagePortalMode.transportDetail"
    >
      <v-btn
        icon
        small
        class="mr-2 mb-1"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
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
            <div class="d-flex flex-column">
              <span
                class="text-body-2"
                style="color: #7f7f7f"
              >
                {{ $t('transportManagement.table.transportNumber') }}
              </span>
              <span style="font-size: 18px; color: var(--v-primary-base)">
                {{ transportInfo?.transportNumber || '-' }}
              </span>
            </div>
            <div class="d-flex flex-column ml-4">
              <span
                class="text-body-2"
                style="color: #7f7f7f"
              >
                {{ $t('transportManagement.table.transportName') }}
              </span>
              <span style="font-size: 18px">{{ transportInfo?.transportName || '-' }}</span>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              small
              class="text-none"
              color="primary"
              :disabled="transportParamList.length === 0 || monitTime !== initialMonitTime"
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
          <v-row
            no-gutters
            class="pa-4"
          >
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
  name: 'transportDetail',
  components: {
    BaseGrid,
    ActionMenu,
  },
  data() {
    return {
      elementName: 'transportDetail',
      tableHeight: document.body.clientHeight - 210,
      paramHeaders: [
        'no',
        'onlineStatus',
        'parameterName', // 参数名称 大部分情况是唯一的
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
      monitTime: initialMonitTime,
      initialMonitTime,
    };
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('transportManagement', ['transportParamList', 'transportInfo']),
    moduleName() {
      return this.$route.name;
    },
    transportId() {
      return this.$route.query.transportId;
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
    ...mapActions('transportManagement', ['getTansportParamList', 'getTransportInfo']),
    ...mapMutations('helper', ['setAlert']),
    /**
     * 1 新增/编辑/删除等操作后刷新表格，需要保留表格状态
     * 0 初始化 刷新整个表格
     * @param {*} type 1或者0
     */
    refresh(type) {
      this.init(type);
    },
    goBack() {
      this.$router.push({
        name: 'transportManagement',
      });
    },
    async init(type) {
      await this.getTransportInfo(this.transportId);
      this.getParamList(type);
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
    customComparator(valueA, valueB) {
      // 将值转为实际数字进行比较
      const numberA = parseFloat(valueA);
      const numberB = parseFloat(valueB);

      if (numberA < numberB) {
        return -1;
      }
      if (numberA > numberB) {
        return 1;
      }
      return 0;
    },
    // 获取参数列表
    async getParamList(isNotInit) {
      const payload = {
        transportName: this.transportInfo.transportName,
        transportNumber: this.transportInfo.transportNumber,
        workshopId: this.transportInfo.workshopId,
      };
      const result = this.getTansportParamList(payload);
      if (result) {
        if (isNotInit) {
          // 并非初始加载表格数据，新增/编辑/删除等操作后刷新表格，需要保留表格状态
          this.paramGridApi.applyTransaction({ update: [...this.transportParamList] });
        } else {
          // 初始化表格数据
          this.options.rowData = this.transportParamList;
        }
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
      }
      // this.options.rowData = this.transportParamList;
    },
    // 监控按钮点击事件
    async handleMonitor() {
      const payload = {
        transportName: this.transportInfo.transportName,
        transportNumber: this.transportInfo.transportNumber,
        workshopId: this.transportInfo.workshopId,
      };
      const monitorValues = await this.getTansportParamList(payload);
      console.log(monitorValues, 'monitorValues');
      if (monitorValues.length) {
        this.transportParamList.forEach((ele) => {
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
          headerName: this.$t(`transportManagement.table.${item}`),
          index,
          filter: 'agTextColumnFilter',
          // checkboxSelection: index === 0,
          // headerCheckboxSelection: index === 0,
          comparator: this.customComparator,
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
