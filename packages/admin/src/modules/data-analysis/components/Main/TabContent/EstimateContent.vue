<template>
  <v-form
    ref="form"
    lazy-validation
    :style="`height: ${height}px;`"
  >
    <!-- 单值算法 -->
    <v-row
      v-if="groupid===1"
      :style="`height: ${height-10}px;`"
      class="tabcontent"
    >
      <v-col :cols="4" class="radio">
        <v-radio-group
          dense
          class="ml-2"
          v-model="estimated.mrmode"
        >
          <v-radio
            v-for="(n, index) in mrRadios"
            :key="index"
            :label="$t(`dataAnalysis.options.${n.name}movingrange`)"
            :value="n.value"
          ></v-radio>
        </v-radio-group>
      </v-col>
      <v-col :cols="3">
        <v-text-field
          class="mt-4"
          dense
          outlined
          clearable
          type="number"
          :label="`${$t('dataAnalysis.options.movingrangelength')}*`"
          v-model="estimated.mrLength"
          :rules="rules.movingrangelength"
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- 子组算法 -->
    <v-row v-if="groupid===2&&algorithmselected!=='zone_chart'
      &&algorithmselected!=='i-mr-rs_chart'"
      :style="`height: ${height-10}px;`"
      class="tabcontent"
    >
      <v-col :cols="4">
        <v-radio-group
          dense
          class="ml-2"
          row
          v-model="estimated.standarddeviation"
          @change="sdRadioChange"
        >
          <v-radio
            v-for="(n, index) in sdRadios"
            :key="index"
            :label="$t(`dataAnalysis.options.${n.name}`)"
            :value="n.value"
          ></v-radio>
        </v-radio-group>
      </v-col>
      <v-col :cols="3">
        <v-checkbox
          dense
          class="mt-4"
          hide-details
          v-model="estimated.useunbiasingconstant"
          :label="$t(`dataAnalysis.options.unbiasingconstant`)"
          :disabled="unbiasingConstantDisabled"
        ></v-checkbox>
      </v-col>
    </v-row>
    <!-- 子组-区域算法/时间加权算法/能力分析算法 -->
    <v-row
      v-if="algorithmselected==='zone_chart' || groupid===4 || groupid===6"
      :style="`height: ${height-10}px;`"
      class="tabcontent"
    >
      <v-col :cols="6">
        <div>{{ $t('dataAnalysis.options.subgroup1') }}</div>
        <v-divider></v-divider>
        <v-row>
          <v-col :cols="6" class="radio">
            <v-radio-group
              dense
              class="ml-2"
              v-model="estimated.mrmode"
            >
              <v-radio
                v-for="(n, index) in mrRadios"
                :key="index"
                :label="$t(`dataAnalysis.options.${n.name}movingrange`)"
                :value="n.value"
              ></v-radio>
            </v-radio-group>
          </v-col>
          <v-col :cols="6">
            <v-text-field
              class="mt-2"
              dense
              outlined
              clearable
              type="number"
              :label="`${$t('dataAnalysis.options.movingrangelength')}*`"
              v-model="estimated.mrLength"
              :rules="rules.movingrangelength"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col :cols="6">
        <div>{{ $t('dataAnalysis.options.subgroupbiggerthan1') }}</div>
        <v-divider></v-divider>
        <v-row>
          <v-col :cols="6" class="radio">
            <v-radio-group
              dense
              class="ml-2"
              row
              v-model="estimated.standarddeviation"
            >
              <v-radio
                v-for="(n, index) in sdRadios"
                :key="index"
                :label="$t(`dataAnalysis.options.${n.name}`)"
                :value="n.value"
                @change="sdRadioChange"
              ></v-radio>
            </v-radio-group>
          </v-col>
          <v-col :cols="6">
            <v-checkbox
              dense
              class="mt-1"
              hide-details
              v-model="estimated.useunbiasingconstant"
              :label="$t(`dataAnalysis.options.unbiasingconstant`)"
              :disabled="unbiasingConstantDisabled"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        :cols="12"
        v-if="groupid===6"
      >
        <v-divider></v-divider>
        <v-checkbox
          dense
          class="mt-1"
          hide-details
          v-model="estimated.usebiasoverallsd"
          :label="$t(`dataAnalysis.options.usebiasoverallsd`)"
        ></v-checkbox>
      </v-col>
    </v-row>
    <!-- 子组-i-mr-r/s算法 -->
    <v-row
      v-if="algorithmselected==='i-mr-rs_chart'"
      :style="`height: ${height-10}px;`"
      class="tabcontent"
    >
      <!-- 组间 -->
      <v-col :cols="3">
        <div>{{ `${$t('dataAnalysis.options.betweensubgroups')}*` }}</div>
        <v-divider></v-divider>
        <v-radio-group
          dense
          class="ml-2"
          v-model="estimated.mrmode"
        >
          <v-radio
            v-for="(n, index) in mrRadios"
            :key="index"
            :label="$t(`dataAnalysis.options.${n.name}movingrange`)"
            :value="n.value"
          ></v-radio>
        </v-radio-group>
      </v-col>
      <!-- 组内 -->
      <v-col :cols="6">
        <div>{{ $t('dataAnalysis.options.withinsubgroups') }}</div>
        <v-divider></v-divider>
        <v-row>
          <v-col :cols="6" class="radio">
            <div class="mt-4">
              {{ `${$t('dataAnalysis.options.subgroupsmallerthan8')}*` }}
            </div>
            <v-divider></v-divider>
            <v-radio-group
              dense
              class="ml-2"
              row
              v-model="estimated.standarddeviation"
            >
              <v-radio
                v-for="(n, index) in sdRadios"
                :key="index"
                :label="$t(`dataAnalysis.options.${n.name}`)"
                :value="n.value"
                @change="sdRadioChange"
              ></v-radio>
            </v-radio-group>
          </v-col>
          <v-col :cols="6" class="radio">
            <div class="mt-4">
              {{ `${$t('dataAnalysis.options.subgroupbiggerthan8')}*` }}
            </div>
            <v-divider></v-divider>
            <v-radio-group
              dense
              class="ml-2"
              row
              v-model="estimated.standarddeviation2"
            >
              <v-radio
                v-for="(n, index) in sdRadios2"
                :key="index"
                :label="$t(`dataAnalysis.options.${n.name}`)"
                :value="n.value"
                @change="sdRadioChange"
              ></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-col>
      <v-col :cols="3">
        <v-text-field
          class="mt-2"
          dense
          outlined
          clearable
          type="number"
          :label="`${$t('dataAnalysis.options.movingrangelength')}*`"
          v-model="estimated.mrLength"
          :rules="rules.movingrangelength"
        ></v-text-field>
        <v-checkbox
          dense
          hide-details
          v-model="estimated.useunbiasingconstant"
          :label="$t(`dataAnalysis.options.unbiasingconstant`)"
          :disabled="unbiasingConstantDisabled"
        ></v-checkbox>
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
      estimated: {},
      mrRadios: [
        {
          name: 'average',
          value: 'averagemovingrange',
        },
        {
          name: 'median',
          value: 'medianmovingrange',
        },
      ],
      allSDRadios: [
        {
          name: 'rbar',
          value: 'rbar',
        },
        {
          name: 'sbar',
          value: 'sbar',
        },
        {
          name: 'pooled',
          value: 'pooled',
        },
      ],
    };
  },
  watch: {
    // 监听选项卡参数变化，同步写入缓存
    estimated: {
      handler(val) {
        this.estimatedSet(val);
      },
      deep: true,
      immediate: true,
    },
    // 根据视图传递参数给选项赋值，若无选中视图则显示默认参数
    setparams: {
      handler(val) {
        const arr = Object.keys(val);
        if (arr.length !== 0) {
          this.estimated = val;
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
    // 根据算法筛选标准差radios选项
    sdRadios() {
      if (this.algorithmselected === 'xbar-r_chart' || this.algorithmselected === 'r_chart') {
        return this.allSDRadios.filter((item) => item.name !== 'sbar');
      }
      if (this.algorithmselected === 'xbar-s_chart' || this.algorithmselected === 's_chart') {
        return this.allSDRadios.filter((item) => item.name !== 'rbar');
      }
      return this.allSDRadios;
    },
    sdRadios2() {
      return this.allSDRadios.filter((item) => item.name !== 'rbar');
    },
    // 不同算法根据标准差选项不同，无偏变量可选性变化
    unbiasingConstantDisabled() {
      if (this.groupid === 2) {
        if (this.algorithmselected === 'xbar-r_chart' || this.algorithmselected === 'xbar_chart'
        || this.algorithmselected === 'r_chart' || this.algorithmselected === 'zone_chart'
        || this.algorithmselected === 'xbar_chart') {
          return this.estimated.standarddeviation === 'rbar';
        }
        return false;
      }
      if (this.groupid === 4 || this.groupid === 6) {
        return this.estimated.standarddeviation === 'rbar';
      }
      return false;
    },
  },
  created() {
    this.estimatedSet(this.estimated);
  },
  methods: {
    ...mapMutations('dataAnalysis', ['setEstimated']),
    checkform() {
      if (!this.$refs.form.validate()) {
        return false;
      }
      return true;
    },
    // 设置选项卡为默认参数，并写入缓存
    setDefaultParams() {
      this.estimated = {
        ...this.defaultParams,
      };
    },
    // 根据校验将显示的参数项写入缓存
    estimatedSet(val) {
      const check = this.checkparamters;
      const result = {};
      // eslint-disable-next-line
      for (let i in val) {
        if (check[i] && check[i].show) {
          result[i] = val[i];
        }
      }
      this.setEstimated(result);
    },
    sdRadioChange() {
      if (this.estimated.standarddeviation === 'rbar') {
        this.estimated.useunbiasingconstant = true;
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

  .tabcontent /deep/ .col-6 {
    padding-bottom: 0px;
  }

  .tabcontent /deep/ .col-12 {
    padding-top: 0px;
    padding-bottom: 0px;
  }
</style>
