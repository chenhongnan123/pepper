<template>
  <v-form
    ref="form"
    lazy-validation
    :style="`height: ${height}px;`"
  >
    <v-row
      :style="`height: ${height-10}px;`"
      class="tabcontent"
    >
      <v-col :cols="3" v-if="meanshow">
        <v-text-field
          class="mt-2"
          dense
          outlined
          clearable
          type="number"
          :label="`${$t('dataAnalysis.options.mean')}`"
          v-model="parameters.meanValue"
        ></v-text-field>
      </v-col>
      <v-col :cols="3" v-if="standarddeviationshow">
        <v-text-field
          class="mt-2"
          dense
          outlined
          clearable
          type="number"
          :label="`${$t('dataAnalysis.options.standarddeviation')}`"
          v-model="parameters.standardDeviation"
        ></v-text-field>
      </v-col>
      <v-col :cols="3" v-if="proportionshow">
        <v-text-field
          class="mt-2"
          dense
          outlined
          clearable
          type="number"
          :label="`${$t('dataAnalysis.options.proportion')}`"
          v-model="parameters.proportion"
          :rules="rules.propnumber"
        ></v-text-field>
      </v-col>
      <v-col :cols="3" v-if="groupid===6">
        <v-text-field
          class="mt-2"
          dense
          outlined
          clearable
          type="number"
          :label="`${$t('dataAnalysis.options.specUpperlimit')}*`"
          v-model="parameters.upperLimit"
        ></v-text-field>
      </v-col>
      <v-col :cols="3" v-if="groupid===6">
        <v-text-field
          class="mt-2"
          dense
          outlined
          clearable
          type="number"
          :label="`${$t('dataAnalysis.options.specLowerlimit')}*`"
          v-model="parameters.lowerLimit"
        ></v-text-field>
      </v-col>
      <!-- I-MR-R/S算法，标准差分为子组内和子组间 -->
      <v-col
        :cols="4"
        v-if="algorithmselected==='i-mr-rs_chart'"
      >
        <div class="mt-1">{{ `${$t('dataAnalysis.options.standarddeviation')}` }}</div>
        <v-divider></v-divider>
        <v-row dense>
          <v-col :cols="6">
            <v-text-field
              class="mt-2"
              dense
              outlined
              clearable
              type="number"
              :label="`${$t('dataAnalysis.options.withinsubgroups')}`"
              v-model="parameters.withinSubgroupSD"
            ></v-text-field>
          </v-col>
          <v-col :cols="6">
            <v-text-field
              class="mt-2"
              dense
              outlined
              clearable
              type="number"
              :label="`${$t('dataAnalysis.options.betweensubgroups')}`"
              v-model="parameters.betweenSubgroupSD"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col :cols="3" v-if="groupid===6&&algorithmselected!=='nnormxpk'">
        <v-text-field
          class="mt-2"
          dense
          outlined
          clearable
          type="number"
          :label="`${$t('dataAnalysis.options.hisMean')}`"
          v-model="parameters.meanValue"
        ></v-text-field>
      </v-col>
      <v-col
        :cols="3"
        v-if="algorithmselected==='normxpk'||algorithmselected==='normxmk'"
      >
        <v-text-field
          class="mt-2"
          dense
          outlined
          clearable
          type="number"
          :label="`${$t('dataAnalysis.options.hisStandarddeviation')}`"
          v-model="parameters.standardDeviation"
        ></v-text-field>
      </v-col>
      <v-col
        :cols="3"
        v-if="algorithmselected==='bwxpk'"
      >
        <div class="mt-1">{{ `${$t('dataAnalysis.options.hisStandarddeviation')}` }}</div>
        <v-divider></v-divider>
        <v-checkbox
          dense
          class="mt-1"
          hide-details
          v-model="parameters.useHistorySD"
          :label="`${$t('dataAnalysis.options.useHisSD')}`"
        ></v-checkbox>
        <v-row v-if="parameters.useHistorySD">
          <v-col :cols="6">
            <v-text-field
              class="mt-2"
              dense
              outlined
              clearable
              type="number"
              :label="`${$t('dataAnalysis.options.withinsubgroups')}*`"
              v-model="parameters.withinSubgroupSD"
              :rules="rules.isrequired"
            ></v-text-field>
          </v-col>
          <v-col :cols="6">
            <v-text-field
              class="mt-2"
              dense
              outlined
              clearable
              type="number"
              :label="`${$t('dataAnalysis.options.betweensubgroups')}*`"
              v-model="parameters.betweenSubgroupSD"
              :rules="rules.isrequired"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        :cols="3"
        v-if="algorithmselected==='nnormxpk'"
      >
        <v-select
          class="mt-2"
          dense
          outlined
          clearable
          v-model="parameters.fitDistribution"
          :label="`${$t('dataAnalysis.options.fitDistribution')}*`"
          :items="fitDistributionOptions"
          item-text="text"
          item-value="value"
          :rules="rules.isrequired"
        ></v-select>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  props: {
    // 传参：当前选项卡参数配置，包含显隐和必填、非必填信息
    checkparamters: {
      type: Object,
      required: true,
    },
    // 传参：包含当前选项卡参数默认值
    defaultParams: {
      type: Object,
      required: true,
    },
    // 要进行设置的当前选项卡参数(用于视图数据赋值)
    setparams: {
      type: Object,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      // 存放当前选项卡参数信息
      parameters: {},
    };
  },
  watch: {
    // 监听选项卡参数变化，同步写入缓存
    parameters: {
      handler(val) {
        this.paramsSet(val);
      },
      deep: true,
      immediate: true,
    },
    // 根据视图传递参数给选项赋值，若无选中视图则显示默认参数
    setparams: {
      handler(val) {
        const arr = Object.keys(val);
        if (arr.length !== 0) {
          this.parameters = val;
        } else {
          this.setDefaultParams();
        }
      },
      deep: true,
      immediate: true,
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
    algorithmselected() {
      return this.algorithm.value;
    },
    groupid() {
      return this.algorithmtype.value;
    },
    // 拟合分布选项列表
    fitDistributionOptions() {
      return [
        {
          text: this.$t('dataAnalysis.options.lognormal'),
          value: 'lognormal',
        },
        {
          text: this.$t('dataAnalysis.options.3plognormal'),
          value: '3plognormal',
        },
        {
          text: this.$t('dataAnalysis.options.gamma'),
          value: 'gamma',
        },
        {
          text: this.$t('dataAnalysis.options.3pgamma'),
          value: '3pgamma',
        },
        {
          text: this.$t('dataAnalysis.options.exponential'),
          value: 'exponential',
        },
        {
          text: this.$t('dataAnalysis.options.2pexponential'),
          value: '2pexponential',
        },
        {
          text: this.$t('dataAnalysis.options.weibull'),
          value: 'weibull',
        },
        {
          text: this.$t('dataAnalysis.options.3pweibull'),
          value: '3pweibull',
        },
        {
          text: this.$t('dataAnalysis.options.logistic'),
          value: 'logistic',
        },
        {
          text: this.$t('dataAnalysis.options.loglogistic'),
          value: 'loglogistic',
        },
        {
          text: this.$t('dataAnalysis.options.3ploglogistic'),
          value: '3ploglogistic',
        },
      ];
    },
    // 根据算法展示均值输入框
    meanshow() {
      if (!this.proportionshow) {
        if (this.algorithmselected !== 'mr_chart'
          && this.algorithmselected !== 'r_chart' && this.algorithmselected !== 's_chart'
          && this.algorithmselected !== 'cumsum_chart' && this.algorithmselected !== 'genvar_chart'
          && this.algorithmselected !== 'tsqrd-gv_chart' && this.algorithmselected !== 'tsqrd_chart'
          && this.algorithmselected !== 'z-mr_chart' // z-mr算法隐藏均值输入，目前不支持按照标签列逐个定义均值
          && this.groupid !== 6 // 能力分析算法隐藏均值输入
        ) {
          return true;
        }
      }
      return false;
    },
    // 根据算法展示标准差输入框
    standarddeviationshow() {
      if (!this.proportionshow) {
        if (this.algorithmselected !== 'u_chart' && this.algorithmselected !== 'laney-u_chart'
          && this.algorithmselected !== 'c_chart' && this.algorithmselected !== 'i-mr-rs_chart'
          && this.algorithmselected !== 'tsqrd-gv_chart' && this.algorithmselected !== 'tsqrd_chart'
          && this.algorithmselected !== 'genvar_chart'
          && this.algorithmselected !== 'z-mr_chart' // z-mr算法隐藏标准差输入，目前不支持按照标签列逐个定义标准差
          && this.groupid !== 6 // 能力分析算法隐藏均值输入
        ) {
          return true;
        }
      }
      return false;
    },
    // 根据算法展示比率输入框
    proportionshow() {
      return this.groupid === 3
        && (this.algorithmselected === 'p_chart'
        || this.algorithmselected === 'laney-p_chart'
        || this.algorithmselected === 'np_chart');
    },
  },
  created() {
    this.paramsSet(this.parameters);
  },
  methods: {
    ...mapMutations('dataAnalysis', ['setParameters']),
    checkform() {
      if (!this.$refs.form.validate()) {
        return false;
      }
      return true;
    },
    // 设置选项卡为默认参数，并写入缓存
    setDefaultParams() {
      this.parameters = {
        ...this.defaultParams,
      };
    },
    // 根据校验将显示的参数项写入缓存
    paramsSet(val) {
      const check = this.checkparamters;
      const result = {};
      // eslint-disable-next-line
      for (let i in val) {
        if (check[i] && check[i].show) {
          result[i] = val[i];
        }
      }
      this.setParameters(result);
    },
  },
};
</script>
<style scoped>
  .tabcontent{
    overflow: auto;
    width: 100%;
  }
</style>
