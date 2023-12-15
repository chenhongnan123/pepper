<!-- eslint-disable max-len -->
<template>
  <div>
    <v-tabs v-model="tab" id="optionsTab">
      <v-tab
        v-for="item in items"
        :key="item.tab"
      >
        {{ item.tab }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="item in items"
        :key="item.tab"
        :height="height"
      >
        <div v-if="item.tabname==='variate'">
          <variate-content
            :variateList="variateList"
            :rules="rules"
            :checkparamters="parameter.variates||{}"
            :defaultParams="defaultParams.variates||{}"
            :setparams="variateparams"
            :height="height"
          />
        </div>
        <div v-if="item.tabname==='parameter'">
          <parameter-content
            :rules="rules"
            :checkparamters="parameter.parameters||{}"
            :defaultParams="defaultParams.parameters||{}"
            :setparams="parameterparams"
            :height="height"
          />
        </div>
        <div v-if="item.tabname==='estimatedStandardDeviation'">
          <estimate-content
            :rules="rules"
            :checkparamters="parameter.estimated||{}"
            :defaultParams="defaultParams.estimated||{}"
            :setparams="estimatedparams"
            :height="height"
          />
        </div>
        <div v-if="item.tabname==='checkout'">
          <check-out-content
            :rules="rules"
            :checkparamters="parameter.tests||{}"
            :defaultParams="defaultParams.tests||{}"
            :setparams="testsparams"
            :height="height"
          />
        </div>
        <!-- 累计和算法包含计划/类型选项卡 -->
        <div v-if="item.tabname==='planortype'">
          <plan-or-type-content
            :rules="rules"
            :checkparamters="parameter.planortype||{}"
            :defaultParams="defaultParams.planortype||{}"
            :setparams="planortypeparams"
            :height="height"
          />
        </div>
        <div v-if="item.tabname==='boxCox'">
          <box-cox-content
            :rules="rules"
            :setparams="boxcoxparams"
            :checkparamters="parameter.boxcox||{}"
            :defaultParams="defaultParams.boxcox||{}"
            :height="height"
          />
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import VariateContent from '../TabContent/VariateContent.vue';
import ParameterContent from '../TabContent/ParameterContent.vue';
import EstimateContent from '../TabContent/EstimateContent.vue';
import CheckOutContent from '../TabContent/CheckOutContent.vue';
import PlanOrTypeContent from '../TabContent/PlanOrTypeContent.vue';
import BoxCoxContent from '../TabContent/BoxCoxContent.vue';

export default {
  name: 'TimeWeight',
  data() {
    return {
      tab: null,
      // eslint-disable-next-line
      // tabs: ['variate', 'parameter', 'estimatedStandardDeviation', 'checkout', 'planortype', 'boxCox'],
      tabs: ['variate', 'parameter', 'estimatedStandardDeviation', 'checkout', 'planortype'],
    };
  },
  components: {
    VariateContent,
    ParameterContent,
    EstimateContent,
    CheckOutContent,
    PlanOrTypeContent,
    BoxCoxContent,
  },
  props: {
    // 传参：选项卡各项参数配置，包含显隐和必填、非必填信息
    parameter: {
      type: Object,
      required: true,
    },
    // 变量列表，根据数据表或数据源得出的数据列/标签列
    variateList: {
      type: Array,
      required: true,
    },
    // 要进行设置的选项卡全部参数(用于视图数据赋值)
    optionparams: {
      type: Object,
      required: true,
    },
    // 传参：包含选项卡全部参数默认值
    defaultParams: {
      type: Object,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('dataAnalysis', ['selectedItems']),
    ...mapState('dataAnalysis', ['variates', 'parameters', 'estimated', 'tests', 'planortype', 'boxcox']),
    algorithm() {
      return this.selectedItems.algorithm;
    },
    isselectedalgorithm() {
      const arr = Object.keys(this.algorithm);
      if (arr.length > 0) {
        return true;
      }
      return false;
    },
    tabList() {
      if (this.algorithm.value === 'cumsum_chart') {
        return this.tabs.filter((item) => item !== 'checkout');
      }
      return this.tabs.filter((item) => item !== 'planortype');
    },
    // 选项卡tab页列表
    items() {
      const list = this.tabList.map((item) => {
        const obj = {
          tab: this.$t(`dataAnalysis.options.${item}`),
          tabname: item,
        };
        return obj;
      });
      return list;
    },
    variateparams() {
      return this.optionparams.variates || {};
    },
    parameterparams() {
      return this.optionparams.parameters || {};
    },
    estimatedparams() {
      return this.optionparams.estimated || {};
    },
    testsparams() {
      return this.optionparams.tests || {};
    },
    planortypeparams() {
      return this.optionparams.planortype || {};
    },
    boxcoxparams() {
      return this.optionparams.boxcox || {};
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
  },
};
</script>
<style scoped>
  #optionsTab /deep/ .v-tabs-bar{
    height: 40px !important;
  }
</style>
