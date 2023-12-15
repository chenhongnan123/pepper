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
      <v-col :cols="3">
        <v-text-field
          class="mt-3"
          dense
          outlined
          clearable
          hide-details
          type="number"
          :label="`${$t('dataAnalysis.options.target')}
          ${algorithmselected==='nnormxpk'?'':`(${$t('dataAnalysis.options.addCpm')})`}`"
          v-model="options.cpmTarget"
        ></v-text-field>
        <v-text-field
          dense
          outlined
          class="mt-3"
          clearable
          type="number"
          place-holder="K"
          :label="`${$t('dataAnalysis.options.useTolerance')}`"
          v-model="options.ksigma"
          :rules="rules.notRequiredInter"
        ></v-text-field>
      </v-col>
      <v-col :cols="2">
        <div class="mt-2">{{ `${$t('dataAnalysis.options.performAnalysis')}*` }}</div>
        <v-divider></v-divider>
        <v-radio-group
          v-if="algorithmselected==='nnormxpk'"
          dense
          class="mt-1"
          v-model="options.performAnalysis"
        >
          <v-radio
            v-for="(n, index) in analysisRadios"
            :key="index"
            :label="$t(`dataAnalysis.options.${n.name}`)"
            :value="n.value"
          ></v-radio>
        </v-radio-group>
        <div v-else>
          <v-checkbox
            dense
            class="mt-1"
            hide-details
            v-model="options.withinSubgroup"
            :label="$t(`dataAnalysis.options.withinSubgroupAnalysis`)"
          ></v-checkbox>
          <v-checkbox
            dense
            hide-details
            v-model="options.overall"
            :label="$t(`dataAnalysis.options.overallAnalysis`)"
          ></v-checkbox>
        </div>
      </v-col>
      <v-col :cols="algorithmselected!=='nnormxpk'?2:3" class="radio">
        <div class="mt-2">{{ `${$t('dataAnalysis.options.display')}*` }}</div>
        <v-divider></v-divider>
        <v-radio-group
          dense
          class="mt-1"
          v-model="options.display"
          @change="changeDisplay"
        >
          <v-radio
            v-for="(n, index) in displayRadios"
            :key="index"
            :label="$t(`dataAnalysis.options.${n.name}`)"
            :value="n.value"
          ></v-radio>
        </v-radio-group>
      </v-col>
      <v-col :cols="4" v-if="algorithmselected!=='nnormxpk'">
        <div class="mt-2">{{ `${$t('dataAnalysis.options.confidenceIntervals')}*` }}</div>
        <v-divider></v-divider>
        <v-checkbox
          dense
          class="mt-1"
          hide-details
          v-model="options.includeConfidenceIntervals"
          :label="`${$t('dataAnalysis.options.includeConfidenceIntervals')}`"
          :disabled="options.display==='benchmarkZs'"
        ></v-checkbox>
        <v-row v-if="options.includeConfidenceIntervals">
          <v-col :cols="6">
            <v-text-field
              class="mt-1"
              dense
              outlined
              clearable
              type="number"
              :label="`${$t('dataAnalysis.options.confidenceLevel')}*`"
              v-model="options.confidenceLevel"
              :rules="rules.zeroHundred"
              :disabled="options.display==='benchmarkZs'"
            ></v-text-field>
          </v-col>
          <v-col :cols="6">
            <v-select
              class="mt-1"
              dense
              outlined
              v-model="options.confidenceIntervals"
              :label="`${$t('dataAnalysis.options.confidenceIntervals')}`"
              :items="confidenceIntervalsOptions"
              item-text="text"
              item-value="value"
              :rules="rules.isrequired"
              :disabled="options.display==='benchmarkZs'"
              :menu-props="customMenuProps"
            ></v-select>
          </v-col>
        </v-row>
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
      options: {},
      // 显示选项列表
      displayAllRadios: [
        {
          name: 'capabilityStatisCp',
          value: 'capabilityStatisCp',
        },
        {
          name: 'capabilityStatisCm',
          value: 'capabilityStatisCm',
        },
        {
          name: 'benchmarkZs',
          value: 'benchmarkZs',
        },
      ],
      customMenuProps: {
        offsetY: true, // enable vertical offset
        // offsetX: true, // enable horizontal offset
        offsetYValue: 0, // vertical offset value
        // offsetXValue: 0, // horizontal offset value
      },
    };
  },
  watch: {
    // 监听选项卡参数变化，同步写入缓存
    options: {
      handler(val) {
        this.optionsSet(val);
      },
      deep: true,
      immediate: true,
    },
    // 根据视图传递参数给选项赋值，若无选中视图则显示默认参数
    setparams: {
      handler(val) {
        const arr = Object.keys(val);
        if (arr.length !== 0) {
          this.options = val;
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
    // 已选算法
    algorithmselected() {
      return this.algorithm.value;
    },
    // 算法类型group_id
    groupid() {
      return this.algorithmtype.value;
    },
    // cmk/ppk显示不同选项名称
    displayRadios() {
      if (this.algorithmselected === 'normxmk') {
        return this.displayAllRadios.filter((item) => item.name !== 'capabilityStatisCp');
      }
      return this.displayAllRadios.filter((item) => item.name !== 'capabilityStatisCm');
    },
    // 非正态pkk算法，显示不同的分析方式选项
    analysisRadios() {
      return [
        {
          name: 'zscore',
          value: 'zscore',
        },
        {
          name: 'iso',
          value: 'iso',
        },
      ];
    },
    // 置信区间选项
    confidenceIntervalsOptions() {
      return [
        // {
        //   text: this.$t('dataAnalysis.options.singleSided'),
        //   value: 'singleSided',
        // },
        {
          text: this.$t('dataAnalysis.options.twoSided'),
          value: 'twoSided',
        },
      ];
    },
  },
  created() {
    this.optionsSet(this.options);
  },
  methods: {
    ...mapMutations('dataAnalysis', ['setOptions']),
    checkform() {
      if (!this.$refs.form.validate()) {
        return false;
      }
      return true;
    },
    // 设置选项卡为默认参数，并写入缓存
    setDefaultParams() {
      this.options = {
        ...this.defaultParams,
      };
    },
    // 根据校验将显示的参数项写入缓存
    optionsSet(val) {
      const check = this.checkparamters;
      const result = {};
      // eslint-disable-next-line
      for (let i in val) {
        if (check[i] && check[i].show) {
          result[i] = val[i];
        }
      }
      this.setOptions(result);
    },
    // 显示radio选项变化监听
    changeDisplay(val) {
      // 选择基准Z值时，包括置信区间勾选框去勾选
      if (val === 'benchmarkZs') {
        this.options.includeConfidenceIntervals = true;
        this.options.confidenceLevel = 95;
        this.options.confidenceIntervals = 'twoSided';
      } else {
        this.options.includeConfidenceIntervals = false;
      }
    },
  },
};
</script>
<style scoped>
  .tabcontent{
    overflow: auto;
    width: 100%;
  }
  .radio /deep/ .v-input--selection-controls{
    margin-top: 4px !important;
  }

  .radio /deep/ .v-input--radio-group--column .v-radio:not(:last-child):not(:only-child){
    margin-bottom: 0 !important;
  }
</style>
