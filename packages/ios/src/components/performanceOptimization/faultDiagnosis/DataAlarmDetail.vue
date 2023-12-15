<template>
  <div class="fill-height px-8">
    <div
      class=" primary--text font-weight-bold bluetitlepart mt-8"
    >
      <div class="title" style="width: 102px;">
        {{ $t('dataAlarmDetail.title.alarmDetail') }}
      </div>
      <div class="bgImg">
        <img
          :src="require('@/assets/icons/img/darkbluesquare-short.svg')"
          alt=""
        />
      </div>
      <div class="cardtop" style="left: 115px">
        <div class="darkbluerectangle"></div>
        <div class="lightbluerectangle"></div>
      </div>
    </div>
    <v-card
      class="bluecard bluecard-decoration-5 rounded-xl"
      rounded
      :style="`height: ${topHeight}px;overflow:hidden;`"
    >
      <v-card-text
        :style="`height: ${contentHeight}px;width: 100%;`"
      >
        <v-row
          dense
          class="fill-height mt-3 mx-2"
        >
          <v-col :cols="10">
            <v-row dense>
              <v-col cols="3">
                <div class="d-flex flex-column fill-height">
                  <div class="text-subtitle-1 primary--text">
                    {{ $t('dataAlarmDetail.label.eventName') }}
                  </div>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        v-bind="attrs"
                        v-on="on"
                        class="text-truncate"
                        style="font-size: 16px;"
                      >
                        {{ modelDetail?.eventName || '-'}}
                      </div>
                    </template>
                    <div>{{ modelDetail?.eventName || '-' }}</div>
                  </v-tooltip>
                </div>
              </v-col>
              <v-col cols="3">
                <div>
                  <span class="text-subtitle-1 primary--text">
                    {{ $t('dataAlarmDetail.label.algorithmType') }}
                  </span>
                </div>
                <div v-if="modelDetail?.type === '1'">
                  <span style="font-size: 16px;">
                    {{ $t('dataAlarmDetail.label.customAlgorithm') }}
                  </span>
                </div>
                <div v-else-if="modelDetail?.type === '0'">
                  <span style="font-size: 16px;">
                    {{ $t('dataAlarmDetail.label.standardAlgorithm') }}
                  </span>
                </div>
                <div v-else>
                  <span style="font-size: 16px;">-</span>
                </div>
              </v-col>
              <v-col cols="3">
                <div>
                  <span class="text-subtitle-1 primary--text">
                    {{ $t('dataAlarmDetail.label.algorithm') }}
                  </span>
                </div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      v-bind="attrs"
                      v-on="on"
                      class="text-truncate"
                      style="font-size: 16px;"
                    >
                      {{ customAlgorithm || '-' }}
                    </div>
                  </template>
                  <div>{{ customAlgorithm || '-' }}</div>
                </v-tooltip>
              </v-col>
              <v-col cols="3">
                <div>
                  <span class="text-subtitle-1 primary--text">
                    {{ $t('dataAlarmDetail.label.abnormalFluctuationCount') }}
                  </span>
                </div>
                <div v-if="modelDetail?.alarmCount">
                  <span style="font-size: 16px;">
                    {{ `${modelDetail?.alarmCount}${$t('dataAlarmDetail.label.times')}` }}
                  </span>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col :cols="2">
            <div class="d-flex">
              <v-btn
                outlined
                color="primary"
                rounded
                class="ml-auto"
                @click="isShowRepairDialog = true"
              >
              {{ $t('dataAlarmDetail.btn.submitRepairTask') }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-row
      dense
      class="mt-2"
      :style="`height: ${bottomHeight}px;`"
    >
      <v-col cols="6">
        <assembly-detail
          :bomId="bomId"
          :width="detailWidth"
          :cardHeight="detailHeight"
        />
      </v-col>
      <v-col cols="6">
        <v-card
          class="bluecard rounded-xl px-4"
          :style="`height: 200px;`"
          style="background: rgba(255, 255, 255, 0.07)!important;border: none!important;"
          rounded
        >
          <div
            class="d-flex align-center customBtnGroup"
            :style="`height:200px;width: 100%;`"
          >
            <v-btn
              :height="130"
              x-small
              class="high-blue-btn mr-2"
              :disabled="page===0"
              @click="page = page - 1"
            >
              <v-icon size="30px" color="primary">mdi-menu-left</v-icon>
            </v-btn>
            <v-carousel
              hide-delimiter-background
              hide-delimiters
              :show-arrows="false"
              v-model="page"
              :height="200"
            >
              <v-carousel-item
                v-for="(item, ind) in monitorRecordList"
                :key="`monitor_record_page_${ind}`"
              >
                <div class="d-flex pa-2">
                  <div
                    class="font-weight-bold"
                    style="font-size: 18px;"
                  >
                    {{ item.warnCode }}
                  </div>
                  <v-chip
                    small
                    class="ml-auto"
                    label
                    text-color="info"
                  >
                    {{ `${page + 1}/${pageCount}` }}
                  </v-chip>
                </div>
                <div
                  class="px-2 pb-1 overflow-y-auto"
                  style="font-size: 16px;height: 115px;color: rgba(255, 255, 255, 0.7);"
                >
                  {{ item.warnContent }}
                </div>
                <div
                  class="d-flex align-end mx-2 customBtn"
                >
                  <div
                    style="color: rgba(255, 255, 255, 0.7);font-size: 12px;"
                  >{{ item.updateTime }}</div>
                  <v-btn
                    class="ml-auto"
                    outlined
                    dense
                    color="primary"
                    rounded
                    small
                    @click="alarmId = item.id,isShowCancelDialog = true"
                  >
                    {{ $t('dataAlarmDetail.btn.cancelAlarm') }}
                  </v-btn>
                </div>
              </v-carousel-item>
            </v-carousel>
            <v-btn
              :height="130"
              x-small
              class="high-blue-btn ml-2"
              :disabled="(page+1)===pageCount || pageCount===0"
              @click="page = page + 1"
            >
              <v-icon size="30px" color="primary">mdi-menu-right</v-icon>
            </v-btn>
          </div>
        </v-card>
        <div :style="`height: ${chartHeight}px;`">
          <data-alarm-chart
            :height="chartHeight"
            :item="currentMonitorRecord"
          />
        </div>
      </v-col>
    </v-row>
    <SubmitRepairDialog
      :addDialog="isShowRepairDialog"
      @closeDialog="isShowRepairDialog = false"
      :defaultBomId="bomId"
    ></SubmitRepairDialog>
    <CancelDialog
      :isShow="isShowCancelDialog"
      :alarmId="alarmId"
      @closeDialog="isShowCancelDialog = false"
      @getTableList="init"
    ></CancelDialog>
  </div>
</template>

<script>
import {
  mapActions,
  mapMutations,
  mapState,
} from 'vuex';
import AssemblyDetail from './AssemblyDetail.vue';
import SubmitRepairDialog from './SubmitRepairDialog.vue';
import CancelDialog from './CancelDialog.vue';
import DataAlarmChart from './DataAlarmChart.vue';

export default {
  name: 'DataAlarmDetail',
  data() {
    return {
      clientheight: document.body.clientHeight,
      clientwidth: document.body.clientWidth,
      page: 0,
      isShowCancelDialog: false,
      isShowRepairDialog: false,
      alarmId: '',
    };
  },
  components: {
    AssemblyDetail,
    SubmitRepairDialog,
    CancelDialog,
    DataAlarmChart,
  },
  computed: {
    ...mapState('helper', ['serverTime']),
    ...mapState('dataAlarmDetail', [
      'modelDetail',
      'monitorRecordList',
    ]),
    topHeight() {
      return (this.clientheight - 210) * 0.15;
    },
    contentHeight() {
      return this.topHeight - 55;
    },
    bottomHeight() {
      return (this.clientheight - 210) * 0.85 - 8;
    },
    detailHeight() {
      return this.bottomHeight - 50;
    },
    detailWidth() {
      return (this.clientwidth - 100) * 0.5;
    },
    chartHeight() {
      return this.bottomHeight - 200;
    },
    // bomId
    bomId() {
      if (this.$route.params?.bomId) {
        return Number(this.$route.params?.bomId);
      }
      return 0;
    },
    // 事件id
    eventId() {
      if (this.$route.params?.eventId) {
        return Number(this.$route.params?.eventId);
      }
      return 0;
    },
    // 算法类型列表
    algorithmTypeList() {
      return [
        {
          type: '1',
          name: this.$t('dataAlarmDetail.algorithm.singleValue'),
        },
        {
          type: '2',
          name: this.$t('dataAlarmDetail.algorithm.subgroup'),
        },
        {
          type: '6',
          name: this.$t('dataAlarmDetail.algorithm.capabilityAnalysis'),
        },
      ];
    },
    // 算法列表
    algorithmList() {
      return [
        {
          value: 'i_chart',
          name: this.$t('dataAlarmDetail.algorithm.ichart'),
        },
        {
          value: 'mr_chart',
          name: this.$t('dataAlarmDetail.algorithm.mrchart'),
        },
        {
          value: 'i-mr_chart',
          name: this.$t('dataAlarmDetail.algorithm.i_mrchart'),
        },
        {
          value: 'z-mr_chart',
          name: this.$t('dataAlarmDetail.algorithm.z_mrchart'),
        },
        {
          value: 'xbar-r_chart',
          name: this.$t('dataAlarmDetail.algorithm.xbar_rchart'),
        },
        {
          value: 'xbar-s_chart',
          name: this.$t('dataAlarmDetail.algorithm.xbar_schart'),
        },
        {
          value: 'xbar_chart',
          name: this.$t('dataAlarmDetail.algorithm.xbarchart'),
        },
        {
          value: 's_chart',
          name: this.$t('dataAlarmDetail.algorithm.schart'),
        },
        {
          value: 'r_chart',
          name: this.$t('dataAlarmDetail.algorithm.rchart'),
        },
        {
          value: 'zone_chart',
          name: this.$t('dataAlarmDetail.algorithm.zonechart'),
        },
        {
          value: 'i-mr-rs_chart',
          name: this.$t('dataAlarmDetail.algorithm.imr_r/schart'),
        },
        {
          value: 'normxpk',
          name: this.$t('dataAlarmDetail.algorithm.normalcpkppk'),
        },
        {
          value: 'normxmk',
          name: this.$t('dataAlarmDetail.algorithm.normalcmkppk'),
        },
      ];
    },
    // 算法拼接文本
    customAlgorithm() {
      if (this.modelDetail?.algorithmType && this.modelDetail?.algorithm) {
        const {
          algorithmType,
          algorithm,
        } = this.modelDetail;
        const typeName = this.algorithmTypeList.find((i) => i.type === algorithmType)?.name || '';
        const algorithmName = this.algorithmList.find((i) => i.value === algorithm)?.name || '';
        return `${typeName} | ${algorithmName}`;
      }
      return '';
    },
    // 页数
    pageCount() {
      return this.monitorRecordList?.length || 0;
    },
    // 当前显示的数据监测记录
    currentMonitorRecord() {
      return this.monitorRecordList?.[this.page] || {};
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapMutations('maintenanceTask', ['setRepairTaskDialog']),
    ...mapActions('dataAlarmDetail', ['getModelDetail', 'getMonitorRecordList']),
    async init() {
      if (this.eventId) {
        await this.getModelDetail(this.eventId);
      }
      await this.getMonitorList();
    },
    async getMonitorList() {
      if (this.eventId) {
        await this.getMonitorRecordList(this.eventId);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  .customBtnGroup {
    ::v-deep() .v-btn:not(.v-btn--round) {
      min-width: 27px;
      width: 27px!important;
    }
    .customBtn {
      ::v-deep() .v-btn {
        min-width: 86px;
        // width: auto;
      }
    }
  }
</style>
