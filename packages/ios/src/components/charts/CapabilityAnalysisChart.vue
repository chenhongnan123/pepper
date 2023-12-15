<template>
  <div :style="`height: ${height}px;width: 100%;overflow-y: auto;`">
    <div
      v-if="chartCardShow"
      class="mt-4"
    >
      <div
        class="d-flex justify-center"
        v-if="chartData&&chartData.status===200"
      >
        <highcharts
          id="processCapabilityChart"
          ref="processCapabilityChart"
          :options="capabOptions"
        ></highcharts>
      </div>
      <v-row
        v-if="chartData&&chartData.status===200"
        :style="`height: ${textHeight}px;overflow-y: auto;`"
        class="mx-3"
        :class="`${isDark ? 'colorWhite' : 'colorBlack'}`"
        dense
      >
        <!-- 处理数据模块 -->
        <v-col :cols="4">
          <p class="text-center mb-1">{{ $t('dataAlarmDetail.chart.processData') }}</p>
          <v-row dense no-gutters>
            <v-col :cols="6">
              <div class="chartCalData">
                <!-- 下限值 -->
                <div class="leftBottomline topline rightline">
                  <div class="smallLabelWidth ml-2">{{ $t('dataAlarmDetail.chart.lsl') }}</div>
                  <div class="valueWidth ml-2">{{ chartData.lsl || '*' }}</div>
                </div>
                <!-- 上限值 -->
                <div class="leftBottomline rightline">
                  <div class="smallLabelWidth ml-2">{{ $t('dataAlarmDetail.chart.usl') }}</div>
                  <div class="valueWidth ml-2">{{ chartData.usl || '*' }}</div>
                </div>
                <!-- 目标 -->
                <div class="leftBottomline rightline">
                  <div class="smallestLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.target') }}
                  </div>
                  <div class="valueWidth ml-2">{{ target || '*' }}</div>
                </div>
                <!-- 样本均值 -->
                <div class="leftBottomline rightline">
                  <div class="smallLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.sampleMean') }}
                  </div>
                  <div class="valueWidth ml-2">{{ getFixed(chartData.mean, 3) || '*' }}</div>
                </div>
                <!-- 样本数量 -->
                <div class="leftBottomline rightline">
                  <div class="smallLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.sampleSize') }}
                  </div>
                  <div class="valueWidth ml-2">{{ chartData.sample_size || '*' }}</div>
                </div>
              </div>
            </v-col>
            <v-col :cols="6">
              <!-- 正态/组间/组内算法展示标准差 -->
              <div
                class="chartCalData"
                v-if="selectedAlgorithm!=='nnormxpk'"
              >
                <!-- 整体标准差 -->
                <div v-if="overallShow" class="rightBottomline topline">
                  <div class="halfLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.stDevOverall') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.std_oa, 5) || '*' }}
                  </div>
                </div>
                <!-- 子组内标准差 -->
                <div
                  v-if="withinSubgroupShow"
                  class="rightBottomline"
                  :class="overallShow?'':'topline'"
                >
                  <div class="halfLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.stDevWithin') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.std_wi, 5) || '*' }}
                  </div>
                </div>
                <!-- 组间/组内cpk、ppk算法才显示组间标准差 -->
                <div
                  v-if="selectedAlgorithm==='bwxpk'"
                  class="rightBottomline"
                  :class="overallShow?'':'topline'"
                  :style="`${(clientWidth<1499&&overallShow&&withinSubgroupShow)
                    ?'border-left: 1px solid rgba(0, 0, 0, 0.12);':''}`"
                >
                  <div class="halfLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.stDevBetween') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.std_bw, 5) || '*' }}
                  </div>
                </div>
                <!-- 组间/组内cpk、ppk算法才显示组间/组内标准差 -->
                <div
                  v-if="selectedAlgorithm==='bwxpk'"
                  class="rightBottomline"
                  :class="(clientWidth<1522&&overallShow&&withinSubgroupShow)?'leftline':''"
                >
                  <div class="largeLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.stDevBW') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.std_cmb, 5) || '*' }}
                  </div>
                </div>
              </div>
              <!-- 非正态ppk算法展示内容 -->
              <div
                v-else
                class="chartCalData"
              >
                <!-- Weibull和Gamma分布需要显示形状 -->
                <div
                  v-if="shapeShow"
                  class="rightBottomline topline"
                >
                  <div class="smallestLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.shape') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.shape, 3) || '*' }}
                  </div>
                </div>
                <!-- 对数正态和Logistic分布需要显示位置 -->
                <div
                  v-if="locationShow"
                  class="rightBottomline"
                  :class="shapeShow ? '' : 'topline'"
                >
                  <div class="smallestLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.location') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.location, 3) || '*' }}
                  </div>
                </div>
                <!-- 除指数分布外，其余分布均显示尺度 -->
                <div
                  v-if="scaleShow"
                  class="rightBottomline"
                  :class="shapeShow || scaleShow ? '' : 'topline'"
                >
                  <div class="smallestLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.scale') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.scale, 3) || '*' }}
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <!-- 整体分析模块 -->
        <v-col :cols="4" v-if="overallShow">
          <p class="text-center mb-1">
            {{ $t('dataAlarmDetail.chart.overallCapability') }}
          </p>
          <!-- 显示：基准Z值 -->
          <v-row
            dense
            no-gutters
            v-if="z_bench"
          >
            <v-col :cols="6">
              <div class="chartCalData">
                <!-- Z值 -->
                <div class="leftBottomline topline rightline">
                  <div class="smallerLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.ZBench') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.z_bench_pp, 2) || '*' }}
                  </div>
                </div>
                <!-- 勾选包含置信区间才会显示置信区间参数 -->
                <!-- Z值置信区间 -->
                <div
                  v-if="optionsparams.includeConfidenceIntervals"
                  class="leftBottomline rightline"
                >
                  <div class="largeLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.ciForZBench') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getConfidenceIntervals(chartData.LB_zbench_pp, 2) || '*' }}
                  </div>
                </div>
                <!-- Z值下限 -->
                <div class="leftBottomline rightline">
                  <div class="halfLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.ZLSL') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.zLSL_ppL, 2) || '*' }}
                  </div>
                </div>
                <!-- Z值上限 -->
                <div class="leftBottomline rightline">
                  <div class="halfLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.ZUSL') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.zUSL_ppU, 2) || '*' }}
                  </div>
                </div>
              </div>
            </v-col>
            <v-col :cols="6">
              <div class="chartCalData">
                <!-- Ppk -->
                <div class="rightBottomline topline">
                  <div class="smallestLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.Ppk') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.usl, 2) || '*' }}
                  </div>
                </div>
                <!-- 勾选包含置信区间才会显示置信区间参数 -->
                <!-- Ppk置信区间 -->
                <div
                  v-if="optionsparams.includeConfidenceIntervals"
                  class="rightBottomline"
                >
                  <div class="halfLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.ciForPpk') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getConfidenceIntervals(chartData.LB_ppk, 2) || '*' }}
                  </div>
                </div>
                <!-- Cpm（非正态算法中没有） -->
                <div v-if="selectedAlgorithm!=='nnormxpk'" class="rightBottomline">
                  <div class="smallestLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.Cpm') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.cpm, 2) || '*' }}
                  </div>
                </div>
                <!-- 勾选包含置信区间才会显示置信区间参数 -->
                <!-- Cpm置信区间 -->
                <div
                  v-if="selectedAlgorithm!=='nnormxpk' && target
                  && optionsparams.includeConfidenceIntervals"
                  class="rightBottomline"
                >
                  <div class="halfLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.ciForCpm') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getConfidenceIntervals(chartData.LB_cpm, 2) || '*' }}
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <!-- 显示：能力统计量 -->
          <v-row dense no-gutters v-else>
            <v-col :cols="6">
              <div class="chartCalData">
                <!-- Pp -->
                <div class="leftBottomline topline rightline">
                  <div class="smallestLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.Pp') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.z_bench_pp, 2) || '*' }}
                  </div>
                </div>
                <!-- 勾选包含置信区间才会显示置信区间参数 -->
                <!-- Pp置信区间 -->
                <div
                  v-if="optionsparams.includeConfidenceIntervals"
                  class="leftBottomline rightline"
                >
                  <div class="halfLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.ciForPp') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getConfidenceIntervals(chartData.LB_zbench_pp, 2) || '*' }}
                  </div>
                </div>
                <!-- PP上限 -->
                <div class="leftBottomline rightline">
                  <div class="smallestLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.ppl') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.zLSL_ppL, 2) || '*' }}
                  </div>
                </div>
                <!-- PP下限 -->
                <div class="leftBottomline rightline">
                  <div class="smallestLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.ppu') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.zUSL_ppU, 2) || '*' }}
                  </div>
                </div>
              </div>
            </v-col>
            <v-col :cols="6">
              <div class="chartCalData">
                <!-- Ppk -->
                <div class="rightBottomline topline">
                  <div class="smallestLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.Ppk') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.ppk, 2) || '*' }}
                  </div>
                </div>
                <!-- 勾选包含置信区间才会显示置信区间参数 -->
                <!-- Ppk置信区间 -->
                <div
                  v-if="optionsparams.includeConfidenceIntervals"
                  class="rightBottomline"
                >
                  <div class="halfLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.ciForPpk') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getConfidenceIntervals(chartData.LB_ppk, 2) || '*' }}
                  </div>
                </div>
                <!-- Cpm（非正态算法中没有） -->
                <div v-if="selectedAlgorithm!=='nnormxpk'" class="rightBottomline">
                  <div class="smallestLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.Cpm') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.cpm, 2) || '*' }}
                  </div>
                </div>
                <!-- Cpm置信区间，在taget存在且勾选包含置信区间时显示 -->
                <div
                  v-if="selectedAlgorithm!=='nnormxpk' && target
                  && optionsparams.includeConfidenceIntervals"
                  class="rightBottomline"
                >
                  <div class="halfLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.ciForCpm') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getConfidenceIntervals(chartData.LB_cpm, 2) || '*' }}
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <!-- 子组内分析模块 -->
        <v-col :cols="4" v-if="withinSubgroupShow">
          <p
            class="text-center mb-1"
          >
            <span v-if="selectedAlgorithm === 'bwxpk'">
              {{ $t('dataAlarmDetail.chart.betweenwithinCapability') }}
            </span>
            <span v-else>
              {{ $t('dataAlarmDetail.chart.withinCapability') }}
            </span>
          </p>
          <!-- 显示：基准Z值 -->
          <v-row dense v-if="z_bench" no-gutters>
            <v-col :cols="6">
              <div class="chartCalData">
                <!-- Z值 -->
                <div class="leftBottomline topline rightline">
                  <div class="smallerLabelWidth ml-2">{{ $t('dataAlarmDetail.chart.ZBench') }}</div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.z_bench_cp, 2) || '*' }}
                  </div>
                </div>
                <!-- 勾选包含置信区间才会显示置信区间参数 -->
                <!-- Z值置信区间 -->
                <div
                  v-if="optionsparams.includeConfidenceIntervals"
                  class="leftBottomline rightline"
                >
                  <div class="largeLabelWidth ml-2">
                    {{ $t('dataAlarmDetail.chart.ciForZBench') }}
                  </div>
                  <div class="valueWidth ml-2">
                    {{ getConfidenceIntervals(chartData.LB_zbench_cp, 2) || '*' }}
                  </div>
                </div>
                <!-- Z值下限 -->
                <div class="leftBottomline rightline">
                  <div class="halfLabelWidth ml-2">{{ $t('dataAlarmDetail.chart.ZLSL') }}</div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.zLSL_cpL, 2) || '*' }}
                  </div>
                </div>
                <!-- Z值上限 -->
                <div class="leftBottomline rightline">
                  <div class="halfLabelWidth ml-2">{{ $t('dataAlarmDetail.chart.ZUSL') }}</div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.zUSL_cpU, 2) || '*' }}
                  </div>
                </div>
              </div>
            </v-col>
            <v-col :cols="6">
              <div class="chartCalData">
                <!-- Cpk/Cmk -->
                <div class="rightBottomline topline">
                  <!-- cmk/ppk算法显示Cmk，其余显示Cpk -->
                  <div
                    class="smallestLabelWidth ml-2"
                    v-if="selectedAlgorithm==='normxmk'"
                  >{{ $t('dataAlarmDetail.chart.Cmk') }}</div>
                  <div
                    class="smallestLabelWidth ml-2"
                    v-else
                  >{{ $t('dataAlarmDetail.chart.Cpk') }}</div>
                  <div
                    v-if="selectedAlgorithm==='normxmk'"
                    class="valueWidth ml-2"
                    :style="`color: var(--v-${
                      getColorByValue(getFixed(chartData.cpk, 2), 'cmk')}-base)`"
                  >
                    {{ getFixed(chartData.cpk, 2) || '*' }}
                  </div>
                  <div
                    v-else
                    class="valueWidth ml-2"
                    :style="`color: var(--v-${
                      getColorByValue(getFixed(chartData.cpk, 2), 'cpk')}-base)`"
                  >
                    {{ getFixed(chartData.cpk, 2) || '*' }}
                  </div>
                </div>
                <!-- 勾选包含置信区间才会显示置信区间参数 -->
                <!-- Cpk/Cmk置信区间 -->
                <div
                  v-if="optionsparams.includeConfidenceIntervals"
                  class="rightBottomline"
                >
                  <!-- cmk/ppk算法显示Cmk，其余显示Cpk -->
                  <div
                    v-if="selectedAlgorithm==='normxmk'"
                    class="halfLabelWidth ml-2"
                  >
                    {{ $t('dataAlarmDetail.chart.ciForCmk') }}
                  </div>
                  <div
                    v-else
                    class="halfLabelWidth ml-2"
                  >
                    {{ $t('dataAlarmDetail.chart.ciForCpk') }}
                  </div>
                  <div class="valueWidth ml-2">
                    <!-- 置信区间为单侧时，LB_cpk返回单个数值 -->
                    <!-- <span
                      v-if="optionsparams.options.confidenceIntervals !== 'twoSided'"
                    >
                      {{ getFixed(chartData.LB_cpk, 2) || '*' }}
                    </span> -->
                    <!-- 置信区间为双侧时，LB_cpk返回数组 -->
                    <!-- 所有置信区间显示在单侧时为数值，双侧时为数组 -->
                    <!-- 单侧时标签显示为LB for xx， 双侧时标签显示为CI for xx -->
                    <!-- 目前仅支持双侧，不支持单侧，因此未做判断处理 -->
                    <span>
                      {{ getConfidenceIntervals(chartData.LB_cpk, 2) || '*' }}
                    </span>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <!-- 显示： 能力统计量 -->
          <v-row dense v-else no-gutters>
            <v-col :cols="6">
              <div class="chartCalData">
                <!-- Cp/Cm -->
                <div class="leftBottomline topline rightline">
                  <!-- cmk/ppk算法显示Cm，其余显示Cp -->
                  <div
                    v-if="selectedAlgorithm==='normxmk'"
                    class="smallestLabelWidth ml-2"
                  >{{ $t('dataAlarmDetail.chart.Cm') }}</div>
                  <div
                    v-else
                    class="smallestLabelWidth ml-2"
                  >{{ $t('dataAlarmDetail.chart.Cp') }}</div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.z_bench_cp, 2) || '*' }}
                  </div>
                </div>
                <!-- 勾选包含置信区间才会显示置信区间参数 -->
                <!-- Cp/Cm置信区间 -->
                <div
                  v-if="optionsparams.includeConfidenceIntervals"
                  class="leftBottomline rightline"
                >
                  <!-- cmk/ppk算法显示Cm，其余显示Cp -->
                  <div
                    v-if="selectedAlgorithm==='normxmk'"
                    class="halfLabelWidth ml-2"
                  >{{ $t('dataAlarmDetail.chart.ciForCm') }}</div>
                  <div
                    v-else
                    class="halfLabelWidth ml-2"
                  >{{ $t('dataAlarmDetail.chart.ciForCp') }}</div>
                  <div class="valueWidth ml-2">
                    {{ getConfidenceIntervals(chartData.LB_zbench_cp, 2) || '*' }}
                  </div>
                </div>
                <!-- Cp/Cm下限 -->
                <div class="leftBottomline rightline">
                  <!-- cmk/ppk算法显示CML，其余显示CPL -->
                  <div
                    v-if="selectedAlgorithm==='normxmk'"
                    class="smallestLabelWidth ml-2"
                  >{{ $t('dataAlarmDetail.chart.cml') }}</div>
                  <div
                    v-else
                    class="smallestLabelWidth ml-2"
                  >{{ $t('dataAlarmDetail.chart.cpl') }}</div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.zLSL_cpL, 2) || '*' }}
                  </div>
                </div>
                <!-- Cp/Cm上限 -->
                <div class="leftBottomline rightline">
                  <!-- cmk/ppk算法显示CMU，其余显示CPU -->
                  <div
                    v-if="selectedAlgorithm==='normxmk'"
                    class="smallestLabelWidth ml-2"
                  >{{ $t('dataAlarmDetail.chart.cmu') }}</div>
                  <div
                    v-else
                    class="smallestLabelWidth ml-2"
                  >{{ $t('dataAlarmDetail.chart.cpu') }}</div>
                  <div class="valueWidth ml-2">
                    {{ getFixed(chartData.zUSL_cpU, 2) || '*' }}
                  </div>
                </div>
              </div>
            </v-col>
            <v-col :cols="6">
              <div class="chartCalData">
                <!-- Cpk/Cmk -->
                <div class="rightBottomline topline">
                  <!-- cmk/ppk算法显示Cmk，其余显示Cpk -->
                  <div
                    v-if="selectedAlgorithm==='normxmk'"
                    class="smallestLabelWidth ml-2"
                  >{{ $t('dataAlarmDetail.chart.Cmk') }}</div>
                  <div
                    v-else
                    class="smallestLabelWidth ml-2"
                  >{{ $t('dataAlarmDetail.chart.Cpk') }}</div>
                  <div
                    v-if="selectedAlgorithm==='normxmk'"
                    class="valueWidth ml-2"
                    :style="`color: var(--v-${
                      getColorByValue(getFixed(chartData.cpk, 2), 'cmk')}-base)`"
                  >
                    {{ getFixed(chartData.cpk, 2) || '*' }}
                  </div>
                  <div
                    v-else
                    class="valueWidth ml-2"
                    :style="`color: var(--v-${
                      getColorByValue(getFixed(chartData.cpk, 2), 'cpk')}-base)`"
                  >
                    {{ getFixed(chartData.cpk, 2) || '*' }}
                  </div>
                </div>
                <!-- 勾选包含置信区间才会显示置信区间参数 -->
                <!-- Cpk/Cmk置信区间 -->
                <div
                  v-if="optionsparams.includeConfidenceIntervals"
                  class="rightBottomline"
                >
                  <!-- cmk/ppk算法显示Cmk，其余显示Cpk -->
                  <div
                    class="halfLabelWidth ml-2"
                    v-if="selectedAlgorithm==='normxmk'"
                  >{{ $t('dataAlarmDetail.chart.ciForCmk') }}</div>
                  <div
                    class="halfLabelWidth ml-2"
                    v-else
                  >{{ $t('dataAlarmDetail.chart.ciForCpk') }}</div>
                  <div class="valueWidth ml-2">
                    <!-- 置信区间为单侧时，LB_cpk返回单个数值 -->
                    <!-- <span
                      v-if="optionsparams.options.confidenceIntervals !== 'twoSided'"
                    >
                      {{ getFixed(chartData.LB_cpk, 2) || '*' }}
                    </span> -->
                    <!-- 置信区间为双侧时，LB_cpk返回数组 -->
                    <span>
                      {{ getConfidenceIntervals(chartData.LB_cpk, 2) || '*' }}
                    </span>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div
        class="mx-2 text-right"
        :class="`${isDark ? 'colorWhite' : 'colorBlack'}`"
        v-if="ksigma"
      >
        {{ $t('dataAlarmDetail.chart.capabKsigma', { num: `${ksigma}` }) }}
      </div>
    </div>
    <v-row
      v-if="errMsgShow"
      :height="height"
      class="fill-height pa-0 px-2"
      style="width: 100%;"
      align-content="center"
      justify="center"
    >
      <v-col
        cols="12"
        class="text-center"
      >
        <div
          v-for="(item, index) in errMsgList"
          :key="`err_msg_${index}`"
          class="errmsg-text"
        >
          {{ item }}
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
// 引入highcharts组件
import { Chart } from 'highcharts-vue';
// eslint-disable-next-line
import Highcharts from 'highcharts';
// 引入高斯分布
import GaussianDistribution from 'highcharts/modules/histogram-bellcurve';
import Accessibility from 'highcharts/modules/accessibility';
import {
  getMin,
  getMax,
} from './spcChartUtils/commonUtil';

GaussianDistribution(Highcharts);
Accessibility(Highcharts);

let that = null;
export default {
  name: 'CapabilityAnalysisChart',
  data() {
    return {
      clientHeight: document.body.clientHeight,
      clientWidth: document.body.clientWidth,
      chartCardShow: false, // 控制图卡片是否显示
      errMsgShow: false,
      errMsgList: [],
      options: {
        chart: {
          polar: false,
          height: 300, // 默认高度
          type: 'histogram', // 控制图为直方图
        },
      },
      textHeight: 170, // 控制图下方文字高度
      sourceDataPoints: [], // 源数据点，用作绘制直方图
    };
  },
  components: {
    highcharts: Chart,
  },
  props: {
    // 传入当前选项卡选择的参数对象，用作部分控制图逻辑处理
    optionsparams: {
      type: Object,
      required: true,
    },
    // 当前接口返回的计算数据
    chartData: {
      type: Object,
      required: true,
    },
    // 接口入参
    payload: {
      type: Object,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    forceHeight: {
      type: Boolean,
      default: false,
    },
    isDark: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // 选择的控制图算法
    selectedAlgorithm() {
      return this.payload?.chart_type || this.chartData?.chart_type || '';
    },
    // 控制图实际高度
    chartHeight() {
      if (this.forceHeight) {
        return this.height - this.textHeight - 30;
      }
      return (this.height - this.textHeight - 30) < 400
        ? 400 : (this.height - this.textHeight - 30);
    },
    capabOptions() {
      return this.getChartOptions();
    },
    // 对能力统计值使用Kxsigma的公差，用作控制图下方文字显示
    ksigma() {
      return this.optionsparams.options?.ksigma || null;
    },
    // 置信水平，用作控制图副标题展示
    confidenceLevel() {
      return this.optionsparams.options?.confidenceLevel || '';
    },
    withinSubgroupShow() {
      return this.optionsparams.options.withinSubgroup || true;
    },
    overallShow() {
      return this.optionsparams.options.overall || true;
    },
    target() {
      return this.optionsparams.options?.cpm_target || null;
    },
    fitDistribution() {
      return this.optionsparams.parameters?.fitDistribution || '';
    },
    z_bench() {
      return this.optionsparams.options.display === 'benchmarkZs';
    },
    // 展示形状数据
    shapeShow() {
      const { fitDistribution } = this;
      return fitDistribution === 'weibull' || fitDistribution === '3pweibull'
        || fitDistribution === 'gamma' || fitDistribution === '3pgamma';
    },
    // 展示位置数据
    locationShow() {
      const { fitDistribution } = this;
      return fitDistribution === 'lognormal' || fitDistribution === '3plognormal'
        || fitDistribution === 'logistic' || fitDistribution === 'loglogistic'
          || fitDistribution === '3ploglogistic';
    },
    // 展示尺度数据
    scaleShow() {
      const { fitDistribution } = this;
      return fitDistribution !== 'exponential';
    },
    // 整体分析，高斯分布数据点
    overallPoints() {
      if (this.chartData.dist_x_oa?.length && this.chartData.dist_y_oa.length) {
        return this.chartData.dist_x_oa.map((item, index) => {
          const obj = {
            x: Number(item.toFixed(3)),
            y: Number(this.chartData.dist_y_oa[index].toFixed(3)),
          };
          return obj;
        });
      }
      return [];
    },
    // 子组内分析，高斯分布数据点
    withinPoints() {
      if (this.chartData.dist_x_p?.length && this.chartData.dist_y_p.length) {
        return this.chartData.dist_x_p.map((item, index) => {
          const obj = {
            x: Number(item.toFixed(3)),
            y: Number(this.chartData.dist_y_p[index].toFixed(3)),
          };
          return obj;
        });
      }
      return [];
    },
  },
  watch: {
    // 监控接口计算结果变更
    chartData: {
      handler(obj) {
        // 图表数据变化时，必须先清空上次绘制的图表数据，以免影响下次绘制
        this.reset();
        // 返回状态200，成功时才绘制图表
        if (obj && obj.status === 200) {
          this.errMsgShow = false;
          if (this.payload?.data?.length > 0) {
            [this.sourceDataPoints] = this.payload.data;
            this.chartCardShow = true;
          } else {
            this.sourceDataPoints = [];
            this.chartCardShow = false;
          }
        } else {
          this.chartCardShow = false;
          if (obj?.err_msg?.length > 0) {
            this.errMsgList = [
              ...obj.err_msg,
            ];
            this.errMsgShow = true;
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    // 放进全局变量以便在highcharts内部函数中调用this中的函数和数据
    that = this;
  },
  mounted() {
    // 控制图参数初始配置
    this.options = this.getOriginOptions();
    // 加载通用的参数配置
    // Highcharts.setOptions(this.options);
    Highcharts.chart('processCapabilityChart', this.options);
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    // 获取控制图初始统一配置项
    getOriginOptions() {
      const origiinaloptions = {
        chart: {
          polar: false,
          height: this.chartHeight,
          width: 650,
          type: 'histogram', // 默认直方图
          margin: [45, 120, 50, 80], // 设置内边距，上右下左
          backgroundColor: this.isDark ? 'transparent' : '#FFF',
        },
        credits: {
          enabled: false,
        }, // 不显示highcharts链接
        title: {
          text: '', // 不设置title会有默认标题
          margin: 12,
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: this.isDark ? '#FFF' : '#666666',
          },
          x: -35,
          y: 10,
        },
        pane: {
          size: '85%',
        },
        subtitle: {
          text: '',
        },
        legend: {
          enabled: true, // 不显示图例
          align: 'right',
          verticalAlign: 'top',
          layout: 'vertical',
          x: 0,
          y: 48,
          itemStyle: {
            color: this.isDark ? '#FFF' : '#000',
          },
          itemHoverStyle: {
            color: this.isDark ? '#03B7FD' : '#000',
          }, // 鼠标悬浮在图例上的颜色
        },
        plotOptions: {
          series: {
            // general options for all series
            pointPlacement: 'between',
          },
          spline: {
            // shared options for all spline series
            marker: {
              enabled: false,
              states: {
                hover: {
                  enabled: false,
                },
              },
            },
          },
          histogram: {
            // shared options for all histogram series
            showInLegend: false, // 不显示图例
            colors: ['#7cb5ec'],
            opacity: 0.90, // 直方图透明度
            borderWidth: 1,
            borderColor: 'black',
            // pointWidth: 20,
            // pointPadding: 0, // 直方图柱子之间的间隔
            // groupPadding: 0.1, // 直方图组之间的间隔
          },
          column: {
            showInLegend: false, // 不显示图例
            colors: ['#7cb5ec'],
            opacity: 0.95, // 直方图透明度
            borderWidth: 1,
            borderColor: 'black',
            // pointWidth: 40,
            // pointPadding: 0,
          },
        },
        xAxis: [
          {
            title: { text: '' },
            labels: {
              enabled: true,
              // step: 2, // 设置坐标标签间隔
              y: 10, // x轴上下偏移量
              style: {
                color: this.isDark ? '#FFF' : '#666666',
              },
            },
            gridLineWidth: 1, // x轴网格线宽度
            gridLineColor: this.isDark ? 'transparent' : '#ccd6eb',
            gridZIndex: -1,
            min: null,
            max: null,
            plotLines: [],
            plotBands: [],
            tickColor: this.isDark ? '#FFF' : '#ccd6eb',
            lineColor: this.isDark ? '#FFF' : '#ccd6eb',
            tickmarkPlacement: 'between',
          },
          {
            title: { text: '' },
            opposite: true,
            labels: {
              enabled: false,
              y: 10, // x轴上下偏移量
              style: {
                color: this.isDark ? '#FFF' : '#666666',
              },
            }, // 隐藏x轴的坐标标签
            gridLineColor: this.isDark ? 'transparent' : '#ccd6eb',
            lineWidth: 1, // 隐藏x轴的坐标轴线
            lineColor: this.isDark ? '#FFF' : '#ccd6eb',
            tickColor: 'transparent',
            tickmarkPlacement: 'between',
            plotLines: [],
            plotBands: [],
          },
        ],
        yAxis: [
          {
            title: { text: '' },
            opposite: false,
            gridLineWidth: 1, // y轴网格线宽度
            // gridLineColor: '#eee', // y轴网格线颜色
            gridZIndex: -1,
            labels: {
              enabled: false,
              style: {
                color: this.isDark ? '#FFF' : '#666666',
              },
            }, // 隐藏坐标标签
            lineWidth: 1, // 隐藏坐标轴线
            lineColor: this.isDark ? '#FFF' : '#ccd6eb',
            gridLineColor: this.isDark ? 'transparent' : '#ccd6eb',
            tickAmount: undefined, // y轴坐标点个数
            tickColor: 'transparent', // 设置坐标轴线颜色为透明，实现隐藏效果
            max: null, // 最大最小坐标默认设置空
            min: null,
            plotLines: [],
            plotBands: [],
          },
          {
            title: { text: '' },
            opposite: true,
            labels: {
              enabled: false,
              style: {
                color: this.isDark ? '#FFF' : '#666666',
              },
            },
            lineWidth: 1, // 隐藏坐标轴线
            lineColor: this.isDark ? '#FFF' : '#ccd6eb',
            gridLineColor: this.isDark ? 'transparent' : '#ccd6eb',
            tickAmount: undefined, // y轴坐标点个数
            tickColor: 'transparent', // 设置坐标轴线颜色为透明，实现隐藏效果
            max: null, // 最大最小坐标默认设置空
            min: null,
            plotLines: [],
            plotBands: [],
          },
        ],
        series: [],
      };
      return origiinaloptions;
    },
    // 重置控制图参数，清空图表数据
    reset() {
      this.chartCardShow = false;
    },
    // 设置控制图配置参数
    getChartOptions() {
      const { defaultOptions, chartData } = this;
      // 校验图表数据是否返回
      if (chartData.status && chartData.status === 200) {
        return this.getCommonChartOptions();
      }
      return defaultOptions;
    },
    // 能力分析算法控制图参数统一配置
    getCommonChartOptions() {
      // 获取控制图基本配置参数
      const commonoptions = this.getOriginOptions();
      const {
        chartData, // 接口返回的计算数据
        sourceDataPoints, // 源数据点
        overallPoints, // 整体分析高斯分布数据点
        withinPoints, // 子组内分析高斯分布数据点
        selectedAlgorithm, // 选择的算法
        fitDistribution, // 非正态算法的拟合分布
        target, // 目标值
      } = this;
      const { usl, lsl } = chartData;
      commonoptions.title.text = '';
      // 非正态算法，标题显示计算模型分布
      if (selectedAlgorithm === 'nnormxpk') {
        let dist = '';
        // 按照对数正态、韦伯、伽马、指数、logistic、对数logistic分布显示
        if (fitDistribution === 'lognormal' || fitDistribution === '3plognormal') {
          dist = 'lognormal';
        } else if (fitDistribution === 'weibull' || fitDistribution === '3pweibull') {
          dist = 'weibull';
        } else if (fitDistribution === 'gamma' || fitDistribution === '3pgamma') {
          dist = 'gamma';
        } else if (fitDistribution === 'exponential' || fitDistribution === '2pexponential') {
          dist = 'exponential';
        } else if (fitDistribution === 'loglogistic' || fitDistribution === '3ploglogistic') {
          dist = 'loglogistic';
        } else {
          dist = fitDistribution;
        }
        commonoptions.title.text = this.$t(
          'dataAlarmDetail.chart.calcBasedOn',
          { type: this.$t(`dataAlarmDetail.options.${dist}`) },
        );
      } else if (this.confidenceLevel) {
        // 其余算法若包含置信区间，则显示置信水平
        commonoptions.title.text = `${this.confidenceLevel}%${this.$t('dataAlarmDetail.options.confidenceLevel')}`;
      }
      // 高斯分布曲线的所有x轴数据
      let xAxis = [];
      if (chartData.dist_x_oa && chartData.dist_x_p) {
        xAxis = chartData.dist_x_oa.concat(chartData.dist_x_p);
      } else if (chartData.dist_x_oa && !chartData.dist_x_p) {
        xAxis = chartData.dist_x_oa;
      } else if (!chartData.dist_x_oa && chartData.dist_x_p) {
        xAxis = chartData.dist_x_p;
      }
      // 保留三位小数
      const xAxisArr = xAxis.map((item) => (Number(item)).toFixed(3));
      commonoptions.xAxis[1].categories = xAxisArr;
      // 样本数量
      const sampleSize = sourceDataPoints.length;
      // 使用 Sturges 法则计算区间大小
      const numBins = Math.ceil(1 + Math.log2(sampleSize));
      // 使用 Rice 法则计算区间大小
      // this.binsNumber = Math.ceil(2 * Math.cbrt(sampleSize));
      const min = getMin(sourceDataPoints);
      const max = getMax(sourceDataPoints);
      const intervalSize = Number((max - min) / numBins);
      // 设置x轴坐标间隔
      commonoptions.xAxis[0].tickInterval = intervalSize.toFixed(3) / 2;
      const limitArr = [min, max, usl, lsl, target];
      const notEmptyLimitArr = limitArr.filter(((item) => item !== null && item !== undefined));
      // 设置x轴坐标范围
      commonoptions.xAxis[0].max = (getMax(notEmptyLimitArr) + (intervalSize / 2));
      commonoptions.xAxis[0].min = (getMin(notEmptyLimitArr) - (intervalSize / 2));
      const xPlotLines = [];
      if (usl || usl === 0) {
        xPlotLines.push({
          color: this.isDark ? 'red' : '#900b09',
          dashStyle: 'dash',
          value: Number(usl),
          label: {
            style: {
              color: this.isDark ? 'red' : '#900b09',
            },
            // 与目标值一致时合并显示
            text: `${this.$t('dataAlarmDetail.chart.usl')}
            ${target === usl ? `,${this.$t('dataAlarmDetail.chart.target')}` : ''}`,
            textAlign: 'center',
            y: -5,
            rotation: 0,
          },
          width: 1,
        });
      }
      if (lsl || lsl === 0) {
        xPlotLines.push({
          color: this.isDark ? 'red' : '#900b09',
          dashStyle: 'dash',
          value: Number(lsl),
          label: {
            style: {
              color: this.isDark ? 'red' : '#900b09',
            },
            // 与目标值一致时合并显示
            text: `${this.$t('dataAlarmDetail.chart.lsl')}
            ${target === lsl ? `,${this.$t('dataAlarmDetail.chart.target')}` : ''}`,
            textAlign: 'center',
            y: -5,
            rotation: 0,
          },
          width: 1,
        });
      }
      // 目标值单独添加
      if ((target || target === 0) && usl !== target && lsl !== target) {
        const targetLine = {
          color: 'green',
          dashStyle: 'dash',
          value: Number(target),
          label: {
            style: {
              color: 'green',
            },
            text: this.$t('dataAlarmDetail.chart.target'),
            textAlign: 'center',
            y: -5,
            rotation: 0,
          },
          width: 1,
        };
        xPlotLines.push(targetLine);
      }
      commonoptions.xAxis[0].plotLines = xPlotLines;
      const series = [
        {
          name: 'histogram',
          type: 'histogram',
          xAxis: 0,
          yAxis: 1,
          data: this.processSourceData(sourceDataPoints, intervalSize),
          // data: sourceDataPoints,
          binsNumber: 'sturges',
          binWidth: intervalSize,
          zIndex: 0,
          centerInCategory: true,
          tooltip: {
            pointFormatter() {
              const { x, y } = this;
              const xValue = `${x}-${x + this.series.options.binWidth}`;
              return `${that.$t('dataAlarmDetail.chart.value')}: ${y},${that.$t('dataAlarmDetail.chart.interval')}: ${xValue}<br/>`;
            },
          },
          sonification: {
            enabled: true,
          },
        },
      ];
      // 整体分析曲线
      if (this.overallShow) {
        series.push({
          name: this.$t('dataAlarmDetail.chart.overall'),
          type: 'spline',
          data: overallPoints,
          zIndex: 1,
          dashStyle: 'solid',
          lineWidth: 2,
          color: '#900b09',
          tooltip: {
            valueDecimals: 3,
          },
        });
      }
      // 子组内分析曲线
      if (this.withinSubgroupShow) {
        let seriesName = '';
        if (selectedAlgorithm === 'bwxpk') {
          seriesName = this.$t('dataAlarmDetail.chart.between/within');
        } else {
          seriesName = this.$t('dataAlarmDetail.chart.within');
        }
        series.push({
          name: seriesName,
          type: 'spline',
          data: withinPoints,
          zIndex: 1,
          dashStyle: 'LongDash',
          lineDashStyle: 'LongDash', // 设置虚线样式
          lineWidth: 2,
          color: this.isDark ? '#e6e6e6' : '#1a0000',
          tooltip: {
            valueDecimals: 3,
          },
        });
      }
      commonoptions.series = series;
      return commonoptions;
    },
    getColorByValue(value, type) {
      if (type === 'cmk') {
        if (value && value >= 1.67 && value <= 2) {
          return 'warning';
        }
        if (value && value > 2) {
          return 'success';
        }
        if (value && value < 1.67) {
          return 'error';
        }
      } else { // cpk
        if (value && value > 1.33) {
          return 'success';
        }
        if (value && value <= 1.33) {
          return 'error';
        }
      }
      return '';
    },
    // 数值保留小数位数
    getFixed(number, pos) {
      if (number) {
        return Number(number).toFixed(pos);
      }
      // 数值为0时不作处理，返回显示0
      if (number === 0) return '0';
      return number;
    },
    // 置信区间数值处理
    getConfidenceIntervals(arr, pos) {
      if (!arr) {
        return null;
      }
      if (arr.length === 2) {
        const first = this.getFixed(arr[0], pos);
        const second = this.getFixed(arr[1], pos);
        if (first === null || second === null) {
          return null;
        }
        return `(${first},${second})`;
      }
      return null;
    },
    // 直方图数据处理
    processSourceData(rawData, intervalSize) {
      // 计算频数并组织数据
      const frequencyData = [];
      for (let i = 0; i < rawData.length; i += 1) {
        const value = rawData[i];
        const interval = Math.floor(value / intervalSize) * intervalSize;
        const existing = frequencyData.find((item) => item[0] === interval);
        if (existing) {
          existing[1] += 1;
        } else {
          frequencyData.push([interval, 1]);
        }
      }
      // 将数据按区间从小到大排序
      frequencyData.sort((a, b) => a[0] - b[0]);
      return frequencyData;
    },
  },
};
</script>
<style scoped lang="scss">
  .titlecard {
    ::v-deep() .v-card__title {
      font-size: 1rem;
      line-height: 1rem;
      padding: 10px 16px 10px 16px;
    }
  }

  .colorBlack {
    color: #252525;
  }

  .errmsg-text {
    font-size: 15px;
  }

  .chartCalData {
    width: 100%;
    height: 100%;
    color: #252525;
    font-size: 12px;
    text-align: left;
    .topline {
      border-top: 1px solid rgba(0, 0, 0, 0.12);
    }
    .leftBottomline {
      border-left: 1px solid rgba(0, 0, 0, 0.12);
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }
    .rightBottomline {
      border-right: 1px solid rgba(0, 0, 0, 0.12);
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }
    .rightline {
      border-right: 1px solid rgba(0, 0, 0, 0.12);
    }
    .leftline {
      border-left: 1px solid rgba(0, 0, 0, 0.12);
    }
    .smallestLabelWidth {
      display: inline-block;
      // width: 16%;
      width: 30px;
    }
    .smallerLabelWidth {
      display: inline-block;
      // width: 28%;
      width: 50px;
    }
    .smallLabelWidth {
      display: inline-block;
      // width: 35%;
      width: 60px;
    }
    .halfLabelWidth {
      display: inline-block;
      // width: 42%;
      width: 75px;
    }
    .largeLabelWidth {
      display: inline-block;
      // width: 55%;
      width: 105px;
    }
    .valueWidth {
      display: inline-block;
    }
  }
</style>
