<template>
    <div class="warp ma-2 pa-2">
        <GeneralTitle
        :title="`${$t('repairSuggestionDetail.label.tips')}`">
      </GeneralTitle>
        <div class="tip-card d-flex  mt-4 pa-4 rounded">
            <div class="tip-card-icon justify-center align-center">
                <v-icon class="card-icon">mdi-bell-outline</v-icon>
            </div>
            <div class="tip-card-content d-flex flex-column justify-space-between">
              <div class="mb-7">
                <div class="tip-card-content-title">
                    {{ `${$t('repairSuggestionDetail.label.dataMonitor')}：` }}
                </div>
                <div class="tip-card-content-message">
                      {{ monitorWaveTime }}
                    </div>
              </div>
              <div class="mb-7">
                <div class="tip-card-content-title">
                    {{ `${$t('repairSuggestionDetail.label.faultRateAnalysis')}：` }}
                </div>
                <div class="tip-card-content-message">
                      {{ troubleUntreated }}
                    </div>
              </div>
              <div class="mb-7">
                <div class="tip-card-content-title">
                    {{ `${$t('repairSuggestionDetail.label.maintenanceSituation')}：` }}
                </div>

                <div
                    class="tip-card-content-message">
                      {{ maintenanceOverTime }}
                    </div>
              </div>
              <div class="mb-7">
                <div class="tip-card-content-title">
                    {{ `${$t('repairSuggestionDetail.label.residualAnalysis')}：` }}
                </div>

                <div
                    class="tip-card-content-message">
                      {{ residualLife }}
                    </div>
              </div>

            </div>
        </div>
    </div>
</template>

<script>
import {
  mapState,
} from 'vuex';
import GeneralTitle from '../components/GeneralTitle.vue';

export default {
  name: 'TipCard',
  data() {
    return {
      statusHeight: 36,
      clientWidth: document.body.clientWidth,

    };
  },
  components: {
    GeneralTitle,
  },
  computed: {
    ...mapState('statePrediction', ['mainDeviceInfo', 'mainDevice', 'partList', 'deviceHealthInfo',
      'bomList', 'partAnnexInfo', 'partHealthDetailInfo',
    ]),
    bomId() {
      return this.$route.params.id;
    },
    partHeathInfo() {
      return this.deviceHealthInfo[this.bomId];
    },
    monitorWaveTime() {
      const params = {
        eventException: this.partHealthDetailInfo?.eventException,
        monitorWaveTime: this.partHealthDetailInfo?.monitorWaveTime,
      };
      return this.$t('repairSuggestionDetail.tips.monitorWaveTime', params);
    },
    troubleUntreated() {
      const params = {
        troubleWarn: this.partHealthDetailInfo?.troubleWarn,
        troubleUntreated: this.partHealthDetailInfo?.troubleUntreated,
      };
      return this.$t('repairSuggestionDetail.tips.troubleUntreated', params);
    },
    residualLife() {
      const params = {
        lifeType: this.partHealthDetailInfo?.lifeType === '1'
          ? this.$t('repairSuggestionDetail.label.count')
          : this.$t('repairSuggestionDetail.label.day'),
        residualLife: this.partHealthDetailInfo?.residualLife,
      };
      return this.$t('repairSuggestionDetail.tips.residualLife', params);
    },
    maintenanceOverTime() {
      const params = {
        maintenanceFinish: this.partHealthDetailInfo?.maintenanceFinish,
        maintenanceOverTime: this.partHealthDetailInfo?.maintenanceOverTime,
      };
      return this.$t('repairSuggestionDetail.tips.maintenanceOverTime', params);
    },
  },
  created() {
  },
  methods: {

  },
};
</script>
<style lang="scss" scoped>
.warp {
    width: 100%;
    .tip-card {
        background: rgba(242,242,242,0.10);
        .tip-card-icon {
            flex: 0 0 60px;
            .card-icon {
                color: var(--v-primary-base);
                font-size: 50px;
            }
        }
        .tip-card-content {
            .tip-card-content-title {
                height: 40px;
                font-size:20px;
                font-weight: bold;
            }
            .tip-card-content-message {
                font-size:14px;
                color: rgba(242,242,242,0.80);
                height: 500%;
            }
        }
    }
}
</style>
