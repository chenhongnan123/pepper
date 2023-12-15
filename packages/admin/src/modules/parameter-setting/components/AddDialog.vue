<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'500px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            isNew
            ? $t('parameterSetting.dialog.addMenu')
            : $t('parameterSetting.dialog.editMenu')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-text-field
            class="mx-3 mt-1"
            clearable
            :rules="rules.isRequired"
            :label="`${$t('parameterSetting.table.configName')}*`"
            v-model="tabledataobj.configName"
          ></v-text-field>
          <v-text-field
            class="mx-3 mt-1"
            clearable
            :rules="rules.isRequired"
            :label="`${$t('parameterSetting.table.configKey')}*`"
            :disabled="tabledataobj.configType === 'Y'"
            v-model="tabledataobj.configKey"
          ></v-text-field>
          <v-text-field
            class="mx-3 mt-1"
            clearable
            :rules="rules.isRequired"
            :label="`${$t('parameterSetting.table.configValue')}*`"
            v-model="tabledataobj.configValue"
          ></v-text-field>
          <v-radio-group
            :label="`${$t('parameterSetting.table.configType')}`"
            v-model="tabledataobj.configType"
            row
            class="mx-3 mt-1"
          >
            <v-radio
              :label="`${$t('parameterSetting.btn.yes')}`"
              value="Y"
            />
            <v-radio
            :label="`${$t('parameterSetting.btn.no')}`"
              value="N"
            />
          </v-radio-group>
          <v-textarea
            class="mx-3 mt-1"
            :label="`${$t('parameterSetting.table.remark')}`"
            v-model="tabledataobj.remark"
            clearable
            auto-grow
            rows="1"
            row-height="20"
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions class="mt-4">
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          small
          text
          class="mr-2"
          @click="reset"
          v-if="isNew"
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
  name: 'ParameterAddDialog',
  data() {
    return {
      tabledataobj: {
        configType: 'N',
      },
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
    selectedTableList: {
      type: Array,
    },
  },
  computed: {
    ...mapState('parameterSetting', ['getParameterList']),
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
      return this.$getCommonRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('parameterSetting', ['addParameter', 'editParameter']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        isNew,
        tabledataobj,
      } = this;

      const {
        configId,
        configName,
        configKey,
        configValue,
        configType,
        remark,
      } = tabledataobj;

      let payload = {
        configName,
        configKey,
        configValue,
        configType,
        remark,
      };
      let result = null;
      if (isNew) {
        payload = {
          ...payload,
        };
        result = await this.addParameter(payload);
      } else {
        payload = {
          ...payload,
          configId,
        };
        result = await this.editParameter(payload);
      }
      if (result) {
        this.$emit('getTableList');
        this.dialog = false;
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.tabledataobj = {
            configType: 'N',
          };
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        this.reset();
        return;
      }
      const { isNew, selectedTableList } = this;
      if (!selectedTableList.length || isNew) {
        this.reset();
        return;
      }
      const {
        configId,
        configName,
        configKey,
        configValue,
        configType,
        remark,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          configId,
          configName,
          configKey,
          configValue,
          configType,
          remark,
        };
      });
    },
  },
};
</script>
