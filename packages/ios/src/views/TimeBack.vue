<template>
  <div class="pl-4 pr-4 pt-10 time-back">
    <v-row dense>
      <v-col cols="4">
        <v-row dense class="pl-6">
          <v-col cols="12">
            <div
              :style="`height:${topHeight}px`"
              class="div-transparent overflow-y-auto pa-2"
            >
              <div class="d-flex">
                <v-icon
                  color="primary"
                >mdi-clock-time-three-outline</v-icon>
                <span class="ml-2 font-weight-bold">{{ $t('timeBack.dataRange') }}</span>
              </div>
              <v-row dense class="px-8 mt-1">
                <v-col cols="12">
                  <div class="text-subtitle-2">{{$t('timeBack.timeRange')}}</div>
                  <date-picker
                    v-model="timeRange"
                    prefix-class="xmx"
                    type="datetime"
                    value-type="timestamp"
                    class="long-datepicker"
                    range
                    @change="getAlarmlist"
                  />
                </v-col>
              </v-row>
              <v-row dense class="px-8 mt-1">
                <v-col cols="5">
                  <div class="text-subtitle-2">{{$t('timeBack.selectLayout')}}</div>
                  <v-autocomplete
                    v-model="selectedBom"
                    :items="machineBomList"
                    outlined
                    dense
                    item-text="bomName"
                    item-value="bomId"
                    class="input-transparent"
                    @change="getPartlist();getAlarmlist();"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="7">
                  <div class="text-subtitle-2">{{$t('timeBack.partLayout')}}</div>
                  <v-autocomplete
                    v-model="selectedPart"
                    :items="bomDetailList"
                    outlined
                    dense
                    item-text="bomName"
                    item-value="bomId"
                    class="input-transparent"
                    @change="getAlarmlist"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
        <v-row dense class="pl-6">
          <v-col cols="4">
            <div
              :style="`height:${bottomHeight}px`"
              class="div-transparent overflow-y-auto pa-2"
            >
              <div class="d-flex">
                <v-icon
                  color="primary"
                >mdi-table-large</v-icon>
                <span class="ml-2 font-weight-bold">{{ $t('timeBack.dataTable') }}</span>
                <v-spacer></v-spacer>
                <v-chip
                  color="rgba(242, 242, 242, 0.2)"
                  label
                  small
                >{{ dataSourceList.length }}</v-chip>
              </div>
              <v-row dense class="px-1 mt-2">
                <v-col cols="12">
                  <div class="text-subtitle-2">{{$t('timeBack.dataSource')}}</div>
                  <v-autocomplete
                    v-model="selectDataSource"
                    :items="dataSourceList"
                    outlined
                    dense
                    item-text="dataSourceName"
                    item-value="dataSourceId"
                    return-object
                    hide-details
                    class="input-transparent"
                    @change="getColumnList"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <div
                class="div-transparent overflow-y-auto pa-1 mt-1 mx-1"
                :style="`height:${bottomHeight - 118}px`"
              >
                <v-list dense color="transparent" class="py-0">
                  <v-list-item-group
                    v-model="selectedColumnList"
                    multiple
                    @change="getDataTree"
                  >
                    <template v-for="(item, index) in dataColumnList">
                      <v-list-item :key="`${selectDataSource}-${index}`">
                        <template v-slot:default="{ active }">
                          <v-list-item-action class="mr-1 my-1">
                            <v-checkbox :input-value="active" dense></v-checkbox>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-subtitle>{{ item.columnName }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </v-list-item>
                      <v-divider
                        v-if="index < dataColumnList.length - 1"
                        :key="index"
                      ></v-divider>
                    </template>
                  </v-list-item-group>
                </v-list>
              </div>
            </div>
          </v-col>
          <v-col cols="8">
            <div
              :style="`height:${bottomHeight}px`"
              class="div-transparent overflow-y-auto pa-2"
            >
              <div class="d-flex align-center">
                <v-icon
                  color="primary"
                >mdi-database-outline</v-icon>
                <span class="ml-2 font-weight-bold">{{ $t('timeBack.data') }}</span>
                <v-spacer></v-spacer>
                <v-btn
                  class="mx-1"
                  outlined
                  color="primary"
                  small
                  @click="handleExtend"
                >
                  <v-icon left small>mdi-swap-vertical</v-icon>
                  {{$t('timeBack.extendOrFold')}}
                </v-btn>
                <v-btn
                  class="ml-1"
                  outlined
                  color="primary"
                  small
                  @click="handleClear"
                >
                  <v-icon left small>mdi-close</v-icon>
                  {{$t('timeBack.clearSelect')}}
                </v-btn>
              </div>
              <v-treeview
                ref="dataTree"
                class="timeback-datatree"
                :style="`height: ${bottomHeight - 44}px;overflow-y: scroll;cursor: pointer;`"
                open-all
                :items="dataTree"
                activatable
                multiple-active
                dense
                return-object
                item-key="id"
                open-on-click
                :active.sync="activeColumn"
              >
                <template v-slot:label="{ item, active }">
                  <v-tooltip right >
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        class="d-flex"
                        v-if="item.isParent"
                      >
                        <span
                          v-bind="attrs"
                          v-on="on"
                          class="text-truncate"
                        >
                          {{ item.dataSourceName }}
                        </span>
                      </div>
                      <div
                        class="d-flex"
                        v-else
                      >
                        <v-icon
                          :color="active?'primary':'white'"
                          class="mr-2"
                        >mdi-resistor-nodes</v-icon>
                        <span
                          v-bind="attrs"
                          v-on="on"
                          class="text-truncate"
                        >
                          {{ item.columnName }}
                        </span>
                      </div>
                    </template>
                    <div v-if="item.isParent">
                      {{ item.dataSourceName }}
                    </div>
                    <div v-else>
                      {{ item.columnName }}
                    </div>
                  </v-tooltip>
                </template>
              </v-treeview>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="8">
        <router-view />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import moment from 'moment';
import DatePicker from 'vue2-datepicker';

export default {
  name: 'timeBack',
  data() {
    return {
      moment,
      clientheight: document.body.clientHeight,
      timeRange: [
        +moment().set({ hour: 0, minute: 0, second: 0 }),
        +moment().set({ hour: 23, minute: 59, second: 59 }),
      ],
      selectedBom: null,
      selectedPart: null,
      selectDataSource: null,
      dataColumnList: [],
      selectedColumnList: [],
      dataTree: [],
      activeColumn: [],
      extend: true,
    };
  },
  components: {
    DatePicker,
  },
  computed: {
    ...mapState('timeBack', [
      'machineBomList',
      'bomDetailList',
      'dataSourceList',
      'dataParamList',
      'monitorList',
      'recordList',
    ]),
    topHeight() {
      return 200;
    },
    bottomHeight() {
      return this.clientheight - 200 - 98 - 77 - 16;
    },
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions('timeBack', [
      'getMachineBomList',
      'getBomTableList',
      'getDataSourceList',
      'getDataParametersById',
      'getMonitorList',
      'getRecordList',
      'getTableDataList',
    ]),
    ...mapMutations('timeBack', [
      'setTimeRange',
      'setLineChartDataList',
      'setXrangeChartDataList',
    ]),
    init() {
      this.getMachineBomList();
      this.getDataSourceList();
      this.getAlarmlist();
    },
    async getAlarmlist() {
      console.log('getAlarmlist');
      const {
        timeRange, selectedBom, selectedPart, activeColumn,
      } = this;
      if (timeRange.length === 2) {
        this.setTimeRange(timeRange);
        let query1 = `beginTime=${timeRange[0]}&endTime=${timeRange[1]}`;
        let query2 = `beginTime=${moment(timeRange[0]).format('yyyy-MM-DD HH:mm:ss')}&endTime=${moment(timeRange[1]).format('yyyy-MM-DD HH:mm:ss')}`;
        if (selectedBom) {
          query1 += `&bomParentId=${selectedBom}`;
          query2 += `&bomParentId=${selectedBom}`;
        }
        if (selectedPart) {
          query1 += `&bomId=${selectedPart}`;
          query2 += `&bomId=${selectedPart}`;
        }
        const monitorList = await this.getMonitorList(query1);
        const recordList = await this.getRecordList(query2);
        const xrangeChartDataList = [
          ...recordList,
          ...monitorList,
        ];
        this.setXrangeChartDataList(xrangeChartDataList);
        await this.getLineChartDataList(activeColumn);
      }
    },
    getPartlist() {
      const { selectedBom } = this;
      if (selectedBom) {
        this.getBomTableList(selectedBom);
      }
      this.selectedPart = null;
    },
    async getColumnList() {
      if (this.selectDataSource) {
        const { dataSourceId } = this.selectDataSource;
        const dataColumnList = await this.getDataParametersById(dataSourceId);
        this.dataColumnList = dataColumnList
          .filter((column) => column.parameterDataType !== 10
            && column.parameterDataType !== 11
            && column.parameterDataType !== 12);
        this.selectedColumnList = [];
        const { dataTree } = this;
        const dataTreeIndex = dataTree
          .findIndex((t) => t.dataSourceId === dataSourceId);
        if (dataTreeIndex > -1) {
          const selectList = [];
          this.dataColumnList.forEach((item, index) => {
            if (dataTree[dataTreeIndex].children.some((c) => c.id === item.id)) {
              selectList.push(index);
            }
          });
          this.selectedColumnList = selectList;
        } else {
          this.selectedColumnList = [];
        }
        return;
      }
      this.selectedColumnList = [];
    },
    getDataTree() {
      let isFirstFlag = true;
      this.activeColumn = [];
      const {
        selectedColumnList,
        dataColumnList,
        selectDataSource,
        dataTree,
      } = this;
      if (selectedColumnList.length === 0) {
        this.dataTree = dataTree.filter((t) => t.dataSourceId !== selectDataSource.dataSourceId);
        return;
      }
      selectedColumnList.forEach((key) => {
        const dataTreeIndex = dataTree
          .findIndex((t) => t.dataSourceId === selectDataSource.dataSourceId);
        if (dataTreeIndex > -1) {
          if (isFirstFlag) {
            dataTree[dataTreeIndex].children = [];
            isFirstFlag = false;
          }
          if (!dataTree[dataTreeIndex].children.some((c) => c.id === dataColumnList[key].id)) {
            dataTree[dataTreeIndex].children.push({
              ...dataColumnList[key],
              isParent: false,
              dataSourceName: selectDataSource.dataSourceName,
              collectionName: selectDataSource.dataSourceNumber,
              storageFrequency: selectDataSource.storageFrequency,
            });
          }
        } else {
          dataTree.push({
            ...selectDataSource,
            isParent: true,
            children: [
              {
                ...dataColumnList[key],
                isParent: false,
                dataSourceName: selectDataSource.dataSourceName,
                collectionName: selectDataSource.dataSourceNumber,
                storageFrequency: selectDataSource.storageFrequency,
              },
            ],
          });
        }
      });
      this.dataTree = dataTree;
    },
    handleExtend() {
      this.$refs.dataTree.updateAll(this.extend);
      this.extend = !this.extend;
    },
    handleClear() {
      this.selectedColumnList = [];
      this.dataTree = [];
      this.activeColumn = [];
    },
    async getLineChartDataList(activeColumn) {
      const { timeRange } = this;
      if (timeRange.length < 2) {
        return;
      }
      if (activeColumn && activeColumn.length) {
        // activeColumn.
        const tableList = this.$getUniqueArray(activeColumn.map((item) => item.collectionName));
        console.log(tableList, 'tableList');
        const tableData = await tableList.reduce(async (newObj, table) => {
          newObj[table] = await this.getTableDataList(`collectionName=${table}&dateFrom=${timeRange[0]}&dateTo=${timeRange[1]}`);
          return newObj;
        }, {});
        console.log(tableData, 'tableData');
        const lineChartDataList = activeColumn.map((item) => {
          const data = tableData[item.collectionName]
            .map((t) => {
              const obj = {
                x: t.createdtimestamp,
                y: Number(t[item.connectionParameterNumber]),
                name: moment(t.createdtimestamp).format('yyyy-MM-DD HH:mm:ss'),
              };
              return obj;
            });
          const obj = {
            dataSourceName: item.dataSourceName,
            columnName: item.columnName,
            storageFrequency: item.storageFrequency,
            data,
          };
          return obj;
        });
        console.log(lineChartDataList, 'lineChartDataList');
        this.setLineChartDataList(lineChartDataList);
      } else {
        this.setLineChartDataList([]);
      }
    },
  },
  watch: {
    async activeColumn(activeColumn) {
      await this.getLineChartDataList(activeColumn);
    },
  },
};
</script>
