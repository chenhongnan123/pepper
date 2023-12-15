<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="450px"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden">
      <v-row>
        <v-col :cols="12">
          <v-card-title primary-title>
            <span>{{ $t('dataAnalysis.dialog.confirmtip')}}</span>
            <v-spacer></v-spacer>
            <v-btn icon small @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text
            class="ml-4"
            style="max-height: 400px;overflow-y: auto;"
          >
            <div>
              <div>{{ `${$t('dataAnalysis.dialog.algorithmname')}:`}}</div>
              <div class="ml-8" v-text="algorithmText"></div>
            </div>
            <!-- 变量 -->
            <div v-if="variatesShow">
              <div>{{ `${$t('dataAnalysis.options.variate')}:`}}</div>
              <div
                class="ml-8"
                v-if="params.variates.partnumber"
              >
                {{ `${$t('dataAnalysis.options.sizeidcolumn')}:
                  ${getVariate(params.variates.partnumber)}` }}
              </div>
              <div
                class="ml-8"
                v-if="params.variates.variateOne"
              >
                {{ `${$t('dataAnalysis.options.variateone')}:
                  ${getVariate(params.variates.variateOne)}` }}
              </div>
              <div
                class="ml-8"
                v-if="params.variates.variateTwo"
              >
                {{ `${$t('dataAnalysis.options.variatetwo')}:
                  ${getVariate(params.variates.variateTwo)}` }}
              </div>
              <div
                class="ml-8"
                v-if="params.variates.variateThree"
              >
                <!-- eslint-disable-next-line -->
                {{ `${$t('dataAnalysis.options.variatethree')}:
                  ${getVariate(params.variates.variateThree)}` }}
              </div>
              <div
                class="ml-8"
                v-if="params.variates.subgroupsizenumber"
              >
                {{ `${$t('dataAnalysis.options.subgroupsize')}
                  ${$t('dataAnalysis.options.sizenumber')}:
                    ${params.variates.subgroupsizenumber}` }}
              </div>
              <div
                class="ml-8"
                v-if="params.variates.subgroupsizecolumn"
              >
                {{ `${$t('dataAnalysis.options.subgroupsize')}
                  ${$t('dataAnalysis.options.sizeidcolumn')}:
                  ${getVariate(params.variates.subgroupsizecolumn)}` }}
              </div>
              <div
                class="ml-8"
                v-if="params.variates.movingaveragelength"
              >
                {{ `${$t('dataAnalysis.options.movingaveragelength')}
                : ${params.variates.movingaveragelength}` }}
              </div>
              <div
                class="ml-8"
                v-if="params.variates.ewmaweight"
              >
                {{ `${$t('dataAnalysis.options.ewmaweight')}:
                  ${params.variates.ewmaweight}` }}
              </div>
              <div
                class="ml-8"
                v-if="params.variates.target || params.variates.target == 0"
              >
                {{ `${$t('dataAnalysis.options.target')}:
                  ${params.variates.target}` }}
              </div>
            </div>
            <!-- 参数 -->
            <div v-if="parametersHasChildProp">
              <div v-if="parametersShow">
                <div>
                  {{ `${$t('dataAnalysis.options.parameter')}:`}}
                </div>
                <div
                  class="ml-8"
                  v-if="groupid === 6 && params.parameters.upperLimit"
                >
                  {{ `${$t('dataAnalysis.options.specUpperlimit')}:
                    ${params.parameters.upperLimit}` }}
                </div>
                <div
                  class="ml-8"
                  v-if="groupid === 6 && params.parameters.lowerLimit"
                >
                  {{ `${$t('dataAnalysis.options.specLowerlimit')}:
                    ${params.parameters.lowerLimit}` }}
                </div>
                <div
                  class="ml-8"
                  v-if="params.parameters.meanValue"
                >
                  <span v-if="groupid === 6">
                    {{ $t('dataAnalysis.options.hisMean') }}
                  </span>
                  <span v-else>
                    {{ $t('dataAnalysis.options.mean') }}
                  </span>
                  {{ `: ${params.parameters.meanValue}` }}
                </div>
                <div
                  class="ml-8"
                  v-if="params.parameters.standardDeviation"
                >
                  <span v-if="groupid === 6">
                    {{ $t('dataAnalysis.options.hisStandarddeviation') }}
                  </span>
                  <span v-else>
                    {{ $t('dataAnalysis.options.standarddeviation') }}
                  </span>
                  {{ `: ${params.parameters.standardDeviation}` }}
                </div>
                <div
                  class="ml-8"
                  v-if="params.parameters.useHistorySD"
                >
                  {{ `${$t('dataAnalysis.options.hisStandarddeviation')}:` }}
                </div>
                <div
                  class="ml-8"
                  v-if="algorithmselected==='i-mr-rs_chart'
                  && (params.parameters.withinSubgroupSD || params.parameters.betweenSubgroupSD)"
                >
                  {{ `${$t('dataAnalysis.options.standarddeviation')}:` }}
                </div>
                <div
                  class="ml-16"
                  v-if="(algorithmselected==='i-mr-rs_chart' || params.parameters.useHistorySD)
                  && params.parameters.withinSubgroupSD"
                >
                  {{ `${$t('dataAnalysis.options.withinsubgroups')}:` }}
                  {{ params.parameters.withinSubgroupSD }}
                </div>
                <div
                  class="ml-16"
                  v-if="(algorithmselected==='i-mr-rs_chart' || params.parameters.useHistorySD)
                  && params.parameters.betweenSubgroupSD"
                >
                  {{ `${$t('dataAnalysis.options.betweensubgroups')}:` }}
                  {{ params.parameters.betweenSubgroupSD }}
                </div>
                <div
                  class="ml-8"
                  v-if="params.parameters.proportion"
                >
                  {{ `${$t('dataAnalysis.options.proportion')}
                    : ${params.parameters.proportion}` }}
                </div>
                <div
                  class="ml-8"
                  v-if="algorithmselected==='nnormxpk' && params.parameters.fitDistribution"
                >
                  {{ `${$t('dataAnalysis.options.fitDistribution')}` }}
                  {{ `: ${$t(`dataAnalysis.options.${params.parameters.fitDistribution}`)}` }}
                </div>
              </div>
              <div v-else>
                <div>
                  {{ `${$t('dataAnalysis.options.parameter')}:
                    ${$t('dataAnalysis.options.empty')}` }}
                </div>
              </div>
            </div>
            <!-- 估计标准差 -->
            <div v-if="estimatedHasChildProp">
              <div v-if="estimatedShow">
                <div>
                  {{ `${$t('dataAnalysis.options.estimatedStandardDeviation')}:`}}
                </div>
                <div
                  class="ml-8"
                  v-if="groupid===1 && params.estimated.mrmode"
                >
                  {{ $t(`dataAnalysis.options.${params.estimated.mrmode}`) }}
                </div>
                <div
                  class="ml-8"
                  v-if="groupid===1 && params.estimated.mrLength"
                >
                  {{ `${$t('dataAnalysis.options.movingrangelength')}
                    : ${params.estimated.mrLength}` }}
                </div>
                <div
                  class="ml-8"
                  v-if="groupid===2&&algorithmselected!=='zone_chart'
                    && algorithmselected!=='i-mr-rs_chart'"
                >
                  <div
                    v-if="params.estimated.standarddeviation"
                  >
                    {{ $t(`dataAnalysis.options.${params.estimated.standarddeviation}`) }}
                  </div>
                  <div
                    v-if="params.estimated.useunbiasingconstant"
                  >
                    {{ $t(`dataAnalysis.options.unbiasingconstant`) }}
                  </div>
                </div>
                <div
                  class="ml-8"
                  v-if="algorithmselected==='zone_chart' || groupid===4 || groupid===6"
                >
                  <div>{{ `${$t('dataAnalysis.options.subgroup1')}` }}</div>
                  <div
                    class="ml-8"
                    v-if="params.estimated.mrmode"
                  >
                    {{ $t(`dataAnalysis.options.${params.estimated.mrmode}`) }}
                  </div>
                  <div
                    class="ml-8"
                    v-if="params.estimated.mrLength"
                  >
                    {{ `${$t('dataAnalysis.options.movingrangelength')}
                    : ${params.estimated.mrLength}` }}
                  </div>
                  <div>{{ `${$t('dataAnalysis.options.subgroupbiggerthan1')}` }}</div>
                  <div
                    class="ml-8"
                    v-if="params.estimated.standarddeviation"
                  >
                    {{ $t(`dataAnalysis.options.${params.estimated.standarddeviation}`) }}
                  </div>
                  <div
                    class="ml-8"
                    v-if="params.estimated.standarddeviation!=='rbar'
                    &&params.estimated.useunbiasingconstant"
                  >
                    {{ `${$t('dataAnalysis.options.unbiasingconstant')}` }}
                  </div>
                  <div
                    v-if="groupid===6 && params.estimated.usebiasoverallsd"
                  >
                    {{ `${$t('dataAnalysis.options.usebiasoverallsd')}` }}
                  </div>
                </div>
                <div
                  class="ml-8"
                  v-if="algorithmselected==='i-mr-rs_chart'"
                >
                  <div>{{ `${$t('dataAnalysis.options.betweensubgroups')}` }}</div>
                  <div
                    class="ml-8"
                    v-if="params.estimated.mrmode"
                  >
                    {{ $t(`dataAnalysis.options.${params.estimated.mrmode}`) }}
                  </div>
                  <div>{{ $t('dataAnalysis.options.withinsubgroups') }}</div>
                  <div class="ml-8">{{ `${$t('dataAnalysis.options.subgroupsmallerthan8')}` }}</div>
                  <div
                    class="ml-8"
                    v-if="params.estimated.standarddeviation"
                  >
                    {{ $t(`dataAnalysis.options.${params.estimated.standarddeviation}`) }}
                  </div>
                  <div class="ml-8">{{ `${$t('dataAnalysis.options.subgroupbiggerthan8')}` }}</div>
                  <div
                    class="ml-8"
                    v-if="params.estimated.standarddeviation2"
                  >
                    {{ $t(`dataAnalysis.options.${params.estimated.standarddeviation2}`) }}
                  </div>
                  <div
                    v-if="params.estimated.mrLength"
                  >
                    {{ `${$t('dataAnalysis.options.movingrangelength')}
                    : ${params.estimated.mrLength}` }}
                  </div>
                  <div
                    v-if="params.estimated.useunbiasingconstant"
                  >
                    {{ `${$t('dataAnalysis.options.unbiasingconstant')}` }}
                  </div>
                </div>
              </div>
              <div v-else>
                <div>
                  <!-- eslint-disable-next-line -->
                  {{ `${$t('dataAnalysis.options.estimatedStandardDeviation')}: ${$t('dataAnalysis.options.empty')}` }}
                </div>
              </div>
            </div>
            <!-- 检验 -->
            <div v-if="testsHasChildProp">
              <div v-if="testsShow">
                <div>
                  {{ `${$t('dataAnalysis.options.checkout')}:`}}
                  <span v-if="testsArr.length===0">
                    {{ `${$t('dataAnalysis.options.empty')}` }}
                  </span>
                </div>
                <div
                  v-for="(item,index) in testsArr"
                  :key="index"
                >
                  <div
                    class="ml-8"
                    v-if="item.values.checked"
                  >
                    {{ `${$t(`dataAnalysis.options.${item.name}`, { num: item.values.value })}` }}
                  </div>
                </div>
              </div>
              <div v-else>
                <div>
                {{ `${$t('dataAnalysis.options.checkout')}: ${$t('dataAnalysis.options.empty')}` }}
                </div>
              </div>
            </div>
            <!-- options -->
            <div v-if="optionsHasChildProp">
              <div v-if="optionsShow">
                <div>
                  {{ `${$t('dataAnalysis.options.options')}:`}}
                </div>
                <div
                  class="ml-8"
                  v-if="params.options.cpmTarget"
                >
                  {{ `${$t('dataAnalysis.options.target')}(${$t('dataAnalysis.options.addCpm')})` }}
                  {{ `: ${params.options.cpmTarget}` }}
                </div>
                <div
                  class="ml-8"
                  v-if="params.options.ksigma"
                >
                  {{ $t('dataAnalysis.options.useTolerance') }}
                  {{ `: ${params.options.ksigma}` }}
                </div>
                <div class="ml-8">
                  {{ `${$t('dataAnalysis.options.performAnalysis')}:` }}
                  <span
                    v-if="algorithmselected==='nnormxpk' && params.options.performAnalysis"
                  >
                    {{ $t(`dataAnalysis.options.${params.options.performAnalysis}`) }}
                  </span>
                  <div
                    class="ml-8"
                    v-if="algorithmselected!=='nnormxpk' && params.options.withinSubgroup"
                  >
                    {{ `${$t('dataAnalysis.options.withinSubgroupAnalysis')}` }}
                  </div>
                  <div
                    class="ml-8"
                    v-if="algorithmselected!=='nnormxpk' && params.options.overall"
                  >
                    {{ `${$t('dataAnalysis.options.overallAnalysis')}` }}
                  </div>
                </div>
                <div class="ml-8">
                  {{ `${$t('dataAnalysis.options.display')}: ` }}
                  {{ $t(`dataAnalysis.options.${params.options.display}`) }}
                </div>
                <div
                  class="ml-8"
                  v-if="algorithmselected!=='nnormxpk'
                  && params.options.includeConfidenceIntervals"
                >
                  <div>
                    <!-- eslint-disable-next-line -->
                    {{ `${$t('dataAnalysis.options.confidenceLevel')}: ${params.options.confidenceLevel}` }}
                  </div>
                  <div>
                    <!-- eslint-disable-next-line -->
                    {{ `${$t('dataAnalysis.options.confidenceIntervals')}: ${$t(`dataAnalysis.options.${params.options.confidenceIntervals}`)}` }}
                  </div>
                </div>
              </div>
              <div v-else>
                <div>
                {{ `${$t('dataAnalysis.options.options')}: ${$t('dataAnalysis.options.empty')}` }}
                </div>
              </div>
            </div>
            <!-- plan/type -->
            <div v-if="planortypeHasChildProp">
              <div v-if="planortypeShow">
                <div>
                  {{ `${$t('dataAnalysis.options.planortype')}:`}}
                </div>
                <div
                  v-if="params.planortype.cumsumtype==='tabular'"
                  class="ml-8"
                >
                  {{ `${$t('dataAnalysis.options.typeofcusum')}:
                    ${$t('dataAnalysis.options.tabular')}` }}
                  <div
                    v-if="params.planortype.reset"
                    class="ml-8"
                  >
                    {{ $t('dataAnalysis.options.restsignal') }}
                  </div>
                  <div
                    v-if="params.planortype.useFIR"
                    class="ml-8"
                  >
                    {{ $t('dataAnalysis.options.useFIR') }}
                  </div>
                  <div
                    v-if="params.planortype.sdnumber"
                    class="ml-8"
                  >
                    {{ `${$t('dataAnalysis.options.sdnumber')}: ${params.planortype.sdnumber}` }}
                  </div>
                </div>
                <div
                  v-if="params.planortype.h || params.planortype.k"
                  class="ml-8"
                >
                  {{ `${$t('dataAnalysis.options.cusumplan')}` }}
                  <div class="ml-8">
                    <span
                      v-if="params.planortype.h"
                    >
                      {{ `${$t('dataAnalysis.options.h')}: ${params.planortype.h}` }}
                    </span>
                    <span v-if="params.planortype.h">,</span>
                    <span
                      v-if="params.planortype.h"
                    >
                      {{ `${$t('dataAnalysis.options.k')}: ${params.planortype.k}` }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else>
                <div>
                {{ `${$t('dataAnalysis.options.planortype')}:
                  ${$t('dataAnalysis.options.empty')}` }}
                </div>
              </div>
            </div>
            <!-- weights/reset -->
            <div v-if="weightsHasChildProp">
              <div v-if="weightsShow">
                <div>
                  {{ `${$t('dataAnalysis.options.weights')}:`}}
                </div>
                <div
                  v-if="params.weights.zonea || params.weights.zonea === 0"
                  class="ml-8"
                >
                  {{ `${$t('dataAnalysis.options.zonea')}: ${params.weights.zonea}` }}
                </div>
                <div
                  v-if="params.weights.zoneb"
                  class="ml-8"
                >
                  {{ `${$t('dataAnalysis.options.zoneb')}: ${params.weights.zoneb}` }}
                </div>
                <div
                  v-if="params.weights.zonec"
                  class="ml-8"
                >
                  {{ `${$t('dataAnalysis.options.zonec')}: ${params.weights.zonec}` }}
                </div>
                <div
                  v-if="params.weights.zoned"
                  class="ml-8"
                >
                  {{ `${$t('dataAnalysis.options.zoned')}: ${params.weights.zoned}` }}
                </div>
                <div
                  v-if="params.weights.zonensigma"
                  class="ml-8"
                >
                  {{ $t(`dataAnalysis.options.zonensigma`, { num: params.weights.zonensigma }) }}
                </div>
                <div
                  v-if="params.weights.reset"
                  class="ml-8"
                >
                  {{ $t('dataAnalysis.options.zonereset') }}
                </div>
              </div>
              <div v-else>
                <div>
                {{ `${$t('dataAnalysis.options.weights')}: ${$t('dataAnalysis.options.empty')}` }}
                </div>
              </div>
            </div>
            <!-- boxcox -->
            <div v-if="boxcoxHasChildProp">
              <div v-if="boxcoxShow">
                <div>
                  {{ `${$t('dataAnalysis.options.boxCox')}:`}}
                </div>
                <div
                  v-if="params.boxcox.isboxcox"
                  class="ml-8"
                >
                  {{ $t('dataAnalysis.options.useboxcox') }}
                  <div
                    v-if="params.boxcox.boxcoxoption"
                  >
                    {{ `${$t(`dataAnalysis.options.${params.boxcox.boxcoxoption}`)}
                      ${(params.boxcox.boxcoxoption === 'other'
                        && (params.boxcox.boxcoxvalue || params.boxcox.boxcoxvalue === 0))
                          ? `: ${params.boxcox.boxcoxvalue}`
                          : ''}`}}
                  </div>
                </div>
                <div v-else class="ml-8">
                  {{ $t('dataAnalysis.options.nouseboxcox') }}
                </div>
              </div>
              <div v-else>
                <div>
                {{ `${$t('dataAnalysis.options.boxCox')}: ${$t('dataAnalysis.options.empty')}` }}
                </div>
              </div>
            </div>
          </v-card-text>
          <v-card-actions class="mt-4 mb-2">
            <v-spacer></v-spacer>
            <v-btn
              color="warning"
              small
              text
              class="mr-2"
              @click="dialog = false"
            >
              {{ $t('dataAnalysis.btn.cancel') }}
            </v-btn>
            <v-btn color="primary" small class="text-none" @click="handleSave">
              {{ $t('dataAnalysis.btn.confirm') }}
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  name: 'confirmDialog',
  data() {
    return {
    };
  },
  props: {
    confirmDialog: {
      type: Boolean,
      required: true,
    },
    algorithm: {
      type: Object,
      required: true,
    }, // 传入当前选择的算法
    params: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('dataAnalysis', ['selectedItems']),
    ...mapState('dataAnalysis', ['dataColumnList']),
    dialog: {
      get() {
        return this.confirmDialog;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
    algorithmText() {
      return this.algorithm.text || '';
    },
    algorithmselected() {
      return this.algorithm.value || '';
    },
    groupid() {
      return this.algorithm.groupId || '';
    },
    variatesShow() {
      return this.params && this.params.variates
      && Object.keys(this.params.variates).length > 0;
    },
    parametersShow() {
      if (this.params && this.params.parameters) {
        const { parameters } = this.params;
        const arr = Object.keys(parameters);
        if (arr.length > 0) {
          // eslint-disable-next-line
          for (let i in parameters) {
            if (parameters[i] !== '' && parameters[i] !== null) {
              return true;
            }
          }
          return false;
        }
      }
      return false;
    },
    parametersHasChildProp() {
      return this.groupid !== 5;
    }, // 多变量算法不显示参数项
    estimatedHasChildProp() {
      return this.groupid === 1 || this.groupid === 2 || this.groupid === 4
      || (this.groupid === 6 && this.algorithmselected !== 'nnormxpk');
    }, // 单值算法、子组算法、时间加权算法、能力分析算法（非正态除外）均显示估计标准差选项
    estimatedShow() {
      return this.params && this.params.estimated
      && Object.keys(this.params.estimated).length > 0;
    },
    testsHasChildProp() {
      return this.groupid === 1
      || (this.groupid === 2 && this.algorithmselected !== 'zone_chart')
      || this.groupid === 3
      || (this.groupid === 4 && this.algorithmselected !== 'cumsum_chart');
    }, // 子组-区域算法、时间加权-累积和算法、多变量算法、能力分析算法不显示校验项，其余算法均显示
    testsShow() {
      return this.params && this.params.tests
      && Object.keys(this.params.tests).length > 0;
    },
    // 校验项列表
    testsArr() {
      const { tests } = this.params;
      const list = [];
      // eslint-disable-next-line
      for (let key in tests) {
        const obj = {
          name: key,
          values: tests[key],
        };
        list.push(obj);
      }
      return list;
    },
    boxcoxHasChildProp() {
      // return this.groupid === 1 || this.groupid === 2 || this.groupid === 4
      // || this.groupid === 5 || this.groupid === 6;
      return false; // 隐藏box-cox
    }, // 属性控制算法不显示boxcox项，其余算法均显示
    boxcoxShow() {
      return this.params && this.params.boxcox
      && Object.keys(this.params.boxcox).length > 0;
    },
    // 只有累计和算法有计划/类型内容
    planortypeHasChildProp() {
      return this.groupid === 4 && this.algorithmselected === 'cumsum_chart';
    },
    planortypeShow() {
      return this.params && this.params.planortype
      && Object.keys(this.params.planortype).length > 0;
    },
    // 只有zone_chart有权重/重置内容
    weightsHasChildProp() {
      return this.groupid === 2 && this.algorithmselected === 'zone_chart';
    },
    weightsShow() {
      return this.params && this.params.weights
      && Object.keys(this.params.weights).length > 0;
    },
    // 只有能力分析算法有选项内容
    optionsHasChildProp() {
      return this.groupid === 6;
    },
    optionsShow() {
      // console.log(this.params.options, 'options');
      return this.params && this.params.options
      && Object.keys(this.params.options).length > 0;
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('dataAnalysis', []),
    // 根据变量number获取变量名称展示
    getVariate(number) {
      const fieldlist = this.dataColumnList.filter((item) =>
        item.connectionParameterNumber === number);
      let field = '';
      if (fieldlist.length > 0) {
        field = fieldlist[0].columnName;
      }
      return field;
    },
    handleSave() {
      this.$emit('getCharts');
      this.dialog = false;
    },
  },
};
</script>
