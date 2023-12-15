<template>
  <v-form
    ref="form"
    lazy-validation
    :style="`height: ${height}px;`"
  >
    <v-row
      :style="`height: ${height-10}px;`"
      class="tabcontent"
    s>
      <v-col :cols="5">
        <v-checkbox
          dense
          class="ml-2"
          hide-details
          v-model="boxcox.isboxcox"
          :label="$t(`dataAnalysis.options.useboxcox`)"
          @change="useboxcoxChange"
        ></v-checkbox>
      </v-col>
      <v-col :cols="7" class="radiocol">
        <v-radio-group
          dense
          row
          class="ml-2"
          v-model="boxcox.boxcoxoption"
          :disabled="!boxcox.isboxcox"
        >
          <v-radio
            v-for="(n, index) in boxcoxRadios"
            :key="index"
            :label="$t(`dataAnalysis.options.${n.name}`)"
            :value="n.value"
          ></v-radio>
        </v-radio-group>
        <v-text-field
          v-if="boxcox.boxcoxoption === 'other'"
          dense
          outlined
          clearable
          type="number"
          v-model="boxcox.boxcoxvalue"
          :rules="rules.boxnumber"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  props: {
    // 传参：boxcox选项卡参数配置，包含显隐和必填、非必填信息
    checkparamters: {
      type: Object,
      required: true,
    },
    // 传参：包含boxcox选项卡参数默认值
    defaultParams: {
      type: Object,
      required: true,
    },
    // 要进行设置的boxcox选项卡参数(用于视图数据赋值)
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
      boxcox: {},
      // 定义boxcox变换radios选项
      boxcoxRadios: [
        {
          name: 'ln',
          value: 'ln',
        },
        {
          name: 'squareroot',
          value: 'squareroot',
        },
        {
          name: 'optimalλ',
          value: 'optimalλ',
        },
        {
          name: 'other',
          value: 'other',
        },
      ],
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
  },
  watch: {
    // 监听选项卡参数变化，同步写入缓存
    boxcox: {
      handler(val) {
        this.boxcoxSet(val);
      },
      deep: true,
      immediate: true,
    },
    // 根据视图传递参数给选项赋值，若无选中视图则显示默认参数
    setparams: {
      handler(val) {
        const arr = Object.keys(val);
        if (arr.length !== 0) {
          this.boxcox = val;
        } else {
          this.setDefaultParams();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.setBoxcox(this.boxcox);
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('dataAnalysis', ['setBoxcox']),
    // 表单校验
    checkform() {
      if (!this.$refs.form.validate()) {
        return false;
      }
      return true;
    },
    // 设置选项卡为默认参数，并写入缓存
    setDefaultParams() {
      this.boxcox = {
        ...this.defaultParams,
      };
      this.setBoxcox(this.boxcox);
    },
    // 根据校验将显示的参数项写入缓存
    boxcoxSet(val) {
      const check = this.checkparamters;
      const result = {};
      // eslint-disable-next-line
      for (let i in val) {
        if (check && check.show) {
          result[i] = val[i];
        }
      }
      this.setBoxcox(result);
    },
    useboxcoxChange() {
      if (!this.boxcox.isboxcox) {
        this.boxcox.boxcoxoption = '';
        this.boxcox.boxcoxvalue = 2;
      } else {
        // 默认选择ln
        this.boxcox.boxcoxoption = 'ln';
        this.boxcox.boxcoxvalue = 2;
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
  .radiocol /deep/ .v-input--selection-controls {
    margin-top: 4px;
  }
</style>
