<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="400px"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            !isAddNew
            ? $t('alarmConfiguration.dialog.editDeviceAlarm')
            : $t('alarmConfiguration.dialog.addDeviceAlarm')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height: 450px;">
        <v-form
          ref="form"
          lazy-validation
        >
          <v-text-field
            clearable
            :rules="rules.number"
            :label="`${$t('alarmConfiguration.dialog.alarmNumber')}*`"
            v-model="tabledataobj.alarmNumber"
            :counter="20"
            :disabled="!isAddNew"
          ></v-text-field>
          <v-text-field
            class="mt-2"
            clearable
            :rules="rules.name"
            :label="`${$t('alarmConfiguration.dialog.alarmName')}*`"
            v-model="tabledataobj.alarmName"
            :counter="50"
          ></v-text-field>
          <v-text-field
            class="mt-2"
            clearable
            :label="$t('alarmConfiguration.dialog.description')"
            v-model="tabledataobj.description"
          ></v-text-field>
          <v-autocomplete
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
            class="mt-2"
            clearable
            :label="`${$t('alarmConfiguration.dialog.alarmType')}*`"
            :items="alarmTypeList"
            item-text="typeName"
            item-value="typeCode"
            v-model="tabledataobj.alarmTypeCode"
            :rules="rules.isRequired"
          >
            <template v-slot:item="{ item }">
            <div
              class="d-flex justify-space-between custom-autocomplete"
              style="width:100%"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.typeName }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.typeCode }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ item.description }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-icon v-if="item.enabledFlag!=='Y'">mdi-cancel</v-icon>
            </div>
            </template>
          </v-autocomplete>
          <v-switch
            v-model="tabledataobj.active"
            color="primary"
            hide-details
            dense
            :label="`${$t('alarmConfiguration.dialog.active')}`"
          >
          </v-switch>
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
  name: 'DeviceDialog',
  data() {
    return {
      tabledataobj: {
        active: true,
      },
    };
  },
  props: {
    deviceDialog: {
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
      'alarmTypeList',
    ]),
    dialog: {
      get() {
        return this.deviceDialog;
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
      'getComponentList',
      'getAlarmTypeList',
      'addDeviceAlarm',
      'updateDeviceAlarm',
    ]),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        serialColumn,
        alarmNumber,
        alarmName,
        componentCode,
        description,
        alarmTypeCode,
        active,
      } = this.tabledataobj;
      const payload = {
        serialColumn,
        alarmNumber,
        alarmName,
        componentCode,
        description,
        alarmTypeCode,
        enabledFlag: active ? 'Y' : 'N',
      };
      // console.log(payload, 'payload');
      let result = null;
      if (this.isAddNew) {
        delete payload.serialColumn;
        result = await this.addDeviceAlarm(payload);
      } else {
        result = await this.updateDeviceAlarm(payload);
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
      // 获取报警类型列表
      await this.getAlarmTypeList();
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
          alarmNumber,
          alarmName,
          componentCode,
          description,
          alarmTypeCode,
          enabledFlag,
        } = selectedTableList[0];
        this.$nextTick(async () => {
          this.tabledataobj = {
            ...this.tabledataobj,
            serialColumn,
            alarmNumber,
            alarmName,
            componentCode,
            description,
            alarmTypeCode,
            active: enabledFlag === 'Y',
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
