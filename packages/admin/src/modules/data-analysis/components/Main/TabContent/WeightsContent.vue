<template>
  <v-form
    ref="form"
    lazy-validation
    :style="`height: ${height}px;`"
  >
    <v-row
      id="weightsContent"
      :style="`height: ${height-10}px;overflow-y: auto;`"
      class="tabcontent"
    >
      <v-col :cols="4">
        <v-text-field
          class="mt-3"
          dense
          outlined
          clearable
          type="number"
          :label="`${$t('dataAnalysis.options.zonea')}`"
          v-model="weights.zonea"
          :rules="zoneRules"
        ></v-text-field>
      </v-col>
      <v-col :cols="4">
        <v-text-field
          class="mt-3"
          dense
          outlined
          clearable
          type="number"
          :label="`${$t('dataAnalysis.options.zoneb')}`"
          v-model="weights.zoneb"
          :rules="zoneRules"
        ></v-text-field>
      </v-col>
      <v-col :cols="4">
        <v-text-field
          class="mt-3"
          dense
          outlined
          clearable
          type="number"
          :label="`${$t('dataAnalysis.options.zonec')}`"
          v-model="weights.zonec"
          :rules="zoneRules"
        ></v-text-field>
      </v-col>
      <v-col :cols="4">
        <v-text-field
          dense
          outlined
          clearable
          type="number"
          :label="`${$t('dataAnalysis.options.zoned')}`"
          v-model="weights.zoned"
          :rules="zoneRules"
        ></v-text-field>
      </v-col>
      <v-col :cols="4">
        <v-text-field
          dense
          outlined
          clearable
          type="number"
          :label="$t('dataAnalysis.options.zonensigma', { num: 'N' })"
          v-model="weights.zonensigma"
          :rules="rules.zonensigma"
        ></v-text-field>
      </v-col>
      <v-col :cols="4">
        <v-checkbox
          dense
          hide-details
          v-model="weights.reset"
          :label="$t(`dataAnalysis.options.zonereset`)"
        ></v-checkbox>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
// 引入权重区域值校验函数
import {
  checkWeightsZone,
} from '../../../requestUtil';

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
      weights: {},
    };
  },
  watch: {
    // 监听选项卡参数变化，同步写入缓存
    weights: {
      handler(val) {
        this.weightsSet(val);
      },
      deep: true,
      immediate: true,
    },
    // 根据视图传递参数给选项赋值，若无选中视图则显示默认参数
    setparams: {
      handler(val) {
        const arr = Object.keys(val);
        if (arr.length !== 0) {
          this.weights = val;
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
    algorithmselected() {
      return this.algorithm.value;
    },
    groupid() {
      return this.algorithm.groupId;
    },
    // 区域值输入框校验
    zoneRules() {
      return [
        // eslint-disable-next-line
        (v) => Number(v) === 0 || /^[0-9]*[1-9][0-9]*$/.test(v) || `${this.$t('dataAnalysis.verification.isinter')}`,
        (v) => Number(v) >= 0 || `${this.$t('dataAnalysis.verification.numberbiggerthan', { num: 0 })}`,
        (v) => this.zoneValid(v) || `${this.$t('dataAnalysis.verification.zonenumbercheckfailed')}`,
      ];
    },
  },
  created() {
    this.weightsSet(this.weights);
  },
  methods: {
    ...mapMutations('dataAnalysis', ['setWeights']),
    checkform() {
      if (!this.$refs.form.validate()) {
        return false;
      }
      return true;
    },
    // 设置选项卡为默认参数，并写入缓存
    setDefaultParams() {
      this.weights = {
        ...this.defaultParams,
      };
    },
    // 根据校验将显示的参数项写入缓存
    weightsSet(val) {
      const check = this.checkparamters;
      const result = {};
      // eslint-disable-next-line
      for (let i in val) {
        if (check[i] && check[i].show) {
          result[i] = val[i];
        }
      }
      this.setWeights(result);
    },
    zoneValid() {
      return checkWeightsZone(this.weights);
    },
  },
};
</script>
<style scoped>
  .tabcontent{
    overflow: auto;
    width: 100%;
  }

  #weightsContent /deep/ .col-4{
    padding: 12px 0 0 12px !important;
  }

  #weightsContent /deep/ .col-3, #weightsContent /deep/ .col-4{
    padding: 8px 0 0 12px !important;
  }

  #weightContent /deep/ .v-text-field__details {
    margin-bottom: 0px!important;
  }
</style>
