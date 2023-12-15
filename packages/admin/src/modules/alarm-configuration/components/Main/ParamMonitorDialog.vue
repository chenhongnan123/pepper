<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="triggerConditionChecked ? '800px' : '400px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            !isAddNew
            ? $t('alarmConfiguration.dialog.editParamMonitorAlarm')
            : $t('alarmConfiguration.dialog.addParamMonitorAlarm')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height: 500px;">
        <v-form
          ref="form"
          lazy-validation
        >
          <v-row>
            <v-col :cols="triggerConditionChecked ? 6 : 12">
              <v-text-field
                class="mt-3"
                dense
                clearable
                :rules="rules.number"
                :label="`${$t('alarmConfiguration.dialog.eventNumber')}*`"
                v-model="tabledataobj.eventNumber"
                :counter="20"
                :disabled="!isAddNew"
              ></v-text-field>
              <v-text-field
                dense
                class="mt-2"
                clearable
                :rules="rules.name"
                :label="`${$t('alarmConfiguration.dialog.eventName')}*`"
                v-model="tabledataobj.eventName"
                :counter="50"
              ></v-text-field>
              <v-text-field
                dense
                class="mt-2"
                clearable
                :label="$t('alarmConfiguration.dialog.eventDesc')"
                v-model="tabledataobj.description"
              ></v-text-field>
              <v-autocomplete
                dense
                class="mt-2"
                clearable
                :label="`${$t('alarmConfiguration.dialog.component')}*`"
                :items="componentList"
                item-text="componentName"
                item-value="componentCode"
                v-model="tabledataobj.componentCode"
                :rules="rules.isRequired"
              >
                <template v-slot:item="{ item }">
                <div
                  class="d-flex justify-space-between custom-autocomplete"
                  style="width:100%"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.componentName }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ item.componentCode }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{ item.description }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-icon v-if="item.enabledFlag!=='Y'">mdi-cancel</v-icon>
                </div>
                </template>
              </v-autocomplete>
              <v-autocomplete
                dense
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
              <div class="mt-2">
                <div>{{ `${$t('alarmConfiguration.dialog.triggerCondition')}*` }}</div>
                <v-row dense>
                  <v-col :cols="6">
                    <v-checkbox
                      v-model="tabledataobj.upperLimitEnabled"
                      :label="`${$t('alarmConfiguration.dialog.upperLimit')}`"
                      hide-details
                      dense
                      @change="limitEnabledChange"
                    ></v-checkbox>
                  </v-col>
                  <v-col :cols="6">
                    <v-checkbox
                      v-model="tabledataobj.lowerLimitEnabled"
                      :label="`${$t('alarmConfiguration.dialog.lowerLimit')}`"
                      hide-details
                      dense
                      @change="limitEnabledChange"
                    ></v-checkbox>
                  </v-col>
                  <v-col :cols="6">
                    <v-checkbox
                      v-model="tabledataobj.warningValueEnabled"
                      :label="`${$t('alarmConfiguration.dialog.warnValue')}`"
                      hide-details
                      dense
                      :disabled="!limitChecked"
                    ></v-checkbox>
                  </v-col>
                  <v-col :cols="6">
                    <v-checkbox
                      v-model="tabledataobj.triggerNumberEnabled"
                      :label="`${$t('alarmConfiguration.dialog.triggerNumber')}`"
                      hide-details
                      dense
                      :disabled="!limitChecked"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </div>
              <v-row dense>
                <v-col :cols="6">
                  <v-switch
                    v-model="tabledataobj.active"
                    color="primary"
                    hide-details
                    :label="`${$t('alarmConfiguration.dialog.active')}`"
                  >
                  </v-switch>
                </v-col>
                <v-col :cols="6">
                  <v-switch
                    v-model="tabledataobj.isDashboardShow"
                    color="primary"
                    hide-details
                    :label="`${$t('alarmConfiguration.dialog.dashboardShow')}`"
                  >
                  </v-switch>
                </v-col>
              </v-row>
              <v-text-field
                dense
                v-if="tabledataobj.isDashboardShow"
                class="mt-4"
                clearable
                :rules="rules.isInter"
                :label="`${$t('alarmConfiguration.dialog.dashboardPosition')}*`"
                v-model="tabledataobj.dashboardPosition"
              ></v-text-field>
            </v-col>
            <v-col v-if="triggerConditionChecked" :cols="6">
              <v-text-field
                class="mt-3"
                dense
                v-if="tabledataobj.upperLimitEnabled"
                clearable
                :rules="rules.isInter"
                :label="`${$t('alarmConfiguration.dialog.upperLimit')}*`"
                v-model="tabledataobj.upperLimitValue"
              ></v-text-field>
              <v-text-field
                dense
                class="mt-2"
                v-if="tabledataobj.upperLimitEnabled && tabledataobj.warningValueEnabled"
                clearable
                :rules="rules.isInter"
                :label="`${$t('alarmConfiguration.dialog.upperLimitWarnValue')}*`"
                v-model="tabledataobj.upperLimitWarnValue"
              ></v-text-field>
              <v-text-field
                dense
                class="mt-2"
                v-if="tabledataobj.lowerLimitEnabled"
                clearable
                :rules="rules.isInter"
                :label="`${$t('alarmConfiguration.dialog.lowerLimit')}*`"
                v-model="tabledataobj.lowerLimitValue"
              ></v-text-field>
              <v-text-field
                dense
                class="mt-2"
                v-if="tabledataobj.lowerLimitEnabled && tabledataobj.warningValueEnabled"
                clearable
                :rules="rules.isInter"
                :label="`${$t('alarmConfiguration.dialog.lowerLimitWarnValue')}*`"
                v-model="tabledataobj.lowerLimitWarnValue"
              ></v-text-field>
              <v-text-field
                dense
                class="mt-2"
                v-if="tabledataobj.triggerNumberEnabled"
                clearable
                :rules="rules.isInter"
                :label="`${$t('alarmConfiguration.dialog.triggerNumber')}*`"
                v-model="tabledataobj.triggerNumber"
              ></v-text-field>
            </v-col>
          </v-row>
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
  name: 'ParamMonitorDialog',
  data() {
    return {
      tabledataobj: {
        active: true,
        isDashboardShow: true,
      },
    };
  },
  props: {
    eventDialog: {
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
      'componentList',
      'parameterList',
    ]),
    dialog: {
      get() {
        return this.eventDialog;
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
    // 是否勾选上下限
    limitChecked() {
      return this.tabledataobj.upperLimitEnabled || this.tabledataobj.lowerLimitEnabled;
    },
    // 触发条件是否有勾选
    triggerConditionChecked() {
      return this.tabledataobj.upperLimitEnabled || this.tabledataobj.lowerLimitEnabled
        || this.tabledataobj.warningValueEnabled || this.tabledataobj.triggerNumberEnabled;
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('alarmConfiguration', [
      'getComponentList',
      'getParameterList',
      'addParamMonitorAlarm',
      'updateParamMonitorAlarm',
    ]),
    // 上下限值勾选变化监听
    limitEnabledChange() {
      // 上下限均为未勾选时，预警值和触发前次数置为未勾选
      if (!this.limitChecked) {
        this.tabledataobj.warningValueEnabled = false;
        this.tabledataobj.triggerNumberEnabled = false;
      }
    },
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      if (!this.triggerConditionChecked) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'triggerConditionRequired',
        });
        return;
      }
      const {
        serialColumn,
        eventNumber,
        eventName,
        componentCode,
        description,
        parameterCode,
        upperLimitEnabled,
        lowerLimitEnabled,
        warningValueEnabled,
        triggerNumberEnabled,
        upperLimitValue,
        lowerLimitValue,
        upperLimitWarnValue,
        lowerLimitWarnValue,
        triggerNumber,
        active,
        isDashboardShow,
      } = this.tabledataobj;
      const payload = {
        serialColumn,
        eventNumber,
        eventName,
        componentCode,
        description,
        parameterCode,
        upperLimitEnabled,
        lowerLimitEnabled,
        warningValueEnabled,
        triggerNumberEnabled,
        upperLimitValue,
        lowerLimitValue,
        upperLimitWarnValue,
        lowerLimitWarnValue,
        triggerNumber,
        enabledFlag: active ? 'Y' : 'N',
        isDashboardShow,
      };
      // console.log(payload, 'payload');
      let result = null;
      if (this.isAddNew) {
        delete payload.serialColumn;
        result = await this.addParamMonitorAlarm(payload);
      } else {
        result = await this.updateParamMonitorAlarm(payload);
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
      const payload = {
        productCode: this.deviceCode,
        expend2D: true, // false-返回树形结构，true-返回列表结构
        includeTopLevel: false, // false-不包含顶层，true-包含顶层
      };
      // 获取部件列表
      await this.getComponentList(payload);
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
          componentCode,
          description,
          parameterCode,
          upperLimitEnabled,
          lowerLimitEnabled,
          warningValueEnabled,
          triggerNumberEnabled,
          upperLimitValue,
          lowerLimitValue,
          upperLimitWarnValue,
          lowerLimitWarnValue,
          triggerNumber,
          enabledFlag,
          isDashboardShow,
        } = selectedTableList[0];
        this.$nextTick(async () => {
          this.tabledataobj = {
            ...this.tabledataobj,
            serialColumn,
            eventNumber,
            eventName,
            componentCode,
            description,
            parameterCode,
            upperLimitEnabled,
            lowerLimitEnabled,
            warningValueEnabled,
            triggerNumberEnabled,
            upperLimitValue,
            lowerLimitValue,
            upperLimitWarnValue,
            lowerLimitWarnValue,
            triggerNumber,
            active: enabledFlag === 'Y',
            isDashboardShow,
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
