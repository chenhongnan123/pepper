<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :min-width="'900px'"
    :max-width="'1200px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;" class="dialogcard bluecard-decoration-5">
      <div
        v-for="i in 5"
        :key="i"
        :class="`rectangle-${i}`"
      ></div>
      <v-card-title primary-title>
        <span>任务名称</span>
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
        <v-btn style="position: relative;" class="pa-0"
          @click="clickTabBtn(1)"
        >
          <img src="@/assets/icons/img/fault-diagnosis/selected_btn.svg" alt="">
          <span style="position: absolute;left: 30px;color: var(--v-primary-base);">
            报修内容
          </span>
        </v-btn>
        <v-btn style="position: relative;" class="pa-0 ml-2"
          @click="clickTabBtn(2)"
        >
          <img src="@/assets/icons/img/fault-diagnosis/selected_btn.svg" alt="">
          <span style="position: absolute;left: 30px;color: var(--v-primary-base);">
            任务内容
          </span>
        </v-btn>
        <v-btn style="position: relative;" class="pa-0 ml-2"
          @click="clickTabBtn(3)"
        >
          <img src="@/assets/icons/img/fault-diagnosis/selected_btn.svg" alt="">
          <span style="position: absolute;left: 20px;color: var(--v-primary-base);">
            零件更换
          </span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn class="btn" rounded outlined style="border: 1px solid #bb7b6b;
          background-color: #bb7b6b;"
          @click="handleCancelTask"
        >取消任务</v-btn>
        <v-btn class="btn ml-2" rounded outlined style="border: 1px solid #0a5fad;
          background-color: #0a5fad;"
          v-if="!isStartTask"
          @click="handleStartTask"
        >开始任务</v-btn>
        <v-btn class="btn ml-2" rounded outlined style="border: 1px solid #0a5fad;
          background-color: #0a5fad;"
          v-else
          @click="handleCompleteTask"
        >完成任务</v-btn>
        <v-btn class="btn ml-2" rounded outlined style="border: 1px solid #18fefe;"
        >
        <v-icon>mdi-plus</v-icon>
        更换零件</v-btn>
        <v-btn class="btn ml-2" rounded outlined style="border: 1px solid #18fefe;"
        >
        <v-icon>mdi-school-outline</v-icon>
        专家知识</v-btn>
        <v-btn class="btn ml-2" rounded outlined style="border: 1px solid #18fefe;"
        >保存</v-btn>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-row
            v-if="tab === 1"
            justify="center"
            dense
            style="min-height: 570px;"
          >
            <v-col cols="6">
              <!-- <SelectableBomTree
                class="mx-3 mt-3"
                ref="selectableBomTree"
                :title="'故障位置'"
                :height="460"
                :isMultiple="false"
                :isErr="!!bomErrMsg"
                :bomList="bomListFormatted"
                :isSelectable="true"
                :activatable="false"
              ></SelectableBomTree> -->
              <!-- <div class="mx-4 error--text">{{bomErrMsg}}</div> -->
              <div>
                <v-text-field
                  class="mx-3 mt-1"
                  outlined
                  clearable
                  disabled
                  :rules="rules.limit50"
                  v-model="bomObj.productName"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="6" >
              <span class="mx-3">任务名称</span>
              <v-text-field
                class="mx-3 mt-1"
                outlined
                  disabled
                clearable
                :rules="rules.limit50"
                v-model="newTaskObj.taskName"
                ></v-text-field>
              <span class="mx-3">故障代码</span>
              <v-autocomplete
                clearable
                  disabled
                outlined
                :rules="rules.isRequired"
                class="mx-3 mt-1"
                v-model="newTaskObj.defectCode"
                :items="errorCodeList"
                item-text="defectContent"
                item-value="defectCode"
                @change="changeErrorCode(tabledataobj.defectCode)"
              >
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>{{item.defectCode}}</v-list-item-title>
                    <v-list-item-subtitle>{{item.defectContent}}</v-list-item-subtitle>
                    <v-list-item-subtitle>{{item.description}}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
              <span class="mx-3">故障现象</span>
              <v-textarea
                class="mx-3 mt-3"
                style="flex:initial"
                  disabled
                clearable
                outlined
                v-model="newTaskObj.faultPhenomenon"
                auto-grow
                height="200px"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row
            v-if="tab === 2"
            class="pt-4"
            style="min-height: 570px;"
          >
            <v-col cols="12">
              <v-row no-gutters>
                <v-col cols="6">
                <v-textarea
                  class="mx-3 mt-3"
                  style="flex:initial"
                  clearable
                  :disabled="!isStartTask"
                  outlined
                  v-model="newTaskObj.faultPhenomenon"
                  auto-grow
                  height="300px"
                ></v-textarea>
                </v-col>
                <v-col cols="6">
                <v-textarea
                  class="mx-3 mt-3"
                  style="flex:initial"
                  clearable
                  :disabled="!isStartTask"
                  outlined
                  v-model="newTaskObj.faultPhenomenon"
                  auto-grow
                  height="300px"
                ></v-textarea>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-textarea
                  class="mx-3 mt-3"
                  style="flex:initial;width: 100%;"
                  clearable
                  :disabled="!isStartTask"
                  outlined
                  v-model="newTaskObj.faultPhenomenon"
                  auto-grow
                  height="150px"
                ></v-textarea>
              </v-row>
            </v-col>
          </v-row>
          <v-row
            v-if="tab === 3"
            style="min-height: 570px;"
          >3</v-row>
        </v-form>
      </v-card-text>
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
import dayjs from 'dayjs';

