<template>
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    width="1500"
    height="900"
    transition="dialog-transition"
  >
    <v-card
      style="overflow: hidden"
      height="700"
    >
      <v-row>
        <v-col>
          <v-card-title primary-title>
            <span>
              {{ $t('alarmMonitor.dialog.morevideo') }}
            </span>
            <v-btn
              icon
              small
              class="ml-2"
              @click="refreshVideoList"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-spacer />
            <v-btn
              icon
              small
              @click="dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text style="height: 500px">
            <v-row no-gutters>
              <v-col cols="3">
                <!-- 工站 -->
                <selectable-bom-tree
                  style="width: 100%"
                  ref="selectableBomTree"
                  :title="$t('alarmMonitor.dialog.workstation')"
                  :height="300"
                  :bomList="bomList"
                  :isMultiple="false"
                  :isShowMaintenancePart="false"
                  :isShowMainPart="false"
                  bomErrMsg=""
                  itemChildren="childrenBomList"
                  itemKey="bomId"
                  itemText="bomName"
                  placeholder="alarmMonitor.dialog.searchfolder"
                  @handleActive="handleActive"
                />
                <!-- 相机 -->
                <span>
                  <div class="font-weight-medium subtitle-1 mt-4">
                    {{ $t('alarmMonitor.dialog.camera') }}
                  </div>
                  <v-card
                    outlined
                    height="100"
                  >
                    <v-card-text
                      class="alarm-info"
                      v-if="!clickBom || currentBom?.camera === '1'"
                    >
                      <div>
                        {{ $t('alarmMonitor.dialog.ip') }}:{{ currentBom?.cameraIp || '--' }}
                      </div>
                      <div>
                        {{ $t('alarmMonitor.dialog.port') }}:{{ currentBom?.cameraPort || '--' }}
                      </div>
                      <div>
                        {{ $t('alarmMonitor.dialog.thoroughfare') }}:{{
                          currentBom?.cameraThoroughfare
                        }}
                      </div>
                    </v-card-text>
                    <v-card-text v-if="clickBom && currentBom?.camera === '0'">
                     {{ this.$t('alarmMonitor.label.unassociatedCamera') }}
                    </v-card-text>
                  </v-card>
                </span>
                <!-- 时刻 -->
                <div class="font-weight-medium subtitle-1 mt-4">
                  {{ $t('alarmMonitor.dialog.time') }}
                </div>
                <!--
                  camera === '0' 不存在相机 === '1' 存在相机
                 -->
                <DateTimeSinglePicker
                  dense
                  style="width: 100%"
                  v-model="currentTime"
                  type="datetime"
                  :disabled="currentBom?.camera === '0'"
                  :picker-options="{ disabledDate }"
                />
                <v-btn
                  width="100%"
                  dense
                  class="text-none mt-4"
                  color="primary"
                  outlined
                  :disabled="currentBom?.camera === '0'"
                  @click="createVideo"
                >
                  {{ $t('alarmMonitor.btn.obtain') }}
                </v-btn>
              </v-col>
              <v-col cols="9">
                <div class="ml-3">
                  <div class="mt-2 font-weight-medium subtitle-1 d-flex justify-space-between">
                    {{ $t('alarmMonitor.dialog.video') }}
                    <DateTimeRangePicker
                      dense
                      @input="filterRecord"
                      v-model="dateFilter"
                    />
                  </div>
                  <v-card
                    outlined
                    height="505"
                    class="mt-4"
                  >
                    <base-grid
                      v-if="!videoObj.showVideo && dialog"
                      ref="videoGrid"
                      elementName="videoList"
                      :restoreColumn="true"
                      :options="options"
                    />
                    <span v-if="videoObj.showVideo">
                      <div>
                        <v-btn
                          icon
                          small
                          class="mr-2 mb-1"
                          @click="videoObj.showVideo = false"
                        >
                          <v-icon>mdi-arrow-left</v-icon>
                        </v-btn>
                        {{ videoObj?.bomName }}
                      </div>
                      <div class="video-text">
                        <span> {{ $t('alarmMonitor.dialog.videoduration') }}：1min </span>
                        <span class="ml-5">
                          {{ $t('alarmMonitor.table.alarmStartTimestamp') }}：
                          {{
                            videoObj.beginRecordTimestamp
                              ? $getFormatDate(videoObj.beginRecordTimestamp, 'yyyy-MM-DD HH:mm:ss')
                              : '--'
                          }}
                        </span>
                        <span class="ml-3">
                          {{ $t('alarmMonitor.table.alarmEndTimestamp') }}：
                          {{
                            videoObj.endRecordTimestamp
                              ? $getFormatDate(videoObj.endRecordTimestamp, 'yyyy-MM-DD HH:mm:ss')
                              : '--'
                          }}
                        </span>
                      </div>
                      <video
                        ref="videoRef"
                        disabled
                        width="100%"
                        height="100%"
                        controls
                        style="margin: 0 auto; display: block"
                      >
                        <track kind="captions" />
                        <!-- 视频的地址 -->
                        <source
                          :src="videoObj?.videoPath"
                          type="video/mp4"
                        />
                      </video>
                    </span>
                  </v-card>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import VideoView from '@/components/commonUI/preview/VideoView.vue';
