<template>
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    width="1100"
    transition="dialog-transition"
  >
    <v-card
      style="overflow: hidden"
      height="600"
    >
      <v-row>
        <v-col>
          <v-card-title primary-title>
            <span>
              {{ $t('alarmMonitor.dialog.alarmvideo') }}
            </span>
            <v-btn
              icon
              small
              class="ml-2"
              @click="refreshVideo"
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
              <v-col cols="4">
                <!-- 相机 -->
                <span class="camera">
                  <v-btn
                    class="ma-2 edit-camera"
                    outlined
                    x-small
                    fab
                    color="primary"
                    @click="editCameraDialog = true"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <div class="font-weight-medium subtitle-1">
                    {{ $t('alarmMonitor.dialog.camera') }}
                  </div>
                  <v-card
                    outlined
                    height="100"
                  >
                    <v-card-text class="alarm-info">
                      <div class="video-info">
                        <span> {{ $t('alarmMonitor.dialog.ip') }}：</span>
                        <span>{{ monitorInfo.cameraIp || '--' }}</span>
                      </div>
                      <div class="video-info">
                        <span> {{ $t('alarmMonitor.dialog.port') }}：</span>
                        <span>{{ monitorInfo.cameraPort || '--' }}</span>
                      </div>
                      <div class="video-info">
                        <span> {{ $t('alarmMonitor.dialog.thoroughfare') }}：</span>
                        <span>{{ monitorInfo.cameraThoroughfare || '--' }}</span>
                      </div>
                    </v-card-text>
                  </v-card>
                </span>
                <!-- 报警位置 -->
                <span>
                  <div class="mt-2 font-weight-medium subtitle-1">
                    {{ $t('alarmMonitor.dialog.alarmlocation') }}
                  </div>
                  <v-card
                    outlined
                    height="100"
                  >
                    <v-card-text class="alarm-info">
                      <div class="video-info">
                        <span> {{ $t('alarmMonitor.dialog.foldername') }}：</span>
                        <span> {{ monitorInfo.bomName || '--' }}</span>
                      </div>
                      <div class="video-info">
                        <span> {{ $t('alarmMonitor.dialog.partname') }}：</span>
                        <span>{{ monitorInfo.partName || '--' }}</span>
                      </div>
                    </v-card-text>
                  </v-card>
                </span>
                <!-- 报警信息 -->
                <span>
                  <div class="mt-2 font-weight-medium subtitle-1">
                    {{ $t('alarmMonitor.dialog.alarminfo') }}
                  </div>
                  <v-card
                    outlined
                    height="208"
                  >
                    <v-card-text class="alarm-info">
                      <div class="video-info">
                        <span> {{ $t('alarmMonitor.dialog.alarmtime') }}</span>
                        <div>
                          {{
                            monitorInfo.alarmStartTimestamp
                              ? this.$getFormatDate(
                                  monitorInfo.alarmStartTimestamp,
                                  'yyyy-MM-DD HH:mm:ss',
                                )
                              : '--'
                          }}
                        </div>
                      </div>
                      <div class="video-info">
                        <span> {{ $t('alarmMonitor.table.alarmCode') }}</span>
                        <div>{{ monitorInfo.alarmCode || '--' }}</div>
                      </div>
                      <div class="video-info">
                        <span> {{ $t('alarmMonitor.table.alarmName') }}</span>
                        <div>{{ monitorInfo.alarmName || '--' }}</div>
                      </div>
                    </v-card-text>
                  </v-card>
                </span>
              </v-col>
              <v-col cols="8">
                <div class="ml-3">
                  <div class="mt-2 font-weight-medium subtitle-1">
                    {{ $t('alarmMonitor.dialog.video') }}
                    <v-btn
                      x-small
                      dense
                      class="text-none"
                      :color="loadColor"
                      v-if="monitorInfo.cameraIp"
                    >
                      {{ loadStatus }}
                    </v-btn>
                    <v-btn
                      small
                      icon
                      class="text-none ml-3"
                      color="primary"
                      @click="handleDownload"
                      v-if="monitorInfo.videoPath && +monitorInfo.monitorLoadingStatus === 1"
                    >
                      <v-icon>mdi-tray-arrow-down</v-icon>
                    </v-btn>
                  </div>

                  <div class="d-flex video-text">
                    <span> {{ $t('alarmMonitor.dialog.videoduration') }}：1min </span>
                    <span class="ml-5">
                      {{ $t('alarmMonitor.table.alarmStartTimestamp') }}：
                      {{
                        monitorInfo.alarmStartTimestamp
                          ? $getFormatDate(monitorInfo.alarmStartTimestamp, 'yyyy-MM-DD HH:mm:ss')
                          : '--'
                      }}
                    </span>
                    <span class="ml-3">
                      {{ $t('alarmMonitor.table.alarmEndTimestamp') }}：
                      {{
                        monitorInfo.alarmEndTimestamp
                          ? $getFormatDate(monitorInfo.alarmEndTimestamp, 'yyyy-MM-DD HH:mm:ss')
                          : '--'
                      }}
                    </span>
                    <v-spacer></v-spacer>
                    <v-btn
                      x-small
                      dense
                      class="text-none"
                      color="primary"
                      v-if="
                        monitorInfo.monitorLoadingStatus == 2 && isBtnAccess('basic:monitor:reload')
                      "
                      @click="handleReload"
                    >
                      {{ $t('alarmMonitor.btn.redownload') }}
                    </v-btn>
                  </div>
                  <!--  -->
                  <v-card
                    outlined
                    height="450"
                  >
                    <video
                      v-if="monitorInfo.videoPath"
                      ref="videoRef"
                      disabled
                      width="100%"
                      height="100%"
                      controls
                      style="margin: 0 auto; display: block"
                    >
                      <track kind="captions" />
                      <source
                        :src="monitorInfo.videoPath"
                        type="video/mp4"
                      />
                    </video>
                    <!-- <div
                      class="novideo"
                      v-if="monitorInfo.cameraIp && monitorInfo.monitorLoadingStatus==='0'"
                    >
                      视频加载中
                    </div> -->
                    <div
                      class="novideo"
                      v-if="!monitorInfo.videoPath"
                    >
                      {{ $t('alarmMonitor.label.noVideo') }}
                    </div>
                  </v-card>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
    <EditCameraDialog
      :editCameraDialog="editCameraDialog"
      :monitorInfo="monitorInfo"
      @closeDialog="editCameraDialog = false"
      @getTableList="refreshVideo"
    />
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
  mapGetters,
} from 'vuex';
import _ from 'lodash';
import VideoView from '@/components/commonUI/preview/VideoView.vue';
import EditCameraDialog from './EditCameraDialog.vue';

