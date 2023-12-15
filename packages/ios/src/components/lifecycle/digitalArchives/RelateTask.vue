<template>
  <div
    class="mt-2"
    ref="taskList"
    :style="`height: ${contentHeight}px;overflow: auto;`"
  >
    <div
      v-if="maintenanceTasks.length > 0"
      class="topBtnBar"
    >
      <v-row style="width: 100%;" dense>
        <v-col
          :cols="6"
          class="bluebtn"
          align="center"
        >
          <v-btn>
            {{ $t('digitalarchives.maintenance') }}
          </v-btn>
        </v-col>
        <v-col :cols="6" class="bluebtn" align="center">
          <v-btn>
            {{ $t('digitalarchives.repair') }}
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div
      v-if="maintenanceTasks.length > 0"
      class="customTimeline"
    >
      <v-timeline
        v-for="(yearTask, index) in maintenanceTasks"
        :key="`year_group_${index}`"
      >
        <v-timeline-item
          v-for="(task, childIndex) in yearTask.tasks"
          :key="`task_${childIndex}`"
          :color="getDotColor(task)"
          fill-dot
          :small="!task.isfirst"
          :left="task.taskGroup === '0'"
          :right="task.taskGroup === '1'"
        >
          <template v-slot:icon>
            <span
              v-if="task.isfirst"
            >{{yearTask.year}}</span>
          </template>
          <template v-slot:opposite>
            <span
              v-if="!task.isfirst"
              style="font-size: 16px;font-weight: 500;"
              :class="`${task.taskGroup === '1' ? 'warning--text' : 'secondary--text'}`"
            >{{ `${task.year}-${task.month}`}}</span>
          </template>
          <!-- 左侧和右侧的卡片布局不同 -->
          <div v-if="getCardAlign(task) === true">
            <v-card
              v-if="!task.isfirst"
              class="elevation-2"
            >
              <v-card-text>
                <div>
                  <v-row dense>
                    <v-col :cols="5" align-self="start">
                      <div style="text-align: left;">
                        <v-chip
                          style="max-width: 24px;"
                          small
                          class="text-truncate"
                          color="info"
                          @click="gotodetail(task)"
                        >
                          <span class="icon--text icontext">...</span>
                        </v-chip>
                        <v-chip
                          style="max-width: 80px;"
                          small
                          class="text-truncate ml-2"
                          color="secondary"
                        >
                          <span
                            class="primary--text"
                            v-text="getTaskType(task)"
                          >
                          </span>
                        </v-chip>
                      </div>
                    </v-col>
                    <v-col :cols="7">
                      <div
                        class="text-truncate"
                        style="text-align: right;color: rgba(255,255,255,0.7);"
                      >
                        {{ task.taskNo }}
                      </div>
                      <div
                        class="text-truncate icon--text"
                        style="text-align: right;"
                      >{{ task.taskName }}</div>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col :cols="12">
                      <div
                        class="primary--text"
                        style="font-size: 12px;text-align: right;"
                      >
                        {{ task.planStartTime }}
                        {{ $t('digitalarchives.to') }}
                        {{ task.planEndTime }}
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-card>
          </div>
          <div v-else>
            <v-card
              v-if="!task.isfirst"
              class="elevation-2"
            >
              <v-card-text>
                <div>
                  <v-row dense>
                    <v-col :cols="7">
                      <div
                        class="text-truncate"
                        style="text-align: left;color: rgba(255,255,255,0.7);"
                      >
                        {{ task.taskNo }}
                      </div>
                      <div
                        class="text-truncate icon--text"
                        style="text-align: left;"
                      >{{ task.taskName }}</div>
                    </v-col>
                    <v-col :cols="3">
                      <v-chip
                        style="max-width: 80px;float: right;"
                        small
                        class="text-truncate ml-2"
                        color="secondary"
                      >
                        <span
                          class="primary--text"
                          v-text="getTaskType(task)"
                        >
                        </span>
                      </v-chip>
                    </v-col>
                    <v-col :cols="2">
                      <v-chip
                        style="max-width: 24px;"
                        small
                        class="text-truncate"
                        color="info"
                        @click="gotodetail(task)"
                      >
                        <span class="icon--text icontext">...</span>
                      </v-chip>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col :cols="12">
                      <div
                        class="primary--text"
                        style="font-size: 12px;text-align: left;"
                      >
                        {{ task.planStartTime }}
                        {{ $t('digitalarchives.to') }}
                        {{ task.planEndTime }}
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </v-timeline-item>
      </v-timeline>
    </div>
    <repair-task-dialog />
    <task-dialog />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import moment from 'moment';