// import SelectableBomTree from '@/components/commonUI/SelectableBomTree.vue';

export default {
  name: 'TaskExecuteDialog',
  data() {
    return {
      tabledataobj: {
        taskName: '',
        defectCode: '',
        // scheduledStartDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        // scheduledCompletionDate: dayjs().format('YYYY-MM-DD HH:mm:ss'), // 计划完成时间 保持和开始时间一致
        // timeoutReminderDate: '5', // 超时提醒时间 不传
        // productId: '',
        // componentSequenceIds: [],
        // billSequenceIds: [],
        faultPhenomenon: '', // 故障现象描述
      },
      bomErrMsg: '',
      bomListFormatted: [],
      openall: false,
      tab: 1,
      isStartTask: false,
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    isNew: {
      type: Boolean,
    },
    selectedItem: {
      type: Object,
    },
  },
  components: {
    // SelectableBomTree,
  },
  computed: {
    ...mapState('faultDiagnosis', ['bomObj', 'bomList', 'errorCodeList', 'newTaskObj']),
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
          (v) => !!v || '必填项',
          (v) => v?.length <= 50 || '最多输入50个字符',
        ],
        isRequired: [(v) => !!v || '必填项'],
      };
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('faultDiagnosis', ['getErrorCodeList', 'getFormatBomList', 'addRepairTask']),
    getPayload() {
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
        defectCode,
        faultPhenomenon,
      } = tabledataobj;
      const componentSequenceIds = this.$refs.selectableBomTree.selectfloder
        .map((item) => item.componentSequenceId);
      const billSequenceIds = this.$refs.selectableBomTree.selectfloder
        .map((item) => item.billSequenceId);
      const productId = `${this.$refs.selectableBomTree.selectfloder
        .map((item) => item.productId)?.[0]}`;
      const payload = {
        taskName,
        defectCode,
        scheduledStartDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        scheduledCompletionDate: dayjs().format('YYYY-MM-DD HH:mm:ss'), // 计划完成时间 保持和开始时间一致
        productId,
        componentSequenceIds,
        billSequenceIds,
        faultPhenomenon,
      };
      return payload;
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.tabledataobj = {
            taskName: '',
            defectCode: '',
            scheduledStartDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            scheduledCompletionDate: dayjs().format('YYYY-MM-DD HH:mm:ss'), // 计划完成时间 保持和开始时间一致
            // timeoutReminderDate: '5', // 超时提醒时间 不传
            productId: '',
            componentSequenceIds: [],
            billSequenceIds: [],
            faultPhenomenon: '', // 故障现象描述
          };
          this.bomErrMsg = '';
        });
      }
    },

    async saveTask() {
      const payload = this.getPayload();
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
      const payload = this.getPayload();
      if (!payload) {
        return;
      }
      const isAdded = await this.addRepairTask(payload);
      if (isAdded) {
        this.reset();
        this.$emit('showTaskExecuteDialog');
        this.$emit('closeDialog');
      }
    },
    changeErrorCode(defectCode) {
      // defectCode 数据库唯一字段
      const errorCodeObj = this.errorCodeList?.find((item) => item?.defectCode === defectCode);
      this.tabledataobj.faultPhenomenon = errorCodeObj?.description || '';
    },
    clickTabBtn(tab) {
      this.tab = tab;
    },
    async handleCancelTask() {
      // 修改任务状态
      await this.$store.dispatch('faultDiagnosis/cancelRepairTask');
      // 取消报警
      await this.$store.dispatch('faultDiagnosis/cancelAlarm', {
        alarmStatus: '0',
        alarmId: Number(this.$route.query.alarmId),
      });
      this.$emit('closeDialog');
    },
    async handleStartTask() {
      // 修改任务状态 为开始
      await this.$store.dispatch('faultDiagnosis/startRepairTask');
      this.isStartTask = true;
    },
    async handleCompleteTask() {
      // 修改任务状态 为完成
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }

      this.bomListFormatted = await this.getFormatBomList();
      // this.$nextTick(() => {
      //   // TODO openall不生效
      //   this.$refs.selectableBomTree.openall = true;
      // });

      await this.getErrorCodeList();

      // const { selectedItem } = this;

      // await this.getErrorCodeList();
      // const {
      //   defectReportName,
      //   description,
      // } = selectedItem;
      // this.$nextTick(async () => {
      //   this.tabledataobj = {
      //     ...this.tabledataobj,
      //     defectReportName,
      //     description,
      //   };
      // });
    //   if (selectedItem?.componentSequenceIds) {
    //     const componentSequenceIds = selectedItem.componentSequenceIds.split(',');
    //     const billSequenceIds = selectedItem.billSequenceIds.split(',');
    //     // const billSequenceIds = '70220'.split(',');
    //     // console.log(componentSequenceIds, 'componentSequenceIds');
    //     this.$refs.selectableBomTree.selectfloder = componentSequenceIds.map((id, index) => {
    //       const obj = {
    //         componentSequenceId: Number(id),
    //         billSequenceId: Number(billSequenceIds[index]),
    //       };
    //       return obj;
    //     });
    //   }
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
