<template>
    <div class="score-warp d-flex flex-column">
        <div class="score-title my-2 pb-1 text-subtitle-1">
            {{ scoreTitle }}</div>
        <div class="score-content d-flex flex-column justify-space-between">
          <div class="score-content-top">
             {{ scoreData.name }}
          </div>
          <div class="score-content-bottom d-flex justify-space-between">
            <div class="score-content-left d-flex pt-2">
                        <div class="mr-2 ml-1 mt-1 rounded"
                        :style="`background-color: ${scortItem.blockColor};
            width: ${blockWidth}px;height: ${blockHeight}px;`"></div>
            <div class="content-left-score d-flex flex-column">
              <div>{{ scoreData.number }}</div>
              <div>{{ scortItem.status }}</div>
            </div>
            </div>
            <div class="score-content-right">
                <!-- <div class="score-content-right-title text-no-wrap text-body-2">
                    {{ scoreData.number }}
                </div> -->
                <div class="score-content-right-score">
                    <span class="text-h3">
                        {{ scoreData.score }}
                    </span>
                    <span class="text-body-2">
                      {{ `${$t('repairSuggestionDetail.label.score')}` }}
                    </span>
                </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'ScoreDisplayHighLow',
  props: {
    scoreData: {
      type: Object,
      default: () => ({}),
    },
    scoreTitle: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      blockWidth: 10,
      blockHeight: 28,
    };
  },
  components: {
  },
  computed: {
    statusList() {
      const list = [
        {
          status: this.$t('repairSuggestionDetail.label.healthy'),
          statusCode: 1,
          icon: 'mdi-leaf',
          color: 'rgba(5,96,42,1)',
          bgColor: 'rgba(76, 178, 28, 1)',
          blockColor: 'rgba(76, 178, 28, 1)',
          active: this.isInRange(this.scoreData.score, 90, 100),
        },
        {
          status: this.$t('repairSuggestionDetail.label.relativelyHealthy'),
          statusCode: 2,
          icon: 'mdi-check',
          color: 'rgba(74, 121, 2, 1)',
          bgColor: 'rgba(176, 203, 13, 1)',
          blockColor: 'rgba(164, 186, 30, 1)',
          active: this.isInRange(this.scoreData.score, 70, 90),
        },
        {
          status: this.$t('repairSuggestionDetail.label.subHealthy'),
          statusCode: 3,
          icon: 'mdi-minus',
          color: 'rgba(203, 207, 8, 1)',
          bgColor: 'rgba(255, 255, 0, 0.5)',
          blockColor: 'rgba(217, 222, 14, 1)',
          active: this.isInRange(this.scoreData.score, 50, 70),
        },
        {
          status: this.$t('repairSuggestionDetail.label.earlyWarning'),
          statusCode: 4,
          icon: 'mdi-alert-circle-outline',
          color: 'rgba(255,152,0,1)',
          bgColor: 'rgba(255, 152, 0, 0.5)',
          blockColor: 'rgba(217, 125, 16, 1)',
          active: this.isInRange(this.scoreData.score, 30, 50),
        },
        {
          status: this.$t('repairSuggestionDetail.label.fault'),
          statusCode: 5,
          icon: 'mdi-close',
          color: 'rgba(211, 6, 31,1)',
          bgColor: 'rgba(217, 0, 27, 0.5)',
          blockColor: 'rgba(201, 14, 36, 1)',
          active: this.isInRange(this.scoreData.score, 0, 30),
        },
      ];
      // const activeStatus = list.find((item) => item.statusCode === this.status);
      // if (activeStatus) {
      //   activeStatus.active = true;
      // }
      return list;
    },
    scortItem() {
      return this.statusList.find((ele) => ele.active);
    },
  },
  created() {
  },
  methods: {
    // 判断数据在某一个区间
    isInRange(num, min, max) {
      return (num === 0 && min === 0) ? true : (num > min && num <= max);
    },
  },
};
</script>
<style lang="scss" scoped>
.score-warp {
    width: 280px;
    .score-title {
        color: #cbcccc;
        // font-size: 16px;
        border-bottom: 1px solid rgba(106, 139, 157, 1);
    }

    .score-content {
        border-bottom: 1px solid rgba(106, 139, 157, 1);
        .score-content-top {
          width: 100%;
          vertical-align: text-top;
          color: var(--v-primary-base);
          font-size: 16px;
          font-weight: bold;
          // height: 22px;
          // line-height: 22px;
        }
        .score-content-bottom {

          .score-content-left {
                .content-left-score {
                    font-size: 12px;
                }
          }

          .score-content-right {
              .score-content-right-title {
                  vertical-align: top;
                  text-align: end;
                  font-size: 14px;
              }

              .score-content-right-score {
                  display: flex;
                  justify-content: end;
                  align-items: end;
                  span:first-child {
                      font-size: 38px;
                      font-weight: bold;
                  }
                  span:last-child {
                      font-size: 14px;
                  }
              }
          }
        }
    }
}
.text-hidden-overflow{
  width: 125px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
