<template>
  <div class="d-flex mt-n4 flex-column">
    <div class="">
      <!-- :style="`background: ${getColor(alarmData.type, alarmData.algorithmType)}`" -->
      <v-card elevation="2" style="background: transparent" class="">
        <div class="warn-card-list pa-5" style="color:#fff;">
          <div style="margin:0;">
            <div class="d-flex align-center">
              <!-- <v-icon style="color: #fff;">
                {{ getIcon(alarmData.type, alarmData.algorithmType) }}
              </v-icon> -->
              <span class="text-hidden-overflow mr-3" :title="alarmData.eventName"
                style="color:#fff; font-size: 16px; font-weight: bold">
                {{ alarmData.eventName || '-' }}
              </span>
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
          </div>
          <v-card-text
          style="font-size: 12px; margin: 0; padding: 10px 0; line-height:16px;overflow: auto;"
            :style="`height: ${height - 180}px`">
            {{ alarmData.warnContent || '-' }}
          </v-card-text>
          <div style="font-size: 12px;">{{ alarmData.createTime || '-' }}</div>
          <v-dialog
            width="800"
            persistent
            scrollable
            v-model="dialog"
            max-width="800"
            transition="dialog-transition">
            <template v-slot:activator="{ on, attrs }">
              <div class="d-flex justify-center pt-3">
                <v-btn outlined small color="primary"
                rounded dark v-bind="attrs" v-on="on">
                {{ `${$t('homeView.label.viewCurves')}` }}
              </v-btn>
              </div>
            </template>

            <v-card>
              <v-card-title class="text-h5 lighten-2">
                <div class="d-flex align-center">
              <!-- <v-icon style="color: #fff;">
                {{ getIcon(alarmData.type, alarmData.algorithmType) }}
              </v-icon> -->
              <span class="text-hidden-overflow mr-3" :title="alarmData.eventName"
                style="color:#fff; font-size: 16px; font-weight: bold">
                {{ alarmData.eventName }}
              </span>
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
              </v-card-title>

              <v-card-text>
                <DataAlarmChart :item="alarmData" :height="400"></DataAlarmChart>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false">
                  {{ `${$t('homeView.label.close')}` }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import {
  mapActions,
  mapMutations,
  mapGetters,
} from 'vuex';
import DataAlarmChart from '@/components/performanceOptimization/faultDiagnosis/DataAlarmChart.vue';

export default {
  name: 'DataAlarmList',
  components: {
    DataAlarmChart,
  },
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
  created() {

  },
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
          return this.$t('homeView.label.ichart');
        case '2':
          return this.$t('homeView.label.subgroup');
        default:
          return this.$t('homeView.label.capabilityAnalysis');
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
