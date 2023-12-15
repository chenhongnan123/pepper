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
      <v-col :cols="6">
        <div>{{ $t('dataAnalysis.options.typeofcusum') }}</div>
        <v-divider></v-divider>
        <v-row>
          <v-col :cols="6" class="radio">
            <v-radio-group
              dense
              class="ml-2"
              hide-details
              v-model="planortype.cumsumtype"
            >
              <v-radio
                v-for="(n, index) in typeoptions"
                :key="index"
                :label="$t(`dataAnalysis.options.${n.name}`)"
                :value="n.value"
              ></v-radio>
            </v-radio-group>
            <v-checkbox
              dense
              hide-details
              class="ml-2"
              v-model="planortype.reset"
              :label="$t('dataAnalysis.options.restsignal')"
            ></v-checkbox>
          </v-col>
          <v-col :cols="6" class="radio">
            <v-checkbox
              class="mt-4"
              dense
              hide-details
              v-model="planortype.useFIR"
              :label="$t('dataAnalysis.options.useFIR')"
            ></v-checkbox>
            <v-text-field
              class="mt-4"
              dense
              outlined
              clearable
              type="number"
              :disabled="!planortype.useFIR"
              :label="`${$t('dataAnalysis.options.sdnumber')}`"
              v-model="planortype.sdnumber"
              :rules="rules.nstandarddeviation"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col :cols="6">
        <div>{{ $t('dataAnalysis.options.cusumplan') }}</div>
        <v-divider></v-divider>
        <v-row>
          <v-col :cols="4">
            <v-text-field
              class="mt-2"
              dense
              outlined
              clearable
              type="number"
              :label="`${$t('dataAnalysis.options.h')}`"
              v-model="planortype.h"
              :rules="rules.naturalNum"
            ></v-text-field>
          </v-col>
          <v-col :cols="4">
            <v-text-field
              class="mt-2"
              dense
              outlined
              clearable
              type="number"
              :label="`${$t('dataAnalysis.options.k')}`"
              v-model="planortype.k"
              :rules="rules.naturalNum"
            ></v-text-field>
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
      planortype: {},
      typeoptions: [{
        name: 'tabular',
        checked: true,
        value: 'tabular',
      }],
    };
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
  },
  watch: {
    // 监听选项卡参数变化，同步写入缓存
    planortype: {
      handler(val) {
        this.planortypeSet(val);
      },
      deep: true,
      immediate: true,
    },
    // 根据视图传递参数给选项赋值，若无选中视图则显示默认参数
    setparams: {
      handler(val) {
        const arr = Object.keys(val);
        if (arr.length !== 0) {
          this.planortype = val;
        } else {
          this.setDefaultParams();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.planortypeSet(this.planortype);
  },
  methods: {
    ...mapMutations('dataAnalysis', ['setPlanOrType']),
    checkform() {
      if (!this.$refs.form.validate()) {
        return false;
      }
      return true;
    },
    // 设置选项卡为默认参数，并写入缓存
    setDefaultParams() {
      this.planortype = {
        ...this.defaultParams,
      };
    },
    // 根据校验将显示的参数项写入缓存
    planortypeSet(val) {
      const check = this.checkparamters;
      const result = {};
      // eslint-disable-next-line
      for (let i in val) {
        if (check[i] && check[i].show) {
          result[i] = val[i];
        }
      }
      this.setPlanOrType(result);
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