import SelectableBomTree from '@/components/commonUI/SelectableBomTree.vue';
import DateTimeSinglePicker from '@/components/commonUI/DateTimeSinglePicker.vue';
import DateTimeRangePicker from '@/components/commonUI//DateTimeRangePicker.vue';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import LoadingBtn from '../LoadingBtn.vue';
import ActionBtn from '../ActionBtn.vue';

export default {
  name: 'videoMoreDialog',
  props: {
    videoDialog: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      bomList: [],
      currentBom: null,
      currentTime: '',
      clickBom: false,
      gridApi: null,
      videoObj: {
        showVideo: false,
      },
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'alarmMonitor.table.no',
            filter: 'agTextColumnFilter',
            // eslint-disable-next-line
            valueGetter: (params) => params.node?.rowIndex + 1,
          },
          {
            field: 'createTime',
            headerName: 'alarmMonitor.table.createTime',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'recordTimestamp',
            headerName: 'alarmMonitor.table.recordTimestamp',
            filter: 'agTextColumnFilter',
            valueGetter: (params) =>
              this.$getFormatDate(params.data?.recordTimestamp, 'YYYY-MM-DD HH:mm:ss'),
          },
          {
            field: 'bomName',
            headerName: 'alarmMonitor.dialog.workstation',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'monitorLoadingStatus', // 状态
            headerName: 'alarmMonitor.table.monitorLoadingStatus',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'LoadingBtn',
              params: {
                that: this,
                field: 'monitorLoadingStatus',
              },
            }),
          },
          {
            field: 'action', // 操作
            headerName: 'alarmMonitor.table.action',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'ActionBtn',
              params: {
                that: this,
                field: 'monitorLoadingStatus',
              },
            }),
          },
        ],
        rowData: [],
        rowDataId: 'videoRecordId',
        sideBar: {
          hiddenByDefault: true,
        },
        height: 560,
        rowHeight: 35,
      },
      dateFilter: [],
    };
  },
  components: {
    VideoView,
    SelectableBomTree,
    DateTimeSinglePicker,
    DateTimeRangePicker,
    LoadingBtn,
    BaseGrid,
    ActionBtn,
  },
  computed: {
    ...mapState('helper', ['currentLocale']),
    ...mapState('alarmMonitor', ['videoList', 'videoDetail']),
    dialog: {
      get() {
        return this.videoDialog;
      },
      set() {
        this.bomList = [];
        this.options.rowData = [];
        this.currentBom = null;
        this.clickBom = false;
        this.videoObj.showVideo = false;
        this.initDate();
        this.$emit('closeDialog');
      },
    },
  },
  mounted() {
    // this.gridApi = this.$refs.videoGrid.gridApi;
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('alarmMonitor', ['setBomList']),
    ...mapActions('alarmMonitor', [
      'generateVideo',
      'getBomList',
      'getVideoList',
      'reloadVideo',
      'getVideoById',
    ]),
    handleActive(item) {
      // eslint-disable-next-line prefer-destructuring
      this.currentBom = item[0];
      if (item[0]) {
        this.clickBom = true;
      } else {
        this.clickBom = false;
      }
    },
    // 创建一条视频
    async createVideo() {
      const {
        currentTime,
        currentBom: { bomId },
      } = this;
      await this.generateVideo({ recordTimestamp: currentTime, bomId });
      await this.refreshVideoList();
      this.videoObj.showVideo = false;
    },
    // 刷新右侧视频列表
    async refreshVideoList() {
      if (!this.videoDialog) {
        return;
      }
      // 5秒的轮询
      await this.$getTimeout(5000);
      const [beginRecordTimestamp, endRecordTimestamp] = this.dateFilter;
      await this.getTableList({
        beginRecordTimestamp,
        endRecordTimestamp,
      });
      await this.refreshVideoList();
    },
    async getTableList(payload) {
      await this.getVideoList(payload);
      this.options.rowData = this.videoList;
    },
    // 重新加载视频
    async refreshVideo(item) {
      const result = await this.reloadVideo({
        ...item,
      });
      if (result) {
        const currentVideoObj = await this.getVideoById(item.videoRecordId);
        // 只更新当前点击的数据
        this.$refs.videoGrid.gridApi.applyTransaction({ update: [currentVideoObj] });
      }
    },
    async filterRecord([beginRecordTimestamp, endRecordTimestamp]) {
      this.getTableList({
        beginRecordTimestamp,
        endRecordTimestamp,
      });
    },
    // 播放视频
    playVideo(item) {
      this.videoObj = {
        ...item,
        showVideo: true,
      };
    },
    disabledDate(time) {
      // 计算三个月前的日期
      const today = new Date();
      const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());

      // 将三个月前的日期以及更早的日期禁用
      return time.getTime() < threeMonthsAgo.getTime();
    },
    initDate() {
      const beginTime = new Date().setHours(0, 0, 0, 0);
      const endTime = new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000;
      this.dateFilter = [beginTime, endTime];
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      const bomList = await this.getBomList();
      this.bomList = bomList;
      // const [beginRecordTimestamp, endRecordTimestamp] = this.dateFilter;
      // this.getTableList({
      //   beginRecordTimestamp,
      //   endRecordTimestamp,
      // });
      this.refreshVideoList();
    },
  },
};
</script>
<style scoped>
.video-text {
  color: #999;
  font-size: 12px;
  padding-left: 10px;
}
.novideo {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
