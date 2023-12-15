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
        <!-- 多变量算法只有变量/参数/boxcox三个选项卡 -->
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
        <div v-if="item.tabname==='boxCox'">
          <box-cox-content
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
import BoxCoxContent from '../TabContent/BoxCoxContent.vue';

export default {
  // eslint-disable-next-line
  name: 'Multivariable',
  data() {
    return {
      tab: null,
      // tabs: ['variate', 'parameter', 'boxCox'],
      tabs: ['variate', 'parameter'],
    };
  },
  components: {
    VariateContent,
    ParameterContent,
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
    ...mapState('dataAnalysis', ['variates', 'parameters', 'boxcox']),
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
      // 多变量算法控制图不支持显示参数tab页
      if (this.algorithm.value === 'genvar_chart'
      || this.algorithm.value === 'tsqrd-gv_chart'
      || this.algorithm.value === 'tsqrd_chart') {
        return this.tabs.filter((item) => item !== 'parameter');
      }
      return this.tabs;
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
