<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'650px'"
  >
    <v-card style="overflow: hidden">
      <v-card-title primary-title>
        <span> EA日志详情 </span>
        <v-spacer></v-spacer>
        <v-btn
          icon
          small
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height: 530px; overflow-y: auto">
        <v-row class="mt-1">
          <v-col :cols="12">
            <div class="body-2">
              <span class="font-weight-bold text-h6"> {{ eaLogObj.createTime }} </span>
            </div>
          </v-col>
          <v-col :cols="12">
            <div class="body-2">
              <span class="font-weight-bold"> 派工单号： </span>
              <span class="ml-2">{{ eaLogObj.deviceName || '' }}</span>
            </div>
          </v-col>
          <v-col :cols="6">
            <div class="body-2">
              <span class="font-weight-bold"> 设备名称： </span>
              <span class="ml-2">{{ eaLogObj.dispatchNumber || '' }}</span>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="body-2">
              <span class="font-weight-bold"> 事件： </span>
              <span class="ml-2">{{ eaLogObj.event || '' }}</span>
            </div>
          </v-col>
          <v-col cols="12">
            <div class="body-2">
              <span class="font-weight-bold"> 错误信息： </span>
              <span class="ml-2">{{ eaLogObj.errorMsg || '' }}</span>
            </div>
          </v-col>
          <v-col :cols="12">
            <div class="body-2">
              <span class="font-weight-bold"> 读取PLC参数： </span>
            </div>
            <json-viewer
              class="mt-2"
              :value="eaLogObj?.writeParam"
              :expand-depth="5"
              boxed
              sort
              :expanded="false"
              :preview-mode="false"
            >
            </json-viewer>
          </v-col>
          <v-col :cols="12">
            <div class="body-2">
              <span class="font-weight-bold"> 写入PLC参数 </span>
            </div>
            <json-viewer
              class="mt-2"
              :value="eaLogObj?.writeParam"
              :expand-depth="5"
              boxed
              sort
              :expanded="false"
              :preview-mode="false"
            >
            </json-viewer>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mb-2">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="dialog = false"
          >{{ $t('btn.close') }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import JsonViewer from 'vue-json-viewer';

export default {
  name: 'InfoDialog',
  data() {
    return {
      eaLogObj: {
        readParam: {},
        writeParam: {},
      },
    };
  },
  components: {
    JsonViewer,
  },
  props: {
    infoDialog: {
      type: Boolean,
      required: true,
    },
    logId: {
      type: Number,
    },
  },
  computed: {
    ...mapState('eaLog', ['eaLogInfo']),
    dialog: {
      get() {
        return this.infoDialog;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
  },
  methods: {
    ...mapActions('eaLog', ['getEaLogInfo']),
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      await this.getEaLogInfo(this.logId);
      const { writeParam, readParam } = this.eaLogInfo;
      this.eaLogObj = {
        ...this.eaLogInfo,
        readParam: JSON.parse(readParam),
        writeParam: JSON.parse(writeParam),
      };
    },
  },
};
</script>

<style scoped>
::v-deep .v-list-item__subtitle {
  white-space: normal;
  word-wrap: break-word;
}
</style>
