<template>
  <div class="pr-2">
    <div
      class=" primary--text font-weight-bold bluetitlepart mt-8"
    >
      <div class="title" style="width: 102px">
        报警详情
      </div>
      <!-- alarmDetail: {{ alarmDetail }} -->
      <!-- alarmObj: {{ alarmObj }} -->
      <div class="bgImg">
        <img
          :src="require('@/assets/icons/img/darkbluesquare-short.svg')"
          alt=""
        />
      </div>
      <div class="cardtop" style="left: 115px">
        <div class="darkbluerectangle"></div>
        <div class="lightbluerectangle"></div>
      </div>
    </div>
    <v-card
      class="bluecard bluecard-decoration-5 rounded-xl"
      rounded
      :style="`height: ${cardHeight}px;overflow:hidden;`"
    >
      <v-card-text
        :style="`height: ${contentHeight}px;overflow-y: auto;`"
        class="overflow-y-auto px-4 pt-8 pb-0"
      >
        <v-row>
          <v-col :cols="5">
            <div>
              <span class="text-subtitle-1 primary--text">报警等级</span>
            </div>
            <div class="d-flex align-center">
              <img v-if="this.alarmObj?.alarmDge.toLowerCase() === 'error'"
                src="@/assets/icons/img/fault-diagnosis-error.svg"
                alt="" height="25px">
              <img v-else-if="this.alarmObj?.alarmDge === 'warning'"
                src="@/assets/icons/img/fault-diagnosis-warning.svg"
                alt="" height="25px">
              <img v-else src=""
                alt="" height="25px">
              <span v-if="this.alarmObj?.alarmDge.toLowerCase() === 'error'"
                class="error--text font-weight-black" style="font-size: 16px;">报警</span>
              <span v-else-if="this.alarmObj?.alarmDge === 'warning'"
                class="warning--text font-weight-black" style="font-size: 16px;">预警</span>
              <span v-else
                class="font-weight-black" style="font-size: 20px;"></span>
            </div>
          </v-col>
          <v-col :cols="7">
            <div>
              <span class="text-subtitle-1 primary--text">报警时间</span>
            </div>
            <div>
              <span style="font-size: 16px;">{{ alarmObj?.alarmTime }}</span>
            </div>
          </v-col>
          <v-col :cols="5" class="pa-0 px-4">
            <div>
              <span class="text-subtitle-1 primary--text">故障代码</span>
            </div>
            <div>
              <span style="font-size: 16px;">{{ alarmObj?.alarmCode }}</span>
            </div>
          </v-col>
          <v-col :cols="7" class="pa-0 px-4">
            <div>
              <span class="text-subtitle-1 primary--text">故障内容</span>
            </div>
            <div>
              <span style="font-size: 16px;">{{ alarmObj?.alarmContent }}</span>
            </div>
          </v-col>
          <v-col :cols="12" class="pa-0 px-4">
            <div>
              <span class="text-subtitle-1 primary--text">故障描述</span>
            </div>
            <div>
              <span style="font-size: 16px;">{{ alarmObj?.alarmTxt }}</span>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="mr-2" outlined color="primary" rounded
          @click="isShowCancelDialog = true"
        >已处理</v-btn>
        <v-btn class="mr-2" outlined color="primary" rounded
          @click="isShowRepairDialog = true"
        >提交维修任务</v-btn>
      </v-card-actions>
    </v-card>
    <SubmitRepairDialog
      :addDialog="isShowRepairDialog"
      @closeDialog="isShowRepairDialog = false"
      @showTaskExecuteDialog="showTaskExecuteDialog"
    ></SubmitRepairDialog>
    <CancelDialog
      :isShow="isShowCancelDialog"
      @closeDialog="isShowCancelDialog = false"
    ></CancelDialog>
    <!-- <TaskExecuteDialog
      :addDialog="isShowTaskExecuteDialog"
      @closeDialog="isShowTaskExecuteDialog = false"
    ></TaskExecuteDialog> -->
    <RepairTaskDialog />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import RepairTaskDialog from '@/components/performanceOptimization/maintenanceTask/repairTaskDialog.vue';
import SubmitRepairDialog from './SubmitRepairDialog.vue';
import CancelDialog from './CancelDialog.vue';
// import TaskExecuteDialog from './TaskExecuteDialog.vue';

export default {
  name: 'WarningDetailCard',
  data() {
    return {
      isShowCancelDialog: false,
      isShowTaskExecuteDialog: false,
    };
  },
  props: {
    height: {
      type: Number,
      required: true,
    },
  },
  components: {
    SubmitRepairDialog,
    CancelDialog,
    // TaskExecuteDialog,
    RepairTaskDialog,
  },
  computed: {
    ...mapState('faultDiagnosis', [
      'alarmDetail',
    ]),
    cardHeight() {
      return this.height - 26;
    },
    contentHeight() {
      return this.cardHeight - 55;
    },
    alarmObj() {
      const alarmId = Number(this.$route.query.alarmId);
      const obj = this.alarmDetail.find((item) => item.alarmId === alarmId) || {};
      this.setAlarmObj(obj);
      return obj;
    },
    isShowRepairDialog: {
      get() {
        return this.$store.state.faultDiagnosis.isShowRepairDialog;
      },
      set(val) {
        this.$store.commit('faultDiagnosis/SET_ISSHOWREPAIRDIALOG', val);
      },
    },
  },
  methods: {
    ...mapMutations('faultDiagnosis', [
      'setAlarmObj',
    ]),
    ...mapMutations('maintenanceTask', ['setRepairTaskDialog']),
    showTaskExecuteDialog() {
      this.setRepairTaskDialog(true);
    },
  },
};
</script>
