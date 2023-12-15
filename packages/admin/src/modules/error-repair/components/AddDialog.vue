<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'500px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            isNew
            ? $t('errorRepair.dialog.addErrorRepair')
            : $t('errorRepair.dialog.editErrorRepair')
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
            dense
          >
            <v-col cols="12">
              <!-- 处理报修时的操作类型 -->
              <v-radio-group
                v-model="tabledataobj.operateEvent"
                row
                dense
                :rules="rules.isRequired"
                v-if="!isNew"
              >
                <v-radio
                  :label="$t('errorRepair.label.DEL')"
                  :value="'DEL'"
                ></v-radio>
                <v-radio
                  :label="$t('errorRepair.label.CREATE_TASK')"
                  :value="'CREATE_TASK'"
                  class="ml-16"
                ></v-radio>
              </v-radio-group>
              <v-text-field
                :class="isNew ? 'mt-4' : 'mt-2'"
                clearable
                :rules="rules.name"
                :label="`${$t('errorRepair.table.name')}*`"
                v-model="tabledataobj.taskName"
                :counter="50"
              ></v-text-field>
              <v-autocomplete
                clearable
                :rules="rules.isRequired"
                :label="`${$t('errorRepair.label.errorCode')}*`"
                class="mt-3"
                v-model="tabledataobj.faultCode"
                :items="errorCodeList"
                item-text="alarmName"
                item-value="alarmCodeId"
                return-object
                v-if="tabledataobj.operateEvent === 'CREATE_TASK' || isNew"
                @change="errorCodeChange"
              >
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>{{item.alarmName}}</v-list-item-title>
                    <v-list-item-subtitle>{{item.bomName}}</v-list-item-subtitle>
                    <v-list-item-subtitle>{{item.parentBomName}}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
              <v-text-field
                class="mt-1"
                clearable
                disabled
                hide-details
                :label="`${$t('errorRepair.table.reportPosition')}*`"
                v-model="currentFalutPosition"
              ></v-text-field>
              <!-- <v-text-field
                :class="`${isMobile?'in':''}`"
                class="mt-6 customDateTimePicker"
                clearable
                :rules="rules.isRequired"
                style="flex:initial"
                type="datetime-local"
                :label="`${$t('maintenanceTask.table.scheduledStartDate')}*`"
                v-model="tabledataobj.planStartTime"
                v-if="!isNew && tabledataobj.operateEvent === 'CREATE_TASK'"
                :error-messages="dateCheckMsg"
              >
                <template v-slot:append="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    icon
                    color="primary"
                    @click="clickMe"
                  >
                    <v-icon>mdi-calendar</v-icon>
                  </v-btn>
                </template>
              </v-text-field> -->
              <!-- <v-text-field
                :class="`${isMobile?'in':''}`"
                append-icon="mdi-calendar"
                class="mt-2 customDateTimePicker"
                :rules="rules.isRequired"
                style="flex:initial"
                type="datetime-local"
                clearable
                :label="`${$t('maintenanceTask.table.scheduledCompletionDate')}*`"
                v-model="tabledataobj.planEndTime"
                v-if="!isNew && tabledataobj.operateEvent === 'CREATE_TASK'"
                :error-messages="dateCheckMsg"
              ></v-text-field> -->
              <div
                class="mt-5"
                v-if="!isNew && tabledataobj.operateEvent === 'CREATE_TASK'"
              >
                <div style="width: 100%;">
                  {{ $t('maintenanceTask.table.scheduledStartDate') }}*
                </div>
                <date-time-single-picker
                  clearable
                  :placeholder="`${$t('maintenanceTask.table.scheduledStartDate')}*`"
                  v-model="tabledataobj.planStartTime"
                  type="datetime"
                  editable
                  class="mt-1"
                  style="width: 100%;"
                />
              </div>
              <div
                class="mt-5"
                v-if="!isNew && tabledataobj.operateEvent === 'CREATE_TASK'"
              >
                <div style="width: 100%;">
                  {{ $t('maintenanceTask.table.scheduledCompletionDate') }}*
                </div>
                <date-time-single-picker
                  clearable
                  :placeholder="`${$t('maintenanceTask.table.scheduledCompletionDate')}*`"
                  v-model="tabledataobj.planEndTime"
                  type="datetime"
                  editable
                  class="mt-1"
                  style="width: 100%;"
                />
              </div>
              <v-textarea
                class="mt-5"
                style="flex:initial"
                outlined
                :label="`${$t('errorRepair.table.description')}`"
                v-model="tabledataobj.faultPhenomenon"
                :auto-grow="false"
                :rows="tabledataobj.operateEvent === 'CREATE_TASK' ? '8': '10'"
                :rules="rules.over500"
                :counter="500"
              ></v-textarea>
            </v-col>
            <!-- <v-col cols="6">
              <selectable-bom-tree
                class="mt-3"
                ref="selectableBomTree"
                :title="$t('errorRepair.table.reportPosition')"
                :height="tabledataobj.operateEvent === 'CREATE_TASK'?595:456"
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
              <div class="mx-4 error--text">{{bomErrMsg}}</div>
            </v-col> -->
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
          v-if="isNew"
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

import selectableBomTree from '@/components/commonUI/SelectableBomTree.vue';
import DateTimeSinglePicker from '@/components/commonUI/DateTimeSinglePicker.vue';

