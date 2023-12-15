<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'900px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            $t('maintenancePlan.dialog.addMaintenancePlan')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-row
            justify="center"
          >
            <v-col cols="6">
              <v-text-field
                class="mt-1"
                clearable
                :rules="rules.number"
                :label="`${$t('maintenancePlan.table.number')}*`"
                v-model="tabledataobj.planCode"
                :counter="20"
              ></v-text-field>
              <v-text-field
                class="mt-1"
                clearable
                :rules="rules.name"
                :label="`${$t('maintenancePlan.table.name')}*`"
                v-model="tabledataobj.planName"
                :counter="50"
              ></v-text-field>
              <v-autocomplete
                clearable
                :rules="rules.isRequired"
                :label="`${$t('maintenancePlan.label.playType')}*`"
                class="mt-1"
                v-model="tabledataobj.planType"
                :items="planTypes"
                item-text="text"
                item-value="value"
              >
              </v-autocomplete>
              <!-- 运维方案 -->
              <v-autocomplete
                clearable
                :rules="rules.isRequired"
                :label="`${$t('maintenancePlan.table.maintenance')}*`"
                class="mt-1"
                v-model="tabledataobj.maintenanceSchemaId"
                :items="filterSchemaList"
                item-text="schemaName"
                item-value="id"
              >
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>{{item.schemaName}}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.schemaTypeLabel }}</v-list-item-subtitle>
                    <v-list-item-subtitle>{{item.remark}}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
              <!-- 选择维保对象，设备bom -->
              <!-- <selectable-bom-tree
                class="mt-3"
                ref="selectableBomTree"
                :title="$t('maintenancePlan.table.maintenanceTarget')"
                :height="380"
                :bomList="formatBomList(bomTreeList)"
                :isMultiple="false"
                :isErr="!!bomErrMsg"
                :isShowMaintenancePart="false"
                :isShowMainPart="false"
                itemChildren="childrenBomList"
                itemKey="bomId"
                itemText="bomName"
                alarmDisabledKey="isParent"
              />
              <div class="mx-4 error--text">{{bomErrMsg}}</div> -->
            </v-col>
            <v-col cols="6">
              <!-- 基于状态 -->
              <template v-if="tabledataobj.planType === '1'">
                <span class="text-subtitle-1">{{$t('maintenancePlan.label.trigger')}}</span>
                <v-radio-group
                  v-model="tabledataobj.triggerCondition"
                  row
                  :rules="rules.isRequired"
                >
                  <v-radio
                    :label="$t('maintenancePlan.label.count')"
                    :value="'0'"
                  ></v-radio>
                  <v-radio
                    :label="$t('maintenancePlan.label.timing')"
                    :value="'1'"
                    class="ml-16"
                  ></v-radio>
                </v-radio-group>
                <v-text-field
                  class="mt-1"
                  clearable
                  :rules="rules.interge"
                  :label="`${$t('maintenancePlan.table.triggerNum')}*`"
                  :hint="$t('maintenancePlan.label.triggerNumTips')"
                  v-model="tabledataobj.triggerCount"
                ></v-text-field>
                <v-autocomplete
                  clearable
                  :rules="rules.isRequired"
                  :label="`${$t('maintenancePlan.label.countParam')}*`"
                  class="mt-1"
                  v-model="tabledataobj.countParameter"
                  :items="countParamList"
                  item-text="parameterName"
                  item-value="parameterId"
                  :filter="filterFunc"
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title>{{item.parameterDescription}}</v-list-item-title>
                      <v-list-item-subtitle>{{item.parameterName}}</v-list-item-subtitle>
                      <v-list-item-subtitle>{{item.connectionName}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
                <v-text-field
                  class="mt-1"
                  clearable
                  :rules="rules.interge6"
                  :label="`${$t('maintenancePlan.label.estimatedTime')}*`"
                  v-model="tabledataobj.estimatedWork"
                ></v-text-field>
              </template>
              <!-- 基于时间 -->
              <template v-else>
                <span class="text-subtitle-1">
                  {{$t('maintenancePlan.table.cycle')}}
                </span>
                <v-text-field
                  class=""
                  clearable
                  :rules="rules.nameIn20"
                  :label="`${$t('maintenancePlan.label.cycleName')}*`"
                  v-model="tabledataobj.scheduleName"
                  :counter="20"
                ></v-text-field>
                <div class="mt-3 grey-thin-border rounded">
                  <tab-layout
                    :items="[
                      {tabName: $t('maintenancePlan.tab.month')},
                      {tabName: $t('maintenancePlan.tab.day')},
                      {tabName: $t('maintenancePlan.tab.hour')},
                    ]"
                    :tab="dateTab"
                    @changeTab="handleChangeTab"
                    class="mx-2 mt-2"
                  />
                  <v-tabs-items
                    v-model="dateTab"
                    class="ma-2 grey-thin-border rounded"
                    style="height: 250px"
                  >
                    <!-- 月 -->
                    <v-tab-item>
                      <v-radio-group
                        v-model="tabledataobj.monthType"
                        row
                        class="mt-1"
                        :rules="rules.isRequired"
                        dense
                        mandatory
                      >
                        <v-radio
                          v-for="(type, key) in monthTypes"
                          :key="`month-${key}`"
                          :label="type"
                          :value="key"
                        ></v-radio>
                      </v-radio-group>
                      <template
                        v-if="tabledataobj.monthType === 1"
                      >
                        <v-autocomplete
                          clearable
                          :rules="rules.isRequired"
                          :label="`${$t('maintenancePlan.label.from')}*`"
                          class="mx-3"
                          v-model="tabledataobj.monthFrom"
                          :items="months"
                          dense
                        >
                        </v-autocomplete>
                        <v-autocomplete
                          clearable
                          :rules="rules.isRequired"
                          :label="`${$t('maintenancePlan.label.to')}*`"
                          class="mx-3"
                          v-model="tabledataobj.monthTo"
                          :items="months"
                          dense
                        >
                        </v-autocomplete>
                        <v-text-field
                          class="mx-3"
                          clearable
                          :rules="rules.interge"
                          :label="`${$t('maintenancePlan.label.step')}*`"
                          v-model="tabledataobj.monthStep"
                          dense
                        ></v-text-field>
                      </template>
                      <v-row
                        no-gutters
                        class="mx-3"
                        v-if="tabledataobj.monthType === 2"
                      >
                        <v-col
                          v-for="(month, key) in months"
                          :key="`assignMonth-${key}`"
                          cols="auro"
                          class="flex-grow-0 flex-shrink-1"
                        >
                          <v-checkbox
                            v-model="tabledataobj.assignMonth"
                            :label="`${month}`"
                            :value="month"
                            dense
                            hide-details
                            multiple
                            class="pr-2"
                            :rules="rules.isRequired"
                          ></v-checkbox>
                        </v-col>
                      </v-row>
                    </v-tab-item>
                    <!-- 日 -->
                    <v-tab-item>
                      <v-radio-group
                        v-model="tabledataobj.dayType"
                        row
                        class="mx-3 mt-1"
                        :rules="rules.isRequired"
                        dense
                        mandatory
                      >
                        <v-radio
                          v-for="(type, key) in dayTypes"
                          :key="`day-${key}`"
                          :label="type"
                          :value="key"
                        ></v-radio>
                      </v-radio-group>
                      <template
                        v-if="tabledataobj.dayType === 1"
                      >
                        <v-autocomplete
                          clearable
                          :rules="rules.isRequired"
                          :label="`${$t('maintenancePlan.label.from')}*`"
                          class="mx-3"
                          v-model="tabledataobj.dayFrom"
                          :items="days"
                          dense
                        >
                        </v-autocomplete>
                        <v-autocomplete
                          clearable
                          :rules="rules.isRequired"
                          :label="`${$t('maintenancePlan.label.to')}*`"
                          class="mx-3"
                          v-model="tabledataobj.dayTo"
                          :items="days"
                          dense
                        >
                        </v-autocomplete>
                        <v-text-field
                          class="mx-3"
                          clearable
                          :rules="rules.interge"
                          :label="`${$t('maintenancePlan.label.step')}*`"
                          v-model="tabledataobj.dayStep"
                          dense
                        ></v-text-field>
                      </template>
                      <v-row
                        no-gutters
                        class="mx-3"
                        v-if="tabledataobj.dayType === 2"
                      >
                        <v-col
                          v-for="(day, key) in days"
                          :key="`assignDay-${key}`"
                          cols="auro"
                          class="flex-grow-0 flex-shrink-1"
                        >
                          <v-checkbox
                            v-model="tabledataobj.assignDay"
                            :label="`${day}`"
                            :value="day"
                            dense
                            hide-details
                            multiple
                            class="pr-2 mt-0"
                            :rules="rules.isRequired"
                          ></v-checkbox>
                        </v-col>
                      </v-row>
                      <v-row
                        no-gutters
                        class="mx-3"
                        v-if="tabledataobj.dayType === 3"
                      >
                        <v-col
                          v-for="(week, key) in weeks"
                          :key="`assignWeek-${key}`"
                          cols="auto"
                          class="flex-grow-0 flex-shrink-1"
                        >
                          <v-checkbox
                            v-model="tabledataobj.assignWeek"
                            :label="week"
                            :value="key"
                            dense
                            hide-details
                            multiple
                            class="pr-2 mt-0"
                            :rules="rules.isRequired"
                          ></v-checkbox>
                        </v-col>
                      </v-row>
                    </v-tab-item>
                    <!-- 小时 -->
                    <v-tab-item>
                      <v-radio-group
                        v-model="tabledataobj.hourType"
                        row
                        class="mx-3 mt-1"
                        :rules="rules.isRequired"
                        dense
                        mandatory
                      >
                        <v-radio
                          v-for="(type, key) in hourTypes"
                          :key="`hour-${key}`"
                          :label="type"
                          :value="key"
                        ></v-radio>
                      </v-radio-group>
                      <template
                        v-if="tabledataobj.hourType === 1"
                      >
                        <v-autocomplete
                          clearable
                          :rules="rules.isRequired"
                          :label="`${$t('maintenancePlan.label.from')}*`"
                          class="mx-3"
                          v-model="tabledataobj.hourFrom"
                          :items="hours"
                          dense
                        >
                        </v-autocomplete>
                        <v-autocomplete
                          clearable
                          :rules="rules.isRequired"
                          :label="`${$t('maintenancePlan.label.to')}*`"
                          class="mx-3"
                          v-model="tabledataobj.hourTo"
                          :items="hours"
                          dense
                        >
                        </v-autocomplete>
                        <v-text-field
                          class="mx-3"
                          clearable
                          :rules="rules.interge"
                          :label="`${$t('maintenancePlan.label.step')}*`"
                          v-model="tabledataobj.hourStep"
                          dense
                        ></v-text-field>
                      </template>
                      <v-row
                        no-gutters
                        class="mx-3"
                        v-if="tabledataobj.hourType === 2"
                      >
                        <v-col
                          v-for="(hour, key) in hours"
                          :key="`assignHour-${key}`"
                          cols="auro"
                          class="flex-grow-0 flex-shrink-1"
                        >
                          <v-checkbox
                            v-model="tabledataobj.assignHour"
                            :label="`${hour}`"
                            :value="key"
                            dense
                            hide-details
                            multiple
                            class="pr-2 mt-0"
                            :rules="rules.isRequired"
                          ></v-checkbox>
                        </v-col>
                      </v-row>
                    </v-tab-item>
                  </v-tabs-items>
                  <div
                    class="ma-2 grey-thin-border rounded"
                  >
                    <div class="d-flex align-center ma-2">
                      <span>{{$t('maintenancePlan.label.cycleExample')}}</span>
                      <v-spacer></v-spacer>
                      <v-btn
                        small
                        color="success"
                        @click="handleExample"
                      >
                        {{$t('maintenancePlan.btn.example')}}
                      </v-btn>
                    </div>
                    <div style="height: 174px" class="pa-3 overflow-y-auto">
                      <div v-for="(example, key) in exampleList" :key="key">
                        <span>{{example}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <v-text-field
                  class="mt-1"
                  clearable
                  :rules="rules.interge6"
                  :label="`${$t('maintenancePlan.label.estimatedTime')}*`"
                  v-model="tabledataobj.estimatedWork"
                ></v-text-field>
              </template>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="my-1">
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          small
          text
          class="mr-2"
          @click="reset"
        >
          {{$t('btn.eliminate')}}
        </v-btn>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="handleSave"
        >
          {{$t('btn.save')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
  mapGetters,
} from 'vuex';

import later from '@breejs/later';
import cronvalidate from 'cron-validate';
// import selectableBomTree from '@/components/commonUI/SelectableBomTree.vue';
import TabLayout from '@/components/commonUI/TabLayout.vue';

export default {
  name: 'MaintenancePlanAddDialog',
  data() {
    return {
      tabledataobj: {
        planCode: '',
        planName: '',
        planType: '',
        maintenanceSchemaId: '',
        scheduleName: '',
        triggerCondition: '0', // 默认计次
        triggerCount: '',
        countParameter: '',
        estimatedWork: '',
      },
      dateTab: 0,
      bomErrMsg: '', // 设备bom选择错误提示
      exampleList: [], // 定时器示例列表
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // 月份选择
      days: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], // 日期选择
      // weeks: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], // 星期选择
      hours: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23,
      ], // 小时选择
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    // selectableBomTree,
    TabLayout,
  },
  computed: {
    ...mapState('maintenancePlan', [
      'bomTreeList',
      'maintenanceSchemaList',
      'planTypeList',
    ]),
    ...mapState('maintenancePlan', ['countParamList']),
    ...mapGetters('maintenancePlan', ['formatBomList']),
    weeks() {
      return [
        this.$t('maintenancePlan.label.Monday'),
        this.$t('maintenancePlan.label.Tuesday'),
        this.$t('maintenancePlan.label.Wednesday'),
        this.$t('maintenancePlan.label.Thursday'),
        this.$t('maintenancePlan.label.Friday'),
        this.$t('maintenancePlan.label.Saturday'),
        this.$t('maintenancePlan.label.Sunday'),
      ];
    },
    dialog: {
      get() {
        return this.addDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    rules() {
      return this.$getMaintenanceRules();
    },
    planTypes() {
      const { planTypeList } = this;
      if (planTypeList?.length) {
        return planTypeList.map((item) => {
          const obj = {
            value: item.dictValue,
            text: item.dictLabel,
          };
          return obj;
        });
      }
      return [];
    },
    filterSchemaList() {
      // 筛选已启用的运维方案
      return this.maintenanceSchemaList.filter((item) => item.status === '1');
    },
    monthTypes() {
      return [
        this.$t('maintenancePlan.label.everyMonth'),
        this.$t('maintenancePlan.label.monthInterval'),
        this.$t('maintenancePlan.label.assignMonth'),
      ];
    },
    dayTypes() {
      return [
        this.$t('maintenancePlan.label.everyDay'),
        this.$t('maintenancePlan.label.dayInterval'),
        this.$t('maintenancePlan.label.assignDay'),
        this.$t('maintenancePlan.label.assignWeek'),
      ];
    },
    hourTypes() {
      return [
        this.$t('maintenancePlan.label.everyHour'),
        this.$t('maintenancePlan.label.hourInterval'),
        this.$t('maintenancePlan.label.assignHour'),
      ];
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('maintenancePlan', [
      'getMaintenancePlanTypeList',
      'getMaintenanceSchemaList',
      'getBomTree',
      'getCountParamList',
      'addMaintenancePlan',
    ]),
    // 重新定义过滤器，支持多字段过滤
    filterFunc(item, queryText, itemText) {
      if (!queryText || !itemText) {
        return true;
      }
      if (!item.parameterName || !item.parameterDescription) {
        return false;
      }
      return itemText.toString().toLowerCase().indexOf(queryText.toLowerCase()) > -1
      || item.parameterName.toString().toLowerCase().indexOf(queryText.toLowerCase()) > -1
      || item.parameterDescription.toString().toLowerCase().indexOf(queryText.toLowerCase()) > -1;
    },
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      // if (!this.$refs.selectableBomTree.selectfloder.length) {
      //   this.bomErrMsg = this.$t('verification.isrequired');
      //   return;
      // }
      const {
        tabledataobj,
      } = this;
      const {
        planCode,
        planName,
        planType,
        maintenanceSchemaId,
        scheduleName,
        triggerCondition,
        triggerCount,
        countParameter,
        estimatedWork,
      } = tabledataobj;
      // const [selectBom] = this.$refs.selectableBomTree.selectfloder;
      let payload = {
        planCode,
        planName,
        planType,
        schemaId: maintenanceSchemaId,
        // maintenanceObject: selectBom?.bomId || 0,
        // partId: selectBom?.partId || 0,
        estimatedWork, // 预估工时，用于任务结束时间
        status: '0', // 默认不启用
      };
      // 基于时间
      if (planType === '0') {
        const express = this.generateCronExpress();
        payload = {
          ...payload,
          scheduleName, // 重复周期名称
          cronExpression: `0 ${express}`, // cron表达式
        };
      } else {
        // 基于状态
        payload = {
          ...payload,
          triggerCondition,
          triggerCount,
          countParameter, // 计时/次参数id
        };
      }
      const result = await this.addMaintenancePlan(payload);
      if (result) {
        this.$emit('getTableList');
        this.dialog = false;
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        // if (this.$refs.selectableBomTree) {
        //   this.$refs.selectableBomTree.selectfloder = [];
        // }
        this.$nextTick(() => {
          this.tabledataobj = {
            planCode: '',
            planName: '',
            planType: '',
            maintenanceSchemaId: '',
            scheduleName: '',
            triggerCondition: '0', // 默认计次
            triggerCount: '',
            countParameter: '',
            estimatedWork: '',
          };
          this.dateTab = 0;
          this.bomErrMsg = '';
        });
      }
    },
    handleChangeTab(tab) {
      this.dateTab = tab;
    },
    handleExample() {
      this.exampleList = [];
      const express = this.generateCronExpress();
      const cronresult = cronvalidate(express, {
        override: {
          useAliases: true,
        },
      });
      if (cronresult.isValid()) {
        const s = later.parse.cron(express, false);
        this.exampleList = later
          .schedule(s)
          .next(10)
          .map((item) => this.$getFormatDate(item, 'yyyy-MM-DD HH:mm:ss'));
      } else {
        // Cron表达式无效
        this.exampleList.push(this.$t('maintenancePlan.dialog.cronInvalid'));
      }
    },
    // 生成定时器代码
    generateCronExpress() {
      const {
        monthType,
        dayType,
        hourType,
        monthFrom,
        monthTo,
        monthStep,
        dayFrom,
        dayTo,
        dayStep,
        hourFrom,
        hourTo,
        hourStep,
        assignMonth,
        assignDay,
        assignWeek,
        assignHour,
      } = this.tabledataobj;
      let hour = '*';
      let day = '*';
      let month = '*';
      let week = '*';
      if (monthType === 1) {
        month = `${monthFrom}-${monthTo}/${monthStep}`;
      } else if (monthType === 2) {
        month = assignMonth.join(',');
      }
      if (dayType === 1) {
        day = `${dayFrom}-${dayTo}/${dayStep}`;
      } else if (dayType === 2) {
        day = assignDay.join(',');
      } else if (dayType === 3) {
        week = assignWeek
          .map((item) => Number(item) + 1)
          .join(',');
      }
      if (hourType === 1) {
        hour = `${hourFrom}-${hourTo}/${hourStep}`;
      } else if (hourType === 2) {
        hour = assignHour.join(',');
      }
      const express = `${0} ${hour} ${day} ${month} ${week}`;
      // console.log('express', express);
      return express;
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      // 查询计划类型字典表
      await this.getMaintenancePlanTypeList();
      // 查询维保方案列表
      await this.getMaintenanceSchemaList();
      // 获取设备bom树
      // await this.getBomTree();
      // 获取计时/计次参数列表
      await this.getCountParamList();
      this.reset();
      later.date.localTime();
    },
  },
};
</script>