import RepairTaskDialog from '../../performanceOptimization/maintenanceTask/repairTaskDialog.vue';
import TaskDialog from '../../performanceOptimization/maintenanceTask/maintenanceTaskDialog.vue';

export default {
  name: 'RelateTask',
  data() {
    return {
      clientheight: document.body.clientHeight,
      loading: false,
      moment,
    };
  },
  components: {
    RepairTaskDialog,
    TaskDialog,
  },
  props: {
    height: {
      type: Number,
      required: true,
    },
    details: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('digitalArchives', ['deviceDetail', 'taskList']),
    contentHeight() {
      return this.height - 10;
    },
    // 模块，区分设备层二级bom层
    module() {
      if (this.details?.bomLevel === '0') {
        return 'DeviceDoc';
      }
      if (this.details?.bomLevel === '2') {
        return 'partManagementDetail';
      }
      return '';
    },
    // bomId或设备id
    bomId() {
      if (this.module === 'DeviceDoc') {
        return Number(this.deviceDetail.deviceId);
      }
      if (this.module === 'partManagementDetail') {
        if (this.details?.bomId) {
          return Number(this.details.bomId);
        }
      }
      return '';
    },
    maintenanceTasks() {
      let result = [];
      if (this.taskList?.length) {
        const list = this.taskList.map((item) => {
          const obj = {
            ...item,
            year: this.getYear(item.planStartTime),
            month: this.getMonth(item.planStartTime),
          };
          return obj;
        });
        result = this.formatTaskListByYear(list);
      }
      return result;
    },
  },
  watch: {
    bomId: {
      handler(val) {
        if (val) {
          this.init();
        } else {
          this.setTaskList([]);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      // this.$refs.taskList.addEventListener('scroll', this.onScroll);
    });
  },
  methods: {
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapMutations('maintenanceTask', [
      'setMaintenanceTaskDialog',
      'setRepairTaskDialog',
      'setTaskInfo',
    ]),
    ...mapMutations('digitalArchives', ['setTaskList']),
    ...mapActions('digitalArchives', ['getTaskList']),
    // 滚动事件触发下拉加载
    // onScroll(e) {
    //   const realNode = e.srcElement;
    //   const taskBOM = this.$refs.taskList.querySelector('.customTimeline');
    //   // 1386 = 10条任务所占元素高度，pageSize默认10
    //   if (taskBOM.offsetHeight <= realNode.scrollTop + 1386 + 20) {
    //     this.page += 1;
    //     this.getMaintenanceTaskList();
    //   }
    // },
    // 获取运维任务列表
    async init() {
      // this.page = 1;
      await this.getTaskList({
        module: this.module,
        bomId: this.bomId,
      });
    },
    getYear(date) {
      return moment(date).format('YYYY');
    },
    getMonth(date) {
      return moment(date).format('MM');
    },
    formatTaskListByYear(tasks) {
      const yearArr = tasks.map((item) => item.year);
      const years = [...new Set(yearArr)];
      const result = [];
      for (let i = 0; i < years.length; i += 1) {
        const year = years[i];
        const filtertasks = tasks.filter((item) => item.year === year);
        const firstNode = [{
          year,
          isfirst: true,
        }];
        const obj = {
          year,
          tasks: firstNode.concat(filtertasks),
        };
        result.push(obj);
      }
      return result;
    },
    getCardAlign(task) {
      if (task.taskGroup === '1') {
        return false;
      }
      return true;
    },
    getTaskType(task) {
      const type = task.taskGroup;
      if (type === '0') {
        return this.$t('digitalarchives.maintenance');
      }
      if (type === '1') {
        return this.$t('digitalarchives.repair');
      }
      return '';
    },
    getDotColor(task) {
      if (task.isfirst) {
        return 'purple';
      }
      if (task.taskGroup === '1') {
        return 'warning';
      }
      return 'secondary';
    },
    gotodetail(item) {
      this.setTaskInfo(item);
      // 维保任务详情
      if (item.taskGroup === '0') {
        this.setMaintenanceTaskDialog(true);
      } else {
        // 维修任务详情
        this.setRepairTaskDialog(true);
      }
    },
  },
};
</script>

<style scoped lang="scss">
  .topBtnBar {
    height: 44px;
  }

  .icontext {
    position: relative;
    left: -6px;
    top: -4px;
    font-size: 16px;
  }

  .bluebtn{
    ::v-deep() .v-btn {
      background-color: rgba(0, 0, 0, 0.3);
      color: #34dbfc;
      border: 1px solid rgba(24, 122, 205, 0.88);
      border-radius: 18px;
      height: 35px;
    }
  }

  .customTimeline {
    margin-top: -64px;
    ::v-deep() .v-card {
      background: rgba(0, 255, 255, 0.2)!important;
    }
  }

</style>