export default {
  name: 'ErrorRepairAddDialog',
  data() {
    return {
      tabledataobj: {
        operateEvent: 'CREATE_TASK',
      },
      currentFalutPosition: '',
      // bomErrMsg: '',
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    isNew: {
      type: Boolean,
      required: true,
    },
    selectedItem: {
      type: Object,
      required: false,
    },
  },
  components: {
    selectableBomTree,
    DateTimeSinglePicker,
  },
  computed: {
    ...mapState('errorRepair', ['bomTreeList', 'errorCodeList']),
    ...mapGetters('errorRepair', ['formatBomList']),
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
    // dateCheckMsg: {
    //   set() {
    //   },
    //   get() {
    //     const { planStartTime, planEndTime } = this.tabledataobj;
    //     if (planStartTime && planEndTime) {
    //       const fromdate = new Date(planStartTime);
    //       const todate = new Date(planEndTime);
    //       if (fromdate.getTime() > todate.getTime()) {
    //         return '结束日期不可小于开始日期。';
    //       }
    //     }
    //     return '';
    //   },
    // },
  },
  mounted() {
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('errorRepair', [
      'getBomTree',
      'getErrorCodeList',
      'addErrorRepair',
      'editErrorRepair',
    ]),
    // isMobile() {
    //   const { userAgentData } = navigator;
    //   return !userAgentData;
    // }, // 是否为移动端
    errorCodeChange(faultCodeObj) {
      this.currentFalutPosition = faultCodeObj?.bomName;
    },
    async handleSave() {
      if (!this.$refs.form.validate()) {
      // if (!this.$refs.form.validate() || this.dateCheckMsg) {
        return;
      }
      const {
        isNew,
        selectedItem,
        tabledataobj,
      } = this;
      const {
        operateEvent,
        taskName,
        faultPhenomenon,
        faultCode,
        planStartTime,
        planEndTime,
      } = tabledataobj;
      // console.log(planStartTime, planEndTime, 'time');
      if (!isNew && operateEvent === 'CREATE_TASK') {
        if (!planStartTime || !planEndTime) {
          this.setAlert({
            show: true,
            type: 'error',
            message: this.$t('errorRepair.dialog.planTimeEmpty'),
          });
          return;
        }
        if (planStartTime && planEndTime) {
          const fromdate = new Date(planStartTime);
          const todate = new Date(planEndTime);
          if (fromdate.getTime() > todate.getTime()) {
            this.setAlert({
              show: true,
              type: 'error',
              message: this.$t('errorRepair.dialog.planEndTimeEarlier'),
            });
            return;
          }
        }
      }
      // if (!this.$refs.selectableBomTree.selectfloder.length) {
      //   this.bomErrMsg = this.$t('verification.isrequired');
      //   return;
      // }
      // const [selectedBom] = this.$refs.selectableBomTree.selectfloder;
      let payload = {
        taskName,
        faultPhenomenon: faultPhenomenon || '', // 故障现象
      };
      let result = null;
      if (isNew) {
        payload = {
          ...payload,
          faultCodeId: faultCode?.alarmCodeId || 0, // 故障代码id
          faultLocation: faultCode?.bomId || 0, // 故障位置
          status: '0', // 新增时，状态为未处理
        };
        result = await this.addErrorRepair(payload);
      } else {
        if (operateEvent === 'CREATE_TASK') {
          payload = {
            ...payload,
            id: selectedItem?.id || 0,
            faultCodeId: faultCode?.alarmCodeId || 0, // 故障代码id
            faultLocation: faultCode?.bomId || 0, // 故障位置
            planStartTime: this.$getFormatDate(planStartTime, 'yyyy-MM-DD HH:mm:ss'),
            planEndTime: this.$getFormatDate(planEndTime, 'yyyy-MM-DD HH:mm:ss'),
            status: '1', // 生成维修任务时，状态为已处理，否则为已取消
          };
        } else {
          payload = {
            ...payload,
            id: selectedItem?.id || 0,
            status: '2', // 生成维修任务时，状态为已处理，否则为已取消
          };
        }
        payload = {
          ...payload,
          id: selectedItem?.id || 0,
          planStartTime: this.$getFormatDate(planStartTime, 'yyyy-MM-DD HH:mm:ss'),
          planEndTime: this.$getFormatDate(planEndTime, 'yyyy-MM-DD HH:mm:ss'),
          status: operateEvent === 'CREATE_TASK' ? '1' : '2', // 生成维修任务时，状态为已处理，否则为已取消
        };
        result = await this.editErrorRepair(payload);
      }
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
            operateEvent: 'CREATE_TASK',
          };
          // this.bomErrMsg = '';
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      // await this.getBomTree();
      // 查询故障代码
      await this.getErrorCodeList();
      const { selectedItem, isNew } = this;
      if (isNew) {
        this.reset();
        return;
      }
      const {
        taskName,
        faultCodeId,
        faultPhenomenon,
      } = selectedItem;
      const selectedFault = this.errorCodeList.find((item) => item.alarmCodeId === faultCodeId);
      // console.log(selectedFault, 'selectedFault');
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          taskName,
          faultCode: selectedFault,
          faultPhenomenon,
        };
        this.errorCodeChange(selectedFault);
      });
      // if (selectedItem.faultLocation) {
      //   this.$refs.selectableBomTree.selectfloder = [selectedItem.faultLocation];
      // }
    },
  },
};
</script>

<style scoped lang="scss">
.in {
  // ios端 Safari type 是 datetime-local 的 input 不显示 ::after
  ::v-deep input[type="datetime-local"]::after {
    display: none !important;
  }
  // ios端 Safari 默认样式修改
  ::v-deep input::-webkit-date-and-time-value {
    text-align: start !important;
  }
}
.customDateTimePicker {
  ::v-deep() .v-input__append-inner {
    position: relative;
    width: 24px;
    height: 28px;
  }
}
</style>
