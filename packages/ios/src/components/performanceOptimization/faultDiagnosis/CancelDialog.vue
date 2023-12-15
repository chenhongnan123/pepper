<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'500px'"
    transition="dialog-transition"
  >
    <div class="dialogcard pa-4 bluecard-decoration-5">
      <div
        v-for="i in 5"
        :key="i"
        :class="`rectangle-${i}`"
      ></div>
      <div class="d-flex">
        <div>
          <span class="title1">
            {{ $t('dataAlarmDetail.dialog.title') }}
          </span>
        </div>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <div style="height: 10px;">
        <img
          src="@/assets/icons/img/fault-diagnosis/line.png"
          style="width: 100%;"
          alt=""
        >
      </div>
      <div style="height: 242px;">
        <div style="height: 80%;" class="d-flex align-center justify-center">
          <span style="font-size: x-large;">
            {{ $t('dataAlarmDetail.dialog.cancelAlarm') }}
          </span>
        </div>
        <div style="height: 20%;" class="d-flex align-center justify-center">
          <v-spacer></v-spacer>
          <v-btn
            @click="handleConfirm"
            color="rgba(24, 254, 254, 0.44)" style="border-radius: 5px;"
          >
            {{ $t('dataAlarmDetail.dialog.confirm') }}
          </v-btn>
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import {
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  name: 'CancelDialog',
  data() {
    return {
    };
  },
  props: {
    isShow: {
      type: Boolean,
      required: true,
    },
    alarmId: {
      type: [String, Number],
      required: true,
    },
  },
  components: {
  },
  computed: {
    dialog: {
      get() {
        return this.isShow;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('dataAlarmDetail', ['dealAlarm']),
    ...mapActions('faultDiagnosis', ['getAlarmTotalCount']),
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
    },
    // 去消除报警
    async handleConfirm() {
      const result = await this.dealAlarm(Number(this.alarmId));
      // 更新AppHeader组件中的故障诊断的数量
      this.getAlarmTotalCount();
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.dialog = false;
        this.$emit('getTableList');
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (dialog) {
        this.reset();
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

</style>
