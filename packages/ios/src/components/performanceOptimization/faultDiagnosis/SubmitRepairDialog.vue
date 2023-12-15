<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'900px'"
    transition="dialog-transition"
  >
    <div class="app-dialog pa-1">
      <v-card class="app-dialog pa-1">
        <div
          v-for="i in 5"
          :key="i"
          :class="`rectangle-${i}`"
        ></div>
        <v-card-title primary-title>
          <div>
            <span>{{$t('maintenanceTask.submitMaintenanceTask')}}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon small @click="dialog = false" color="primary">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <!-- 标题分割线 -->
        <div class="d-flex align-center px-5">
            <img
              :src="require('@/assets/icons/img/dialog-circle-big-dark.svg')"
              alt=""
              class="mr-2"
            />
            <img
              :src="require('@/assets/icons/img/dialog-circle-small-dark.svg')"
              alt=""
            />
            <v-divider></v-divider>
            <img
              :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
              alt=""
              class="mt-2 mr-1"
            />
            <img
              :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
              alt=""
              class="mt-2 mr-1"
            />
            <img
              :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
              alt=""
              class="mt-2 mr-1"
            />
        </div>
        <v-card-title primary-title class="d-flex">
          <v-btn
            style="position: relative;" class="pa-0"
            :width="`${(strLen($t('maintenanceTask.taskContent')) - 6) > 0
              ? 102 + (strLen($t('maintenanceTask.taskContent')) - 6) * 15
              : 102}px`"
          >
            <img
              src="@/assets/icons/img/fault-diagnosis/selected_btn.svg"
              alt=""
              :width="`${(strLen($t('maintenanceTask.taskContent')) - 6) > 0
                ? 102 + (strLen($t('maintenanceTask.taskContent')) - 6) * 15
                : 102}px`"
              height="35px"
            >
            <span
              class="text-h6" style="position: absolute;left: 16px;color: var(--v-primary-base);">
              {{$t('maintenanceTask.taskContent')}}
            </span>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn class="btn mr-2" rounded outlined style="border: 1px solid #18fefe;
          color: var(--v-primary-base);"
            @click="saveAndExecuteTask"
          >{{$t('maintenanceTask.saveAndsubmit')}}</v-btn>
          <v-btn class="btn" rounded outlined style="border: 1px solid #18fefe;
          color: var(--v-primary-base);"
            @click="saveTask"
          >{{$t('common.submitbtn')}}</v-btn>
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
              <v-col cols="6">
                <SelectableBomTree
                  class="mx-3 mt-1"
                  ref="selectableBomTree"
                  :title="$t('maintenanceTask.faultsite')"
                  :height="382"
                  :isMultiple="false"
                  :isErr="!!bomErrMsg"
                  :bomList="bomListFormatted"
                  itemChildren="childrenBomList"
                  itemKey="bomId"
                  itemText="bomName"
                  alarmDisabledKey="isParent"
                  @handleActive="handleResetAlarmCode"
                ></SelectableBomTree>
                <div class="mx-4 error--text">{{bomErrMsg}}</div>
              </v-col>
              <v-col cols="6" >
                <span class="mx-3">{{$t('maintenanceTask.taskname')}}</span>
                <v-text-field
                  class="mx-3 mt-1 blueinput"
                  outlined
                  clearable
                  :rules="rules.limit50"
                  v-model="tabledataobj.taskName"
                  dense
                  ></v-text-field>
                <span class="mx-3">{{$t('maintenanceTask.alarmCode')}}</span>
                <v-autocomplete
                  clearable
                  outlined
                  class="mx-3 mt-1 blueinput"
                  v-model="tabledataobj.faultCodeId"
                  :items="errorCodeItems"
                  item-text="alarmCode"
                  item-value="alarmCodeId"
                  @change="changeErrorCode(tabledataobj.faultCodeId)"
                  dense
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title>{{item.alarmCode}}</v-list-item-title>
                      <v-list-item-subtitle>{{item.alarmName}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
                <span class="mx-3">{{$t('maintenanceTask.faultPhenomenon')}}</span>
                <v-textarea
                  class="mx-3 mt-3 blueinput"
                  style="flex:initial"
                  clearable
                  outlined
                  v-model="tabledataobj.faultPhenomenon"
                  auto-grow
                  height="200px"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
  mapGetters,
} from 'vuex';

import SelectableBomTree from '@/components/commonUI/SelectableBomTree.vue';

export default {
  name: 'SubmitRepairDialog',
  data() {
    return {
      tabledataobj: {
      },
      bomErrMsg: '',
      bomListFormatted: [],
      openall: false,
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    defaultBomId: {
      type: [Number, String],
      required: false,
    }, // 默认选中的bom
    alarmCodeId: {
      type: [Number, String],
      required: false,
    }, // 默认选中的alarmCode
  },
  components: {
    SelectableBomTree,
  },
  computed: {
    ...mapState('faultDiagnosis', ['errorCodeList']),
    ...mapGetters('faultDiagnosis', ['formatBomList']),
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
      return {
        limit50: [
          (v) => !!v || this.$t('verification.isrequired'),
          (v) => v?.length <= 50 || this.$t('verification.lengthlessthan', { num: 50 }),
        ],
        isRequired: [(v) => !!v || this.$t('verification.isrequired')],
      };
    },
    // 筛选启用的故障代码
    errorCodeItems() {
      if (this.errorCodeList?.length) {
        return this.errorCodeList;
      }
      return [];
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('maintenanceTask', ['setTaskInfo', 'setRepairTaskDialog']),
    ...mapActions('faultDiagnosis', ['getErrorCodeList', 'getFormatBomList', 'addRepairTask', 'getRepairTask']),
    handleResetAlarmCode() {
      if (!this.$refs.selectableBomTree.selectfloder.length) {
        return;
      }
      const { bomId } = this.$refs.selectableBomTree.selectfloder[0];
      const { faultCodeId } = this.tabledataobj;
      const errorCodeObj = this.errorCodeItems?.find((item) => item?.alarmCodeId === faultCodeId);
      if (errorCodeObj && errorCodeObj.bomId !== bomId) {
        this.tabledataobj.faultCodeId = null;
      }
    },
    getPayload(status) {
      if (!this.$refs.selectableBomTree.selectfloder.length) {
        this.bomErrMsg = this.$t('verification.isrequired');
        return false;
      }
      if (!this.$refs.form.validate()) {
        return false;
      }
      const {
        tabledataobj,
      } = this;
      const {
        taskName,
        faultCodeId,
        faultPhenomenon,
      } = tabledataobj;
      const faultLocation = this.$refs.selectableBomTree.selectfloder[0].bomId;
      const planStartTime = new Date().getTime();
      const planEndTime = new Date().getTime() + 1 * 60 * 60 * 1000;
      const payload = {
        taskName,
        faultCodeId,
        faultPhenomenon,
        faultLocation,
        status,
        planStartTime: this.$getFormatDate(planStartTime, 'yyyy-MM-DD HH:mm:ss'),
        planEndTime: this.$getFormatDate(planEndTime, 'yyyy-MM-DD HH:mm:ss'),
      };
      return payload;
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.tabledataobj = {};
          this.bomErrMsg = '';
          this.$refs.selectableBomTree.selectfloder = [];
        });
      }
    },

    async saveTask() {
      const payload = this.getPayload('0');
      if (!payload) {
        return;
      }
      const isAdded = await this.addRepairTask(payload);
      if (isAdded) {
        this.reset();
        this.$emit('closeDialog');
      }
    },
    async saveAndExecuteTask() {
      const payload = this.getPayload('1');
      if (!payload) {
        return;
      }
      const isAdded = await this.addRepairTask(payload);
      if (isAdded) {
        // 查询id 任务详情
        const taskInfo = await this.getRepairTask(isAdded.id);
        this.setTaskInfo(taskInfo);
        this.setRepairTaskDialog(true);
        this.reset();
        this.$emit('closeDialog');
      }
    },
    changeErrorCode(alarmCodeId) {
      // faultCodeId 数据库唯一字段
      const errorCodeObj = this.errorCodeItems?.find((item) => item?.alarmCodeId === alarmCodeId);
      this.$refs.selectableBomTree.selectfloder = [
        {
          bomId: errorCodeObj.bomId,
        },
      ];
    },
    strLen(str) {
      let count = 0;
      for (let i = 0; i < str.length; i += 1) {
        count += str.charCodeAt(i) <= 128 ? 1 : 2;
      }
      return count;
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      // 获取故障代码列表
      await this.getErrorCodeList();
      this.bomListFormatted = await this.getFormatBomList();
      // 若存在默认bom则bom树默认选中
      if (Number(this.defaultBomId)) {
        this.$refs.selectableBomTree.selectfloder = [
          {
            bomId: Number(this.defaultBomId),
          },
        ];
      }
      // 默认故障代码
      if (Number(this.alarmCodeId)) {
        this.tabledataobj.faultCodeId = Number(this.alarmCodeId);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.dialogcard {
  background-color: #000000;
  overflow: hidden;
  border: 1px solid #18fefe;
  border-radius: 8px;
  .title1 {
    font-size: 25px;
    font-family: "Arial", sans-serif;
  }
}

.btn {
  background-color: #262b55;
}

</style>
