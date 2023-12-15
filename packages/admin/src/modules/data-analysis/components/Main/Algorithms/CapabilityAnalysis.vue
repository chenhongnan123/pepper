<!-- eslint-disable max-len -->
<template>
  <div v-if="isselectedalgorithm">
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
        <!-- 能力分析包含变量/参数/估计标准差/选项/boxcox五个选项卡 -->
        <div v-if="item.tabname==='variate'">
          <variate-content
            ref="variate"
            :variateList="variateList"
            :algorithm="algorithm"
            :rules="rules"
            :checkparamters="parameter.variates||{}"
            :defaultParams="defaultParams.variates||{}"
            :setparams="variateparams"
            :height="height"
          />
        </div>
        <div v-if="item.tabname==='parameter'">
          <parameter-content
            :algorithm="algorithm"
            :rules="rules"
            :checkparamters="parameter.parameters||{}"
            :defaultParams="defaultParams.parameters||{}"
            :setparams="parameterparams"
            :height="height"
          />
        </div>
        <div v-if="item.tabname==='estimatedStandardDeviation'">
          <estimate-content
            :algorithm="algorithm"
            :rules="rules"
            :setparams="estimatedparams"
            :checkparamters="parameter.estimated||{}"
            :defaultParams="defaultParams.estimated||{}"
            :height="height"
          />
        </div>
        <div v-if="item.tabname==='options'">
          <options-content
            :algorithm="algorithm"
            :rules="rules"
            :setparams="optionsparams"
            :checkparamters="parameter.options||{}"
            :defaultParams="defaultParams.options||{}"
            :height="height"
          />
        </div>
        <div v-if="item.tabname==='boxCox'">
          <box-cox-content
            :algorithm="algorithm"
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
import OptionsContent from '../TabContent/OptionsContent.vue';
import BoxCoxContent from '../TabContent/BoxCoxContent.vue';

export default {
  name: 'CapabilityAnalysis',
  data() {
    return {
      tab: null,
      // eslint-disable-next-line
      // tabs: ['variate', 'parameter', 'estimatedStandardDeviation', 'options', 'boxCox'],
      tabs: ['variate', 'parameter', 'estimatedStandardDeviation', 'options'],
    };
  },
  components: {
    VariateContent,
    ParameterContent,
    EstimateContent,
    OptionsContent,
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
    ...mapState('dataAnalysis', ['variates', 'parameters', 'estimated', 'options', 'boxcox']),
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
        // 非正态ppk算法只有变量、参数和选项三个tab页
        if (this.algorithm.value === 'nnormxpk') {
          return this.tabs.filter((item) => item === 'variate'
            || item === 'parameter' || item === 'options');
        }
        return this.tabs;
      }
      // 未选择算法时清空选项卡
      return [];
    },
    // 选项卡tab页列表
    items() {
      if (this.tabList.length === 0) {
        return [];
      }
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
    optionsparams() {
      return this.optionparams.options || {};
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
