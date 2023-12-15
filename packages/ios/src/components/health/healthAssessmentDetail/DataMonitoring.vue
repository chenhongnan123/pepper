<template>
    <div class="warp">
        <div class="alart-range pa-2 px-4">
          {{ `${$t('repairSuggestionDetail.title.30AbnormalFluctuations')}` }}：
        </div>
        <v-carousel v-if="allAlarmList.length > 0"
            cycle height="250" delimiter-icon="mdi-circle" hide-delimiter-background
            hide-delimiters>
            <v-carousel-item v-for="(item, i) in allAlarmList" :key="i">
                <div class="carousel-title d-flex align-center rounded px-12">
                    <div class="carousel-card-icon d-flex justify-start align-center mr-2">
                        <v-icon class="card-icon d-flex justify-center align-center">
                            mdi-alert</v-icon>
                    </div>
                    <div class="card-content d-flex justify-center align-center">
                        {{ `${$t('repairSuggestionDetail.title.dataAlarm')}` }}
                    </div>
                    <!-- 分页 -->
                    <div class="carousel-page ml-auto px-2 rounded">
                        {{ i + 1 }}/{{ allAlarmList.length }}
                    </div>
                </div>
                <template>
                    <DataAlarmList class=" px-8" :alarmData="item" :height="310"></DataAlarmList>
                </template>
            </v-carousel-item>
            <template v-slot:prev="{ on, attrs }">
                <v-btn :height="130" :width="20"
                x-small class="high-blue-btn mb-3" v-bind="attrs" v-on="on">
                    <v-icon size="30px" color="primary">mdi-menu-left</v-icon>
                </v-btn>
            </template>
            <template v-slot:next="{ on, attrs }">
                <v-btn :height="130" :width="20"
                x-small class="high-blue-btn" v-bind="attrs" v-on="on">
                    <v-icon size="30px" color="primary">mdi-menu-right</v-icon>
                </v-btn>
            </template>
        </v-carousel>
        <template v-else>
          <div class="carousel-title d-flex align-center rounded px-12">
                    <div class="carousel-card-icon d-flex justify-start align-center mr-2">
                        <v-icon class="card-icon d-flex justify-center align-center">
                            mdi-alert</v-icon>
                    </div>
                    <div class="card-content d-flex justify-center align-center">
                        {{ `${$t('repairSuggestionDetail.title.dataAlarm')}` }}
                    </div>
                </div>
        <div class="no-data">{{
      `${$t('repairSuggestionDetail.title.thereAreNo')}${$t('repairSuggestionDetail.title.alarm')}`
        }}</div>
      </template>
    </div>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import DataAlarmList from './DataAlarmList.vue';

export default {
  name: 'DataMonitoring',
  components: { DataAlarmList },
  data() {
    return {
      clientHeight: document.body.clientHeight,
      statusHeight: 38,
    };
  },
  props: {
    height: {
      type: Number,
      required: false,
    },
    status: {
      type: [Number, String],
      required: false,
    },
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('statePrediction', ['recordList', 'algorithmTypeList', 'algorithmIconList']),
    barHeight() {
      return this.height - this.statusHeight;
    },
    allAlarmList() {
      // return this.algorithmPlcList.concat(this.recordList);
      return this.recordList;
    },
  },
  created() { },
  methods: {
    ...mapActions('statePrediction', []),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    showChart() {
      this.$emit('showChart');
    },
    getColor(type, chilType) {
      let obj = {};
      if (type === '0') {
        obj = this.algorithmTypeList.find((item) => item.dictValue === '0');
      } else {
        obj = this.algorithmTypeList.find((item) => item.dictValue === chilType);
      }
      return `#${obj.dictLabel}`;
    },
    getIcon(type, chilType) {
      let obj = {};
      if (type === '0') {
        obj = this.algorithmIconList.find((item) => item.dictValue === '0');
      } else {
        obj = this.algorithmIconList.find((item) => item.dictValue === chilType);
      }
      return `${obj.dictLabel}`;
    },
    getArithmetic(type) {
      const text = type === '0' ? 'canonical' : 'orientation';
      return this.$t(`repairSuggestionDetail.title.${text}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.warp {
  height: 100%;
}
.alart-range {
    font-size: 20px;
    font-weight: bold;
    color: var(--v-primary-base);

}

.carousel-title {
    flex: 0 0 50px;

    .carousel-card-icon {
        // flex: 0 0 60px;
        height: 100%;
        line-height: 100%;

        .card-icon {
            color: red;
            font-size: 30px;
        }
    }

    .card-content {
        font-size: 20px;
        font-weight: bold;
    }

    .carousel-page {
        font-size: 14px;
        font-weight: lighter;
        background: rgba(242, 242, 242, 0.20);
        color: #b2b2b2;
        height: 32px;
        line-height: 32px;
    }
}

.no-data {
      width: 100%;
      height: calc(100% - 150px);
      display: flex;
      justify-content: center;
      align-items: center;
    }

::v-deep .v-window-item {
    position: relative;
}

::v-deep .v-window__prev {
    position: absolute;
    left: -10px;
    top: calc(50% + 20px);
    transform: translate(0, -50%)
}

::v-deep .v-window__next {
    position: absolute;
    right: -10px;
    top: calc(50% + 20px);
    transform: translate(0, -50%)
}
</style>
