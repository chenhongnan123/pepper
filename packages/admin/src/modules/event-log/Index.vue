<template>
  <v-container fluid>
    <portal
      to="app-header"
      v-if="pagePortalMode.eventLog"
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
            <date-time-range-picker
              v-model="dateFilter"
              @input="filterRecord"
            />
            <div style="width: 300px;">
              <v-text-field
                class="ml-2"
                color="primary"
                :label="`${$t('eventLog.table.eventName')}`"
                v-model="eventName"
                outlined
                dense
                hide-details
                @input="filterValue"
              ></v-text-field>
            </div>
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
                ref="eventLogGrid"
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
    <more-info-drawer
      :info="moreInfo"
      :moduleName="moduleName"
    />
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import AsyncGrid from '@/components/aggrid/AsyncGrid.vue';
import DateTimeRangePicker from '@/components/commonUI/DateTimeRangePicker.vue';
import ActionBtn from './components/ActionBtn.vue';
import MoreInfoDrawer from './components/MoreInfoDrawer.vue';

export default {
  name: 'eventLog',
  data() {
    return {
      elementName: 'eventLogList',
      clientHeight: document.body.clientHeight,
      tableHeight: document.body.clientHeight - 210,
      dateFilter: [],
      eventName: '',
      selectedTableList: [],
      eventNames: [],
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'eventLog.table.no',
            filter: false,
            floatingFilter: false,
            index: 1,
            maxWidth: 100,
            valueGetter: 'node.rowIndex + 1',
          },
          {
            field: 'operTime',
            headerName: 'eventLog.table.operTime',
            filter: false,
            floatingFilter: false,
            index: 2,
          },
          {
            field: 'eventName',
            headerName: 'eventLog.table.eventName',
            filter: false,
            floatingFilter: false,
            index: 3,
          },
          {
            field: 'eventContent',
            headerName: 'eventLog.table.eventContent',
            filter: false,
            floatingFilter: false,
            index: 4,
            valueGetter: (params) => {
              if (params.data.eventContent) {
                const type = this.eventContentTypeList.find(
                  (m) => m.dictValue === params.data.eventContent,
                );
                if (type) {
                  return type.dictLabel;
                }
              }
              return params.data.eventContent;
            },
          },
          {
            field: 'action',
            headerName: 'eventLog.table.action',
            filter: false,
            floatingFilter: false,
            index: 5,
            cellRendererSelector: () => ({
              component: 'ActionBtn',
              params: {
                currowinfo: this,
              },
            }),
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
      },
      request: {
        url: 'eventLog/list',
        params: {},
      },
      moreInfo: {},
    };
  },
  components: {
    AsyncGrid,
    DateTimeRangePicker,
    ActionBtn,
    MoreInfoDrawer,
  },
  mounted() {
    this.gridApi = this.$refs.eventLogGrid.gridApi;
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('helper', ['pagePortalMode']),
    ...mapState('eventLog', ['drawer', 'eventContentTypeList']),
    moduleName() {
      return this.$route.name;
    },
  },
  methods: {
    ...mapMutations('helper', ['setPageHeader', 'setAppHeaderHeight', 'setAlert']),
    ...mapMutations('eventLog', ['toggleDrawer', 'setDrawer', 'getEventContentTypeList']),
    refresh() {
      const beginTime = new Date().setHours(0, 0, 0, 0);
      const endTime = new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000;
      this.dateFilter = [beginTime, endTime];
      Object.assign(this.request.params, {
        fromDate: this.$getFormatDate(beginTime, 'YYYY-MM-DD HH:mm:ss'),
        toDate: this.$getFormatDate(endTime, 'YYYY-MM-DD HH:mm:ss'),
        eventName: this.eventName,
      });
      this.getLogList();
    },
    // 重置选择
    resetSelect() {
      if (this.gridApi) {
        this.gridApi.deselectAll();
      }
    },
    filterValue(eventName) {
      Object.assign(this.request.params, { eventName });
      this.getLogList();
    },
    filterRecord([beginTime, endTime]) {
      beginTime = this.$getFormatDate(beginTime, 'YYYY-MM-DD HH:mm:ss');
      endTime = this.$getFormatDate(endTime, 'YYYY-MM-DD HH:mm:ss');
      Object.assign(this.request.params, { beginTime, endTime });
      this.getLogList();
    },
    getLogList() {
      if (this.$refs.eventLogGrid) {
        this.$refs.eventLogGrid.init();
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successFetchData',
        });
      }
    },
    async getTypeList() {
      await this.getEventContentTypeList();
    },
    showInfo(item) {
      this.moreInfo = {
        ...item,
        jsonResult: this.IsJsonString(item.jsonResult) ? JSON.parse(item.jsonResult) : '',
        operParam: this.IsJsonString(item.operParam) ? JSON.parse(item.operParam) : '',
      };
      this.toggleDrawer();
    },
    // 通过返回值来判断：如果true 则是JSON格式，否则，不是JSON格式
    IsJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
  },
};
</script>