export default {
  name: 'VideoDialog',
  props: {
    videoDialog: {
      type: Boolean,
      required: true,
    },
    alarmMonitorId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      editCameraDialog: false,
    };
  },
  components: {
    VideoView,
    EditCameraDialog,
  },
  computed: {
    ...mapState('helper', ['currentLocale']),
    ...mapState('alarmMonitor', ['monitorInfo']),
    ...mapGetters('user', ['isBtnAccess']),
    dialog: {
      get() {
        return this.videoDialog;
      },
      set() {
        this.setMonitorInfo({});
        this.$emit('closeDialog');
      },
    },
    rules() {
      return this.$getOperatorRules();
    },
    loadStatus() {
      const {
        monitorInfo: { monitorLoadingStatus },
      } = this;
      if (monitorLoadingStatus === '0') {
        return this.$t('alarmMonitor.btn.loading');
      }
      if (monitorLoadingStatus === '1') {
        return this.$t('alarmMonitor.btn.loadsuccess');
      }
      if (monitorLoadingStatus === '2') {
        return this.$t('alarmMonitor.btn.loadfail');
      }
      return '-';
    },
    loadColor() {
      const {
        monitorInfo: { monitorLoadingStatus },
      } = this;
      if (monitorLoadingStatus === '0') {
        return 'primary';
      }
      if (monitorLoadingStatus === '1') {
        return 'success';
      }
      if (monitorLoadingStatus === '2') {
        return 'error';
      }
      return '';
    },
    monitorLoadingStatus() {
      return this.monitorInfo.monitorLoadingStatus;
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('alarmMonitor', ['getMonitorInfo', 'reloadAlarmVideo']),
    ...mapMutations('alarmMonitor', ['setMonitorInfo']),

    // 获取报警视频，添加了防抖
    debounceGetMonitorVideo: _.debounce(
      // eslint-disable-next-line func-names
      async function () {
        if (!this.videoDialog || this.monitorInfo.monitorLoadingStatus === '1') {
          return;
        }
        await this.getMonitorInfo(this.alarmMonitorId);
        this.debounceGetMonitorVideo();
      },
      5000,
    ),
    // 刷新视频
    async refreshVideo() {
      await this.getMonitorInfo(this.alarmMonitorId);
      if (this.$refs.videoRef) {
        this.$refs.videoRef.load();
      }
    },
    // 重新加载视频
    async handleReload() {
      const result = await this.reloadAlarmVideo({
        ...this.monitorInfo,
      });
      if (result) {
        // 重新获取列表视频
        await this.getMonitorInfo(this.alarmMonitorId);
      }
    },
    handleDownload() {
      const {
        monitorInfo: { videoPath },
      } = this;
      fetch(videoPath)
        // eslint-disable-next-line no-return-await
        .then(async (res) => await res.blob())
        .then((blob) => {
          // 创建隐藏的可下载链接
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = URL.createObjectURL(blob);
          // 保存下来的文件名
          a.download = '报警视频';
          document.body.appendChild(a);
          a.click();
          // 移除元素
          document.body.removeChild(a);
        });
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      await this.getMonitorInfo(this.alarmMonitorId);
      this.debounceGetMonitorVideo();
    },
  },
};
</script>
<style scoped lang="scss">
.alarm-info {
  padding: 10px 8px;
  font-size: 14px;
  div {
    color: #999;
  }
}
.camera {
  position: relative;
  .edit-camera {
    position: absolute;
    top: 24px;
    right: 0;
    z-index: 9;
  }
}
.video-text {
  color: #c6c6c6;
}
.novideo {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.video-info {
  font-size: 14px;
  // span:first-child {
  //   color: #333;
  // }
}
</style>
