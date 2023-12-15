<template>
  <div class="d-flex flex-column">
    <div class="d-flex statusContainer">
      <div
        v-for="(item, index) in statusList"
        :key="`status_${index}`"
        class="statusSquare"
        :class="index > 0 ? 'ml-2' : ''"
        :style="`width: calc(20% - 6px);height: ${statusHeight}px;
          color: ${item.active ? item.color : defaultStatus.color};
          background-color: ${item.active ? item.bgColor : defaultStatus.bgColor};`"
      >
        <div
          class="text-center"
          :style="`line-height: ${statusHeight}px;`"
        >
          <v-icon
            small
            :style="`color:${item.active ? item.color : defaultStatus.color}`"
          >{{ item.icon }}</v-icon>
          <span
            class="statusText text-truncate"
            :class="smaller ? '' : 'pl-2'"
          >{{ item.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
} from 'vuex';

export default {
  name: 'DisplayHealthStatus',
  components: {
  },
  data() {
    return {
      clientHeight: document.body.clientHeight,
      clientWidth: document.body.clientWidth,
      statusHeight: 36,
    };
  },
  props: {
    // height: {
    //   type: Number,
    //   required: true,
    // },
  },
  computed: {
    ...mapState('statePrediction', ['healthAverage']),
    // healthAverage() {
    //   return 66;
    // },
    smaller() {
      return this.clientWidth < 1400;
    },
    defaultStatus() {
      return {
        bgColor: 'rgba(242,242,242,0.10)',
        color: '#b2b2b2',
      };
    },
    statusList() {
      const list = [
        {
          status: this.$t('repairSuggestionDetail.label.healthy'),
          statusCode: 1,
          icon: 'mdi-leaf',
          color: 'rgba(5,96,42,1)',
          bgColor: 'rgba(76, 178, 28, 1)',
          active: this.isInRange(this.healthAverage, 90, 100),
        },
        {
          status: this.$t('repairSuggestionDetail.label.relativelyHealthy'),
          statusCode: 2,
          icon: 'mdi-check',
          color: 'rgba(74, 121, 2, 1)',
          bgColor: 'rgba(176, 203, 13, 1)',
          active: this.isInRange(this.healthAverage, 70, 90),
        },
        {
          status: this.$t('repairSuggestionDetail.label.subHealthy'),
          statusCode: 3,
          icon: 'mdi-minus',
          color: 'rgba(203, 207, 8, 1)',
          bgColor: 'rgba(255, 255, 0, 0.5)',
          active: this.isInRange(this.healthAverage, 50, 70),
        },
        {
          status: this.$t('repairSuggestionDetail.label.earlyWarning'),
          statusCode: 4,
          icon: 'mdi-alert-circle-outline',
          color: 'rgba(255,152,0,1)',
          bgColor: 'rgba(255, 152, 0, 0.5)',
          active: this.isInRange(this.healthAverage, 30, 50),
        },
        {
          status: this.$t('repairSuggestionDetail.label.fault'),
          statusCode: 5,
          icon: 'mdi-close',
          color: 'rgba(211, 6, 31,1)',
          bgColor: 'rgba(217, 0, 27, 0.5)',
          active: this.isInRange(this.healthAverage, 0, 30),
        },
      ];
      return list;
    },
  },
  created() {
  },
  methods: {
    ...mapActions('statePrediction', []),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    // 判断数据在某一个区间
    isInRange(num, min, max) {
      // return num >= min && num <= max;
      return (num === 0 && min === 0) ? true : (num > min && num <= max);
    },
  },
};
</script>

<style lang="scss" scoped>
  .statusContainer {
    width: 100%;
    .statusSquare {
      border-radius: 2px;
      .statusText {
        font-size: 13px;
      }
    }
  }
</style>
