<!-- eslint-disable max-len -->
<template>
  <div class="fill-height">
    <!-- 单值算法，group_id=1 -->
    <single-value
      v-if="algorithmtype && algorithmtype.value === 1"
      :parameter="parameter"
      :variateList="variateList"
      :optionparams="optionparams"
      :defaultParams="defaultParams"
      :height="height"
      :rules="rules"
    />
    <!-- 子组算法，group_id=2 -->
    <sub-group
      v-if="algorithmtype && algorithmtype.value === 2"
      :parameter="parameter"
      :variateList="variateList"
      :optionparams="optionparams"
      :defaultParams="defaultParams"
      :height="height"
      :rules="rules"
    />
    <!-- 属性算法，group_id=3 -->
    <attribute
      v-if="algorithmtype && algorithmtype.value === 3"
      :parameter="parameter"
      :variateList="variateList"
      :optionparams="optionparams"
      :defaultParams="defaultParams"
      :height="height"
      :rules="rules"
    />
    <!-- 时间加权算法，group_id=4 -->
    <time-weight
      v-if="algorithmtype && algorithmtype.value === 4"
      :parameter="parameter"
      :variateList="variateList"
      :optionparams="optionparams"
      :defaultParams="defaultParams"
      :height="height"
      :rules="rules"
    />
    <!-- 多变量算法，group_id=5 -->
    <multivariable
      v-if="algorithmtype && algorithmtype.value === 5"
      :parameter="parameter"
      :variateList="variateList"
      :optionparams="optionparams"
      :defaultParams="defaultParams"
      :height="height"
      :rules="rules"
    />
    <!-- 能力分析，group_id=6 -->
    <capability-analysis
      v-if="algorithmtype && algorithmtype.value === 6"
      :parameter="parameter"
      :variateList="variateList"
      :optionparams="optionparams"
      :defaultParams="defaultParams"
      :height="height"
      :rules="rules"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import SingleValue from './Algorithms/SingleValue.vue';
import SubGroup from './Algorithms/SubGroup.vue';
import Attribute from './Algorithms/Attribute.vue';
import TimeWeight from './Algorithms/TimeWeight.vue';
import Multivariable from './Algorithms/Multivariable.vue';
import CapabilityAnalysis from './Algorithms/CapabilityAnalysis.vue';

export default {
  data() {
    return {
    };
  },
  components: {
    SingleValue,
    SubGroup,
    Attribute,
    TimeWeight,
    Multivariable,
    CapabilityAnalysis,
  },
  props: {
    // 传参：选项卡各项参数配置，包含显隐和必填、非必填信息
    parameter: {
      type: Object,
      required: true,
    },
    // 变量列表，根据数据表或数据源得出的数据列/标签列
    variatelist: {
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
    algorithm() {
      return this.selectedItems.algorithm;
    },
    algorithmtype() {
      return this.selectedItems.algorithmtype;
    },
    // 将数据列/标签列封装后传给子组件
    variateList() {
      const list = this.variatelist.map((item) => {
        const obj = {
          text: item.headerName,
          // value: item.id,
          value: item.field,
          type: item.type,
          disabled: false,
        };
        return obj;
      });
      return list;
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
  },
};
</script>
