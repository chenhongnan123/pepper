<template>
  <v-card
    elevation="0"
    color="bg"
    class="pa-3"
  >
    <div :style="`height: ${filterOptionsHeight}px;`">
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
                  item-value="id"
                  :label="`${$t('dataAnalysis.label.datasource')}*`"
                  v-model="selectedItems.dataSourceId"
                  @change="handleDataTableChange"
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
              <template v-if="curDataSource">
                <div>
                  {{ curDataSource.dataSourceName }}
                </div>
              </template>
            </v-tooltip>
          </v-col>
          <v-col :cols="1">
            <v-checkbox
              :label="`${$t('dataAnalysis.label.realtime')}`"
              v-model="selectedItems.isRealtime"
              class="ml-1"
              style="margin-top: 3px;"
              hide-details
              disabled
            ></v-checkbox>
          </v-col>
          <v-col :cols="4">
            <div style="display: inline-flex;">
              <v-select
                dense
                outlined
                class="mr-2"
                :label="`${$t('dataAnalysis.label.freshrate')}*`"
                v-model="selectedItems.freshRate"
                :items="freshRateOptions"
                item-text="text"
                item-value="value"
                style="width: 50%;"
                @change="saveDisabled = false;"
              ></v-select>
              <v-text-field
                dense
                outlined
                type="number"
                v-model="selectedItems.dataQuantity"
                :label="`${$t('dataAnalysis.label.dataquantity')}*`"
                :rules="rules.dataquantity3"
                style="width: 50%;"
                @change="saveDisabled = false;handleGetDatas();"
              ></v-text-field>
            </div>
          </v-col>
          <v-col :cols="2">
          </v-col>
          <v-col :cols="2">
          </v-col>
          <v-col :cols="1" align="end">
            <v-btn
              color="primary"
              class="text-none"
              @click="handleSave"
              :disabled="saveDisabled"
              v-if="isBtnAccess('basic:detail:addordedit')"
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
          <v-card
            outlined
            :height="viewOptionsHeight + dataChartCardHeight + 8"
          >
            <v-card-title
              style="background-color:var(--v-primary-base;"
              class="py-1 rounded-b-0"
            >
              <span class="white--text">{{ $t('algorithmConstruction.label.data') }}</span>
            </v-card-title>
            <base-grid
              ref="connectionParameterGrid"
              :elementName="elementName"
              :restoreColumn="true"
              :options="options"
            />
          </v-card>
        </v-col>
        <v-col :cols="9">
          <v-card
            class=""
            :height="viewOptionsHeight"
            outlined
          >
            <v-card-title
              style="background-color:var(--v-primary-base;"
              class="py-1 rounded-b-0"
            >
              <span class="white--text">{{ $t('algorithmConstruction.label.params') }}</span>
              <v-spacer></v-spacer>
              <v-btn
                small
                icon
                dark
                @click="handleAddParam"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text
              class="overflow-y-auto mt-3"
              style="height:160px"
            >
              <v-form
                ref="form2"
                lazy-validation
              >
                <v-row dense>
                  <v-col
                    v-for="(param, key) in paramList"
                    :key="key"
                    cols="6"
                    class="my-1"
                  >
                    <v-row dense align="center">
                      <v-col cols="1">
                        <v-chip label>{{key + 1}}</v-chip>
                      </v-col>
                      <v-col cols="5">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-autocomplete
                              v-on="on"
                              dense
                              hide-details
                              outlined
                              clearable
                              :items="dataParamList"
                              :rules="rules.isrequired"
                              item-text="columnName"
                              item-value="connectionParameterNumber"
                              :label="`${$t('algorithmConstruction.label.column')}*`"
                              v-model="paramList[key].columnName"
                              @change="saveDisabled = false;"
                            >
                            </v-autocomplete>
                          </template>
                          <!-- 动态渲染选项提示文字内容 -->
                          <template v-if="paramList[key].columnName">
                            <div>
                              {{ paramList[key].columnName }}
                            </div>
                          </template>
                        </v-tooltip>
                      </v-col>
                      <v-col cols="5">
                        <v-text-field
                          dense
                          hide-details
                          v-model="paramList[key].paramName"
                          :label="`${$t('algorithmConstruction.label.paramsName')}*`"
                          :rules="rules.isrequired"
                          @change="saveDisabled = false;"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="1">
                        <v-btn
                          small
                          icon
                          @click="handleDeleteParam(key)"
                          color="error"
                          :disabled="paramList.length === 1"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
          <v-card
            class="mt-2"
            :height="dataChartCardHeight"
            outlined
          >
            <v-card-title
            >
              <v-spacer></v-spacer>
              <v-btn
                small
                color="primary"
                @click="handleRun"
              >
                {{ $t('algorithmConstruction.btn.run') }}
              </v-btn>
            </v-card-title>
            <v-card-text>
              <div
                v-html="chartHtml"
                ref="chart"
                class="overflow-y-auto d-flex justify-center"
                :style="`height: ${dataChartCardHeight - 72}px;`"
              ></div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';
