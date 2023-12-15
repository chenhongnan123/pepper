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
          {{ $t('operationLog.module.operationLogDetail') }}
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
        style="height: 520px;overflow-y: auto;"
      >
        <v-row class="mt-1">
          <v-col :cols="6">
            <div class="body-2">
              <span class="font-weight-bold">
                {{ `${$t('operationLog.label.systemModule')}:` }}
              </span>
              <span class="ml-2">{{ logDetail.operModule || '' }}</span>
            </div>
          </v-col>
          <v-col :cols="6">
            <div class="body-2">
              <span class="font-weight-bold">
                {{ `${$t('operationLog.label.requestUrl')}: ` }}
              </span>
              <span class="ml-2">{{ logDetail.operUrl || '' }}</span>
            </div>
          </v-col>
          <v-col :cols="6">
            <div class="body-2">
              <span class="font-weight-bold">
                {{ `${$t('operationLog.label.loginInfo')}: ` }}
              </span>
              <span class="ml-2">{{ logDetail.loginInfo || '' }}</span>
            </div>
          </v-col>
          <v-col :cols="6">
            <div class="body-2">
              <span class="font-weight-bold">
                {{ `${$t('operationLog.label.requestMethod')}: ` }}
              </span>
              <span class="ml-2">{{ logDetail.requestMethod || '' }}</span>
            </div>
          </v-col>
          <v-col :cols="12">
            <div class="body-2">
              <span class="font-weight-bold">
                {{ `${$t('operationLog.label.operationMethod')}: ` }}
              </span>
              <span class="ml-2">{{ logDetail.method || '' }}</span>
            </div>
          </v-col>
          <v-col :cols="12">
            <div class="body-2">
              <span class="font-weight-bold">
                {{ `${$t('operationLog.label.requestParams')}: ` }}
              </span>
            </div>
            <json-viewer
              class="mt-2"
              :value="logDetail.operParam"
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
                {{ `${$t('operationLog.label.returnParams')}: ` }}
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
          <v-col :cols="6">
            <div class="body-2">
              <span class="font-weight-bold">
                {{ `${$t('operationLog.label.status')}: ` }}
              </span>
              <span class="ml-2">{{ logDetail.status || '' }}</span>
            </div>
          </v-col>
          <v-col :cols="6">
            <div class="body-2">
              <span class="font-weight-bold">
                {{ `${$t('operationLog.label.operationTime')}: ` }}
              </span>
              <span class="ml-2">{{ logDetail.operTime || '' }}</span>
            </div>
          </v-col>
          <v-col
            :cols="12"
            v-if="detail.status === 1"
          >
            <div class="body-2">
              <span class="font-weight-bold">
                {{ `${$t('operationLog.label.errorMsg')}: ` }}
              </span>
              <span class="ml-2">{{ logDetail.errorMsg || '' }}</span>
            </div>
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
} from 'vuex';
import JsonViewer from 'vue-json-viewer';

export default {
  name: 'logDetailDialog',
  data() {
    return {
      logDetail: {
        operModule: '',
        operUrl: '',
        loginInfo: '',
        requestMethod: '',
        method: '',
        operParam: {},
        jsonResult: {},
        status: '',
        operTime: '',
        errorMsg: '',
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
    ...mapState('operationLog', []),
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
    // 获取操作类型文本
    getOperTypeText(type) {
      switch (type) {
        case 0:
          return this.$t('operationLog.label.other');
        case 1:
          return this.$t('operationLog.label.add');
        case 2:
          return this.$t('operationLog.label.edit');
        case 3:
          return this.$t('operationLog.label.delete');
        case 4:
          return this.$t('operationLog.label.auth');
        case 5:
          return this.$t('operationLog.label.export');
        case 6:
          return this.$t('operationLog.label.import');
        case 7:
          return this.$t('operationLog.label.exit');
        case 8:
          return this.$t('operationLog.label.generating');
        case 9:
          return this.$t('operationLog.label.clean');
        default:
          return '';
      }
    },
    getStatusText(status) {
      if (status === 0) {
        return this.$t('operationLog.label.success');
      }
      if (status === 1) {
        return this.$t('operationLog.label.error');
      }
      return '';
    },
    // 重置详情信息
    reset() {
      this.$nextTick(() => {
        this.logDetail = {
          operModule: '',
          operUrl: '',
          loginInfo: '',
          requestMethod: '',
          method: '',
          operParam: {},
          jsonResult: {},
          status: '',
          operTime: '',
          errorMsg: '',
        };
      });
    },
  },
  watch: {
    async dialog(val) {
      if (val) {
        const { detail } = this;
        if (Object.keys(detail).length === 0) {
          this.reset();
          return;
        }
        const {
          title,
          businessType,
          operUrl,
          operName,
          operIp,
          requestMethod,
          method,
          operParam,
          jsonResult,
          status,
          operTime,
          errorMsg,
        } = detail;
        const operationType = this.getOperTypeText(businessType);
        let operStatus = '';
        if (this.getStatusText(status)) {
          operStatus = this.getStatusText(status);
        }
        this.$nextTick(async () => {
          this.logDetail = {
            operModule: `${title} / ${operationType}`,
            operUrl,
            loginInfo: `${operName} / ${operIp}`,
            requestMethod,
            method,
            operParam: operParam ? JSON.parse(operParam) : {},
            jsonResult: jsonResult ? JSON.parse(jsonResult) : {},
            status: operStatus,
            operTime,
            errorMsg,
          };
        });
      }
    },
  },
};
</script>
