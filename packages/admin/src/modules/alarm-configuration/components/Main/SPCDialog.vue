<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="400"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            !isAddNew
            ? $t('alarmConfiguration.dialog.editSPCAlarm')
            : $t('alarmConfiguration.dialog.addSPCAlarm')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height: 420px;">
        <v-form
          ref="form"
          lazy-validation
        >
          <v-text-field
            clearable
            :rules="rules.number"
            :label="`${$t('alarmConfiguration.dialog.eventNumber')}*`"
            v-model="tabledataobj.eventNumber"
            :counter="20"
            :disabled="!isAddNew"
          ></v-text-field>
          <v-text-field
            class="mt-2"
            clearable
            :rules="rules.name"
            :label="`${$t('alarmConfiguration.dialog.eventName')}*`"
            v-model="tabledataobj.eventName"
            :counter="50"
          ></v-text-field>
          <v-text-field
            class="mt-2"
            clearable
            :label="$t('alarmConfiguration.dialog.eventDesc')"
            v-model="tabledataobj.description"
          ></v-text-field>
          <v-autocomplete
            class="mt-2"
            clearable
            :label="`${$t('alarmConfiguration.dialog.parameterName')}*`"
            :items="parameterList"
            item-text="parameterName"
            item-value="parameterCode"
            v-model="tabledataobj.parameterCode"
            :rules="rules.isRequired"
          >
            <template v-slot:item="{ item }">
            <div
              class="d-flex justify-space-between custom-autocomplete"
              style="width:100%"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.parameterName }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.parameterCode }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ item.description }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-icon v-if="item.enabledFlag!=='Y'">mdi-cancel</v-icon>
            </div>
            </template>
          </v-autocomplete>
          <v-row dense>
            <v-col :cols="6">
              <v-switch
                v-model="tabledataobj.active"
                color="primary"
                hide-details
                dense
                :label="`${$t('alarmConfiguration.dialog.active')}`"
              >
              </v-switch>
            </v-col>
            <v-col :cols="6">
              <v-switch
                v-model="tabledataobj.isDashboardShow"
                color="primary"
                hide-details
                dense
                :label="`${$t('alarmConfiguration.dialog.dashboardShow')}`"
              >
              </v-switch>
            </v-col>
          </v-row>
          <v-text-field
            v-if="tabledataobj.isDashboardShow"
            class="mt-4"
            clearable
            :rules="rules.isInter"
            :label="`${$t('alarmConfiguration.dialog.dashboardPosition')}*`"
            v-model="tabledataobj.dashboardPosition"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions class="mb-2">
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          small
          text
          class="mr-2"
          @click="reset"
          v-if="isAddNew"
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
} from 'vuex';

export default {
  name: 'SPCDialog',
  data() {
    return {
      tabledataobj: {
        active: true,
        isDashboardShow: true,
      },
    };
  },
  props: {
    spcDialog: {
      type: Boolean,
      required: true,
    },
    isAddNew: {
      type: Boolean,
      required: true,
    },
    selectedTableList: {
      type: Array,
    },
    rules: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('alarmConfiguration', [
      'mainDevice',
      'parameterList',
    ]),
    dialog: {
      get() {
        return this.spcDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    // 设备代码，用作部件列表查询条件
    deviceCode() {
      if (!this.mainDevice) {
        return '';
      }
      return this.mainDevice.productCode || '';
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('alarmConfiguration', [
      'getParameterList',
      'addSpcAlarm',
      'updateSpcAlarm',
    ]),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        serialColumn,
        eventNumber,
        eventName,
        description,
        parameterCode,
        algirithm,
        active,
        isDashboardShow,
        dashboardPosition,
      } = this.tabledataobj;
      const payload = {
        serialColumn,
        eventNumber,
        eventName,
        description,
        parameterCode,
        algirithm,
        enabledFlag: active ? 'Y' : 'N',
        isDashboardShow,
        dashboardPosition: Number(dashboardPosition),
      };
      // console.log(payload, 'payload');
      let result = null;
      if (this.isAddNew) {
        delete payload.serialColumn;
        result = await this.addSpcAlarm(payload);
      } else {
        result = await this.updateSpcAlarm(payload);
      }
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.$emit('getTableList');
        this.dialog = false;
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.tabledataobj = {
            active: true,
            isDashboardShow: true,
          };
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      // 获取参数列表
      await this.getParameterList();
      const {
        selectedTableList,
      } = this;
      if (this.isAddNew) {
        this.reset();
        return;
      }
      if (selectedTableList.length) {
        const {
          serialColumn,
          eventNumber,
          eventName,
          description,
          parameterCode,
          algirithm,
          enabledFlag,
          isDashboardShow,
          dashboardPosition,
        } = selectedTableList[0];
        this.$nextTick(async () => {
          this.tabledataobj = {
            ...this.tabledataobj,
            serialColumn,
            eventNumber,
            eventName,
            description,
            parameterCode,
            algirithm,
            active: enabledFlag === 'Y',
            isDashboardShow,
            dashboardPosition,
          };
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  .custom-autocomplete {
    ::v-deep .v-list-item__subtitle, .v-list-item__title {
      line-height: normal!important;
    }
  } /* 解决windows系统list-item组件内容_遮挡显示问题 */
</style>
