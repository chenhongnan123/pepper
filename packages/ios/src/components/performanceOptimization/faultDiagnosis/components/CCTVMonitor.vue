<template>
  <div class="cctv-monitor pr-2">
    <div class="primary--text font-weight-bold">
      <div class="title">
        <img src="@/assets/icons/img/health/title-icon.png" height="22" alt="">
        {{ $t('faultDiagnosisPLCDetail.CCTVMonitoring') }}
      </div>
      <div class="title-info">
        <div class="title-info-left">
          <img src="@/assets/icons/img/health/title-line.png" alt="">
        </div>
        <div class="title-info-right">
            <span class="tag">
              {{ $t('faultDiagnosisPLCDetail.videoDuration') }}：<span>1min</span>
            </span>
            <span class="tag ml-4">
              {{ $t('faultDiagnosisPLCDetail.createTime') }}：<span>{{ data.createTime }}</span>
            </span>
            <v-btn
                outlined
                :color="status[data.monitorLoadingStatus] || ''"
                height="24px"
                style="font-size: 12px;"
                >
                {{{
                    0: $t('faultDiagnosisPLCDetail.load'),
                    1: $t('faultDiagnosisPLCDetail.loadComplete'),
                    2: $t('faultDiagnosisPLCDetail.loadFai')
                }[data.monitorLoadingStatus]}}
            </v-btn>
            <v-btn
                v-if="data.monitorLoadingStatus === '2'"
                outlined
                color="primary"
                height="24px"
                style="font-size: 12px;"
                @click="handleReloadVideo"
                rounded>
                {{ $t('faultDiagnosisPLCDetail.retrieve') }}
            </v-btn>
        </div>
      </div>
    </div>
    <div class="cctv-monitor-body">
        <div class="cctv-monitor-body-left">
            <v-card class="bluecard bluecard-decoration-5 rounded-xl" rounded>
                <div class="left-title">{{ $t('faultDiagnosisPLCDetail.cameraInformation') }}</div>
                <div class="left-info">
                    <div>IP：<span>{{ data.ip }}</span></div>
                    <div>{{ $t('faultDiagnosisPLCDetail.port') }}：<span>{{ data.port }}</span></div>
                    <div>
                      {{ $t('faultDiagnosisPLCDetail.cameraThoroughfare') }}：
                      <span>{{ data.cameraThoroughfare }}</span>
                    </div>
                </div>
            </v-card>
        </div>
        <div class="cctv-monitor-body-right">
          <video
            v-if="data.videoPath"
            ref="video"
            width="100%"
            height="100%"
            controls
            style="margin: 0 auto;display: block;"
          >
            <track kind="captions" />
            <source
              :src="'http://nordisk.natapp1.cc/' + data.videoPath"
              type="video/mp4"
            >
          </video>
          <div class="no-data" v-else>
            {{ $t('faultDiagnosisPLCDetail.noVideo') }}
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CCTVMonitor',
  props: {
    bomId: {
      type: String,
      default: '',
    },
    alarmCodeId: {
      type: String,
      default: '',
    },
    alarmMonitorId: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      status: {
        0: 'primary',
        1: 'primary',
        2: 'error',
      },
    };
  },
  methods: {
    // 重新加载视频
    handleReloadVideo() {
      this.$basicPost('monitor/monitor/reloadVideo', {
        bomId: this.bomId,
        alarmMonitorId: this.alarmMonitorId,
        cameraIp: this.data.ip,
        cameraPort: this.data.port,
        cameraThoroughfare: this.data.cameraThoroughfare,
        cameraAccount: this.data.cameraAccount,
        cameraPassword: this.data.cameraPassword,
      }).then(() => {
        this.$emit('update');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.cctv-monitor {
    height: 100%;
    .no-data {
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
    }
    .left-title {
        padding: 15px 10px 31px;
    }
    .left-info {
        font-size: 16px;
        div {
            padding-bottom: 33px;
            padding-left: 28px;
            color: #00ffff;
            span {
                font-weight: 400;
                color: #fff;
            }
        }
    }
    &-body {
        display: flex;
        height: 100%;
        &-left {
            height: 100%;
            width: 261px;
            .bluecard {
                height: 100%;
            }
        }
        &-right {
            height: 100%;
            margin-left: 6px;
            flex: 1;
            border: 1px solid #797979;
        }
    }
    .title {
      position: relative;
      padding-left: 35px;
      img {
        position: absolute;
        left: 10px;
        top: 5px;
      }
    }
    .title::before {
      content: ' ';
      height: 16px;
      width: 2px;
      background: #34d3f3;
      position: absolute;
      left: 0;
      top: 8px;
    }
    .title-info {
        height: 24px;
        display: flex;
        &-left {
          width: 261px;
          img {
            width: 100%;
            position: relative;
            top: -6px;
          }
        }
        &-right {
            flex: 1;
            font-size: 13px;
            padding-left: 6px;
            .tag {
                span {
                    color: rgba(255, 255, 255, 0.7);
                }
            }
            button {
                position: relative;
                top: -5px;
                float: right;
            }
            button + button {
                margin-right: 8px;
            }
        }
    }
}
</style>
