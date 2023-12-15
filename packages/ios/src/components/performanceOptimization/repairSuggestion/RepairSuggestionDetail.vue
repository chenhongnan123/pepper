<template>
  <div style="position: relative;">
    <check-point
      :height="topHeight"
      style="position: relative;z-index:1;"
    />
    <model-detail
      :height="middleHeight"
      style="position: absolute;z-index:1 ;width:55%;right:0px;"
    />
    <event-description
      :height="bottomHeight"
      :style="`margin-top:${middleHeight + 6}px;position: relative;z-index:1;`"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
// import ServiceFactory from '@/service/ServiceFactory';
import CheckPoint from './CheckPoint.vue';
import ModelDetail from './ModelDetail.vue';
import EventDescription from './EventDescription.vue';

export default {
  name: 'RepairSuggestionDetail',
  data() {
    return {
      clientheight: document.body.clientHeight,
      timeCount: 0,
      isFirstInit: true,
    };
  },
  components: {
    CheckPoint,
    ModelDetail,
    EventDescription,
  },
  async created() {
    this.SET_MODELTOP(120);
    this.SET_MODELLEFT(-100);
    this.SET_MODELHEIGHT(560);
    this.SET_THREEJSSHOW(true);
    this.SET_UNITYSHOW(false);
    this.init();
  },
  computed: {
    ...mapState('repairSuggestion', ['machineRateList', 'pointList']),
    topHeight() {
      return (this.clientheight - 210) * 0.16;
    },
    middleHeight() {
      return (this.clientheight - 210) * 0.46;
    },
    bottomHeight() {
      return (this.clientheight - 210) * 0.39;
    },
    iszh() {
      return this.$i18n.locale === 'zhHans';
    },
    routename() {
      return this.$route.name;
    },
    isPageChaged() {
      return this.routename !== 'repairSuggestionDetail';
    },
  },
  methods: {
    ...mapMutations('helper', [
      'SET_THREEJSSHOW',
      'SET_UNITYSHOW',
      'SET_MODELHEIGHT',
      'SET_MODELTOP',
      'SET_MODELLEFT',
    ]),
    ...mapActions('repairSuggestion', [
      'getPointList',
      'getHealthScoreDetail',
      'getStationWarningList',
    ]),
    ...mapActions('maintenanceTask', [
      'getUnfinishedTaskList',
    ]),
    // 递归查找所有productId
    getProductIds(source) {
      const list = [];
      if (source?.length) {
        source.forEach((item) => {
          if (item.childNodes?.length) {
            const childIds = this.getProductIds(item.childNodes);
            list.push(childIds);
          }
          list.push(item.productId);
        });
        return list.flat();
      }
      return [];
    },
    async init() {
      if (this.isPageChaged) {
        return;
      }
      const { modelId, productCode, id } = this.$route.params;
      const selectedProdutIdList = this.machineRateList.filter(
        (item) => item.productId === Number(id),
      ); // 筛选当前选中的部件以及所有子部件
      const productIds = this.getProductIds(selectedProdutIdList);
      await this.getPointList(productIds.join(','));
      await this.getUnfinishedTaskList(productIds.join(','));
      await this.getHealthScoreDetail(productCode);
      // 查询所有报警测点，筛选当前选中的部件下的所有报警测点
      await this.getStationWarningList(productIds);
      const { isFirstInit } = this;
      const pointList = this.pointList.map((item) => {
        const obj = {
          ...item,
        };
        // if (item.testStatus === '2') {
        //   obj.status = '3';
        // } else if (item.testStatus === '1') {
        //   obj.status = '2';
        // } else {
        //   obj.status = '1';
        // }
        return obj;
      });
      const mesh = {
        isFirstInit,
        meshname: modelId,
        pointList,
      };
      this.$root.$digitalModel.showMainPartAndPoint(mesh);
      if (isFirstInit) {
        this.isFirstInit = false;
      }
      await this.$getTimeout(5000);
      await this.init();
    },
  },
};
</script>
