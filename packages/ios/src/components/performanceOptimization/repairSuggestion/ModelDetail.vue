<template>
  <div class="fill-height">
    <v-row
      no-gutters
      class="pb-4 failure-detail"
      :style="`height:${height}px`"
    >
      <v-col
        cols="6"
        align-self="end"
      >
        <v-card
          class="bluecard rounded-xl rounded-r-0"
          width="100%"
          :height="cardHeight"
        >
          <v-card-text>
            <div class="text-h6 primary--text">
              {{`${$t('repairSuggestion.maintenancesuggestion')}:`}}
            </div>
            <div class="failure-time py-1 mx-2 my-2">
              <v-row no-gutters class="" style="flex-wrap: nowrap;">
                <v-col cols="3" class="d-flex flex-column  px-2 py-1">
                  <span class="num">{{taskScore.toLocaleString()}}</span>
                  <div class="d-flex align-center">
                    <img
                      :src="require('@/assets/icons/img/failure-time-icon-white-dark.png')"
                      height='24px'
                      alt=""
                    />
                    <div class="d-flex flex-column ml-1">
                      <span class="label-title">
                        {{'任务执行情况'}}
                      </span>
                      <span class="label-title">
                        {{'30天'}}
                      </span>
                    </div>
                  </div>
                </v-col>
                <v-divider vertical dark inset></v-divider>
                <v-col cols="3" class="d-flex flex-column  px-2 py-1">
                  <span class="num">{{measureScore.toLocaleString()}}</span>
                  <div class="d-flex align-center">
                    <img
                      :src="require('@/assets/icons/img/failure-time-icon-white-dark.png')"
                      height='24px'
                      alt=""
                    />
                    <div class="d-flex flex-column ml-1">
                      <span class="label-title">
                        {{'异常波动次数'}}
                      </span>
                      <span class="label-title">
                        {{'30天'}}
                      </span>
                    </div>
                  </div>
                </v-col>
                <v-divider vertical dark inset></v-divider>
                <v-col cols="" class="d-flex flex-column  px-2 py-1">
                  <span class="num">{{malfunctionScore.toLocaleString()}}</span>
                  <div class="d-flex align-center">
                    <img
                      :src="require('@/assets/icons/img/failure-time-icon-white-dark.png')"
                      height='24px'
                      alt=""
                    />
                    <div class="d-flex flex-column ml-1">
                      <span class="label-title">
                        {{'平均无故障时间'}}
                      </span>
                      <span class="label-title">
                        {{'30天'}}
                      </span>
                    </div>
                  </div>
                </v-col>
                <v-divider vertical dark inset></v-divider>
                <v-col cols="" class="d-flex flex-column  pl-2 py-1">
                  <span class="num">{{alarmScore.toLocaleString()}}</span>
                  <div class="d-flex align-center">
                    <img
                      :src="require('@/assets/icons/img/failure-time-icon-white-dark.png')"
                      height='24px'
                      alt=""
                    />
                    <div class="d-flex flex-column ml-1">
                      <span class="label-title">
                        {{'未处理报警'}}
                      </span>
                      <span class="label-title">
                        {{'及时'}}
                      </span>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
            <div
              class="info--text my-3"
              v-for="(suggestion, index) in suggestionList"
              :key="`suggestion-${index}`"
            >
              {{
                `(${index + 1}) ${suggestion}`
              }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="6"
        align-self="end"
        class="pl-1 pr-3"
      >
        <div class="d-flex align-end">
          <v-btn-toggle
            v-model="tabkey"
            tile
            group
            mandatory
            class="group-btn-tab ml-1"
          >
            <v-btn
              v-for="(item,index) in tabItems"
              :key="index"
              :width="`${(strLen(item.name) - 4) > 0 ? 102 + (strLen(item.name) - 4) * 15: 102}px`"
              class="tab-item"
              :ripple="false"
            >
              <img
              v-if="index === tabkey"
              :src="require('@/assets/icons/img/tpm-tab-item-active-dark.svg')"
              :width="`${(strLen(item.name) - 4) > 0 ? 102 + (strLen(item.name) - 4) * 15: 102}px`"
              height="35px"
              alt=""
              class="item-background">
              <img
              v-else
              :src="require('@/assets/icons/img/tpm-tab-item-unactive-dark.svg')"
              :width="`${(strLen(item.name) - 4) > 0 ? 102 + (strLen(item.name) - 4) * 15: 102}px`"
              height="35px"
              alt=""
              class="item-background">
              <span
                class="text-h6 font-weight-bold"
                :class="index === tabkey? 'primary--text' : 'info--text'"
              >
              {{ item.name }}
              </span>
            </v-btn>
          </v-btn-toggle>
          <v-spacer></v-spacer>
        </div>
        <v-card
          class="mx-2 bluecard rounded-xl rounded-l-0"
          width="100%"
          :height="cardHeight"
        >
          <v-card-text v-if="tabkey === 0" class="px-2">
            <div class="d-flex">
              <div class="text-h6 primary--text ml-1">
                {{'异常测量项：'}}
              </div>
              <v-spacer></v-spacer>
              <v-btn class="mx-1" outlined color="primary" rounded dense small
                @click="chartDialog = true"
              >查看曲线</v-btn>
            </div>
            <div class="d-flex failure-detail-info my-3 align-center">
              <v-btn
                height="196px"
                width="20px"
                x-small
                class="high-blue-btn px-1"
                :disabled="pointPageNum <= 0"
                @click="pointPageNum -= 1"
              >
                <v-icon size="60px" color="primary">mdi-menu-left</v-icon>
              </v-btn>
              <div class="d-flex flex-column mx-3 my-1 overflow-y-auto info-item" >
                <div
                  class="primary--text text-h6 font-weight-black"
                  style="line-height:1.3"
                >
                  {{alarmPointList.length?alarmPointList[pointPageNum].stationName:'-'}}
                </div>
                <div
                  class="info--text text-h6 font-weight-black"
                  style="line-height:1.3"
                >
                  测量项：
                  {{alarmPointList.length?alarmPointList[pointPageNum].testItem:'-'}}
                </div>
                <div
                  v-if="!alarmPointList.length"
                  class="info--text text-h6 font-weight-black"
                  style="line-height:1.3"
                >
                  {{'类型：-'}}
                </div>
                <div
                  v-else-if="alarmPointList[pointPageNum].testStatus === 'WARRNING'"
                  class="warning--text text-h6 font-weight-black"
                  style="line-height:1.3"
                >
                  类型：
                  {{
                    alarmPointList.length?alarmPointList[pointPageNum].triggeringCondition:'-'
                  }}
                  预警
                </div>
                <div
                  v-else-if="alarmPointList[pointPageNum].testStatus === 'ERROR'"
                  class="error--text text-h6 font-weight-black"
                  style="line-height:1.3"
                >
                  类型：
                  {{
                    alarmPointList.length?alarmPointList[pointPageNum].triggeringCondition:'-'
                  }}
                  报警
                </div>
                <div
                  class="info--text"
                  style="line-height:1.3;font-size:12px"
                >
                  {{
                    alarmPointList.length?alarmPointList[pointPageNum].warningDate:'-'
                  }}
                </div>
                <div class="mt-3" style="line-height:1rem">
                  <v-row no-gutters class="font-weight-black">
                    <v-col cols="7">{{'报警值'}}</v-col>
                    <v-col>
                      {{
                        alarmPointList.length?alarmPointList[pointPageNum].scadaValue:'0'
                      }}
                      <span v-if="alarmPointList.length&&alarmPointList[pointPageNum].scadaValue">
                        {{alarmPointList.length?alarmPointList[pointPageNum].unit:''}}
                      </span>
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="info--text" style="font-size:12px">
                    <v-col cols="7">
                      {{`${$t('repairSuggestion.upperwarningvalue')}:`}}
                    </v-col>
                    <v-col>
                      {{alarmPointList.length?alarmPointList[pointPageNum].upWarningValue:'0'}}
                      <span
                        v-if="alarmPointList.length&&alarmPointList[pointPageNum].upWarningValue"
                      >
                        {{alarmPointList.length?alarmPointList[pointPageNum].unit:''}}
                      </span>
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="info--text" style="font-size:12px">
                    <v-col cols="7">
                      {{`${$t('repairSuggestion.upperlimitvalue')}:`}}
                    </v-col>
                    <v-col>
                      {{alarmPointList.length?alarmPointList[pointPageNum].upLimit:'0'}}
                      <span
                        v-if="alarmPointList.length&&alarmPointList[pointPageNum].upLimit"
                      >
                        {{alarmPointList.length?alarmPointList[pointPageNum].unit:''}}
                      </span>
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="info--text" style="font-size:12px">
                    <v-col cols="7">{{`${$t('repairSuggestion.lowerwarningvalue')}:`}}</v-col>
                    <v-col>
                      {{
                        alarmPointList.length?alarmPointList[pointPageNum].downWarningValue:'0'
                      }}
                      <span
                        v-if="alarmPointList.length&&alarmPointList[pointPageNum].downWarningValue"
                      >
                        {{alarmPointList.length?alarmPointList[pointPageNum].unit:''}}
                      </span>
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="info--text" style="font-size:12px">
                    <v-col cols="7">
                      {{`${$t('repairSuggestion.lowerlimitvalue')}:`}}
                    </v-col>
                    <v-col>
                      {{
                        alarmPointList.length?alarmPointList[pointPageNum].downLimit:'0'
                      }}
                      <span
                        v-if="alarmPointList.length&&alarmPointList[pointPageNum].downLimit"
                      >
                        {{alarmPointList.length?alarmPointList[pointPageNum].unit:''}}
                      </span>
                    </v-col>
                  </v-row>
                </div>
              </div>
              <v-btn
                height="196px"
                width="20px"
                x-small
                class="high-blue-btn px-1"
                :disabled="pointPageNum >= alarmPointList.length - 1"
                @click="pointPageNum += 1"
              >
                <v-icon size="60px" color="primary">mdi-menu-right</v-icon>
              </v-btn>
              <span class="page-text info--text">
                {{`${pointPageNum + 1}/${alarmPointList.length}`}}
              </span>
            </div>
          </v-card-text>
          <v-card-text v-else class="py-2" style="width: 100%;">
            <div class="text-h6 primary--text ml-1">
              {{'未完成任务：'}}
            </div>
            <div class="d-flex failure-detail-info mt-4 align-center">
              <v-btn
                height="196px"
                width="20px"
                x-small
                class="high-blue-btn px-1"
                :disabled="taskPageNum <= 0"
                @click="taskPageNum -= 1"
              >
                <v-icon size="60px" color="primary">mdi-menu-left</v-icon>
              </v-btn>
              <v-data-table
                fixed-header
                dense
                :headers="headers"
                disable-pagination
                :items="filterTaskList"
                hide-default-footer
                :height="196"
                class="mx-1 task-table-mini"
                style="width: calc(100% - 80px);"
              >
                <template v-slot:item="{ item }">
                    <tr class="pb-1">
                      <!-- <td>
                        <span>
                          {{ item.no }}
                        </span>
                      </td>
                      <td>
                        <span>
                          {{ item.productName }}
                        </span>
                      </td> -->
                      <td
                        :class="item.taskStatusCode===2
                          ?'inProgress-darken'
                          :item.taskStatusCode===7?'delay-darken':''"
                      >
                        <span>
                          {{ item.taskName }}
                        </span>
                      </td>
                      <td
                        :class="item.taskStatusCode===2
                          ?'inProgress-darken'
                          :item.taskStatusCode===7?'delay-darken':''"
                      >
                        {{ item.taskType }}
                      </td>
                      <td
                        :class="item.taskStatusCode===2
                          ?'inProgress-darken'
                          :item.taskStatusCode===7?'delay-darken':''"
                        class="text-left"
                      >
                        <v-btn
                          icon
                          @click="goDetails(item)"
                        >
                          <v-icon>mdi-dots-horizontal-circle-outline</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </template>
              </v-data-table>
              <v-btn
                height="196px"
                width="20px"
                x-small
                class="high-blue-btn px-1"
                :disabled="taskPageNum >= taskPageSum - 1"
                @click="taskPageNum += 1"
              >
                <v-icon size="60px" color="primary">mdi-menu-right</v-icon>
              </v-btn>
              <span class="page-text info--text">
                {{`${taskPageNum + 1}/${taskPageSum}`}}
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <repair-task-dialog />
    <maintenance-task-dialog />
    <chart-dialog
      :chartDialog="chartDialog"
      :alarmPoint="chartAlarmPoint"
      @closeDialog="chartDialog = false"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import RepairTaskDialog from '../maintenanceTask/repairTaskDialog.vue';
import MaintenanceTaskDialog from '../maintenanceTask/maintenanceTaskDialog.vue';
import ChartDialog from './ChartDialog.vue';

export default {
  name: 'ModelDetail',
  data() {
    return {
      clientheight: document.body.clientHeight,
      addRepairTaskDialog: false,
      pointPageNum: 0,
      taskPageNum: 0,
      tabkey: 0,
      chartDialog: false,
    };
  },
  props: {
    height: {
      type: Number,
    },
  },
  components: {
    RepairTaskDialog,
    MaintenanceTaskDialog,
    ChartDialog,
  },
  computed: {
    ...mapState('maintenanceTask', [
      'taskList',
      'unfinishedTaskList',
    ]),
    ...mapState('repairSuggestion', ['alarmPointList', 'healthScore', 'healthDetail']),
    tabItems() {
      return [
        {
          name: '测点',
        },
        {
          name: '任务',
        },
      ];
    },
    filterTaskList() {
      const { unfinishedTaskList, taskPageNum } = this;
      const tasks = unfinishedTaskList.map((item, index) => {
        const obj = {
          ...item,
          no: index + 1,
        };
        return obj;
      });
      return tasks.slice(taskPageNum * 4, (taskPageNum + 1) * 4);
    },
    taskPageSum() {
      const { taskList, id } = this;
      return Math.ceil(taskList.filter((item) => item.productId === Number(id)).length / 4);
    },
    cardHeight() {
      return this.height - 56;
    },
    id() {
      return this.$route.params.id;
    },
    headers() {
      return [
        // {
        //   text: '序号',
        //   value: 'no',
        //   sortable: false,
        //   width: 60,
        //   class: 'highlight',
        // },
        // {
        //   text: '部件',
        //   value: 'productName',
        //   sortable: false,
        //   class: 'highlight',
        //   width: 100,
        // },
        {
          text: this.$t('maintenanceTask.taskname'),
          value: 'taskName',
          sortable: false,
          class: 'highlight',
        },
        {
          text: this.$t('maintenanceTask.tasktype'),
          value: 'taskType',
          sortable: false,
          class: 'highlight',
          width: 90,
        },
        {
          text: this.$t('maintenanceTask.detail'),
          value: 'detail',
          sortable: false,
          class: 'highlight',
          width: 50,
        },
      ];
    },
    taskScore() {
      return this.healthScore?.prodductTaskSource?.TaskSource || 0;
    }, // 任务执行情况得分
    measureScore() {
      return this.healthScore?.prodductTaskSource?.AlarmSource || 0;
    }, // 异常波动次数得分
    malfunctionScore() {
      return this.healthScore?.prodductTaskSource?.MaintainSource || 0;
    }, // 任务执行有效性得分
    alarmScore() {
      return this.healthScore?.prodductTaskSource?.NgalarmSource || 0;
    }, // 未处理报警得分
    // 综合评分
    totalScore() {
      return this.healthScore?.prodductTaskSource?.AllAvgSource || 0;
    },
    healthDetailNum() {
      return this.healthDetail?.productTaskTotal || {};
    },
    suggestionList() {
      const {
        AlarmNum, // 总异常数量
        NGAlarmNum, // 未处理异常数量
        MaintenanceTaskNum, // 维修任务总数量
        UnFinishedMaintenanceTaskNum, // 未完成维修任务数量
        OPSTaskNum, // 运维任务总数量
        UnFinishedOPSTaskNum, // 未完成运维任务数量
        OverdueOPSTaskNum, // 逾期运维任务数量
        OverdueMaintenanceTaskNum, // 逾期维修任务数量
      } = this.healthDetailNum;
      const {
        totalScore, // 综合评分
      } = this;
      const list = [];
      if (AlarmNum) {
        list.push(`30天内出现${AlarmNum}次测量项波动异常，其中${NGAlarmNum}个异常未处理,建议检查该系统。`);
      }
      if (MaintenanceTaskNum) {
        list.push(`30天内已完成${MaintenanceTaskNum}项维修任务，存在${UnFinishedMaintenanceTaskNum}项未完成的维修任务，其中${OverdueMaintenanceTaskNum}项逾期。`);
      }
      if (OPSTaskNum) {
        list.push(`30天内已完成${OPSTaskNum}项运维任务，存在${UnFinishedOPSTaskNum}项未完成的运维任务，其中${OverdueOPSTaskNum}项逾期。`);
      }
      if (totalScore || totalScore === 0) {
        if (Number(totalScore || 0) < 60) {
          list.push(`30天内综合评分为${totalScore}，建议检查该系统。`);
        }
      }
      return list;
    },
    chartAlarmPoint() {
      const { alarmPointList, pointPageNum } = this;
      // console.log(alarmPointList, 'alarmPointList');
      if (alarmPointList.length) {
        return alarmPointList[pointPageNum];
      }
      return {};
    },
  },
  watch: {
  },
  methods: {
    ...mapMutations('maintenanceTask', ['setMaintenanceTaskDialog', 'setRepairTaskDialog', 'setTaskInfo']),
    init() {
      // this.getBomTreeBean();
    },
    strLen(str) {
      let count = 0;
      for (let i = 0; i < str.length; i += 1) {
        count += str.charCodeAt(i) <= 128 ? 1 : 2;
      }
      return count;
    },
    goDetails(task) {
      this.setTaskInfo(task);
      if (task.taskTypeCode === 3) {
        this.setMaintenanceTaskDialog(true);
      } else {
        this.setRepairTaskDialog(true);
      }
    },
  },
};
</script>
