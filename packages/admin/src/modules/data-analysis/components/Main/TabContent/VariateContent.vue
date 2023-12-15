<template>
  <v-form
    ref="form"
    lazy-validation
    :style="`height: ${height}px;`"
  >
    <v-row
      id="variateContent"
      :style="`height: ${height-10}px;`"
      class="tabcontent"
    >
      <v-col :cols="3" v-if="partnumbershow">
        <!-- 标签列选择框 -->
        <v-select
          dense
          class="mt-2"
          clearable
          outlined
          v-model="variates.partnumber"
          :label="`${$t('dataAnalysis.options.sizeidcolumn')}`"
          :items="tagVariateList"
          item-text="text"
          item-value="value"
          :rules="rules.isrequired"
          :menu-props="customMenuProps"
        ></v-select>
      </v-col>
      <v-col :cols="3">
        <v-select
          dense
          :class="subgroupShow ? 'mt-8' : 'mt-2'"
          clearable
          outlined
          :label="`${$t('dataAnalysis.options.variateone')}*`"
          v-model="variates.variateOne"
          :items="oneVariateList"
          item-text="text"
          item-value="value"
          :rules="rules.isrequired"
          :menu-props="customMenuProps"
        ></v-select>
      </v-col>
      <v-col :cols="3" v-if="variabletworequiredshow">
        <v-select
          dense
          :class="subgroupShow ? 'mt-8' : 'mt-2'"
          clearable
          outlined
          :label="`${$t('dataAnalysis.options.variatetwo')}*`"
          v-model="variates.variateTwo"
          :items="twoVariateList"
          item-text="text"
          item-value="value"
          :menu-props="customMenuProps"
        ></v-select>
      </v-col>
      <v-col :cols="6" v-if="subgroupShow">
        <div>
          {{ `${$t('dataAnalysis.options.subgroupsize')}*` }}
        </div>
        <v-text-field
          style="width: 45%; display: inline-block"
          class="mt-2"
          dense
          outlined
          clearable
          v-model="variates.subgroupsizenumber"
          :label="`${$t('dataAnalysis.options.sizenumber')}`"
          :rules="getSubgroupSizeRules()"
          type="number"
          :disabled="numberdisabled"
          @change="numberChange"
        ></v-text-field>
        <span
          v-if="subgroupcolumnshow"
          style="text-align: center; padding: 2px"
        >{{ this.$t('dataAnalysis.label.or') }}</span>
        <v-select
          v-if="subgroupcolumnshow"
          style="width: 45%; display: inline-block"
          dense
          class="mt-2"
          clearable
          outlined
          v-model="variates.subgroupsizecolumn"
          :label="`${$t('dataAnalysis.options.sizeidcolumn')}`"
          :items="tagVariateList"
          item-text="text"
          item-value="value"
          :disabled="columndisabled"
          @change="columnChange"
          :menu-props="customMenuProps"
        ></v-select>
      </v-col>
      <v-col :cols="3" v-if="algorithmselected === 'ma_chart'">
        <v-text-field
          :class="subgroupShow ? 'mt-8' : 'mt-2'"
          dense
          outlined
          clearable
          v-model="variates.movingaveragelength"
          :label="`${$t('dataAnalysis.options.movingaveragelength')}*`"
          :rules="rules.lengthnumber"
          type="number"
        ></v-text-field>
      </v-col>
      <v-col :cols="3" v-if="algorithmselected === 'ewma_chart'">
        <v-text-field
          :class="subgroupShow ? 'mt-8' : 'mt-2'"
          dense
          outlined
          clearable
          v-model="variates.ewmaweight"
          :label="`${$t('dataAnalysis.options.ewmaweight')}*`"
          :rules="rules.weightnumber"
        ></v-text-field>
      </v-col>
      <v-col :cols="3" v-if="algorithmselected === 'cumsum_chart'">
        <v-text-field
          :class="subgroupShow ? 'mt-8' : 'mt-2'"
          dense
          outlined
          clearable
          v-model="variates.target"
          :label="`${$t('dataAnalysis.options.target')}*`"
          :rules="rules.isrequired"
        ></v-text-field>
      </v-col>
      <v-col :cols="3" v-if="false">
        <v-select
          dense
          :class="
            subgroupShow && groupid !== 4
              ? 'mt-8'
              : algorithmselected === 'c_chart' || groupid === 1
              ? 'mt-2'
              : ''
          "
          clearable
          outlined
          :label="`${$t('dataAnalysis.options.variatetwo')}`"
          v-model="variates.variateTwo"
          :items="twoVariateList"
          item-text="text"
          item-value="value"
          :menu-props="customMenuProps"
        ></v-select>
      </v-col>
      <v-col :cols="3" v-if="false">
        <v-select
          dense
          :class="subgroupShow ? '' : 'mt-2'"
          clearable
          outlined
          :label="`${$t('dataAnalysis.options.variatethree')}`"
          v-model="variates.variateThree"
          :items="threeVariateList"
          item-text="text"
          item-value="value"
          :menu-props="customMenuProps"
        ></v-select>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  props: {
    // 传参： 源数据表定义好的数据列或标签列
    variateList: {
      type: Array,
      required: true,
    },
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
      variates: {},
      subgroupcolumnshow: true, // 子组标签列默认展示
      numberdisabled: false,
      columndisabled: false,
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
    variates: {
      handler(val) {
        this.variatesSet(val);
      },
      deep: true,
      immediate: true,
    },
    // 根据视图传递参数给选项赋值，若无选中视图则显示默认参数
    setparams: {
      handler(val) {
        const arr = Object.keys(val);
        if (arr.length !== 0) {
          this.variates = {
            ...val,
          };
          // 赋值时不会触发change事件，因此需要手动触发
          this.columnChange(this.variates.subgroupsizecolumn);
          this.numberChange(this.variates.subgroupsizenumber);
        } else {
          this.setDefaultParams();
        }
      },
      deep: true,
      immediate: true,
    },
    // 监听是否选择实时数据
    isrealtime: {
      handler(val) {
        // 若包含子组大小，且为实时数据，则子组大小默认为1
        if (this.subgroupShow) {
          if (val) {
            this.variates.subgroupsizenumber = 1;
            this.numberdisabled = true;
            // 子组标签列隐藏
            this.subgroupcolumnshow = false;
            this.numberChange(this.variates.subgroupsizenumber);
          } else {
            this.numberChange(this.variates.subgroupsizenumber);
          }
        }
      },
      deep: true,
      immediate: true,
    },
    algorithmselected: {
      handler() {
        if (this.subgroupShow) {
          if (this.isrealtime) {
            this.variates.subgroupsizenumber = 1;
            this.numberdisabled = true;
            // 子组标签列隐藏
            this.subgroupcolumnshow = false;
            this.numberChange(this.variates.subgroupsizenumber);
          }
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState('dataAnalysis', ['selectedItems']),
    algorithm() {
      return this.selectedItems.algorithm;
    },
    // 是否选择实时数据
    isrealtime() {
      return this.selectedItems.isrealtime;
    },
    // 变量列选项不做类型限制
    dataVariateList() {
      // return this.variateList.filter((item) => item.type === 'DATA');
      return this.variateList || [];
    },
    // 已选的变量，不能再次选择
    oneVariateList() {
      // eslint-disable-next-line
      return this.dataVariateList.filter((item) => item.value !== this.variates.variateTwo && item.value !== this.variates.variateThree);
    },
    twoVariateList() {
      // eslint-disable-next-line
      return this.dataVariateList.filter((item) => item.value !== this.variates.variateOne && item.value !== this.variates.variateThree);
    },
    threeVariateList() {
      // eslint-disable-next-line
      return this.dataVariateList.filter((item) => item.value !== this.variates.variateOne && item.value !== this.variates.variateTwo);
    },
    // 标签列选项不做类型限制
    tagVariateList() {
      // return this.variateList.filter((item) => item.type === 'LABEL');
      return this.variateList || [];
    },
    algorithmselected() {
      return this.algorithm.value;
    },
    groupid() {
      return this.algorithm.groupId;
    },
    // 子组大小和子组标签列展示与否
    subgroupShow() {
      return (
        this.groupid === 2
        || (this.groupid === 3 && this.algorithmselected !== 'c_chart')
        || this.groupid === 4 || this.groupid === 5
        || (this.groupid === 6 && this.algorithmselected !== 'normxmk'
        && this.algorithmselected !== 'nnormxpk')
      );
    },
    // z-mr算法展示标签列
    partnumbershow() {
      return this.algorithmselected === 'z-mr_chart';
    },
    // 目前仅多变量算法展示2个变量选择框
    variabletworequiredshow() {
      return this.groupid === 5;
    },
  },
  created() {
    this.variatesSet(this.variates);
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('dataAnalysis', ['setVariates']),
    // 子组zone_chart/属性/时间加权/多变量算法，子组大小校验为1-100，其余为2-100
    getSubgroupSizeRules() {
      if (this.algorithmselected === 'zone_chart'
        || this.groupid === 3 || this.groupid === 4 || this.groupid === 5) {
        return this.rules.subgroupsize;
      }
      return this.rules.subgroupsize2;
    },
    // 设置选项卡为默认参数，并写入缓存
    setDefaultParams() {
      this.variates = {
        ...this.defaultParams,
      };
      this.setVariates(this.variates);
      this.numberdisabled = false;
      this.columndisabled = false;
    },
    // 子组标签列变化
    columnChange(val) {
      if (!val || val === '') {
        this.numberdisabled = false;
      } else {
        this.numberdisabled = true;
        this.variates.subgroupsizenumber = '';
      }
    },
    // 子组大小变化
    numberChange(val) {
      if (!val || val === '') {
        this.columndisabled = false;
      } else {
        this.columndisabled = true;
        this.variates.subgroupsizecolumn = '';
      }
    },
    checkform() {
      if (!this.$refs.form.validate()) {
        return false;
      }
      return true;
    },
    // 根据校验将显示的参数项写入缓存
    variatesSet(val) {
      const check = this.checkparamters;
      const result = {};
      // eslint-disable-next-line
      for (let i in val) {
        if (check[i] && check[i].show) {
          result[i] = val[i];
        }
      }
      this.setVariates(result);
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
