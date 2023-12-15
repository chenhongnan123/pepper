<template>
  <v-container fluid>
    <portal
      to="app-header"
      v-if="pagePortalMode.alarmMonitor"
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
            <search-filter
              ref="searchFilter"
              @input="filterRecord"
            />
            <v-spacer></v-spacer>
            <v-btn
              dense
              color="primary"
              @click="videoDialog = true"
            >
              {{ $t('alarmMonitor.btn.getmorevideo') }}</v-btn
            >
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
                ref="alarmMonitorGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="options"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <VideoMoreDialog
      :videoDialog="videoDialog"
      @closeDialog="videoDialog = false"
    />
    <ExpertiseDialog
      :expertiseParams="expertiseParams"
      @closeDialog="expertiseParams.expertiseDialog = false"
    />
  </v-container>
</template>

<script>
import _ from 'lodash';
import {
  mapState,
  mapMutations,
  mapGetters, mapActions,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import StatusBtn from '../components/StatusBtn.vue';
import VideoBtn from '../components/VideoBtn.vue';
import ExpertiseBtn from '../components/ExpertiseBtn.vue';
import SearchFilter from '../components/SearchFilter.vue';
import VideoMoreDialog from '../components/dialog/VideoMoreDialog.vue';
import ExpertiseDialog from '../components/dialog/ExpertiseDialog.vue';

let that = this;
export default {
  name: 'alarmMonitor',
  components: {
    BaseGrid,
    StatusBtn,
    VideoBtn,
    ExpertiseBtn,
    SearchFilter,
    VideoMoreDialog,
    ExpertiseDialog,
  },
  data() {
    return {
      elementName: 'alarmMonitor',
      headers: [
        'no',
        'alarmStatus',
        'alarmStartTimestamp',
        'alarmEndTimestamp',
        'bomParentName',
        'bomName',
        'alarmCode',
        'alarmName',
        'videoPath',
        'expertise',
      ],
      tableHeight: document.body.clientHeight - 210,
      alarmMonitorGrid: null,
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        rowDataId: 'alarmMonitorId',
      },
      videoDialog: false,
      expertiseDialog: false,
      isCancelPolling: false, // 是否取消轮询
      payload: {},
      expertiseParams: {},
    };
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('alarmMonitor', ['monitorList']),
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {
    this.alarmMonitorGrid = this.$refs.alarmMonitorGrid.gridApi;
    this.init();
    that = this;
  },
  deactivated() {},
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('alarmMonitor', ['getMonitorList']),
    async init() {
      this.initTableHeaders();
    },
    refresh() {
      this.$refs.searchFilter.refresh();
    },
    async filterRecord(payload) {
      this.payload = payload;
      await this.getTableList(this.payload);
      this.setAlert({
        show: true,
        type: 'success',
        message: 'successAction',
      });
      // this.debounceGetTableList();
    },
    // 每5秒查询一下列表
    debounceGetTableList: _.debounce(async () => {
      if (that.isCancelPolling) return;
      that.getTableList(that.payload);
      that.debounceGetTableList(that.payload);
    }, 5000),
    async getTableList(payload) {
      await this.getMonitorList(payload);
      this.options.rowData = this.monitorList;
    },
    initTableHeaders() {
      let headers = [];
      headers = this.headers.map((item, index) => {
        const obj = {
          field: item,
          headerName: `alarmMonitor.table.${item}`,
          index,
          filter: 'agTextColumnFilter',
          // filter: false,
          // floatingFilter: false,
          // checkboxSelection: index === 0,
          // headerCheckboxSelection: index === 0,
        };
        if (item === 'no') {
          obj.valueGetter = 'node.rowIndex + 1';
        }
        if (item === 'alarmStatus') {
          obj.cellRendererSelector = () => ({
            component: 'StatusBtn',
            params: {
              that: this,
            },
          });
        }
        if (item === 'alarmStartTimestamp') {
          obj.valueFormatter = (params) => {
            const { value } = params;
            if (value) {
              return this.$getFormatDate(value, 'yyyy-MM-DD HH:mm:ss');
            }
            return '--';
          };
        }
        if (item === 'alarmEndTimestamp') {
          obj.valueFormatter = (params) => {
            const { value } = params;
            if (value) {
              return this.$getFormatDate(value, 'yyyy-MM-DD HH:mm:ss');
            }
            return '--';
          };
        }
        if (item === 'videoPath') {
          obj.cellRendererSelector = () => ({
            component: 'VideoBtn',
            params: {
              that: this,
            },
          });
        }
        if (item === 'expertise') {
          obj.cellRendererSelector = () => ({
            component: 'ExpertiseBtn',
            params: {
              that: this,
            },
          });
        }
        return obj;
      });
      this.options.headers = headers;
    },
    openDialog(item) {
      this.expertiseParams = {
        ...item,
        expertiseDialog: true,
      };
    },
  },
  watch: {
    $route(to, from) {
      if (from.name === 'MonitorExpertKnowledgeDetail') {
        this.openDialog({
          noRefresh: 'y', // noRefresh控制从专家经验回来，不要重新获取专家经验列表
        });
      } else {
        this.expertiseParams.expertiseDialog = false;
      }
    },
  },
};
</script>
