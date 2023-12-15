<template>
  <div class="bom-health-score d-flex fill-height">
    <v-row no-gutters>
      <v-col :cols="3">
        <div class="flex-c-around">
          <span style="font-size: 12px;color:#b2b2b2;">
            {{ $t('statePrediction.title.dataMonitor') }}
          </span>
          <div class="d-flex">
            <b style="color:black;">
              {{ $t('statePrediction.label.healthScores') }}: </b>
            <b v-if="deviceHealthInfo[bomId]"  class="pl-2" style="color:#000;">
              {{ deviceHealthInfo[bomId].dataMonitor }}
            </b>
            <b  class="pl-2" style="color:#000;" v-else>0</b>
          </div>
        </div>
      </v-col>
      <v-divider
        vertical
        style="color: #e0e0e0;"
      ></v-divider>
      <v-col :cols="3">
        <div class="flex-c-around">
          <span style="font-size: 12px;color:#b2b2b2;">
            {{ $t('statePrediction.label.faultRateAnalysis') }}
          </span>
          <div class="d-flex">
            <b style="color:black;">
              {{ $t('statePrediction.label.healthScores') }}: </b>
            <b v-if="deviceHealthInfo[bomId]"  class="pl-2" style="color:#000;">
              {{ deviceHealthInfo[bomId].failureRate }}
            </b>
            <b  class="pl-2" style="color:#000;" v-else>0</b>
          </div>
        </div>
      </v-col>
      <v-divider
        vertical
        style="color: #e0e0e0;"
      ></v-divider>
      <v-col :cols="3">
        <div class="flex-c-around">
          <span style="font-size: 12px;color:#b2b2b2;">
            {{ $t('statePrediction.label.maintenanceSituation') }}
          </span>
          <div class="d-flex">
            <b style="color:black;">
              {{ $t('statePrediction.label.healthScores') }}: </b>
            <b v-if="deviceHealthInfo[bomId]"  class="pl-2" style="color:#000;">
              {{ deviceHealthInfo[bomId].tpm }}
            </b>
            <b  class="pl-2" style="color:#000;" v-else>0</b>
          </div>
        </div>
      </v-col>
      <v-divider
        vertical
        style="color: #e0e0e0;"
      ></v-divider>
      <v-col :cols="3">
        <div class="flex-c-around">
          <span style="font-size: 12px;color:#b2b2b2;">
            {{ $t('statePrediction.label.residualAnalysis') }}
          </span>
          <div class="d-flex">
            <b style="color:black;">
              {{ $t('statePrediction.label.healthScores') }}: </b>
            <b v-if="deviceHealthInfo[bomId]"  class="pl-2" style="color:#000;">
              {{ deviceHealthInfo[bomId].residualValue }}
            </b>
            <b  class="pl-2" style="color:#000;" v-else>0</b>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';

export default {
  name: 'healthScoreSquareDetail',
  components: {
  },
  data() {
    return {
      clientHeight: document.body.clientHeight,
    };
  },
  props: {
    score: {
      type: [Number, String],
      required: false,
    },
    squareRadius: {
      type: Number,
      required: true,
    },
    partName: {
      type: String,
      required: false,
    },
    partNumber: {
      type: String,
      required: false,
    },
    statusColor: {
      type: String,
      required: true,
      default: '#4cb21c',
    }, // 默认健康绿色
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('statePrediction', ['deviceHealthInfo']),
    bomId() {
      return this.$route.params.id;
    },
  },
  created() {},
  methods: {
    ...mapActions('statePrediction', []),
    ...mapMutations('helper', [
      'setAlert',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.flex-1{
  flex: 1;
}
.bom-health-score{
  width: 100%;
  justify-content: space-between;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  margin: 10px 5px;
  .flex-c-around{
    padding:0 10px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}
  .bgSquare {
    background-color:  #f2f2f2;
  }
  .scoreTitle {
    font-size: 14px;
    color: #333333;
  }
  .score-subtitle {
    font-size: 12px;
    color: #b2b2b2;
  }
</style>
