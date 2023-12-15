<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'650px'"
  >
    <v-card
      style="overflow: hidden"
    >
      <v-card-title primary-title>
        <span>
          接口日志详情
        </span>
        <v-spacer></v-spacer>
        <v-btn
          icon
          small
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text
        style="height: 530px;overflow-y: auto;"
      >
        <v-row class="mt-1">
          <v-col :cols="12">
            <div class="body-2">
              <span class="font-weight-bold">
                请求地址：
              </span>
              <span class="ml-2">{{ logDetail.url || '' }}</span>
            </div>
          </v-col>
          <v-col :cols="12">
            <div class="body-2">
              <span class="font-weight-bold">
                接口描述：
              </span>
              <span class="ml-2">{{ logDetail.interfaceDesc || '' }}</span>
            </div>
          </v-col>
          <v-col :cols="12">
            <div class="body-2">
              <span class="font-weight-bold">
                请求参数：
              </span>
            </div>
            <json-viewer
              class="mt-2"
              :value="logDetail.interfaceParam"
              :expand-depth=5
              boxed
              sort
              :expanded="false"
              :preview-mode="false"
            >
            </json-viewer>
          </v-col>
          <v-col :cols="12">
            <div class="body-2">
              <span class="font-weight-bold">
                返回数据：
              </span>
            </div>
            <json-viewer
              class="mt-2"
              :value="logDetail.jsonResult"
              :expand-depth=5
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
        >{{ $t('btn.close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapActions,
} from 'vuex';
import JsonViewer from 'vue-json-viewer';

export default {
  name: 'LogDetailDialog',
  data() {
    return {
      logDetail: {
        url: '', // 请求地址
        interfaceDesc: '', // 接口描述
        interfaceParam: {}, // 请求参数
        jsonResult: {}, // 返回数据
      },
    };
  },
  props: {
    detailDialog: {
      type: Boolean,
      required: true,
    },
    detail: {
      type: Object,
      required: true,
    },
  },
  components: {
    JsonViewer,
  },
  computed: {
    ...mapState('interfaceLog', ['interfaceLogInfo']),
    dialog: {
      get() {
        return this.detailDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
  },
  methods: {
    ...mapActions('interfaceLog', ['getInterfaceLogInfo']),
    // 获取操作类型文本
    // getOperTypeText(type) {
    //   switch (type) {
    //     case 0:
    //       return this.$t('operationLog.label.other');
    //     case 1:
    //       return this.$t('operationLog.label.add');
    //     case 2:
    //       return this.$t('operationLog.label.edit');
    //     case 3:
    //       return this.$t('operationLog.label.delete');
    //     case 4:
    //       return this.$t('operationLog.label.auth');
    //     case 5:
    //       return this.$t('operationLog.label.export');
    //     case 6:
    //       return this.$t('operationLog.label.import');
    //     case 7:
    //       return this.$t('operationLog.label.exit');
    //     case 8:
    //       return this.$t('operationLog.label.generating');
    //     case 9:
    //       return this.$t('operationLog.label.clean');
    //     default:
    //       return '';
    //   }
    // },
    // getStatusText(status) {
    //   if (status === 0) {
    //     return this.$t('operationLog.label.success');
    //   }
    //   if (status === 1) {
    //     return this.$t('operationLog.label.error');
    //   }
    //   return '';
    // },
    // 重置详情信息
    reset() {
      this.$nextTick(() => {
        this.logDetail = {
          interfaceParam: {},
          jsonResult: {},
        };
      });
    },
  },
  watch: {
    async dialog(val) {
      if (!val) {
        return;
      }
      const { detail: { interfaceId } } = this;
      await this.getInterfaceLogInfo(interfaceId);
      console.log(this.interfaceLogInfo);
      const {
        interfaceParam,
        jsonResult,
        interfaceDesc,
        url,
      } = this.interfaceLogInfo;
      this.$nextTick(() => {
        this.logDetail = {
          ...this.logDetail,
          interfaceParam,
          jsonResult,
          interfaceDesc,
          url,
        };
      });
    },
  },
};
</script>
