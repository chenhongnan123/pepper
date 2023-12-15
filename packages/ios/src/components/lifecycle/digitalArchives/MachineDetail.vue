<template>
  <div >
    <!-- 零件信息卡片 -->
    <div class="custom-card">
      <v-card
        class="cardContainer rounded-lg rightcard mt-7 mb-7"
        :style="`height: ${cardHeight}px`"
        rounded
      >
        <v-card-text
          :style="`height: ${cardHeight}px`"
        >
          <v-row class="ml-2">
            <v-col :cols="6">
              <div
                class="mb-4 d-flex justify-center"
                :style="`height: ${picHeight}px;width: 100%;`"
              >
                <img
                  class="device-img"
                  :style="`height: ${picHeight}px;`"
                  alt=""
                  :src="isDeviceBom ? deviceDetail.devicePic : bomDetail.partPic"
                />
              </div>
              <div
                :style="`height: ${infoHeight}px;`"
              >
                <div
                  class="primary--text numbertitle"
                >
                  {{ isDeviceBom ? deviceDetail.deviceNumber : bomDetail.bomName }}
                </div>
                <div class="mt-4">
                  <div class="leftdivider ml-1">
                    <div v-if="isDeviceBom">
                      <span
                        class="label info--text pl-2"
                        style="font-size: 10px;"
                      >
                        {{ $t('digitalarchives.deviceName') }}
                      </span>
                      <span
                        class="infotext icon--text ml-4"
                        style="font-size: 16px;"
                      >
                        {{ deviceDetail.deviceName }}
                      </span>
                    </div>
                    <div v-else>
                      <span
                        class="label info--text pl-2"
                        style="font-size: 10px;"
                      >
                        {{ $t('digitalarchives.materialname') }}
                      </span>
                      <span
                        class="infotext icon--text ml-4"
                        style="font-size: 16px;"
                      >
                        {{ bomDetail.partName  }}
                      </span>
                    </div>
                    <div v-if="isDeviceBom">
                      <span
                        class="label info--text pl-2"
                        style="font-size: 10px;"
                      >
                        {{ $t('digitalarchives.deviceNumber') }}
                      </span>
                      <span
                        class=" icon--text ml-4"
                        style=";"
                      >
                        {{ deviceDetail.deviceNumber }}
                      </span>
                    </div>
                    <div v-else>
                      <span
                        class="label info--text pl-2"
                        style="font-size: 10px;"
                      >
                        {{ $t('digitalarchives.materialnumber') }}
                      </span>
                      <span
                        class=" icon--text ml-4"
                      >
                        {{ bomDetail.partNumber }}
                      </span>
                    </div>
                    <div v-if="isDeviceBom">
                      <span
                        class="label info--text pl-2"
                        style="font-size: 10px;"
                      >
                        {{ $t('digitalarchives.deviceDescription') }}
                      </span>
                      <span
                        class=" icon--text ml-4"
                        style=";"
                      >
                        {{ deviceDetail.deviceDescription }}
                      </span>
                    </div>
                    <div v-else>
                      <span
                        class="label info--text pl-2"
                        style="font-size: 10px;"
                      >
                        {{ $t('digitalarchives.materialdescription') }}
                      </span>
                      <span
                        class=" icon--text ml-4"
                      >
                        {{ bomDetail.partDescription }}
                      </span>
                    </div>
                    <div v-if="isDeviceBom">
                      <span
                        class="label info--text pl-2"
                        style="font-size: 10px;"
                      >
                        {{ $t('digitalarchives.deviceType') }}
                      </span>
                      <span
                        class=" icon--text ml-4"
                      >{{ deviceDetail.deviceType }}</span>
                    </div>
                    <div v-else>
                      <span
                        class="label info--text pl-2"
                        style="font-size: 10px;"
                      >
                        {{ $t('digitalarchives.materialtype') }}
                      </span>
                      <span
                        class=" icon--text ml-4"
                      >
                        {{ getPartTypeName(bomDetail.partType) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="mt-4">
                  <v-row dense :gutter="2">
                    <v-col :cols="5">
                      <div
                        class="icon--text bgcolorgrey2 tableline pl-2"
                      >{{ $t('digitalarchives.title') }}</div>
                    </v-col>
                    <v-col :cols="7">
                      <div
                        class="icon--text bgcolorgrey tableline pl-2"
                      >{{ $t('digitalarchives.contents') }}</div>
                    </v-col>
                    <v-col
                      :cols="5" v-if="isDeviceBom"
                    >
                      <div
                        class="info--text tableline pl-2"
                      >{{ $t('digitalarchives.deviceSpec') }}</div>
                      <div
                        class="info--text bgcolorgrey3 tableline pl-2"
                      >{{ $t('digitalarchives.startTime') }}</div>
                      <div
                        class="info--text bgcolorgrey3 tableline pl-2"
                      >{{ $t('digitalarchives.remark') }}</div>
                    </v-col>
                    <v-col
                      :cols="5" v-else
                    >
                      <div
                        class="info--text tableline pl-2"
                      >{{ $t('digitalarchives.specification') }}</div>
                      <div
                        class="info--text bgcolorgrey3 tableline pl-2"
                      >{{ $t('digitalarchives.supplier') }}</div>
                      <div
                        class="info--text bgcolorgrey3 tableline pl-2"
                      >{{ $t('digitalarchives.electricalSymbol') }}</div>
                      <div
                        class="info--text tableline pl-2"
                      >{{ $t('digitalarchives.changeDate') }}</div>
                      <div
                        class="info--text bgcolorgrey3 tableline pl-2"
                      >{{ $t('digitalarchives.maintenanceDate') }}</div>
                    </v-col>
                    <v-col
                      :cols="7"
                      v-if="isDeviceBom"
                    >
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <div
                            v-bind="attrs"
                            v-on="on"
                            class="info--text tableline pl-2 text-truncate"
                          >
                            {{ deviceDetail.model || '-' }}
                          </div>
                        </template>
                        <div>{{ deviceDetail.model || '-' }}</div>
                      </v-tooltip>
                      <div
                        class="info--text tableline pl-2 text-truncate"
                      >{{ deviceDetail.activationTime || '-' }}</div>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <div
                            v-bind="attrs"
                            v-on="on"
                            class="info--text tableline pl-2 text-truncate"
                          >
                            {{ deviceDetail.remark || '-' }}
                          </div>
                        </template>
                        <div>{{ deviceDetail.remark || '-' }}</div>
                      </v-tooltip>
                    </v-col>
                    <v-col
                      :cols="7"
                      v-else
                    >
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <div
                            v-bind="attrs"
                            v-on="on"
                            class="info--text tableline pl-2 text-truncate"
                          >
                            {{ bomDetail.model || '-' }}
                          </div>
                        </template>
                        <div>{{ bomDetail.model || '-' }}</div>
                      </v-tooltip>
                      <div
                        class="info--text tableline pl-2 text-truncate"
                      >{{ bomDetail.supplier || '-' }}</div>
                      <div
                        class="info--text bgcolorgrey3 tableline pl-2 text-truncate"
                      >{{ bomDetail.electricSymbol || '-' }}</div>
                      <div
                        class="info--text tableline pl-2 text-truncate"
                      >
                        {{ bomDetail.lastReplaceTime || '-' }}
                      </div>
                      <div
                        class="info--text bgcolorgrey3 tableline pl-2 text-truncate"
                      >
                        {{ bomDetail.lastMaintenanceTime || '-' }}
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-col>
            <v-col :cols="6">
              <machine-relate
                :height="rightHeight"
                :details="details"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import moment from 'moment';
import MachineRelate from './MachineRelate.vue';

export default {
  name: 'MachineDetail',
  data() {
    return {
      moment,
      clientheight: document.body.clientHeight,
    };
  },
  components: {
    MachineRelate,
  },
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('digitalArchives', ['deviceDetail', 'bomDetail', 'itemTypeList']),
    cardHeight() {
      return this.clientheight - 220;
    },
    picHeight() {
      return (this.cardHeight - 16) * 0.45;
    },
    rightHeight() {
      return this.cardHeight - 64 - 16;
    },
    infoHeight() {
      return this.cardHeight - 16 - this.picHeight;
    },
    bomId() {
      if (this.details?.bomId) {
        return Number(this.details.bomId);
      }
      return '';
    },
    // 判断是否为设备，设备层bomLevel='0'
    isDeviceBom() {
      if (this.details?.bomLevel) {
        return this.details.bomLevel === '0';
      }
      return false;
    },
  },
  watch: {
    details: {
      handler(val) {
        if (Object.keys(val).length !== 0) {
          if (this.details?.bomId) {
            this.init();
          }
        } else {
          // 未选择设备bom，清空设备bom信息
          this.setBomDetail({});
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapMutations('digitalArchives', ['setBomDetail']),
    ...mapActions('digitalArchives', ['getItemTypes', 'getBomDetail']),
    init() {
      if (this.bomId) {
        this.getDetail();
      } else {
        this.SET_ALERT({
          type: 'error',
          message: this.$t('digitalarchives.nopartid'),
        });
      }
    },
    async getDetail() {
      await this.getItemTypes();
      await this.getBomDetail(this.bomId);
    },
    getPartTypeName(type) {
      const { itemTypeList } = this;
      const itemType = itemTypeList.find((item) => item.dictValue === type);
      if (itemType) {
        return itemType.dictLabel;
      }
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
  .device-img {
    width: auto;
    max-width: 100%;
    object-fit: contain;
  }
  .cardContainer{
    .cardtitle {
      text-align: center;
      font-size: 30px;
    }
    .numbertitle {
      font-size: 36px;
      text-align: left;
      text-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
      line-height: 32px;
      height: 40px;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .leftdivider {
      border-left: 2px solid;
      border-color: var(--v-info-base);
      .label {
        font-weight: 500;
        text-align: left;
      }
      .infotext {
        font-weight: 700;
        text-align: left;
        vertical-align: bottom;
      }
    }

    .tableline {
      line-height: 30px;
    }

    .bgcolorgrey {
      background-color: rgba(144, 141, 141, 0.49);
    }

    .bgcolorgrey2 {
      background-color: rgba(70, 70, 70, 0.35);
    }

    .bgcolorgrey3 {
      background-color: rgba(48, 48, 48, 0.4);
    }
  }
  .custom-card {
    ::v-deep() .v-card {
      background: transparent;
    }
  }
</style>
