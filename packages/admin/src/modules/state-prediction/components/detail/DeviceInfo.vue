<template>
  <v-card
    :height="height"
    elevation="0"
    color="bg"
    class="mr-3"
  >
    <v-card-title>
      <div class="part-title font-weight-bold d-flex justify-space-between align-start">
        <div style="width: 80%;">
          <div class="text-hidden-overflow" :title="$route.query?.bomName">
            {{ $route.query?.bomName || '-' }}
          </div>
          <div :title="partAnnexInfo?.partNumber"
            class="subtitle-2 grey--text text-hidden-overflow">
            {{ partAnnexInfo?.partNumber || '-' }}
          </div>
        </div>
        <p class="to-part-detail d-flex">
          <button @click.stop="goPartDetail(partAnnexInfo.partId)">
            {{ $t('statePrediction.title.partDetail') }}
          </button>
          <v-icon dense color="primary">mdi-chevron-right</v-icon>
        </p>
      </div>
    </v-card-title>
    <v-card-text>
      <v-row no-gutters>
        <!-- 设备图片展示 -->
        <v-col cols="6">
          <v-img
            :alt="$t('statePrediction.label.equipmentPicture')"
            :height="contentHeight"
            :width="'100%'"
            cover
            :src="partAnnexInfo.partPic"
            style="border-radius: 2px;"
          ></v-img>
        </v-col>
        <!-- 提示信息 -->
        <v-col
          cols="6"
          class="tipContainer pl-2"
          :style="`height: ${contentHeight}px;`"
        >
          <!-- <div
            class="greyBorder tipText pa-1 mb-2"
            style="height: 30%;overflow-y: auto;"
          >
            {{ getDeviceTipByStatus(4) }}
          </div> -->
          <div
            class="greyBorder pa-1"
            style="height: 100%;overflow: hidden;"
          >
            <div class="pa-1" :style="`height:100%;overflow-y: auto;`">
              <!-- 提示 -->
              <div class="d-flex">
                <div class="tipText mr-auto">
                  {{ `${$t('statePrediction.label.tips')}：` }}
                </div>
              </div>
              <!-- 提示内容 -->
              <div class="tipContent">
                <div>
                  <div class="d-flex flex-column">
                    <span>
                      <v-icon x-small color="gray" class="mr-2">mdi-circle</v-icon>
                      <b style="font-size:12px">
                        {{ $t('statePrediction.label.validRun') }}
                      </b>
                    </span>
                    <span class="text-indent-2"
                      style="font-size:11px;color:#7F7F7F;line-height:14px;">
                      {{ monitorWaveTime }}
                    </span>
                  </div>
                  <div class="d-flex flex-column">
                    <span>
                      <v-icon x-small color="gray" class="mr-2">mdi-circle</v-icon>
                      <b style="font-size:12px">
                        {{ $t('statePrediction.label.faultRateAnalysis') }}
                      </b>
                    </span>
                    <span class="text-indent-2"
                    style="font-size:11px;color:#7F7F7F;line-height:14px;">
                      {{ troubleUntreated }}
                    </span>
                  </div>
                  <div class="d-flex flex-column">
                    <span>
                      <v-icon x-small color="gray" class="mr-2">mdi-circle</v-icon>
                      <b style="font-size:12px">
                        {{ $t('statePrediction.label.maintenanceSituation') }}
                      </b>
                    </span>
                    <span class="text-indent-2"
                      style="font-size:11px;color:#7F7F7F;line-height:14px;">
                        {{ maintenanceOverTime }}
                    </span>
                  </div>
                  <div class="d-flex flex-column">
                    <span>
                      <v-icon x-small color="gray" class="mr-2">mdi-circle</v-icon>
                      <b style="font-size:12px">
                        {{ $t('statePrediction.label.residualAnalysis') }}
                      </b>
                    </span>
                    <span class="text-indent-2"
                      style="font-size:11px;color:#7F7F7F;line-height:14px;">
                      {{ residualLife }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';

export default {
  name: 'DeviceInfo',
  components: {
  },
  data() {
    return {
      clientHeight: document.body.clientHeight,
      currentPage: 1,
    };
  },
  props: {
    height: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('statePrediction', ['mainDeviceInfo', 'mainDevice', 'partList', 'deviceHealthInfo',
      'bomList', 'partAnnexInfo', 'partHealthDetailInfo',
    ]),
    contentHeight() {
      return this.height - 64 - 16 - 20;
    },
    tipContentHeight() {
      return this.contentHeight * 0.68 - 28 - 50;
    },
    bomId() {
      return this.$route.params.id;
    },
    deviceInfo() {
      return {
        id: 1,
        name: this.$t('statePrediction.title.deviceName'),
        code: this.$t('statePrediction.title.deviceNumber'),
        picUrl: 'https://picsum.photos/id/11/500/300',
      };
    },
    monitorWaveTime() {
      const params = {
        eventException: this.partHealthDetailInfo?.eventException,
        monitorWaveTime: this.partHealthDetailInfo?.monitorWaveTime,
      };
      return this.$t('statePrediction.tips.monitorWaveTime', params);
    },
    troubleUntreated() {
      const params = {
        troubleWarn: this.partHealthDetailInfo?.troubleWarn,
        troubleUntreated: this.partHealthDetailInfo?.troubleUntreated,
      };
      return this.$t('statePrediction.tips.troubleUntreated', params);
    },
    residualLife() {
      const params = {
        lifeType: this.partHealthDetailInfo?.lifeType === '1' ? this.$t('statePrediction.tips.count') : this.$t('statePrediction.tips.day'),
        residualLife: this.partHealthDetailInfo?.residualLife,
      };
      return this.$t('statePrediction.tips.residualLife', params);
    },
    maintenanceOverTime() {
      const params = {
        maintenanceFinish: this.partHealthDetailInfo?.maintenanceFinish,
        maintenanceOverTime: this.partHealthDetailInfo?.maintenanceOverTime,
      };
      return this.$t('statePrediction.tips.maintenanceOverTime', params);
    },
    tips() {
      return [
        {
          status: 1,
          text: this.$t('statePrediction.tips.healthy'),
        },
        {
          status: 2,
          text: this.$t('statePrediction.tips.relativelyHealthy'),
        },
        {
          status: 3,
          text: this.$t('statePrediction.tips.subHealthy'),
        },
        {
          status: 4,
          text: this.$t('statePrediction.tips.earlyWarning'),
        },
        {
          status: 5,
          text: this.$t('statePrediction.tips.fault'),
        },
      ];
    },
    partHeathInfo() {
      return this.deviceHealthInfo[this.bomId];
    },
    moduleName() {
      return this.$route.name;
    },
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions('statePrediction', [
      'getMainDeviceInfo',
      'getDeviceSuggestions',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    init() {},
    getDeviceTipByStatus(status) {
      const { tips } = this;
      const tip = tips.find((item) => item.status === status);
      return tip ? tip.text : '';
    },
    getStatusNameByScore(score) {
      if (score <= 30) {
        return this.$t('statePrediction.label.fault');
      }
      if (score > 30 && score <= 50) {
        return this.$t('statePrediction.label.earlyWarning');
      }
      if (score > 50 && score <= 70) {
        return this.$t('statePrediction.label.subHealthy');
      }
      if (score > 70 && score <= 90) {
        return this.$t('statePrediction.label.relativelyHealthy');
      }
      return this.$t('statePrediction.label.healthy');
    },
    goPartDetail(id) {
      if (!id) return;
      this.$router.push({ name: 'statePartDetail', params: { id, page: this.moduleName } });
    },
  },
};
</script>

<style lang="scss" scoped>
  .tipContainer {
    .greyBorder {
      border: 1px solid #e0e0e0;
      border-radius: 6px;
    }
    .tipText {
      color: #b2b2b2;
      font-size: 12px;
      text-align: left;
    }
    .paginationRight {
      text-align: right;
      .paginationText {
        font-size: 12px;
        color: #b2b2b2;
        text-align: left;
        line-height: normal;
      }
    }
    .tipContent {
      font-size: 14px;
      color: #333333;
    }
    .custom-detail-btn {
      ::v-deep() .v-btn {
        height: 28px;
        font-size: 0.75rem;
      }
    }
  }
  .text-indent-2{
    text-indent: 2em;
  }
  .text-hidden-overflow{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .grid-r-3{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  .part-title {
    width: 100%;
  }
  .to-part-detail{
    margin: 0;
    cursor: pointer;
    align-items: center;
    justify-content: end;
    color: #0075C2;
    font-size: 14px;
    font-weight:lighter;
}
</style>
