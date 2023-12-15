<template>
  <div class="darkNoBgColor">
    <div :style="`height: ${filterOptionsHeight}px;`">
      <!-- 完整spc功能，包含历史数据分析（时间选择），算法模型过来的仅作实时数据分析 -->
      <v-form
        ref="form"
        lazy-validation
      >
        <v-row dense>
          <v-col :cols="2">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-autocomplete
                  v-on="on"
                  hide-details
                  dense
                  outlined
                  clearable
                  :items="dataTableOptions"
                  :rules="rules.isrequired"
                  item-text="text"
                  item-value="value"
                  return-object
                  :label="`${$t('dataAnalysis.label.datasource')}*`"
                  v-model="selectedItems.datatable"
                  @change="dataTableChange"
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.text }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.desc }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </template>
              <!-- 动态渲染选项提示文字内容 -->
              <template v-if="selectedDataTableName">
                <div>
                  {{ selectedDataTableName }}
                </div>
              </template>
            </v-tooltip>
          </v-col>
          <v-col :cols="1">
            <!-- 算法模型spc功能实时勾选框不允许变更 -->
            <v-checkbox
              :label="`${$t('dataAnalysis.label.realtime')}`"
              v-model="selectedItems.isrealtime"
              class="ml-1"
              style="margin-top: 3px;"
              hide-details
              @change="realtimeChange"
              :disabled="modelId ? true : false"
            ></v-checkbox>
          </v-col>
          <v-col :cols="4" v-if="!selectedItems.isrealtime" class="customDateTimePicker">
            <!-- <date-range-picker
              @getDateRange="getDateRange"
              :currentDates="selectedItems.currentDates"
            /> -->
            <DateTimeRangePicker
              v-model="selectedItems.currentDates"
              @getDateRange="getDateRange"
            />
          </v-col>
          <v-col :cols="4" v-if="selectedItems.isrealtime">
            <div style="display: inline-flex;">
              <v-select
                dense
                outlined
                class="mr-2"
                :label="`${$t('dataAnalysis.label.freshrate')}*`"
                v-model="selectedItems.freshrate"
                :items="freshRateOptions"
                item-text="text"
                item-value="value"
                style="width: 50%;"
                return-object
                @change="freshRateChange"
                :menu-props="customMenuProps"
              ></v-select>
              <v-text-field
                dense
                outlined
                type="number"
                v-model="selectedItems.dataquantity"
                :label="`${$t('dataAnalysis.label.dataquantity')}*`"
                :rules="getDataQuantityRules()"
                style="width: 50%;"
              ></v-text-field>
            </div>
          </v-col>
          <v-col :cols="2">
            <v-select
              dense
              outlined
              :label="`${$t('dataAnalysis.label.algorithmtype')}*`"
              v-model="selectedItems.algorithmtype"
              :items="algorithmTypeList"
              item-text="text"
              item-value="value"
              :rules="rules.isrequired"
              return-object
              hide-details
              @change="algorithmTypeChange"
              :menu-props="customMenuProps"
            ></v-select>
          </v-col>
          <v-col :cols="2">
            <v-select
              dense
              outlined
              :label="`${$t('dataAnalysis.label.algorithm')}*`"
              v-model="selectedItems.algorithm"
              :items="algorithmOptions"
              item-text="text"
              item-value="value"
              :rules="rules.isrequired"
              hide-details
              return-object
              @change="algorithmChange"
              :menu-props="customMenuProps"
            ></v-select>
          </v-col>
          <v-col :cols="1" align="end">
            <v-btn
              v-if="!modelId"
              color="primary"
              class="text-none"
              @click="handleSave"
            >
              {{ $t('dataAnalysis.btn.saveview') }}
            </v-btn>
            <v-btn
              v-else
              color="primary"
              class="text-none"
              @click="handleSaveView"
              :disabled="active === '1'"
            >
              {{ $t('btn.save') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>
    <div :style="`height: ${dataTableHeight}px;`">
      <v-row dense>
        <v-col :cols="3">
          <!-- 算法模型spc不包含视图列表 -->
          <div v-if="!modelId">
            <view-list-card
              ref="viewlist"
              :list="spcViewList"
              @setViewParameters="getViewParameters"
              @getTableList="initViewTable"
              :height="viewOptionsHeight"
              @emitEditView="modifyView"
              @resetView="resetViewParams"
            />
          </div>
          <div :class="modelId ? '' : 'mt-4'">
            <table-data-card
              :list="sourceTableData"
              :reset="resetDataTableList"
              :headers="dataTableHeaders"
              :multiple="true"
              :height="modelId ? dataTableHeight : dataChartCardHeight"
              @callback="(item)=>{selectedTableList = item}"
            />
          </div>
        </v-col>
        <v-col :cols="9">
          <div>
            <parameter-select-card
              :columns="dataTableHeaders"
              :parameter="chartParameters"
              :optionparams="optionparams"
              :defaultParams="defaultParams"
              :rules="rules"
              :height="viewOptionsHeight"
            />
          </div>
          <v-card
            class="mt-4 titlecard"
            :height="dataChartCardHeight"
            v-if="isselectedalgorithm"
          >
            <v-card-title
              dense
              style="background-color: var(--v-primary-base);"
            >
              <span
                v-if="selectedItems.algorithmtype?.value !== 5"
                style="color: white;padding: 10px 16px 10px 16px;"
              >
                {{ $t('dataAnalysis.modules.controlcharts',
                { value: `${getVariateText(variates.variateOne)}`,
                type: `${selectedItems.algorithm?.text}`}) }}
              </span>
              <!-- algorithmtype.value=5是多变量算法，标题包含两个变量 -->
              <span
                v-else
                style="color: white;padding: 10px 16px 10px 16px;"
              >
                {{ $t('dataAnalysis.modules.multivariatecontrolcharts',
                { value1: `${getVariateText(variates.variateOne)}`,
                value2: `${getVariateText(variates.variateTwo)}`,
                type: `${selectedItems.algorithm?.text}`}) }}
              </span>
              <v-spacer />
              <v-btn
                color="#FFF"
                outlined
                class="mr-2"
                @click="initial"
              >
                {{ $t('dataAnalysis.btn.run') }}
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-0" :style="`height: ${dataChartHeight}px;`">
              <div
                v-if="selectedItems.algorithmtype.value === 6"
                class="fill-height"
              >
                <capability-analysis-chart
                  ref="capabilitycharts"
                  :optionsparams="optionsparams"
                  :chartData="chartData"
                  :height="dataChartHeight-16"
                  :forceHeight="false"
                  :isDark="isDark"
                />
              </div>
              <div
                v-else
                class="fill-height"
              >
                <control-charts
                  ref="controlcharts"
                  :optionsparams="optionsparams"
                  :chartData="chartData"
                  :height="dataChartHeight-16"
                  :forceHeight="false"
                  :isDark="isDark"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <save-view-dialog
      :saveDialog="saveDialog"
      @closeDialog="saveDialog = false"
      :parameters="saveViewParameters"
      :rules="rules"
      :editView="editView"
      :viewData="viewData"
      @getViewList="initViewTable"
    />
    <save-monitor-view
      :saveDialog="saveMonitorView"
      @closeDialog="saveMonitorView = false"
      :parameters="saveViewParameters"
      :rules="rules"
      :viewData="monitorViewData"
      @refresh="refreshViewList"
      :modelId="Number(modelId)"
    />
    <confirm-dialog
      :confirmDialog="confirmDialog"
      @closeDialog="confirmDialog = false"
      :algorithm="selectedItems.algorithm"
      :params="confirmParams"
      @getCharts="getCharts"
    />
    <!-- <error-dialog
      :errorDialog="errorDialog"
      :list="errMsgList"
      @closeDialog="errorDialog = false"
    /> -->
  </div>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';
import moment from 'moment';
import spcService from '@/services/spc.service';
// import DateRangePicker from '@/components/commonUI/DateRangePicker.vue';
import DateTimeRangePicker from '@/components/commonUI/DateTimeRangePicker.vue';
import ViewListCard from './Main/ViewListCard';
import TableDataCard from './Main/TableDataCard';
import ParameterSelectCard from './Main/ParameterSelectCard';
import ControlCharts from './Main/ControlCharts';
import CapabilityAnalysisChart from './Main/CapabilityAnalysisChart';
import SaveViewDialog from './Main/Dialog/SaveViewDialog';
import SaveMonitorView from './Main/Dialog/SaveMonitorView';
import ConfirmDialog from './Main/Dialog/ConfirmDialog';
// import ErrorDialog from './Main/Dialog/ErrorDialog';
// 引入算法类型列表及算法列表参数
import { algorithmList, parameterList } from '../algorithmConfig';
// 引入公共方法
import {
  // removeDuplicateObj,
  objectIsEqual,
} from '../commonUtil';
import {
  getTestsParamName,
  getWeightsParamName,
  checkParamExists,
  checkWeightsZone,
  filterEmptyTableData,
} from '../requestUtil';

const columnInitialKeys = ['year', 'month', 'day', 'week', 'hour', 'ts'];
let interval = null;
export default {
  name: 'dataAnalysis',
  components: {
    // DateRangePicker,
    DateTimeRangePicker,
    ViewListCard,
    TableDataCard,
    ParameterSelectCard,
    ControlCharts,
    CapabilityAnalysisChart,
    SaveViewDialog,
    SaveMonitorView,
    ConfirmDialog,
    // ErrorDialog,
  },
  data() {
    return {
      moment,
      clientWidth: document.body.clientWidth,
      clientHeight: document.body.clientHeight,
      // 筛选条件部分的高度
      filterOptionsHeight: 65,
      // 视图卡片和选项卡片的高度
      viewOptionsHeight: 220,
      selectedItems: {
        datatable: {},
        // datasource: {},
        currentDates: [new Date().getTime() - 60 * 60 * 1000, new Date().getTime()],
        // currentDates: [moment(new Date()).format('YYYY-MM-DD'),
        //   moment(new Date()).format('YYYY-MM-DD')], // 当前选择的时间范围
        isrealtime: false, // 是否作实时分析
        freshrate: null,
        dataquantity: null,
        algorithmtype: {},
        algorithm: {},
      }, // 选中的参数
      algorithmOptions: [], // 算法选项列表
      chartParameters: {}, // 设定的options选项卡各个属性校验项，包含显隐和必填非必填
      resetDataTableList: false, // 是否重置datatable列表
      selectedTableList: [], // 数据中选中的行
      dataTableHeaders: [], // 数据表表头
      saveDialog: false,
      editView: false,
      saveViewParameters: {}, // 保存视图时存放视图数据对象
      selectedViewData: {}, // 存放当前选中的视图数据对象
      viewData: {}, // 传递给试图弹窗的数据对象
      monitorViewData: {}, // 传递给过程监控保存视图弹窗的数据对象
      saveMonitorView: false,
      viewParams: {}, // 视图中保存的参数配置
      optionparams: {}, // 传递到options选项卡片内的参数数据对象
      confirmDialog: false,
      confirmParams: {}, // 确认弹窗传参
      optionsparams: {},
      chartData: {}, // 图表数据
      // errorDialog: false, // 报错弹窗
      // errMsgList: [],
      paramCode: null, // 参数代码，用作筛选数据源
      customMenuProps: {
        offsetY: true, // enable vertical offset
        // offsetX: true, // enable horizontal offset
        offsetYValue: 0, // vertical offset value
        // offsetXValue: 0, // horizontal offset value
      },
    };
  },
  computed: {
    ...mapState('dataAnalysis', [
      'dataSourceList',
      'dataColumnList',
      'spcViewList',
      'viewDetail',
      'elements',
      'dataTableData',
      'modelDetailParam',
    ]),
    ...mapState('dataAnalysis', [
      'variates',
      'parameters',
      'estimated',
      'options',
      'weights',
      'tests',
      'planortype',
      'boxcox',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('helper', ['pagePortalMode', 'isDark']),
    // 模块名称
    moduleName() {
      return this.$route.name;
    },
    // 算法模型详情页，源数据表卡片高度
    dataTableHeight() {
      return this.clientHeight - 130 - this.filterOptionsHeight;
    },
    // 数据分析页面，数据卡片和图表卡片的高度
    dataChartCardHeight() {
      return this.clientHeight - 130 - this.filterOptionsHeight - this.viewOptionsHeight - 16;
    },
    // 图表高度
    dataChartHeight() {
      return this.dataChartCardHeight - 36;
    },
    // 算法模型id
    modelId() {
      const { id } = this.$route.params;
      if (id) {
        return id;
      }
      return 0;
    },
    // 算法模型是否已启用
    active() {
      const { active } = this.$route.params;
      return active;
    },
    // 算法模型详情为新增或编辑
    modelIsAdd() {
      return !(Object.keys(this.modelDetailParam)?.length > 0);
    },
    // 校验规则
    rules() {
      return this.$getSpcRules();
    },
    // 选择的数据表名称
    selectedDataTableName() {
      if (this.selectedItems.datatable) {
        return this.selectedItems.datatable.text;
      }
      return '';
    },
    // 获取数据源下拉列表
    dataTableOptions() {
      let options = [];
      // 筛选已启用的数据源
      const tablelist = this.dataSourceList.filter((item) => item.active === '1');
      options = tablelist.map((item) => {
        const obj = {
          text: item.dataSourceName, // 数据源表名称
          value: item.dataSourceNumber, // 数据源表编号
          desc: item.remark, // 数据源表描述
          id: item.dataSourceId, // 数据源表id
        };
        return obj;
      });
      return options;
    },
    // 数据表选择后，数据卡片内显示的表格数据
    sourceTableData: {
      get() {
        return this.dataTableData;
      },
      set(list) {
        return list;
      },
    },
    // 是否已选择算法
    isselectedalgorithm() {
      const arr = Object.keys(this.selectedItems.algorithm);
      if (arr.length > 0) {
        return true;
      }
      return false;
    },
    // 算法类型选项列表，从algorithmConfig文件中获得
    algorithmTypeList() {
      let algorithmTypes = [];
      // 筛选支持实时的算法类型
      if (this.selectedItems.isrealtime) {
        algorithmTypes = algorithmList.filter((item) => item.realTime === true);
      } else {
        algorithmTypes = algorithmList;
      }
      const list = algorithmTypes.map((item) => {
        const obj = {
          text: this.$t(`dataAnalysis.label.${item.name}`),
          value: item.group_id,
          name: item.name,
          disabled: false,
        };
        return obj;
      });
      return list;
    },
    // 刷新率选项列表
    freshRateOptions() {
      const arr = [1, 2, 5, 10, 30, 60];
      const result = [];
      for (let i = 0; i < arr.length; i += 1) {
        const obj = {
          text: `${arr[i]}${this.$t('dataAnalysis.label.seconds')}`,
          value: arr[i],
        };
        result.push(obj);
      }
      return result;
    },
    // 数据量，放入计算属性方便监听
    dataquantity() {
      return this.selectedItems.dataquantity;
    },
    // 刷新率
    freshrate() {
      return this.selectedItems.freshrate;
    },
    // options每个选项卡默认内容
    defaultParams() {
      const params = {
        variates: {
          partnumber: '',
          variateOne: '',
          variateTwo: '',
          variateThree: '',
          subgroupsizenumber: '',
          subgroupsizecolumn: '',
          movingaveragelength: 3,
          ewmaweight: 0.2,
          target: 0.0,
        }, // 变量
        parameters: {
          meanValue: '',
          standardDeviation: '',
          proportion: '',
          upperLimit: '',
          lowerLimit: '',
          useHistorySD: false,
          withinSubgroupSD: '',
          betweenSubgroupSD: '',
          fitDistribution: 'weibull',
        }, // 参数
        estimated: {
          mrmode: 'averagemovingrange',
          mrLength: 2,
          standarddeviation: '',
          standarddeviation2: '',
          useunbiasingconstant: true, // 默认使用无偏常量
          usebiasoverallsd: false,
        }, // 估计标准差
        options: {
          cpmTarget: '',
          ksigma: 6,
          withinSubgroup: true,
          overall: true,
          performAnalysis: 'zscore',
          display: '',
          includeConfidenceIntervals: false,
          confidenceLevel: 95,
          confidenceIntervals: 'twoSided',
        }, // 选项
        weights: {
          zonea: 0,
          zoneb: 2,
          zonec: 4,
          zoned: 8,
          zonensigma: 3,
          reset: false,
        }, // zone-chart权重
        tests: {
          onepoint: {
            checked: true,
            value: 3,
          },
          npointsall: {
            checked: false,
            value: 6,
          },
          npointssameside: {
            checked: false,
            value: 9,
          },
          npointsupdown: {
            checked: false,
            value: 14,
          },
          pointsbiggerthan2: {
            checked: false,
            value: 2,
          },
          npoints1: {
            checked: false,
            value: 15,
          },
          pointsbiggerthan1: {
            checked: false,
            value: 4,
          },
          npointsbiggerthan1: {
            checked: false,
            value: 8,
          },
        }, // 检验
        planortype: {
          cumsumtype: 'tabular',
          useFIR: false,
          sdnumber: 2.0,
          reset: false,
          h: 4.0,
          k: 0.5,
        }, // 计划/类型
        boxcox: {
          isboxcox: false,
          boxcoxoption: '',
          boxcoxvalue: 2,
        }, // Box-Cox变换
      }; // 基础默认选项参数
      // 算法类型和算法选项值
      const groupid = this.selectedItems.algorithmtype.value;
      const algorithmselected = this.selectedItems.algorithm.value;
      // 根据算法类型，设置默认标准差
      if ((groupid === 2 && algorithmselected !== 'xbar-s_chart'
      && algorithmselected !== 's_chart') || groupid === 4
      || groupid === 6) {
        params.estimated.standarddeviation = 'rbar';
      }
      if (algorithmselected === 'i-mr-rs_chart') {
        params.estimated.standarddeviation2 = 'sbar';
      }
      if (algorithmselected === 'xbar-s_chart' || algorithmselected === 's_chart') {
        params.estimated.standarddeviation = 'sbar';
      } // s-chart默认选择sbar，其余默认选择rbar
      // 根据算法类型，设置默认options选项
      if (algorithmselected === 'normxmk') {
        params.options.display = 'capabilityStatisCm';
      } else {
        params.options.display = 'capabilityStatisCp';
      } // cmk/ppk默认选择cm，其他默认选择cp
      return params;
    },
    // 选项卡全部内容，放入计算属性方便监听
    optionsAllParams() {
      const {
        variates,
        parameters,
        estimated,
        options,
        weights,
        tests,
        planortype,
        boxcox,
      } = this;
      return {
        variates,
        parameters,
        estimated,
        options,
        weights,
        tests,
        planortype,
        boxcox,
      };
    },
  },
  watch: {
    // 监听当前视图数据，变化时进行页面选项赋值
    viewParams: {
      handler(obj) {
        const arr = Object.keys(obj);
        if (arr.length !== 0) {
          const {
            datatable,
            currentDates,
            isrealtime,
            freshrate,
            dataquantity,
            algorithmtype,
            algorithm,
            options,
          } = obj;
          // 获取数据源选择框原本选择的数据源
          const selectedDataTable = this.selectedItems.datatable;
          this.selectedItems = {
            currentDates,
            isrealtime,
            freshrate,
            dataquantity,
            datatable: selectedDataTable,
          };
          // 若视图保存的数据源存在则给数据源表选择框赋值
          const datatablefilters = this.dataTableOptions.filter((item) => item.value === datatable);
          if (datatablefilters.length > 0) {
            const selecteddatatable = datatablefilters[0];
            this.selectedItems.datatable = selecteddatatable;
          }
          // 手动写入数据表选项变更事件
          this.dataTableValueChange(this.selectedItems.datatable);
          // 给算法类型/算法选择框赋值
          // eslint-disable-next-line
          const algorithmtypefilters = this.algorithmTypeList.filter((item) => item.value === algorithmtype);
          if (algorithmtypefilters.length > 0) {
            const selectedalgorithmtype = algorithmtypefilters[0];
            this.selectedItems.algorithmtype = {
              ...selectedalgorithmtype,
            };
          }
          // 手动触发算法类型选项变更事件
          this.algorithmTypeChange(this.selectedItems.algorithmtype);
          const algorithmfilters = this.algorithmOptions.filter((item) => item.value === algorithm);
          if (algorithmfilters.length > 0) {
            const selectedalgorithm = algorithmfilters[0];
            this.selectedItems.algorithm = {
              ...selectedalgorithm,
            };
          }
          // 手动触发算法选项变更事件
          this.algorithmChange(this.selectedItems.algorithm);
          this.optionparams = {
            ...options,
          }; // 通过组件传参赋值时，页面未加载则无法写入vuex
          // 手动将当前选项卡参数写入缓存
          this.setSaveParameters(options);
        }
      },
      deep: true,
      immediate: false,
    },
    selectedItems: {
      handler(val) {
        // 将页面配置放入缓存方便子组件调用
        // this.setSelectedItems(val);
        // 修改对象引用存入vuex，否则计算属性无法获取最新缓存内数据值
        this.setSelectedItems({ ...val });
        // 选择选项变化清空定时器，以免发送错误的接口代码
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      },
      deep: true,
      immediate: true,
    },
    dataquantity: {
      handler(val) {
        if (val) {
          // 根据数据量变化重新查询表格源数据
          this.getTableList(this.selectedItems.datatable);
        }
        // 数据量变化清空定时器
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      },
      deep: true,
    },
    freshrate: {
      handler() {
        // 刷新率变更时清空定时器
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      },
      deep: true,
    },
    // 监听全部选项卡内容
    optionsAllParams: {
      handler() {
        // 选项参数变化清空定时器，以免发送错误的接口代码
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      },
      deep: true,
    },
    // 修改视图弹窗关闭
    saveDialog: {
      handler(newVal) {
        // 修改视图结束时重置状态变量
        if (!newVal) {
          if (this.$refs.viewlist) {
            this.$refs.viewlist.clearEditDelStatus();
          }
        }
      },
      deep: true,
      immediate: false,
    },
  },
  activated() {
    // 初始化加载
    this.init();
    // 若从算法模型跳转过来，实时按钮默认选中
    if (this.modelId) {
      this.selectedItems.isrealtime = true;
    } else {
      this.selectedItems.isrealtime = false;
    }
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  created() {
  },
  beforeDestroy() {
    // 页面销毁前清空定时器
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    ...mapMutations('dataAnalysis', [
      'setSelectedItems',
      'setClearTabs',
      'setVariates',
      'setParameters',
      'setEstimated',
      'setOptions',
      'setWeights',
      'setTests',
      'setPlanOrType',
      'setBoxcox',
      'setViewDetail',
    ]),
    ...mapActions('dataAnalysis', [
      'getDataSourceList',
      'getDataColumnList',
      'getViewList',
      'getViewDetailById',
      'getTableData',
      'getModelDetailParam',
      'updateViewDetail',
      'addModelDetail',
      'editModelDetail',
      'runAlgorithm',
    ]),
    // 前往设置页面
    goSettings() {
      this.$router.push({ name: 'dataTableSetting' });
    },
    // 重置全部选择框
    resetSelected() {
      this.selectedItems = {
        ...this.selectedItems,
        datatable: {},
        // 当前选择的时间范围
        currentDates: [new Date().getTime() - 60 * 60 * 1000, new Date().getTime()],
        // eslint-disable-next-line
        isrealtime: this.modelId ? true : false,
        freshrate: null,
        dataquantity: null,
        algorithmtype: {},
        algorithm: {},
      };
    },
    async init() {
      // 获取数据源表清单
      await this.getDataSourceList();
      if (!this.modelId) {
        // 查询全部视图列表
        await this.initViewTable();
        this.resetViewParams();
        if (this.$refs.viewlist) {
          this.$refs.viewlist.resetSelect();
        }
      } else {
        // 若从算法模型跳转而来，去获取模型详情
        await this.getModelDetail();
      }
    },
    // 查询视图详情
    async getModelDetail() {
      await this.getModelDetailParam(this.modelId);
      const { segment } = this.modelDetailParam;
      if (segment) {
        // 重置页面选项
        this.resetSelected();
        // 获取当前保存的页面选项
        this.viewParams = {
          ...JSON.parse(segment),
        };
        this.monitorViewData = JSON.parse(segment);
      } else {
        // 重置视图内容，包含数据表和控制图
        this.resetViewParams();
      }
    },
    // 时间选择变化
    async getDateRange(data) {
      const [min, max] = data;
      const startt = min;
      const endt = max;
      if ((endt - startt) / (1000 * 60 * 60 * 24) > 30) {
        // 选择超过30天，清空选择
        this.selectedItems.currentDates = [];
        this.setAlert({
          show: true,
          type: 'error',
          message: this.$t('dataAnalysis.verification.morethan30days'),
        });
        return;
      }
      this.selectedItems.currentDates = [min, max];
      // 时间变化时重新获取数据表
      this.dataTableChangeHandler(this.selectedItems.datatable);
    },
    // 重置当前视图内容
    resetViewParams() {
      // 初始化清空选项
      this.resetSelected();
      // 清空当前视图详情
      this.setViewDetail({});
      // 清空数据表
      this.dataTableHeaders = [];
      // 清空当前选择的视图数据对象
      this.selectedViewData = {};
      // 清空控制图
      if (this.$refs.controlcharts) {
        this.$refs.controlcharts.reset();
      }
      if (this.$refs.capabilitycharts) {
        this.$refs.capabilitycharts.reset();
      }
      // 清空给控制图的接口数据
      this.chartData = {};
    },
    // 查询视图列表
    async initViewTable() {
      await this.getViewList();
    },
    // 过程监测保存视图后刷新视图
    async refreshViewList() {
      // 查询视图列表
      await this.getViewList();
      // 获取过程监测对应视图参数
      await this.getModelDetailParam();
    },
    // 获取当前保存的所有选项数据
    async getViewParameters(rowData) {
      const { id } = rowData;
      await this.getViewDetailById(id);
      const { viewDetail } = this;
      // 重置页面选项
      this.resetSelected();
      if (viewDetail.segment) {
        this.viewParams = {
          ...JSON.parse(viewDetail.segment),
        };
      }
      // 选中视图后获取当前视图信息
      this.selectedViewData = {
        id: rowData.id,
        key: rowData.viewName,
        value: rowData.viewNumber,
        desc: rowData.viewDescription,
        segment: viewDetail.segment,
      };
    },
    // 视图修改触发函数
    modifyView(rowData) {
      this.viewData = {
        ...rowData,
      }; // 获取视图id、编号、名称等字段
      this.editView = true;
      this.saveDialog = true;
    },
    // 实时勾选框变更
    realtimeChange(val) {
      // 清空算法类型和算法选择项
      this.selectedItems.algorithmtype = {};
      this.selectedItems.algorithm = {};
      // 清空算法下拉列表
      this.algorithmOptions = [];
      // 清空tab选项
      this.setClearTabs(true);
      // 清空算法后清空控制图
      if (this.$refs.controlcharts) {
        this.$refs.controlcharts.reset();
      }
      if (this.$refs.capabilitycharts) {
        this.$refs.capabilitycharts.reset();
      }
      if (val) {
        // 实时分析，时间范围清空
        this.selectedItems.starttime = null;
        this.selectedItems.endtime = null;
      } else {
        // 非实时分析，刷新频率清空
        this.selectedItems.freshrate = null;
        this.selectedItems.dataquantity = null;
      }
      // 重新获取数据表数据
      this.getTableList(this.selectedItems.datatable);
    },
    // 时间加权/多变量算法实时数据量上限为1000
    getDataQuantityRules() {
      if (this.selectedItems.algorithmtype && this.selectedItems.algorithmtype.value
        && (this.selectedItems.algorithmtype.value === 4
        || this.selectedItems.algorithmtype.value === 5)) {
        return this.rules.dataquantity2;
      }
      return this.rules.dataquantity;
    },
    // 日期范围选择限制30天
    dateLimit() {
      const starttime = this.selectedItems.starttime ? `${this.selectedItems.starttime}:00` : null;
      const endtime = this.selectedItems.endtime ? `${this.selectedItems.endtime}:59` : null;
      if (starttime && endtime) {
        const startt = new Date(starttime).getTime();
        const endt = new Date(endtime).getTime();
        if ((endt - startt) / (1000 * 60 * 60 * 24) > 30) {
          return false;
        }
      }
      return true;
    },
    // 数据表选项变更
    dataTableChange(datatable) {
      // this.selectedItems.datatable = {
      //   ...datatable,
      // };
      if (!datatable) {
        // 在数据表和未选择时清空数据卡片表头内容
        this.dataTableHeaders = [];
        return;
      }
      const arr = Object.keys(datatable);
      // this.resetSelections();
      if (arr.length > 0) {
        this.dataTableChangeHandler(datatable);
        // 表格数据变化后，变量选项卡选择框清空，同时需要清空页面和缓存内变量和标签列
        // 若之前已选视图，不清空缓存内变量/标签会影响其校验
        this.clearVariates();
      }
    },
    // 清空变量
    clearVariates() {
      const { variates } = this.optionparams;
      if (variates?.partnumber) {
        variates.partnumber = '';
      }
      if (variates?.variateOne) {
        variates.variateOne = '';
      }
      if (variates?.variateTwo) {
        variates.variateTwo = '';
      }
      if (variates?.variateThree) {
        variates.variateThree = '';
      }
      if (variates?.subgroupsizecolumn) {
        variates.subgroupsizecolumn = '';
      }
      this.optionparams.variates = variates;
    },
    // 数据表手动写值后的逻辑
    dataTableValueChange(datatable) {
      if (!datatable) {
        // 在数据表和未选择时清空数据卡片表头内容
        this.dataTableHeaders = [];
        return;
      }
      const arr = Object.keys(datatable);
      if (arr.length > 0) {
        // 手动写入数据表值时无需清除页面和缓存内变量和标签列
        this.dataTableChangeHandler(datatable);
      }
    },
    // 数据表或数据源选项变更时触发事件
    async dataTableChangeHandler(sourceValueObj) {
      const {
        id, // 数据源表id
      } = sourceValueObj;
      // 去获取数据卡片表格数据
      const arr = Object.keys(sourceValueObj);
      if (arr.length > 0) {
        await this.getDataColumnList(id);
        const addColumnInitialKeys = columnInitialKeys.map((key, index) => ({
          columnName: this.$t(`dataAnalysis.table.datatable.${key}`),
          connectionParameterNumber: key,
          paramId: new Date().getTime() + index,
        }));
        this.dataTableHeaders = this.dataColumnList.concat(addColumnInitialKeys).map((tag, k) => ({
          headerName: tag.columnName,
          field: tag.connectionParameterNumber,
          filter: false,
          // filter: 'agTextColumnFilter',
          // filterParams: {
          //   readOnly: true,
          // }, // 筛选框只读
          // checkboxSelection: k === 0 && true,
          // headerCheckboxSelection: k === 0 && true,
          type: tag.parameterDataType, // 数据列类型（1-10Data，11、12Label）
          id: tag.paramId,
          index: k,
          colId: tag.paramId, // 增加列id，用于列宽度自适应
        }));
        // 获取数据源的数据
        await this.getTableList(sourceValueObj);
        this.sourceTableData = this.dataTableData;
      }
    },
    // 刷新率手动变更时，清除算法和控制图
    freshRateChange() {
      // 刷新率变化后清空算法类型和算法选择项
      this.selectedItems.algorithmtype = {};
      this.selectedItems.algorithm = {};
      // 清空tab选项
      this.setClearTabs(true);
      // 清空控制图
      if (this.$refs.controlcharts) {
        this.$refs.controlcharts.reset();
      }
      if (this.$refs.capabilitycharts) {
        this.$refs.capabilitycharts.reset();
      }
    },
    // 算法类型选项变更
    algorithmTypeChange(type) {
      // 算法类型变更，算法选项框清空
      this.selectedItems.algorithm = {};
      this.setClearTabs(true);
      // 清空控制图
      if (this.$refs.controlcharts) {
        this.$refs.controlcharts.reset();
      }
      if (this.$refs.capabilitycharts) {
        this.$refs.capabilitycharts.reset();
      }
      // 清空参数和选项卡
      this.chartParameters = {};
      this.optionparams = {};
      // 算法类型变更时，选项卡内容恢复默认值
      this.setSaveParameters(this.defaultParams);
      // 算法类型变更，算法下拉选项列表联动变化
      if (type.value) {
        this.algorithmOptions = this.getAlgorithmOptions(type.value);
      } else {
        this.algorithmOptions = [];
      }
      // 清空给控制图的接口数据
      this.chartData = {};
    },
    // 算法选项变更
    algorithmChange(algorithm) {
      // 展示tab选项
      this.setClearTabs(false);
      // 必须手动更新selectedItems
      this.setSelectedItems({ ...this.selectedItems });
      // 清空算法对应校验参数数组
      this.chartParameters = {};
      this.optionparams = {};
      // 先清空参数和选项卡，再将选项卡内容恢复默认值
      this.setSaveParameters(this.defaultParams);
      const arr = Object.keys(algorithm);
      if (arr.length > 0) {
        const { algorithmtype } = this.selectedItems;
        this.chartParameters = this.getCheckParameter(algorithmtype, algorithm);
      }
      // 清空给控制图的接口数据
      this.chartData = {};
    },
    // 算法模型跳转过来的视图保存按钮
    handleSaveView() {
      // 算法模型详情新增或修改前判断是否有按钮权限
      if (!this.isBtnAccess('basic:detail:addoredit')) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'nopermission',
        });
        return;
      }
      if (this.checkViewParameters()) {
        const viewobj = this.getViewParametersObj();
        if (Object.keys(viewobj)?.length > 0) {
          const {
            id,
          } = this.modelDetailParam;
          this.updateModelDetailReq(viewobj, id, false);
          // this.saveViewParameters = {
          //   ...viewobj,
          // };
        }
      }
    },
    // 保存视图按钮点击事件
    handleSave() {
      const {
        id,
      } = this.viewDetail;
      // 验证是否有新增/修改视图详情权限
      if ((id && !this.isBtnAccess('basic:viewdetail:addOrEdit'))
      || (!id && !this.isBtnAccess('basic:view:addAndDetail'))) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'nopermission',
        });
        return;
      }
      // this.editView = false;
      if (this.checkViewParameters()) {
        const viewobj = this.getViewParametersObj();
        if (Object.keys(viewobj)?.length > 0) {
          if (id) {
            this.updateViewDetailReq(viewobj, id, false);
          } else {
            this.saveViewParameters = {
              ...viewobj,
            };
            // 打开保存视图弹窗
            this.saveDialog = true;
          }
        }
      }
    },
    // 封装视图数据
    getViewParametersObj() {
      const {
        datatable,
        currentDates,
        isrealtime,
        freshrate,
        dataquantity,
        algorithmtype,
        algorithm,
      } = this.selectedItems;
      const {
        variates,
        parameters,
        estimated,
        options,
        weights,
        tests,
        planortype,
        boxcox,
      } = this; // 选项卡内容
      const payload = this.getFormatParameters();
      delete payload.data;
      if (payload.cpm_target || payload.cpm_target === 0) {
        // 目标不能大于上限，不能小于下限
        if (payload.usl || payload.usl === 0) {
          if (payload.cpm_target > payload.usl) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'cpmTargetError',
            });
            return null;
          }
        }
        if (payload.lsl || payload.lsl === 0) {
          if (payload.cpm_target < payload.lsl) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'cpmTargetError',
            });
            return null;
          }
        }
      }
      return {
        datatable: (datatable && datatable.value) ? datatable.value : '',
        dataSourceId: (datatable && datatable.id) ? datatable.id : 0,
        dataTableName: (datatable && datatable.text) ? datatable.text : '', // 数据表名称
        currentDates,
        isrealtime,
        freshrate,
        dataquantity,
        algorithmtype: (algorithmtype && algorithmtype.value) ? algorithmtype.value : '',
        algorithm: (algorithm && algorithm.value) ? algorithm.value : '',
        algorithmText: (algorithm && algorithm.text) ? algorithm.text : '', // 算法名称
        options: {
          variates,
          parameters,
          estimated,
          options,
          weights,
          tests,
          planortype,
          boxcox,
        },
        payload,
      };
    },
    // 保存视图前校验必填参数
    checkViewParameters() {
      if (!this.$refs.form.validate()) {
        return false;
      }
      // debug-temporary
      if (!this.selectedItems.datatable
        || Object.keys(this.selectedItems.datatable).length === 0) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'selectdatasourcetable',
        });
        return false;
      }
      if (this.selectedItems.isrealtime) {
        if (!this.selectedItems.freshrate || !this.selectedItems.dataquantity) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'selectrealtime',
          });
          return false;
        }
        if (this.selectedItems.dataquantity <= 0 || this.selectedItems.dataquantity > 200) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'quantityerror',
          });
          return false;
        }
      }
      if (!this.selectedItems.isrealtime) {
        if (this.selectedItems.currentDates.length === 0) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'selecttime',
          });
          return false;
        }
      }
      if (!this.selectedItems.algorithmtype.value || !this.selectedItems.algorithm.value) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'selectalgorithm',
        });
        return false;
      }
      // 校验options选项卡参数
      if (!this.checkChartParams()) {
        return false;
      }
      return true;
    },
    // resetSelections() {
    //   this.resetDataTableList = !this.resetDataTableList;
    //   this.selectedTableList = [];
    // },
    // 根据tableName查询表格数据
    async getTableList(selectedDataTable) {
      if (!selectedDataTable || Object.keys(selectedDataTable).length === 0) {
        return;
      }
      const {
        isrealtime,
        currentDates,
        dataquantity,
      } = this.selectedItems;
      if ((isrealtime && !dataquantity) || (!isrealtime && currentDates.length === 0)) {
        return;
      }
      const {
        value, // 数据源表的编号
      } = selectedDataTable;
      const [min, max] = currentDates;
      // 根据时间或数据量查询表格数据
      let payload = {
        collectionName: value,
      };
      if (isrealtime) { // 实时数据分析
        payload = {
          ...payload,
          pageNum: 1,
          pageSize: dataquantity,
        };
      } else { // 历史数据分析
        payload = {
          ...payload,
          dateFrom: min,
          dateTo: max,
        };
      }
      await this.getTableData(payload);
    },
    // 选项卡内容恢复默认，默认的内容参数定义在本页data中
    setSaveParameters(params) {
      const {
        variates,
        parameters,
        estimated,
        options,
        weights,
        tests,
        planortype,
        boxcox,
      } = params;
      this.setVariates(variates);
      this.setParameters(parameters);
      this.setEstimated(estimated);
      this.setOptions(options);
      this.setTests(tests);
      this.setWeights(weights);
      this.setPlanOrType(planortype);
      this.setBoxcox(boxcox);
    },
    // 根据类型获取算法选择列表
    getAlgorithmOptions(value) {
      const groupId = value;
      // 从配置文件algorithmConfig中获取全部算法清单
      // eslint-disable-next-line
      const list = algorithmList.filter((item) => item.group_id === groupId);
      let algorithms = [];
      if (list.length > 0) {
        // 实时计算时，算法列表筛选出支持实时的算法
        if (this.selectedItems.isrealtime) {
          algorithms = list[0].charts.filter((item) => item.realTime === true);
        } else {
          algorithms = list[0].charts;
        }
      }
      const options = algorithms.map((item) => {
        const obj = {
          text: this.$t(`dataAnalysis.label.${item.name}`),
          value: item.value,
          name: item.name,
          groupId,
          disabled: false,
        };
        return obj;
      });
      return options;
    },
    // 从algorithmConfig配置文件中获取选项卡校验条件，包含显隐和必填非必填
    getCheckParameter(algorithmtype, algorithm) {
      // eslint-disable-next-line
      const filterGroupId = parameterList.filter((item) => item.group_id === algorithmtype.value);
      if (filterGroupId.length) {
        const filterType = filterGroupId.filter((item) => item.chart_type === algorithm.value);
        if (filterType.length) {
          return filterType[0].parameter;
        }
      }
      return {};
    },
    // 选择变量的列名，用作标题展示
    getVariateText(number) {
      const obj = this.dataColumnList.find((item) => item.connectionParameterNumber === number);
      if (obj) {
        return obj?.columnName || '';
      }
      return '';
    },
    // 运行按钮点击事件
    initial() {
      // 校验全部必填选项
      if (!this.checkViewParameters()) {
        return;
      }
      // debug-temporary
      // 校验源数据是否为空
      if (this.dataTableData.length === 0) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'datatableempty',
        });
        return;
      }
      // console.log(this.modelId, 'this.modelId');
      // 算法模型过来
      if (this.modelId) {
        const { segment } = this.modelDetailParam;
        if (!segment) {
          this.goToConfirmParams();
        } else if (!this.isBtnAccess('basic:detail:addoredit') || this.active === '1') {
          // 没有保存按钮权限或算法模型已启用时，直接去确认参数，不允许去保存详情
          this.goToConfirmParams();
        } else {
          // 若有当前模型详情，且参数有变化，则询问是否保存
          const viewObj = this.getViewParametersObj();
          // 判断参数对象是否一致
          if (!objectIsEqual(JSON.parse(segment), viewObj)) {
            this.updateModelDetailData(viewObj);
          } else { // 若未发生变化则去确认参数绘制控制图
            this.goToConfirmParams();
          }
        }
      } else {
        // 数据分析
        const {
          segment,
        } = this.selectedViewData;
        if (!segment) {
          this.goToConfirmParams();
        } else if (!this.isBtnAccess('basic:viewdetail:addOrEdit')) {
          // 没有保存按钮权限则直接去确认参数
          this.goToConfirmParams();
        } else {
          // 若有当前选中视图，且参数有变化，则询问是否保存
          const viewObj = this.getViewParametersObj();
          // 判断参数对象是否一致
          if (!objectIsEqual(JSON.parse(segment), viewObj)) {
            this.updateViewData(viewObj);
          } else { // 若未发生变化则去确认参数绘制控制图
            this.goToConfirmParams();
          }
        }
      }
    },
    goToConfirmParams() {
      this.confirmParams = {
        variates: this.variates,
        parameters: this.parameters,
        estimated: this.estimated,
        options: this.options,
        tests: this.tests,
        planortype: this.planortype,
        weights: this.weights,
        boxcox: this.boxcox,
      };
      this.confirmDialog = true;
    },
    // 去更新视图参数
    async updateViewData(viewObj) {
      if (!await this.$root.$confirm.open(
        this.$t('dataAnalysis.dialog.tip'),
        this.$t('dataAnalysis.dialog.updateview'),
      )) {
        this.goToConfirmParams();
        return;
      }
      const {
        id,
      } = this.viewDetail;
      this.updateViewDetailReq(viewObj, id, true);
    },
    async updateViewDetailReq(viewObj, id, needComfirm) {
      const {
        dataSourceId, // 数据源表id
        currentDates,
        isrealtime,
        freshrate,
        dataquantity,
        algorithmtype,
        algorithm,
        options,
      } = viewObj;
      const payload = {
        id,
        dataSourceId,
        isRealtime: isrealtime ? 1 : 0,
        beginTime: currentDates[0],
        endTime: currentDates[1],
        dataQuantity: Number(dataquantity) || 0,
        freshRate: freshrate?.value ? Number(freshrate.value) : 0,
        algorithm,
        algorithmType: algorithmtype,
        options: JSON.stringify(options),
        segment: JSON.stringify(viewObj),
      };
      // console.log(payload, 'payload');
      const result = await this.updateViewDetail(payload);
      if (result) {
        // 修改成功后将参数写入当前视图对象
        this.selectedViewData.segment = JSON.stringify(viewObj);
        // 刷新视图列表
        this.initViewTable();
        if (needComfirm) {
          this.goToConfirmParams();
        }
      }
    },
    // 去更新算法模型详情
    async updateModelDetailData(viewObj) {
      if (!await this.$root.$confirm.open(
        this.$t('dataAnalysis.dialog.tip'),
        this.$t('dataAnalysis.dialog.updatemodel'),
      )) {
        this.goToConfirmParams();
        return;
      }
      const {
        id,
      } = this.modelDetailParam;
      this.updateModelDetailReq(viewObj, id, true);
    },
    async updateModelDetailReq(viewObj, id, needComfirm) {
      const {
        dataSourceId, // 数据源表id
        currentDates,
        isrealtime,
        freshrate,
        dataquantity,
        algorithmtype,
        algorithm,
        options,
      } = viewObj;
      let payload = {
        modelId: Number(this.modelId),
        dataSourceId,
        isRealtime: isrealtime ? 1 : 0,
        beginTime: currentDates[0],
        endTime: currentDates[1],
        dataQuantity: Number(dataquantity) || 0,
        freshRate: freshrate?.value ? Number(freshrate.value) : 0,
        algorithm,
        algorithmType: algorithmtype,
        options: JSON.stringify(options),
        segment: JSON.stringify(viewObj),
      };
      // console.log(payload, 'payload');
      let result = null;
      if (this.modelIsAdd) {
        result = await this.addModelDetail(payload);
      } else {
        payload = {
          ...payload,
          id,
        };
        result = await this.editModelDetail(payload);
      }
      if (result) {
        // 保存成功后重新获取模型算法详情，获取详情id，否则再次点保存会再次新增详情
        this.getModelDetail();
        // 将参数写入当前视图对象
        this.selectedViewData.segment = JSON.stringify(viewObj);
        if (needComfirm) {
          this.goToConfirmParams();
        }
      }
    },
    // 校验选项参数填写情况
    checkChartParams() {
      const { algorithmtype, algorithm, isrealtime } = this.selectedItems;
      const algorithmselected = algorithm.value;
      const groupid = algorithmtype.value;
      const optionparameters = {
        variates: this.variates,
        parameters: this.parameters,
        estimated: this.estimated,
        options: this.options,
        weights: this.weights,
        tests: this.tests,
        planortype: this.planortype,
        boxcox: this.boxcox,
      };
      const checkparams = {
        ...this.chartParameters,
      };
      // eslint-disable-next-line
      for (let i in optionparameters) {
        // 校验必填变量是否填写
        // 校验变量选项卡是否填写完整
        if (i === 'variates') {
          const variates = optionparameters[i];
          const check = checkparams[i];
          // eslint-disable-next-line
          for (let j in check) {
            if ((j === 'subgroupsizecolumn' || j === 'subgroupsizenumber')
              && check[j].show && check[j].required) {
              if ((!variates.subgroupsizecolumn || variates.subgroupsizecolumn === '')
                && (!variates.subgroupsizenumber || variates.subgroupsizenumber === '')) {
                this.setAlert({
                  show: true,
                  type: 'error',
                  message: 'subgroupsizecolumnerror',
                });
                return false;
              }
              if (!isrealtime) { // 非实时分析校验，实时分析子组大小默认1
                if (variates.subgroupsizenumber || variates.subgroupsizenumber === 0) {
                  const subgroupsize = Number(variates.subgroupsizenumber);
                  // 校验整数
                  if (variates.subgroupsizenumber.toString().indexOf('.') !== -1) {
                    this.setAlert({
                      show: true,
                      type: 'error',
                      message: 'subgroupsizeerror',
                    });
                    return false;
                  }
                  // 子组zone_chart/属性/时间加权/多变量算法，子组大小校验为1-100，其余为2-100
                  if (algorithmselected === 'zone_chart' || groupid === 3
                  || groupid === 4 || groupid === 5) {
                    if (subgroupsize < 1 || subgroupsize > 100) {
                      this.setAlert({
                        show: true,
                        type: 'error',
                        message: 'subgroupsizeerror',
                      });
                      return false;
                    }
                  } else if (subgroupsize < 2 || subgroupsize > 100) {
                    this.setAlert({
                      show: true,
                      type: 'error',
                      message: 'subgroupsizeerror',
                    });
                    return false;
                  }
                }
              }
            } else if (j === 'partnumber' && check[j].show && check[j].required) {
              // z-mr算法标签列为空校验
              if (!variates.partnumber || variates.partnumber === '') {
                this.setAlert({
                  show: true,
                  type: 'error',
                  message: 'labelcolumnerror',
                });
                return false;
              }
            } else if (check[j].show && check[j].required
              && (variates[j] !== 0 && (!variates[j] || variates[j] === ''))) {
              this.setAlert({
                show: true,
                type: 'error',
                message: 'variableserror',
              });
              return false;
            }
          }
        }
        // 校验参数选项卡是否填写完整
        if (i === 'parameters') {
          // 校验必填参数是否填写
          const parameters = optionparameters[i];
          const check = checkparams[i];
          // eslint-disable-next-line
          for (let j in parameters) {
            if (check[j] && check[j].show && check[j].required) {
              if (!parameters[j] || parameters[j] === '') {
                this.setAlert({
                  show: true,
                  type: 'error',
                  message: 'parameterserror',
                });
                return false;
              }
            }
          }
          // 能力分析算法：规格上下限至少填一个
          if (this.selectedItems.algorithmtype.value === 6) {
            if (!parameters.upperLimit && !parameters.lowerLimit) {
              this.setAlert({
                show: true,
                type: 'error',
                message: 'parametersLimitError',
              });
              return false;
            }
            if (parameters.upperLimit && parameters.lowerLimit
              && Number(parameters.upperLimit) <= Number(parameters.lowerLimit)) {
              this.setAlert({
                show: true,
                type: 'error',
                message: 'upperlimitBiggerThanLowerlimit',
              });
              return false;
            }
          }
          // 组间/组内：cpk/ppk算法，勾选使用历史标准差时，组间组内标准差必填
          if (this.selectedItems.algorithm.value === 'bwxpk') {
            if (parameters.useHistorySD) {
              if (!parameters.withinSubgroupSD || !parameters.betweenSubgroupSD) {
                this.setAlert({
                  show: true,
                  type: 'error',
                  message: 'parametersSdError',
                });
                return false;
              }
            }
          }
        }
        // 校验估计标准差选项卡是否填写完整
        if (i === 'estimated') {
          const estimated = optionparameters[i];
          const check = checkparams[i];
          if (check.mrLength && check.mrLength.show && check.mrLength.required) {
            if (!estimated.mrLength || Number(estimated.mrLength) < 2) {
              this.setAlert({
                show: true,
                type: 'error',
                message: 'estimatederror',
              });
              return false;
            }
          }
        }
        // 校验检验选项卡是否填写完整
        if (i === 'tests') {
          // 校验检验项勾选后是否填写数值
          const tests = optionparameters[i];
          const check = checkparams[i];
          // eslint-disable-next-line
          for (let j in tests) {
            if (check[j] && check[j].show && tests[j].checked) {
              if (!tests[j].value || tests[j].value === '') {
                this.setAlert({
                  show: true,
                  type: 'error',
                  message: 'testserror',
                });
                return false;
              }
            }
          }
        }
        // Box-Cox选项卡是否填写完整
        if (i === 'boxcox') {
          // 校验变换项勾选后是否选择变化方式及填写变换值
          const boxcox = optionparameters[i];
          if (boxcox.isboxcox) {
            if (!boxcox.boxcoxoption) {
              this.setAlert({
                show: true,
                type: 'error',
                message: 'boxcoxoptionserror',
              });
              return false;
            }
            if (boxcox.boxcoxoption === 'other' && !boxcox.boxcoxvalue) {
              this.setAlert({
                show: true,
                type: 'error',
                message: 'boxcoxvalueempty',
              });
              return false;
            }
            if (boxcox.boxcoxoption === 'other'
              && (Number(boxcox.boxcoxvalue) < -5 || Number(boxcox.boxcoxvalue) > 5)) {
              this.setAlert({
                show: true,
                type: 'error',
                message: 'boxcoxvalueerror',
              });
              return false;
            }
          }
        }
        if (i === 'weights') {
          const weights = optionparameters[i];
          // zont-chart需要校验区域分数
          if (this.selectedItems.algorithm.value === 'zone_chart') {
            if (!checkWeightsZone(weights)) {
              this.setAlert({
                show: true,
                type: 'error',
                message: 'weightszoneerror',
              });
              return false;
            }
            if (!weights.zonensigma || Number(weights.zonensigma) <= 1) {
              this.setAlert({
                show: true,
                type: 'error',
                message: 'weightszonensigmaerror',
              });
              return false;
            }
          }
        }
        // debug-temporary
        if (i === 'options') {
          // 校验必填参数是否填写
          const parameters = optionparameters[i];
          const check = checkparams[i];
          // eslint-disable-next-line
          for (let j in parameters) {
            if (check[j] && check[j].show && check[j].required) {
              if (!parameters[j] || parameters[j] === '') {
                this.setAlert({
                  show: true,
                  type: 'error',
                  message: 'optionserror',
                });
                return false;
              }
            }
          }
          // 非正态：pkk算法分析方式至少选一个
          if (this.selectedItems.algorithm.value === 'nnormxpk') {
            if (!parameters.performAnalysis) {
              this.setAlert({
                show: true,
                type: 'error',
                message: 'analysisError',
              });
              return false;
            }
          } else if (!parameters.withinSubgroup && !parameters.overall) {
            // 正态/组间/组内：分析方式至少选一个
            this.setAlert({
              show: true,
              type: 'error',
              message: 'analysisError',
            });
            return false;
          }
          // 勾选包含置信区间时，置信水平和置信区间不能为空
          if (parameters.includeConfidenceIntervals) {
            const confLevel = Number(parameters.confidenceLevel);
            if (!parameters.confidenceLevel || !parameters.confidenceIntervals) {
              this.setAlert({
                show: true,
                type: 'error',
                message: 'confidenceEmpty',
              });
              return false;
            }
            if (confLevel.toString().indexOf('.') !== -1) {
              this.setAlert({
                show: true,
                type: 'error',
                message: 'confidenceError',
              });
              return false;
            }
            if (confLevel <= 0 || confLevel >= 100) {
              this.setAlert({
                show: true,
                type: 'error',
                message: 'confidenceError',
              });
              return false;
            }
          }
        }
      }
      // 能力分析算法校验目标值和上下限值
      if (groupid === 6) {
        if (optionparameters?.parameters?.upperLimit && optionparameters?.options?.cpmTarget) {
          if (optionparameters.options.cpmTargett > optionparameters.parameters.upperLimit) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'cpmTargetError',
            });
            return false;
          }
        }
        if (optionparameters?.parameters?.lowerLimit && optionparameters?.options?.cpmTarget) {
          if (optionparameters.options.cpmTargett < optionparameters.parameters.lowerLimit) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'cpmTargetError',
            });
            return false;
          }
        }
      }
      return true;
    },
    // 确认算法配置后去绘图
    getCharts() {
      // 先关闭弹窗
      this.confirmDialog = false;
      // 若为实时，开启定时器，定时请求数据刷新控制图
      if (this.selectedItems.freshrate && this.selectedItems.freshrate.value) {
        const refreshInterval = this.selectedItems.freshrate.value * 1000;
        // 先请求一次数据，再开启定时器
        this.refreshChartData();
        interval = setInterval(this.refreshChartData, refreshInterval);
      } else {
        this.postChartData();
        clearInterval(interval);
        interval = null;
      }
    },
    // 由columnid获取数据源表对应列名
    getTableFieldById(id, tag) {
      let field = null;
      const fieldlist = this.dataColumnList.filter((item) => item.columnName === id);
      if (fieldlist.length > 0) {
        field = fieldlist[0][tag];
      }
      return field;
    },
    // 根据列名筛选去除表格空数据后返回
    getFilteredTableData(columnlist) {
      // 存放全部列名，包含数据列和标签列
      const collist = [];
      for (let i = 0; i < columnlist.length; i += 1) {
        const column = columnlist[i];
        // if (column.type === 'data') { // 数据列
        //   // 表格列描述，在控制图标题中展示，用数组存放
        //   const fielddesp = this.getTableFieldById(column.id, 'columnText');
        //   if (fielddesp) {
        //     this.selectedColumn.push(fielddesp);
        //   }
        // }
        const fieldname = this.getTableFieldById(column.id, 'columnName');
        if (fieldname) {
          collist.push(fieldname);
        }
      }
      return filterEmptyTableData(this.dataTableData, collist);
    },
    // 获取数据点（二维数组）
    getDataPointsList(columnlist) {
      const returndata = [];
      const filteredtabledata = this.getFilteredTableData(columnlist);
      if (filteredtabledata.length === 0) {
        return [];
      }
      // 按照columnlist顺序逐个添加数据/标签数组
      for (let i = 0; i < columnlist.length; i += 1) {
        const { id, type } = columnlist[i];
        const field = this.getTableFieldById(id, 'columnName');
        if (field) {
          const pointsarr = filteredtabledata.map((item) => item[field]);
          let points = [];
          if (type === 'data') {
            // 数据列的数据要转换为Number类型
            points = pointsarr.map((item) => Number(item));
          } else { // 标签列
            const groupid = this.selectedItems.algorithmtype.value;
            if (groupid === 3) {
              // 属性控制算法标签列数据要转换为Number类型
              points = pointsarr.map((item) => Number(item));
            } else {
              points = [
                ...pointsarr,
              ];
            }
          }
          returndata.push(points);
        }
      }
      return returndata;
    },
    // 格式化控制图接口入参
    getFormatParameters() {
      const groupid = this.selectedItems.algorithmtype.value;
      const charttype = this.selectedItems.algorithm.value;
      const {
        variates,
        parameters,
        estimated,
        options,
        tests,
        // weights,
        // planortype,
        boxcox,
      } = this.chartParameters;
      // data若使用二维数组传参，则会默认返回Group1，Group2……
      const payload = {
        group_id: groupid,
        chart_type: charttype,
        data: [], // 注意此处data可传对象或二维数组，对象参数名对应返回参数名
      };
      // variates
      if (Object.keys(this.variates).length > 0) {
        // 目前大部分算法仅支持选择一组数据
        const collist = [
          { type: 'data', id: this.variates.variateOne },
        ];
        if (groupid === 5) {
          // 多变量算法有两组数据
          collist.push({ type: 'data', id: this.variates.variateTwo });
        }
        if (this.variates.subgroupsizenumber && checkParamExists(variates, 'subgroupsizenumber')) {
          payload.subgroup_size = Number(this.variates.subgroupsizenumber);
        } else if (this.variates.subgroupsizecolumn
          && this.variates.subgroupsizecolumn !== ''
          && checkParamExists(variates, 'subgroupsizecolumn')) {
          // 若存在标签列，则需要重新筛选并计算payload.data
          payload.groupcol_exist = true;
          // 标签列必须放在最后加入，确保标签列数据在二维数组的末尾
          collist.push({ type: 'label', id: this.variates.subgroupsizecolumn });
        } else if (this.variates.partnumber
          && this.variates.partnumber !== ''
          && checkParamExists(variates, 'partnumber')) {
          // partnumber仅在子组（Z-MR）算法中存在
          payload.groupcol_exist = true;
          collist.push({ type: 'label', id: this.variates.partnumber });
        }
        // 定义payload的数据数组
        const payloadData = this.getDataPointsList(collist);
        if (payloadData && payloadData.length > 0) {
          payload.data = payloadData;
        }
        // 时间加权算法
        if (charttype === 'ma_chart') {
          if (this.variates.movingaveragelength
            && checkParamExists(variates, 'movingaveragelength')) {
            payload.len_ma = Number(this.variates.movingaveragelength);
          }
        } else if (charttype === 'ewma_chart') {
          if (this.variates.ewmaweight && this.variates.ewmaweight !== ''
            && checkParamExists(variates, 'ewmaweight')) {
            payload.weight = Number(this.variates.ewmaweight);
          }
        } else if (charttype === 'cumsum_chart') {
          if (((this.variates.target && this.variates.target !== '')
            || Number(this.variates.target) === 0)
            && checkParamExists(variates, 'target')) {
            payload.target = Number(this.variates.target);
          }
          // planortype,仅在cumsum算法中才有
          if (Object.keys(this.planortype).length > 0) {
            if (this.planortype.cumsumtype) {
              payload.cumsum_type = this.planortype.cumsumtype;
            }
            if (this.planortype.useFIR) {
              payload.f = Number(this.planortype.sdnumber);
            }
            if (this.planortype.reset) {
              payload.reset = this.planortype.reset;
            }
            if (this.planortype.h || Number(this.planortype.h) === 0) {
              payload.h = Number(this.planortype.h);
            }
            if (this.planortype.k || Number(this.planortype.k) === 0) {
              payload.k = Number(this.planortype.k);
            }
          }
        }
      }
      // parameters
      if (Object.keys(this.parameters).length > 0) {
        // 目前只支持一组数据，因此均值、标准差、比率填值均限制为number，放入数组传参即可
        if ((this.parameters.meanValue || this.parameters.meanValue === 0)
          && checkParamExists(parameters, 'meanValue')) {
          const arr = [];
          arr.push(Number(this.parameters.meanValue));
          payload.hist_mean = arr;
        }
        if ((this.parameters.standardDeviation || this.parameters.standardDeviation === 0)
          && checkParamExists(parameters, 'standardDeviation')) {
          const arr = [];
          arr.push(Number(this.parameters.standardDeviation));
          payload.hist_std = arr;
        }
        if ((this.parameters.proportion || this.parameters.proportion === 0)
          && checkParamExists(parameters, 'proportion')) {
          const arr = [];
          arr.push(Number(this.parameters.proportion));
          payload.hist_prop = arr;
        }
        // 能力分析算法，规则上下限必填至少一个
        if (this.parameters.upperLimit && checkParamExists(parameters, 'upperLimit')) {
          payload.usl = Number(this.parameters.upperLimit);
        }
        if (this.parameters.lowerLimit && checkParamExists(parameters, 'lowerLimit')) {
          payload.lsl = Number(this.parameters.lowerLimit);
        }
        // 组间/组内cpk/ppk算法和I-MR-R/S算法，标准差分子组内和子组间
        if (this.parameters.useHistorySD || charttype === 'i-mr-rs_chart') {
          if (this.parameters.withinSubgroupSD && checkParamExists(parameters, 'withinSubgroupSD')) {
            const arr = [];
            arr.push(Number(this.parameters.withinSubgroupSD));
            payload.sigma_wii = arr;
          }
          if (this.parameters.betweenSubgroupSD && checkParamExists(parameters, 'betweenSubgroupSD')) {
            const arr = [];
            arr.push(Number(this.parameters.betweenSubgroupSD));
            payload.sigma_bwi = arr;
          }
        }
        // 非正态算法，拟合分布必填
        if (this.parameters.fitDistribution && checkParamExists(parameters, 'fitDistribution')) {
          payload.dist_type = this.parameters.fitDistribution;
        }
      }
      // estimated
      if (Object.keys(this.estimated).length > 0) {
        // 当估计标准差显示且有值时才放入payload
        if (checkParamExists(estimated, 'mrmode')) {
          if (this.estimated.mrmode === 'averagemovingrange') {
            payload.mr_mode = 'avg';
          } else if (this.estimated.mrmode === 'medianmovingrange') {
            payload.mr_mode = 'med';
          }
        }
        // 移动极差长度
        if (checkParamExists(estimated, 'mrLength')) {
          if (this.estimated.mrLength || this.estimated.mrLength === 0) {
            payload.moving_range = Number(this.estimated.mrLength);
          }
        }
        // 标准差
        if (checkParamExists(estimated, 'standarddeviation')) {
          // i-mr-r/s_chart存在子组大小分组
          if (charttype === 'i-mr-rs_chart') {
            payload.sigmode_subless8 = this.estimated.standarddeviation;
            payload.sigmode_submore8 = this.estimated.standarddeviation2;
          } else if (this.estimated.standarddeviation) {
            payload.sigmode = this.estimated.standarddeviation;
          }
        }
        // 使用无偏常量
        if (checkParamExists(estimated, 'useunbiasingconstant')) {
          payload.unbias = this.estimated.useunbiasingconstant;
        }
        // 使用无偏常量来计算整体标准差
        if (checkParamExists(estimated, 'usebiasoverallsd')) {
          if (this.estimated.usebiasoverallsd) {
            payload.oa_unbias = this.estimated.usebiasoverallsd;
          }
        }
      }
      // options
      if (Object.keys(this.options).length > 0) {
        // 目标值（添加Cpm到表格）
        if ((this.options.cpmTarget || this.options.cpmTarget === 0)
          && checkParamExists(options, 'cpmTarget')) {
          payload.cpm_target = Number(this.options.cpmTarget);
        }
        // 对能力统计量使用Kxσ的公差(>0)
        if (this.options.ksigma && checkParamExists(options, 'ksigma')) {
          payload.ksigma = this.options.ksigma;
        }
        // 分析方式，正态和组间组内算法，子组内分析/整体分析不传，用作前端画图筛选展示
        // 非正态算法中，分析方式传zscore/iso
        if (this.options.performAnalysis && checkParamExists(options, 'performAnalysis')) {
          payload.method = this.options.performAnalysis;
        }
        // 显示，选择Benchmark Z时true，否则false
        if (this.options.display && checkParamExists(options, 'display')) {
          payload.z_bench = (this.options.display === 'benchmarkZs');
        }
        // 包括置信区间
        // eslint-disable-next-line
        if (this.options.includeConfidenceIntervals && checkParamExists(options, 'includeConfidenceIntervals')) {
          payload.ci_active = this.options.includeConfidenceIntervals;
        }
        // 置信水平
        if (this.options.includeConfidenceIntervals
          && this.options.confidenceLevel
          && checkParamExists(options, 'confidenceLevel')) {
          // 用作控制图标题展示
          payload.original_conf_level = this.options.confidenceLevel;
          payload.conf_intvl = Number(this.options.confidenceLevel) / 100;
        }
        // 置信区间
        if (this.options.includeConfidenceIntervals
          && this.options.confidenceIntervals === 'singleSided'
          && checkParamExists(options, 'confidenceIntervals')) {
          payload.oneside = true;
        } else if (this.options.includeConfidenceIntervals
          && this.options.confidenceIntervals === 'twoSided'
          && checkParamExists(options, 'confidenceIntervals')) {
          payload.oneside = false;
        }
        if (payload.z_bench && charttype !== 'nnormxpk') {
          // 选择Benchmark Z时，ci_active必须传true（非正态ppk算法除外）
          payload.ci_active = true;
          payload.conf_intvl = Number(this.options.confidenceLevel) / 100;
          payload.oneside = false;
        }
      }
      // tests
      if (Object.keys(this.tests).length > 0) {
        // eslint-disable-next-line
        for (let i in this.tests) {
          if (this.tests[i].checked && checkParamExists(tests, i)) {
            const key = getTestsParamName(false, i);
            const value = getTestsParamName(true, i);
            payload[key] = true;
            payload[value] = Number(this.tests[i].value);
          }
        }
      }
      // weights&reset
      if (Object.keys(this.weights).length > 0) {
        // 仅在区域算法中存在weights选项卡
        if (charttype === 'zone_chart') {
          // eslint-disable-next-line
          for (const i in this.weights) {
            const value = this.weights[i];
            const key = getWeightsParamName(i);
            if (key === 'zone' && value) {
              payload[key] = Number(value);
            } else if (key === 'za' || key === 'zb' || key === 'zc' || key === 'zd') {
              payload[key] = Number(value);
            } else if (key === 'reset') {
              payload[key] = value;
            }
          }
        }
      }
      // boxcox
      if (Object.keys(this.boxcox).length > 0 && this.boxcox.isboxcox && boxcox.show) {
        payload.boxcox = true;
        if (this.boxcox.boxcoxoption === 'other') {
          payload.lamb = Number(this.boxcox.boxcoxvalue);
        } else if (this.boxcox.boxcoxoption === 'ln') {
          payload.lamb = 0;
        } else if (this.boxcox.boxcoxoption === 'squareroot') {
          payload.lamb = 0.5;
        } // 其余情况lamb不传
      }
      this.optionsparams = { ...payload };
      // 能力分析算法中，除非正态以外，需要传入是否整体分析和子组内分析，用作控制图筛选展示
      if (groupid === 6) {
        if (charttype !== 'nnormxpk') {
          this.optionsparams.withinSubgroup = this.options.withinSubgroup;
          this.optionsparams.overall = this.options.overall;
        }
        // 置信水平
        delete payload.original_conf_level;
      }
      // 非正态ppk算法仅展示整体分析结果
      if (charttype === 'nnormxpk') {
        this.optionsparams.withinSubgroup = false;
        this.optionsparams.overall = true;
      }
      return payload;
    },
    // 实时刷新表数据并请求算法接口绘图
    async refreshChartData() {
      await this.getTableList(this.selectedItems.datatable);
      await this.postChartData();
    },
    // 发送spc算法运算请求
    async postChartData() {
      const {
        algorithm,
        algorithmtype,
        currentDates,
        dataquantity,
        datatable,
        freshrate,
        isrealtime,
      } = this.selectedItems;
      const {
        variates,
        parameters,
        estimated,
        options,
        weights,
        tests,
        planortype,
        boxcox,
      } = this; // 选项卡内容
      const optionsObj = {
        variates,
        parameters,
        estimated,
        options,
        weights,
        tests,
        planortype,
        boxcox,
      };
      const payload = {
        algorithm: algorithm?.value || '',
        algorithmType: algorithmtype?.value || '',
        isRealtime: isrealtime ? '1' : '0', // 1-实时，0-历史
        beginTime: currentDates[0] || 0,
        endTime: currentDates[1] || 0,
        dataQuantity: dataquantity ? Number(dataquantity) : 0,
        dataSourceNumber: datatable?.value || '',
        freshRate: freshrate?.value || 0,
        options: JSON.stringify(optionsObj),
      };
      // console.log(payload, 'payload');
      // 选项参数传递给图表组件
      this.optionsparams = {
        ...optionsObj,
      }; // 选项卡参数
      // this.chartData = {
      //   i: {
      //     Group1: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      //       1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      //   },
      //   iCL: {
      //     Group1: 0.9333333333333333,
      //   },
      //   iLCL: {
      //     Group1: 0.8416238689166056,
      //   },
      //   iUCL: {
      //     Group1: 1.0250427977500611,
      //   },
      //   vio_points_I: {
      //     Group1: {
      //       oocl: [0, 1],
      //     },
      //   },
      //   chart_type: 'i_chart',
      //   status: 200,
      //   x_axis: null,
      // };
      const result = await this.runAlgorithm(payload);
      const { data } = result;
      if (data) {
        this.chartData = data;
      }
    },
    // 发送spc算法运算请求-旧
    async postChartDataOld() {
      const payload = this.getFormatParameters();
      if (payload.cpm_target || payload.cpm_target === 0) {
        // 目标不能大于上限，不能小于下限
        if (payload.usl || payload.usl === 0) {
          if (payload.cpm_target > payload.usl) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'cpmTargetError',
            });
            return;
          }
        }
        if (payload.lsl || payload.lsl === 0) {
          if (payload.cpm_target < payload.lsl) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'cpmTargetError',
            });
            return;
          }
        }
      }
      // console.log(payload, 'payload');
      let result = null;
      if (payload.group_id === 6) {
        // 能力分析调用接口
        result = await spcService.postCapabData(payload);
      } else {
        // 其他spc分析调用接口
        result = await spcService.postSpcData(payload);
      }
      const { data } = result;
      if (data) {
        if (data.status === 200) {
          this.chartData = data;
        } else {
          // 接口报错清空图表数据
          this.chartData = {};
          if (data.err_msg && data.err_msg.length > 0) {
            this.errMsgList = data.err_msg;
            this.errorDialog = true;
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .datetimeclass {
    ::v-deep() input[type="datetime-local"]::after {
      top: 8px!important;
      right: 35px!important;
    }
  }
  .customDateTimePicker {
    ::v-deep() .el-input__inner {
      border: 1px solid #A8A8A8!important;
    }
    ::v-deep() .el-range-input {
      color: rgba(0, 0, 0, 0.87)!important;
    }
    ::v-deep() .el-range__icon {
      color: rgba(0, 0, 0, 0.87)!important;
    }
    ::v-deep() .is-active {
      border: 2px solid var(--v-primary-base)!important;
    }
  }
  .titlecard {
    ::v-deep() .v-card__title{
      font-size: 1rem;
      line-height: 1rem;
      padding: 0;
    }
    ::v-deep() .v-btn {
      font-size: 15px;
      height: 28px;
    }
  }
</style>

<style lang="scss">
.main-dark {
  .customDateTimePicker {
    .el-range-input {
      color: #ffffff !important;
    }
    .el-range__icon {
      color: #ffffff !important;
    }
  }
}
</style>
