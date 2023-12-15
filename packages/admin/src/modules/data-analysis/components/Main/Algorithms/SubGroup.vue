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
      >
        <div v-if="item.tabname==='variate'">
          <variate-content
            ref="variateTab"
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
            ref="parameterTab"
            :rules="rules"
            :checkparamters="parameter.parameters||{}"
            :defaultParams="defaultParams.parameters||{}"
            :setparams="parameterparams"
            :height="height"
          />
        </div>
        <div v-if="item.tabname==='estimatedStandardDeviation'">
          <estimate-content
            ref="estimatedTab"
            :rules="rules"
            :checkparamters="parameter.estimated||{}"
            :defaultParams="defaultParams.estimated||{}"
            :setparams="estimatedparams"
            :height="height"
          />
        </div>
        <!-- zone算法包含权重/重置选项卡 -->
        <div v-if="item.tabname==='weights'">
          <weights-content
            ref="weightsTab"
            :rules="rules"
            :checkparamters="parameter.weights||{}"
            :defaultParams="defaultParams.weights||{}"
            :setparams="weightsparams"
            :height="height"
          />
        </div>
        <div v-if="item.tabname==='checkout'">
          <check-out-content
            ref="checkoutTab"
            :rules="rules"
            :checkparamters="parameter.tests||{}"
            :defaultParams="defaultParams.tests||{}"
            :setparams="testsparams"
            :height="height"
          />
        </div>
        <div v-if="item.tabname==='boxCox'">
          <box-cox-content
            ref="boxcoxTab"
            :rules="rules"
            :checkparamters="parameter.boxcox||{}"
            :defaultParams="defaultParams.boxcox||{}"
            :setparams="boxcoxparams"
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
import WeightsContent from '../TabContent/WeightsContent.vue';
import CheckOutContent from '../TabContent/CheckOutContent.vue';
import BoxCoxContent from '../TabContent/BoxCoxContent.vue';

export default {
  name: 'SubGroup',
  data() {
    return {
      tab: null,
      // eslint-disable-next-line
      // tabs: ['variate', 'parameter', 'estimatedStandardDeviation', 'weights', 'checkout', 'boxCox'],
      tabs: ['variate', 'parameter', 'estimatedStandardDeviation', 'weights', 'checkout'],
    };
  },
  components: {
    VariateContent,
    ParameterContent,
    EstimateContent,
    WeightsContent,
    CheckOutContent,
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
    ...mapState('dataAnalysis', ['variates', 'parameters', 'estimated', 'weights', 'tests', 'boxcox']),
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
      if (this.isselectedalgorithm) {
        // zone_chart没有检验选项卡，有权重&重置选项卡
        if (this.algorithm.value === 'zone_chart') {
          return this.tabs.filter((item) => item !== 'checkout');
        }
        // 其他算法没有权重选项卡
        return this.tabs.filter((item) => item !== 'weights');
      }
      return [];
    },
    // 选项卡tab页列表
    items() {
      if (this.isselectedalgorithm) {
        const list = this.tabList.map((item) => {
          const obj = {
            tab: this.$t(`dataAnalysis.options.${item}`),
            tabname: item,
          };
          return obj;
        });
        return list;
      }
      return [];
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
    weightsparams() {
      return this.optionparams.weights || {};
    },
    testsparams() {
      return this.optionparams.tests || {};
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
