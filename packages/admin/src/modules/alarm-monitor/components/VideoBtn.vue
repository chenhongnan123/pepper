<template>
  <div>
    <v-btn
      small
      icon
      class="text-none"
      color="primary"
      @click="handleOpenDialog"
      v-if="isBtnAccess('basic:record:query')"
    >
      <v-icon>mdi-video-outline</v-icon>
    </v-btn>
    <v-chip
      class="ml-2"
      :color="statusColor"
      small
    >
      {{ statusText }}
    </v-chip>
    <VideoDialog
      @closeDialog="handleCloseDialog"
      :videoDialog="videoDialog"
      :alarmMonitorId="alarmMonitorId"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VideoDialog from './dialog/VideoDialog.vue';

export default {
  name: 'videoDialog',
  data() {
    return {
      alarmCodeId: null,
      videoDialog: false,
    };
  },
  components: {
    VideoDialog,
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    alarmMonitorId() {
      return this.params.data.alarmMonitorId;
    },
    statusText() {
      const { params: { data } } = this;
      const value = data.monitorLoadingStatus;
      if (value === '0') {
        return this.$t('alarmMonitor.btn.loading');
      }
      if (value === '1') {
        return this.$t('alarmMonitor.btn.loadsuccess');
      }
      if (value === '2') {
        return this.$t('alarmMonitor.btn.loadfail');
      }
      return '--';
    },
    statusColor() {
      const { params: { data } } = this;
      const value = data.monitorLoadingStatus;
      if (value === '0') {
        return 'primary';
      }
      if (value === '1') {
        return 'success';
      }
      if (value === '2') {
        return 'error';
      }
      return '-';
    },
  },
  methods: {
    handleOpenDialog() {
      this.videoDialog = true;
      // this.params.that.isCancelPolling = true; // 开启弹框时 取消定时轮询
    },
    handleCloseDialog() {
      this.videoDialog = false;
      // this.params.that.isCancelPolling = false;
      // this.params.that.debounceGetTableList(); // 关闭弹框，手动调用一下，开启定时轮询
    },
    handleDownload() {
      const { params } = this;
      const { videoPath } = params.data;
      // eslint-disable-next-line no-unreachable
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
};
</script>
