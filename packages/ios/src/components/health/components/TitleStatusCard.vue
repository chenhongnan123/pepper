<template>
  <div class="warp d-flex flex-column pa-4">
    <div class="d-flex justify-space-between py-2">
      <div class="title-left">
        <div class="title-name text-hidden-overflow">
          {{ titleStatusCardData?.name || '-' }}</div>
        <div class="title-code text-hidden-overflow">
          {{ titleStatusCardData?.number || '-' }}</div>
      </div>
      <div class="title-right d-flex flex-column justify-end"
      v-if="isShow">
        <div class="statusSquare" :style="`height: ${statusHeight}px;`">
          <div :class="`point-${partAlarmTag}`" class="point">
            <!-- <img
  :src="require(`@/assets/icons/img/repairSuggestion/point-${partAlarmTag}.svg`)"
            alt="" /> -->
            <img
              v-if="partAlarmTag === '0'"
              class="alarm-img mr-1"
              :src="require('@/assets/icons/img/fault-diagnosis/normalalarm.png')"
              alt=""
            />
            <img
              v-if="partAlarmTag === '1'"
              class="alarm-img mr-1"
              :src="require('@/assets/icons/img/fault-diagnosis/dataalarm.svg')"
              alt=""
            />
            <img
              v-if="partAlarmTag === '2'"
              class="alarm-img mr-1"
              :src="require('@/assets/icons/img/fault-diagnosis/plcalarm.png')"
              alt=""
            />
            <img
              v-if="partAlarmTag === '3'"
              class="alarm-img mr-1"
              :src="require('@/assets/icons/img/fault-diagnosis/nonalarm.png')"
              alt=""
            />
            <span>{{ getAlarmText }}</span>
          </div>
        </div>

      </div>
    </div>
    <div>
      <DisplayHealthStatus></DisplayHealthStatus>
    </div>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';
import DisplayHealthStatus from './DisplayHealthStatus.vue';

export default {
  name: 'TitleStatusCard',
  props: {
    titleStatusCardData: {
      type: Object,
      default: () => { },
      required: true,
    },
  },
  data() {
    return {
      statusHeight: 36,
      clientWidth: document.body.clientWidth,

    };
  },
  components: {
    DisplayHealthStatus,
  },
  computed: {
    ...mapState('statePrediction', ['deviceBomDetailInfo']),
    partAlarmTag() {
      return this.deviceBomDetailInfo?.alarmTag;
    },
    getAlarmText() {
      let data = '';
      switch (this.partAlarmTag) {
        case '0':
          data = this.$t('repairSuggestionDetail.label.normal');
          break;
        case '1':
          data = this.$t('repairSuggestionDetail.label.warningPoint');
          break;
        case '2':
          data = this.$t('repairSuggestionDetail.label.alarm');
          break;
        case '3':
          data = this.$t('repairSuggestionDetail.label.noPoint');
          break;
        default:
          data = '-';
          break;
      }
      return data;
    },
    isShow() {
      return this.titleStatusCardData.type === 'detail' && ['0', '1', '2', '3'].indexOf(this.partAlarmTag) > -1;
    },
  },
  created() {
  },
  methods: {
    smaller() {
      return this.clientWidth < 1400;
    },
  },
};
</script>
<style lang="scss" scoped>
.warp {
  width: 500px;
  height: 160px;

  // background: skyblue;
  .title-left {
    flex: 1;

    .title-name {
      font-size: 36px;
      font-weight: bold;
      color: var(--v-primary-base);
      max-width: 500px;
    }

    .title-code {
      font-size: 16px;
      max-width: 470px;
      color: #888b8a;
    }
  }

  .title-right {
    flex: 0 0 20%;

    .statusSquare {
      border-radius: 2px;
      width: 100%;
      color: #f59a23;
      background-color: #57452d;

      .statusText {
        font-size: 13px;
      }
    }
  }
  .point {
  display: flex;
  align-items: center;
  width: 120px;
  height: 36px;
  padding: 2px 2px 2px 16px;
  border-radius: 2px;
  background-color: rgba(245, 154, 35, 0.2);
  font-family: 'Arial', sans-serif;
  text-align: center;
  line-height: normal;
  img {
    width: 18px;
    height: 22px;
    margin-right: 4px;
  }
  span {
    font-size: 14px;
  }
}
  // 正常测点
.point-0 {
  background-color: rgba(52, 211, 243, 0.2);
  color: rgba(52, 211, 243, 0.8);
}
// 数据告警
.point-1 {
  background-color: rgba(245, 154, 35, 0.2);
  color: rgba(245, 154, 35, 0.8);
}
// plc告警
.point-2 {
  background-color: rgba(245, 154, 35, 0.2);
  color: rgba(245, 154, 35, 0.8);
}
// 非测点
.point-3 {
  background-color: rgba(215, 215, 215, 0.2);
  color: rgba(215, 215, 215, 0.8);
}
}
.text-hidden-overflow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

</style>