import moment from 'moment';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';

let interval = null;
export default {
  name: 'algorithmConstructionDetail1',
  components: {
    BaseGrid,
  },
  data() {
    return {
      elementName: 'algorithmConstructionDetail1',
      moment,
      clientHeight: document.body.clientHeight,
      // 筛选条件部分的高度
      filterOptionsHeight: 65,
      // 视图卡片和选项卡片的高度
      viewOptionsHeight: 220,
      selectedItems: {
        dataSourceId: null,
        isRealtime: true, // 是否作实时分析
        freshRate: null,
        dataQuantity: null,
      }, // 选中的参数
      paramList: [
        {
          columnName: null,
          paramName: null,
        },
      ],
      curDataSource: {},
      saveDisabled: false,
      headers: [
        'createdtimestamp',
        'year',
        'month',
        'day',
        'week',
        'hour',
        'ts',
      ],
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        pagination: false,
        height: document.body.clientHeight - 260,
      },
      chartHtml: '',
    };
  },
  computed: {
    ...mapState('algorithmConstruction', [
      'dataSourceList',
      'dataParamList',
      'algorithmDetail',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    // 算法模型详情页，源数据表卡片高度
    dataTableHeight() {
      return this.clientHeight - 120 - this.filterOptionsHeight - 24;
    },
    // 数据分析页面，数据卡片和图表卡片的高度
    dataChartCardHeight() {
      return this.clientHeight - 120 - this.filterOptionsHeight - this.viewOptionsHeight - 36;
    },
    // 数据卡片和图表卡片的高度
    dataCardHeight() {
      return this.clientHeight - 120 - this.filterOptionsHeight - this.viewOptionsHeight - 36;
    },
    // 图表高度
    dataChartHeight() {
      return this.dataChartCardHeight - 32 - 30;
    },
    // 算法模型id
    modelId() {
      return this.$route.params.id || 0;
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
  },
  activated() {
    // 初始化加载
    this.init();
  },
  deactivated() {
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
      'setAlert',
    ]),
    ...mapActions('algorithmConstruction', [
      'getDataList',
      'getAlgorithmDetailById',
      'getDataParametersById',
      'getDataSourceList',
      'getDataSourceById',
      'addAlgorithDetail',
      'editAlgorithmDetail',
    ]),
    async init() {
      // 查询全部视图列表
      // await this.initViewTable();
      // 获取数据源表清单
      await this.getDataSourceList();
      const { modelId } = this;
      if (modelId) {
        await this.getModelDetailParam(modelId);
      }
      this.chartHtml = '';
    },
    async getModelDetailParam(modelId) {
      const result = await this.getAlgorithmDetailById(modelId);
      if (result) {
        this.saveDisabled = true;
        const {
          id, dataSourceId, freshRate, dataQuantity, options,
        } = result;
        this.selectedItems = {
          ...this.selectedItems,
          dataSourceId,
          freshRate,
          dataQuantity,
          id,
        };
        if (dataSourceId) {
          const dpResult = await this.getDataParametersById(dataSourceId);
          this.curDataSource = await this.getDataSourceById(dataSourceId);
          if (dpResult && this.curDataSource) {
            this.initTableHeaders();
            await this.handleGetDatas();
          }
        }
        if (this.$getIsJson(options)) {
          this.paramList = JSON.parse(options).params || [];
        }
      }
    },
    async handleDataTableChange() {
      this.saveDisabled = false;
      const { dataSourceId } = this.selectedItems;
      if (dataSourceId) {
        const dpResult = await this.getDataParametersById(dataSourceId);
        this.curDataSource = await this.getDataSourceById(dataSourceId);
        if (dpResult && this.curDataSource) {
          this.initTableHeaders();
          await this.handleGetDatas();
        }
      }
    },
    initTableHeaders() {
      const that = this;
      const paramHeaders = this.dataParamList.map((item) => {
        const obj = {
          field: item.connectionParameterNumber,
          headerName: item.columnName,
        };
        return obj;
      });
      const defaultHeaders = this.headers.map((item) => {
        const obj = {
          field: item,
          headerName: `dataSource.table.${item}`,
        };
        if (item === 'createdtimestamp') {
          obj.valueGetter = (params) => {
            if (params.data.createdtimestamp) {
              return that.$getFormatDate(params.data.createdtimestamp, 'yyyy-MM-DD HH:mm:ss.SSS');
            }
            return '-';
          };
        }
        return obj;
      });
      const headers = [
        {
          field: 'no',
          headerName: 'dataSource.table.no',
          maxWidth: 80,
          // eslint-disable-next-line
          valueGetter: (params) => params.node?.rowIndex + 1,
        },
        ...paramHeaders,
        ...defaultHeaders,
      ];
      this.options.headers = headers;
    },
    async handleGetDatas() {
      const { curDataSource } = this;
      const { dataQuantity } = this.selectedItems;
      console.log(curDataSource, 'curDataSource');
      console.log(dataQuantity, 'dataQuantity');
      if (
        !dataQuantity || dataQuantity < 0 || dataQuantity > 500
        || !curDataSource.dataSourceNumber
      ) {
        this.options.rowData = [];
        return;
      }
      const result = await this.getDataList({
        collectionName: curDataSource.dataSourceNumber,
        pageSize: dataQuantity,
      });
      this.options.rowData = result;
    },
    handleAddParam() {
      this.paramList.push({
        columnName: null,
        paramName: null,
      });
      this.saveDisabled = false;
    },
    handleDeleteParam(key) {
      console.log(key);
      this.paramList.splice(key, 1);
      this.saveDisabled = false;
    },
    // 保存视图按钮点击事件
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      if (!this.$refs.form2.validate()) {
        return;
      }
      const {
        dataSourceId,
        freshRate,
        dataQuantity,
        id,
      } = this.selectedItems;
      const params = {
        params: this.paramList,
      };
      const options = JSON.stringify(params);
      const payload = {
        isRealtime: '1',
        dataSourceId,
        freshRate,
        dataQuantity: Number(dataQuantity),
        id,
        options,
        modelId: Number(this.modelId),
      };
      let result = null;
      if (id) {
        result = await this.editAlgorithmDetail(payload);
      } else {
        delete payload.id;
        result = await this.addAlgorithDetail(payload);
      }
      if (result) {
        this.init();
        this.saveDisabled = true;
      }
    },
    // 试运行
    async handleRun() {
      if (!this.$refs.form.validate()) {
        return;
      }
      if (!this.$refs.form2.validate()) {
        return;
      }
      // eslint-disable-next-line
      this.chartHtml = '';
      const {
        selectedItems, curDataSource, modelId, paramList,
      } = this;
      const options = JSON.stringify({
        params: paramList,
      });
      const payload = {
        dataQuantity: selectedItems.dataQuantity,
        dataSourceNumber: curDataSource.dataSourceNumber,
        modelId,
        options,
        width: 900,
        height: 450,
      };
      const { data } = await this.$spcPost('spc/custom/running', payload);
      console.log(data);
      if (data) {
        this.chartHtml = data.chart;
        this.$nextTick(() => {
          const ele = document.createElement('script');
          const reg = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
          const result = data.chart.match(reg);
          console.log(result);
          const scriptText = [];
          result.forEach((item) => {
            const reg2 = /<script>([\s\S]*?)<\/script>/;
            if (item.match(reg2)) {
              scriptText.push(item.match(reg2)[1]);
            }
          });
          ele.innerHTML = scriptText;
          this.$refs.chart.append(ele);
        });
        return;
      }
      this.chartHtml = '';
    },
  },
};
</script>
