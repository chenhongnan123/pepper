<template>
  <div>
    <v-row dense>
      <v-col :cols="isExtend ? 3 : 1">
        <div
          :style="`height:${bottomHeight + topHeight + 8}px`"
          class="div-transparent overflow-y-auto pa-2"
        >
          <div class="d-flex align-center">
            <v-icon
              color="primary"
            >mdi-database-outline</v-icon>
            <span class="ml-2 font-weight-bold" v-if="isExtend">{{ $t('timeBack.video') }}</span>
            <v-spacer></v-spacer>
            <v-btn
              icon
              color="primary"
              @click="handleExpend"
            >
              <v-icon>{{`mdi-arrow-collapse-${isExtend ? 'left': 'right'}`}}</v-icon>
            </v-btn>
          </div>
          <div
            :style="`height:${bottomHeight + topHeight - 36 - 8}px`"
            class="overflow-y-auto pa-2"
          >
            <template
              v-for="video in monitorList"
            >
              <v-row
                :key="video.sid"
                no-gutters
                justify="center"
                class="mb-2"
                style="cursor: pointer;"
                @click="goVideoDetail(video)"
              >
                <img
                  width="100%"
                  :src="video.imgPath"
                  alt="Video image"
                >
                <span
                  class="text-subtitle-2 info--text"
                  v-if="isExtend"
                >{{video.createTime}}</span>
              </v-row>
            </template>
          </div>
        </div>
      </v-col>
      <v-col :cols="isExtend ? 9 : 11">
        <video
          :key="selectedVideo.sid"
          id="myVideo"
          ref="video"
          width="100%"
          :height="topHeight"
          controls
          style="margin: 0 auto;display: block;"
          @canplaythrough="videoReady"
          @playing="onplaying"
          @progress="onprogress"
          @durationchange="ondurationchange"
          @timeupdate="ontimeupdate"
        >
          <track kind="captions" />
          <source
            :src="selectedVideo.videoPath"
            type="video/mp4"
          >
        </video>
        <div class="slider-container">
           <v-slider
            v-model="sliderValue"
            hide-details
            class="mx-0"
            @change="initMouseEvent"
            @mousedown="handleSliderMouseDown"
            @mouseup="handleSliderMouseUp"
          ></v-slider>
        </div>
        <div
          class="overflow-y-auto"
          :style="`height:${bottomHeight}px`"
        >
          <v-charts-line
            ref="xcharts"
            :linedata="lineChartData"
            :timeRange="timeRange"
            :height="bottomHeight"
          />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import VChartsLine from './VChartsLine.vue';

let slidertimeout = null;
export default {
  name: 'timeBackVideoDetail',
  data() {
    return {
      clientheight: document.body.clientHeight - 150,
      clientWidth: document.body.clientWidth,
      sliderValue: 0,
      isExtend: true,
      timeRange: [],
      lineChartData: [],
      video: null,
    };
  },
  components: {
    VChartsLine,
  },
  mounted() {
    const sliderElement = document.querySelector('.v-slider__thumb-container');
    sliderElement.style.position = 'relative';
    sliderElement.innerHTML += '<div class="drag-line"></div>';
    this.init();
  },
  computed: {
    ...mapState('timeBack', [
      'monitorList',
      'selectedVideo',
      'lineChartDataList',
      'storageFrequencyList',
    ]),
    topHeight() {
      return this.clientheight * 0.55;
    },
    bottomHeight() {
      return this.clientheight * 0.45 - 36;
    },
  },
  methods: {
    ...mapMutations('timeBack', [
      'setSelectedVideo',
    ]),
    handleExpend() {
      this.isExtend = !this.isExtend;
      this.sliderValue = 0;
      this.$nextTick(() => {
        this.$refs.xcharts.init();
      });
    },
    init() {
      this.sliderValue = 0;
      this.video = document.getElementById('myVideo');
      const { alarmStartTimestamp } = this.selectedVideo;
      if (alarmStartTimestamp) {
        this.timeRange = [alarmStartTimestamp - 30 * 1000, alarmStartTimestamp + 30 * 1000];
      } else {
        this.timeRange = [];
      }
    },
    handleSliderMouseDown() {
      this.video.pause();
    },
    handleSliderMouseUp() {
      this.video.play();
    },
    initMouseEvent(sliderValue, isVideoControl) {
      const { clientWidth, isExtend } = this;
      clearTimeout(slidertimeout);
      slidertimeout = setTimeout(() => {
        const element = document.querySelector('.highcharts-root');
        console.log(element, 'element');
        if (!element) {
          return;
        }
        const elementWidth = element.clientWidth;
        // 获取要模拟鼠标滑动的元素
        const eventLeft = (elementWidth * sliderValue) / 101.68243953732912;
        console.log(elementWidth, 'elementWidth');
        console.log(eventLeft, 'eventLeft');
        const xoffset = 12 + (clientWidth - 24) / 3
          + (((clientWidth - 24) * 2) / 3 - 8) / (isExtend ? 4 : 12) + 4 + 9;
        console.log(xoffset, 'xoffset');
        // 创建鼠标滑动事件
        const event = new MouseEvent('mousemove', {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: eventLeft + xoffset, // 鼠标相对于窗口的 X 坐标
          clientY: 100, // 鼠标相对于窗口的 Y 坐标
        });
        console.log(event, 'event');
        // 模拟鼠标滑动事件
        element.dispatchEvent(event);
        if (!isVideoControl) {
          this.video.currentTime = (60 * sliderValue) / 100;
        }
      }, 0);
    },
    videoReady(e) {
      console.log(e, 'videoReady');
    },
    onplaying(e) {
      console.log(e, 'onplaying');
    },
    onprogress(e) {
      console.log(e, 'onprogress');
    },
    ondurationchange(e) {
      console.log(e, 'ondurationchange');
    },
    goVideoDetail(video) {
      this.setSelectedVideo(video);
      this.init();
    },
    ontimeupdate() {
      // console.log(e, 'ontimeupdate');
      // console.log(e, 'ontimeupdate');
      // const currentTime = { video };
      console.log(this.video.currentTime, '`Current time');
      this.sliderValue = (this.video.currentTime / 60) * 100;
      this.initMouseEvent(this.sliderValue, 1);
    },
  },
  watch: {
    lineChartDataList: {
      handler(lineChartDataList) {
        const { storageFrequencyList } = this;
        this.lineChartData = lineChartDataList.map((line) => {
          const obj = {
            ...line,
          };
          if (line.storageFrequency) {
            const storageFrequency = storageFrequencyList
              .find((sf) => sf.value === line.storageFrequency);
            if (storageFrequency) {
              obj.storageFrequencyName = storageFrequency.text;
            }
          }
          return obj;
        });
        this.$nextTick(() => {
          this.$refs.xcharts.init();
        });
      },
      immediate: true,
    },
  },
};
</script>
