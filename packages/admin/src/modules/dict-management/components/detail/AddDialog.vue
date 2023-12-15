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
            ? $t('dictManagement.dialog.addDictData')
            : $t('dictManagement.dialog.editDictData')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field
            class="mx-3 mt-1"
            clearable
            :rules="rules.dictType"
            disabled
            :label="`${$t('dictManagement.table.dictType')}*`"
            v-model="dictType"
          ></v-text-field>
        <v-form
          ref="form"
          lazy-validation
        >

          <v-text-field
            class="mx-3 mt-1"
            clearable
            :rules="rules.dictLabel"
            :label="`${$t('dictManagement.table.dictLabel')}*`"
            v-model="tabledataobj.dictLabel"
          ></v-text-field>
          <v-text-field
            class="mx-3 mt-1"
            clearable
            :rules="rules.dictValue"
            :label="`${$t('dictManagement.table.dictValue')}*`"
            v-model="tabledataobj.dictValue"
          ></v-text-field>
          <!-- <v-text-field
            auto-select-first
            class="mx-3 mt-1"
            clearable
            :label="`${$t('dictManagement.table.cssClass')}`"
            v-model="tabledataobj.cssClass"
          ></v-text-field> -->
          <v-text-field
            class="mx-3 mt-1"
            auto-select-first
            clearable
            :rules="rules.dictSort"
            :label="`${$t('dictManagement.table.dictSort')}`"
            v-model="tabledataobj.dictSort"
          ></v-text-field>
          <v-autocomplete
            class="mx-3 mt-1"
            clearable
            auto-select-first
            item-text="listClassName"
            item-value="listClassValue"
            :label="`${$t('dictManagement.table.listClass')}`"
            :items="listClassArr"
            v-model="tabledataobj.listClass"
          ></v-autocomplete>
          <v-radio-group
            :label="`${$t('dictManagement.table.isDefault')}`"
            v-model="tabledataobj.isDefault"
            row
            class="mx-3 mt-1"
          >
            <v-radio
              :label="`${$t('dictManagement.btn.normalStatus')}`"
              value="Y"
            />
            <v-radio
              :label="`${$t('dictManagement.btn.disabledStatus')}`"
              value="N"
            />
          </v-radio-group>
          <v-switch
            :label="`${$t('dictManagement.table.status')}`"
            class="mx-3 mt-1"
            dense
            v-model="tabledataobj.status"
          ></v-switch>
          <v-textarea
            class="mx-3 mt-1"
            :label="`${$t('dictManagement.table.remark')}`"
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
        status: true,
        isDefault: 'Y',
      },
      listClassArr: [
        { listClassName: '默认', listClassValue: 'default' },
        { listClassName: '主要', listClassValue: 'primary' },
        { listClassName: '成功', listClassValue: 'success' },
        { listClassName: '信息', listClassValue: 'info' },
        { listClassName: '警告', listClassValue: 'warning' },
        { listClassName: '危险', listClassValue: 'danger' },
      ],
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
    ...mapState('dictManagement', ['getDictTypeList']),
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
      return this.$getDictRules();
    },
    dictType() {
      return this.$route.params.dictType;
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('dictManagement', ['addDictData', 'updateDictData']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        isNew,
        tabledataobj,
      } = this;

      const {
        dictCode,
        dictLabel,
        dictValue,
        dictSort,
        listClass,
        isDefault,
        status,
        remark,
      } = tabledataobj;

      let payload = {
        dictLabel,
        dictValue,
        dictSort,
        listClass: listClass || 'default', // 没选则是default
        isDefault,
        status: status ? '0' : '1',
        remark,
        dictType: this.dictType,
      };
      let result = null;
      if (isNew) {
        payload = {
          ...payload,
        };
        result = await this.addDictData(payload);
      } else {
        payload = {
          ...payload,
          dictCode,
        };
        result = await this.updateDictData(payload);
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
            status: true,
            isDefault: 'Y',
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
        dictCode,
        dictLabel,
        dictValue,
        dictSort,
        listClass,
        isDefault,
        status,
        remark,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          dictCode,
          dictLabel,
          dictValue,
          dictSort,
          listClass,
          isDefault,
          status: status === '0', // '0'表示开启
          remark,
        };
      });
    },
  },
};
</script>
