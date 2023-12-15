<template>
  <div class="warp d-flex flex-column justify-space-between">
    <div class="title mb-2 text-body-2">
      {{ $t('repairSuggestionDetail.label.healthScores') }}:
    </div>
    <div class="content d-flex flex-column justify-space-between">
      <div class="content-item">
        <div>
          {{ $t('repairSuggestionDetail.label.dataMonitor') }}: </div>
        <div v-if="deviceHealthInfo[bomId]" >
          {{ deviceHealthInfo[bomId].dataMonitor }}
          <span>{{ $t('repairSuggestionDetail.label.score') }}</span>
        </div>
        <div  v-else>0<span>{{ $t('repairSuggestionDetail.label.score') }}</span></div>
      </div>

      <div class="content-item">
        <div>
          {{ $t('repairSuggestionDetail.label.faultRateAnalysis') }}: </div>
        <div v-if="deviceHealthInfo[bomId]" >
          {{ deviceHealthInfo[bomId].failureRate }}
          <span>{{ $t('repairSuggestionDetail.label.score') }}</span>
        </div>
        <div  v-else>0<span>{{ $t('repairSuggestionDetail.label.score') }}</span></div>
      </div>

      <div class="content-item">
        <div>
          {{ $t('repairSuggestionDetail.label.maintenanceSituation') }}: </div>
        <div v-if="deviceHealthInfo[bomId]" >
          {{ deviceHealthInfo[bomId].tpm }}
          <span>{{ $t('repairSuggestionDetail.label.score') }}</span>
        </div>
        <div class="pl-1" v-else>0<span>{{ $t('repairSuggestionDetail.label.score') }}</span></div>
      </div>

      <div class="content-item">
        <div>
          {{ $t('repairSuggestionDetail.label.residualAnalysis') }}: </div>
        <div v-if="deviceHealthInfo[bomId]" >
          {{ deviceHealthInfo[bomId].residualValue }}
          <span>{{ $t('repairSuggestionDetail.label.score') }}</span>
        </div>
        <div  v-else>0<span>{{ $t('repairSuggestionDetail.label.score') }}</span></div>
      </div>
    </div>
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
  created() { },
  methods: {
    ...mapActions('statePrediction', []),
    ...mapMutations('helper', [
      'setAlert',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.warp {
  width: 100%;
  height: 100%;
  padding: 10px 30px 10px 0px;

  .title {
    flex: 0 0 40px;
    color: #b2b2b2;
    height: 40px;
    line-height: 40px;
  }

  .content {
    flex: 1;

    .content-item {
      height: 20%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(106, 139, 157, 1);
      border-bottom: 1px solid rgba(106, 139, 157, 1);
      padding: 0 10px;
      div:first-child {
        font-weight: bold;
        color: var(--v-primary-base);
      }
      div:last-child {
        font-weight: bold;
        font-size:28px;
        span {
          font-weight: lighter;
          font-size:8px ;

        }
      }
    }
  }
}
</style>
