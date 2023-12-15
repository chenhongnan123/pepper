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
        <div
          class="div-transparent overflow-y-auto pa-2 d-flex justify-end"
        >
          <v-btn
            icon
            color="primary"
            x-small
            class="mr-2"
          >
            <v-icon>mdi-arrow-collapse-left</v-icon>
          </v-btn>
          <v-btn
            icon
            color="primary"
            x-small
          >
            <v-icon>mdi-arrow-collapse-left</v-icon>
          </v-btn>
        </div>
        <div class="slider-container">
           <v-slider
            v-model="sliderValue"
            hide-details
            class="mx-0"
            @change="initMouseEvent"
          ></v-slider>
        </div>
        <div
          class="overflow-y-auto"
          :style="`height:${topHeight + bottomHeight - 24 - 36}px`"
        >
          <v-charts-x-range
            ref="xcharts"
            :xrangedata="xRangeChartData"
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
import VChartsXRange from './VChartsXRange.vue';

let slidertimeout = null;
export default {
  name: 'timeBackMain',
  data() {
    return {
      clientheight: document.body.clientHeight,
      clientWidth: document.body.clientWidth,
      sliderValue: 0,
      isExtend: true,
      xRangeChartData: [{
        x: 1701148456160,
        x2: 1701148456160 + 1000,
        y: 0,
        color: '#fff',
      }, {
        x: 1701148456160 + 2000,
        x2: 1701148456160 + 6500,
        y: 1,
        color: '#fff',
        labelrank: 2,
      }, {
        x: 1701148456160 + 4000,
        x2: 1701148456160 + 5000,
        y: 2,
      }, {
        x: 1701148456160 + 6000,
        x2: 1701148456160 + 7000,
        y: 1,
      }, {
        x: 1701148456160 + 8000,
        x2: 1701148456160 + 10000,
        y: 2,
      }],
      lineChartData: [],
    };
  },
  components: {
    VChartsXRange,
  },
  mounted() {
    const sliderElement = document.querySelector('.v-slider__thumb-container');
    sliderElement.style.position = 'relative';
    sliderElement.innerHTML += '<div class="drag-line"></div>';
  },
  computed: {
    ...mapState('timeBack', [
      'timeRange',
      'monitorList',
      'recordList',
      'xrangeChartDataList',
      'lineChartDataList',
      'storageFrequencyList',
    ]),
    topHeight() {
      return 200;
    },
    bottomHeight() {
      return this.clientheight - 200 - 98 - 77 - 16;
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
    initMouseEvent(sliderValue) {
      const { clientWidth, isExtend } = this;
      clearTimeout(slidertimeout);
      slidertimeout = setTimeout(() => {
        const element = document.querySelector('.highcharts-root');
        console.log(element, 'element');
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
      }, 0);
    },
    goVideoDetail(video) {
      this.setSelectedVideo(video);
      this.$router.push({ name: 'timeBackVideoDetail' });
    },
  },
  watch: {
    xrangeChartDataList: {
      handler(xrangeChartDataList) {
        this.xRangeChartData = xrangeChartDataList.map((data, index) => {
          if (data.chartDataType === 'monitor') {
            const obj = {
              x: data.alarmStartTimestamp,
              x2: data.alarmEndTimestamp,
              y: index,
              color: '#9e0e20',
              name: data.alarmCode,
              alarmName: `${data.alarmCode}:${data.alarmName}`,
              bomParentName: data.bomParentName || '-',
              bomName: data.bomName || '-',
            };
            return obj;
          }
          if (data.chartDataType === 'record') {
            const obj = {
              x: new Date(data.createTime).getTime(),
              x2: new Date(data.createTime).getTime() + 60 * 1000,
              y: index,
              color: '#f59a23',
              name: '',
              alarmName: `${data.algorithm}:${data.eventName}`,
              bomParentName: data.bomParentName || '-',
              bomName: data.bomName || '-',
            };
            return obj;
          }
          return {};
        });
        this.$nextTick(() => {
          this.$refs.xcharts.init();
        });
      },
      immediate: true,
    },
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
