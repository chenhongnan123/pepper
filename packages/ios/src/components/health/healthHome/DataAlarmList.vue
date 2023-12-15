<template>
  <div class="d-flex mt-n4 flex-column">
      <!-- :style="`background: ${getColor(alarmData.type, alarmData.algorithmType)}`" -->
      <v-card elevation="2" style="background: transparent" class="">
        <div class="warn-card-list pa-5" style="color:#fff;">
            <div>
              <!-- <v-icon style="color: #fff;">
                {{ getIcon(alarmData.type, alarmData.algorithmType) }}
              </v-icon> -->
              <div  :title="alarmData.eventName"
                style="color:#fff; font-size: 16px; font-weight: bold;max-width: 500px;"
                class="text-hidden-overflow mr-3">
                {{ alarmData.eventName || '-' }}
              </div>
              <v-chip pill small color="rgba(242,242,242,0.20)" style="color: #b2b2b2;">
                <span>
                  {{ getArithmetic(alarmData.type) }}
                </span>
                <span v-show="alarmData.type == 0"> | </span>
                <span v-show="alarmData.type == 0">{{ getAlgorithmType(alarmData.algorithmType) }}
                </span>
                <span v-show="alarmData.type == 0"> | </span>
                <span v-show="alarmData.type == 0">{{ alarmData.algorithm }}</span>
              </v-chip>
            </div>
          <v-card-text
          style="font-size: 12px; margin: 0; padding: 10px 0; line-height:16px;overflow: auto;"
            :style="`height: ${height - 216}px`">
            {{ alarmData.warnContent || '-' }}
          </v-card-text>
          <div style="font-size: 12px;">{{ alarmData.createTime || '-' }}</div>
        </div>
      </v-card>
  </div>
</template>

<script>
import {
  mapActions,
  mapMutations,
  mapGetters,
} from 'vuex';

export default {
  name: 'DataAlarmList',
  components: {},
  data() {
    return {
      clientHeight: document.body.clientHeight,
      statusHeight: 38,
      dialog: false,
    };
  },
  props: {
    alarmData: {
      type: Object,
      default: () => ({}),
    },
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
    barHeight() {
      return this.height - this.statusHeight;
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
    getAlgorithmType(type) {
      switch (type) {
        case '1':
          return this.$t('homeView.algorithmType.singleValue');
        case '2':
          return this.$t('homeView.iew.algorithmType.subgroup');
        default:
          return this.$t('homeView.algorithmType.capabilityAnalysis');
      }
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
.text-hidden-overflow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.warn-card-list {
  // padding: 20px ;
}
</style>
