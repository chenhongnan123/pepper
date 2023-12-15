<template>
  <v-container fluid>
    <portal
      to="app-header"
      v-if="pagePortalMode.statePredictionDetail"
    >
      <v-btn
        icon
        small
        class="mr-2 mb-1"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ $route.query?.bomName || '-' }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="refresh"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <div
      class="d-flex"
      style="width: 100%;"
      :style="`height: ${topCardHeight}px;`"
    >
      <div
        :style="`width: ${leftWidth}%;`"
        class="fill-height"
      >
        <device-info
          :height="topCardHeight"
        />
      </div>
      <div
        :style="`width: ${100 - leftWidth}%;`"
        class="fill-height"
      >
        <device-health-detail
          :height="topCardHeight"
        />
      </div>
    </div>
    <div
      class="d-flex"
      style="width: 100%;"
      :style="`height: ${topCardHeight}px;`"
    >
      <div
        :style="`width: ${leftWidth}%;`"
        class="fill-height mr-3 mt-1 pr-2"
      >
      <v-tabs v-model="tab" background-color="transparent" :key="`tab_key_${tab}`">
        <v-tab class="d-flex justify-between">
          <span class="mr-2" style="font-size: 16px">
            {{ $t('statePrediction.title.dataAlarm') }}
          </span>
          <v-chip class="ml-2" label small>{{ recordList?.length }}</v-chip>
        </v-tab>
        <v-tab>
          <span class="mr-2" style="font-size: 16px">
            {{ $t('statePrediction.title.PLCAlarm') }}
          </span>
          <v-chip class="ml-2" label small>{{ algorithmPlcList?.length }}</v-chip>
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card color="transparent" flat>
            <data-alarm-list :height="bottomCardHeight"></data-alarm-list>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card color="transparent" flat>
            <plc-alarm-list :height="bottomCardHeight"></plc-alarm-list>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
      </div>
      <div
        :style="`width: ${100 - leftWidth}%;`"
        class="fill-height"
      >
        <data-prediction-tab
          :height="bottomCardHeight"
        />
      </div>
    </div>
  </v-container>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import DeviceInfo from '../components/detail/DeviceInfo.vue';
import DeviceHealthDetail from '../components/detail/DeviceHealthDetail.vue';
import DataAlarmList from '../components/detail/DataAlarmList.vue';
import PlcAlarmList from '../components/detail/PlcAlarmList.vue';
import DataPredictionTab from '../components/detail/DataPredictionTab.vue';

export default {
  name: 'statePredictionDetail',
  components: {
    DeviceInfo,
    DeviceHealthDetail,
    DataAlarmList,
    PlcAlarmList,
    DataPredictionTab,
  },
  data() {
    return {
      clientHeight: document.body.clientHeight,
      clientWidth: document.body.clientWidth,
      leftWidth: 35,
      tab: null,
    };
  },
  computed: {
    ...mapState('common', ['multiPageList']),
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('statePrediction', ['deviceBomDetail', 'recordList', 'deviceHealthInfo', 'partAnnexInfo',
      'monthScoreList',
      'algorithmPlcList',
    ]),
    moduleName() {
      return this.$route.name;
    },
    topCardHeight() {
      return (this.clientHeight - 100) * 0.3;
    },
    bottomCardHeight() {
      return (this.clientHeight - 100) * 0.7;
    },
    bomId() {
      if (this.$route.params.id) {
        return Number(this.$route.params.id);
      }
      return 0;
    },
    partId() {
      return this.$route.params.partId;
    },
    routenames() {
      return (this.multiPageList || []).map((_) => _.routename);
    },
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    ...mapActions('statePrediction', [
      'getRecordList',
      'getDeviceHealthInfo',
      'getAlgorithmTypeList',
      'getAlgorithmIconList',
      'getPartAnnexInfo',
      'getMonthScoreDetailList',
      'getAlgorithmPlcList',
      'getPartHealthDetailInfo',
      'getTaskStatusList',
      'getAlgorithmModelList',
      'getMaintenanceTaskList',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    ...mapMutations('statePrediction', [
      'setHealthAverage',
    ]),
    refresh() {
      this.getDeviceHealth();
      this.getWarnList();
      this.getAlgorithmList();
      this.getSpcTaskList(false); // 区分刷新和初始化加载，避免出现多个循环调用
    },
    goBack() {
      this.$router.push({ name: 'statePrediction' });
    },
    init() {
      this.getDeviceHealth();
      this.getWarnList();
      this.getAlgorithmList();
      this.getSpcTaskList(true);
    },
    async getDeviceHealth() {
      await this.getDeviceHealthInfo();
      await this.getPartHealthDetailInfo(this.bomId);
      if (this.deviceHealthInfo && this.deviceHealthInfo[this.bomId]) {
        this.setHealthAverage(this.deviceHealthInfo[this.bomId].partHealth);
      }
    },
    async getWarnList() {
      const beginTime = new Date().getTime() - 30 * 1000 * 60 * 60 * 24;
      await this.getRecordList(`bomId=${this.$route.params.id}&beginTime=${beginTime}`);
      await this.getAlgorithmPlcList(this.$route.params.id);
    },
    async getAlgorithmList() {
      await this.getAlgorithmTypeList();
      await this.getAlgorithmIconList();
      await this.getPartAnnexInfo(this.partId);
      await this.getMonthScoreDetailList(this.bomId);
    },
    async getSpcTaskList(isInit) {
      await this.getTaskStatusList();
      if (this.bomId) {
        if (isInit) {
          await this.getModelList();
          this.getAlgorithmModelListLoop();
        } else {
          await this.getModelList();
        }
        await this.getMaintenanceTaskList(this.bomId);
      }
    },
    // 5秒一循环查询数据监测列表
    async getAlgorithmModelListLoop() {
      if (this.$route.name === 'statePredictionDetail') {
        await this.$getTimeout(5 * 1000);
        this.getModelList();
        this.getAlgorithmModelListLoop();
      }
    },
    async getModelList() {
      if (this.bomId) {
        await this.getAlgorithmModelList({
          bomId: this.$route.name === 'statePredictionDetail' ? this.$route.params.id : this.bomId,
          width: Number(this.clientWidth * 0.47).toFixed(0), // 高宽为整型
          height: 300,
        });
      }
    },
  },
  beforeDestroy() {
    if (!this.routenames.includes('statePrediction')) {
      delete sessionStorage.statePredictionTabData;
    }
  },
};
</script>
