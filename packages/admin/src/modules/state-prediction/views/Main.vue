<template>
  <v-container fluid>
    <portal
      to="app-header"
      v-if="pagePortalMode.statePrediction"
    >
      {{ $t(`modules.${moduleName}`) }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="refresh"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <div
      class="d-flex"
      style="width: 100%;"
      :style="`height: ${topCardHeight}px;`"
    >
      <div
        :style="`width: ${leftWidth}%;`"
        class="fill-height"
      >
        <device-info
          :height="topCardHeight"
        />
      </div>
      <div
        :style="`width: ${100 - leftWidth}%;`"
        class="fill-height"
      >
        <device-health-index
          :height="topCardHeight"
          :highestPart="deviceScore.highestPart"
          :lowestPart="deviceScore.lowestPart"
        />
      </div>
    </div>
    <div
      :style="`height: ${bottomCardHeight}px;`"
      style="width: 100%;"
      class="bottom-container"
    >
      <v-tabs
        show-arrows
        class="pa-0 pt-2"
        v-model="tab"
        :key="`tab_key_${tab}`"
        @change="() => (carouselValue = 0)"
      >
        <v-tab
          v-for="(item, index) in bomFirstList"
          :key="`tab_list_${index}`" @click="getBOMPartsInfo(item)"
        >
          <span
            style="font-size: 16px"
          >{{ item.bomName }}
          </span>
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" style="overflow: inherit;">
        <div
          v-for="(item, index) in items"
          :key="`tab_content_${index}`"
          >
          <div style="margin-top:10px;padding:0 20px;"
            :style="`height: ${carouselHeight + 30}px;`" class="test-class"
          >
            <part-list-carousel
              :value="carouselValue"
              :height="carouselHeight + 20"
              :list="item.partList" @cardClick="cardClick"
              @input="(value) => (carouselValue = value)"
            />
          </div>
        </div>
      </v-tabs-items>
    </div>
  </v-container>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import DeviceInfo from '../components/main/DeviceInfo.vue';
import DeviceHealthIndex from '../components/main/DeviceHealthIndex.vue';
import PartListCarousel from '../components/main/PartListCarousel.vue';

export default {
  name: 'statePrediction',
  components: {
    DeviceInfo,
    DeviceHealthIndex,
    PartListCarousel,
  },
  data() {
    return {
      clientHeight: document.body.clientHeight,
      leftWidth: 35,
      carouselValue: 0,
      tab: null,
      healthList: [],
      items: [],
      lowestPart: {},
      highestPart: {},
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('statePrediction', [
      'deviceBomInfo',
      'bomFirstList',
      'deviceHealthInfo',
      'deviceScore',
      'monthScoreList',
      'partsList',
      'deviceBomDetail',
      'mainDevice',
      'partList',
      'bomList',
    ]),
    moduleName() {
      return this.$route.name;
    },
    topCardHeight() {
      return (this.clientHeight - 100) * 0.3;
    },
    bottomCardHeight() {
      return (this.clientHeight - 100) * 0.65;
    },
    carouselHeight() {
      return this.bottomCardHeight - 60;
    },
    deviceInfo() {
      return {
        id: 1,
        name: this.$t('statePrediction.title.deviceName'),
        code: this.$t('statePrediction.title.deviceNumber'),
        picUrl: 'https://picsum.photos/id/11/500/300',
      };
    },
  },
  created() {
    // 初始化分页
    if (sessionStorage.getItem('statePredictionTabData')) {
      const statePredictionTabData = JSON.parse(sessionStorage.getItem('statePredictionTabData'));
      delete sessionStorage.statePredictionTabData;
      this.tab = statePredictionTabData.tab;
      this.carouselValue = statePredictionTabData.carouselValue;
    } else {
      delete sessionStorage.statePredictionTabData;
    }
    this.init();
  },
  methods: {
    ...mapActions('statePrediction', [
      'getDeviceBomInfo',
      'getBomFirstList',
      'getDeviceScore',
      'getMonthScoreList',
      'getPartsList',
      'getDeviceBomDetail',
      'getPartTypeList',
      'getPartList',
      'getDeviceMainItem',
      'getDeviceHealthInfo',
      'getBOMList',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh() {
      this.init();
    },
    init() {
      this.getBomInfo();
      this.getBomFirstFloorList();
      this.getDeviceMainItemList();
      this.getDeviceScoreInfo();
      this.get30DayScoreList();
      this.getPartsTypeList();
    },
    async getBomInfo() {
      await this.getDeviceBomInfo();
    },
    async getBomFirstFloorList() {
      await this.getBomFirstList();
      await this.getBOMPartsInfo(this.bomFirstList[this.tab || 0]);
    },
    async getDeviceScoreInfo() {
      await this.getDeviceScore();
    },
    async get30DayScoreList() {
      await this.getMonthScoreList();
    },
    async getPartsTypeList() {
      await this.getPartTypeList();
    },
    async getDeviceMainItemList() {
      await this.getBOMList();
      await this.getDeviceHealthInfo();
      await this.getDeviceMainItem();
      await this.getPartList();
    },
    // 获取BOM下零件信息
    async getBOMPartsInfo(row) {
      const items = [];
      await this.getPartsList(`bomId=${row.bomId}`);
      const obj = {
        name: row.bomName,
        partList: this.partsList,
      };
      items.push(obj);
      this.items = [...items];
    },
    async cardClick(data) {
      const routeData = {
        params: {
          id: data.bomId,
          partId: data.partId,
        },
        query: {
          bomName: data.bomName,
        },
      };
      sessionStorage.setItem('statePredictionTabData', JSON.stringify({
        carouselValue: this.carouselValue,
        tab: this.tab,
      })); // 用于记住当前tabs的选中翻页状态
      sessionStorage.setItem('statePredictionDetailData', JSON.stringify(routeData)); // 用于详情跳转
      this.$router.push({
        name: 'statePredictionDetail',
        params: routeData.params,
        query: routeData.query,
      });
    },
    // tab切换
    handleTabChange(key) {
      console.log(key);
    },
  },
};
</script>

<style lang="scss" scoped>
  .bottom-container{
    ::v-deep() .v-tabs, ::v-deep() .v-tabs-bar {
      background: transparent;
    }
  }
</style>
