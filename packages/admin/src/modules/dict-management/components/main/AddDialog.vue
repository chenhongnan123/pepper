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
            ? $t('dictManagement.dialog.addDictType')
            : $t('dictManagement.dialog.editDictType')
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
            :rules="rules.dictName"
            :label="`${$t('dictManagement.table.dictName')}*`"
            v-model="tabledataobj.dictName"
          ></v-text-field>
          <v-text-field
            class="mx-3 mt-1"
            clearable
            :rules="rules.dictType"
            :label="`${$t('dictManagement.table.dictType')}*`"
            v-model="tabledataobj.dictType"
          ></v-text-field>
          <v-radio-group
            :label="`${$t('dictManagement.table.status')}`"
            v-model="tabledataobj.status"
            row
            class="mx-3 mt-1"
          >
            <v-radio
              :label="`${$t('dictManagement.btn.normalStatus')}`"
              :value="0"
            />
            <v-radio
              :label="`${$t('dictManagement.btn.disabledStatus')}`"
              :value="1"
            />
          </v-radio-group>
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
        status: 0,
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
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('dictManagement', ['addDictType', 'updateDictType']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        isNew,
        tabledataobj,
      } = this;

      const {
        dictId,
        dictName,
        dictType,
        status,
        remark,
      } = tabledataobj;

      let payload = {
        dictName,
        dictType,
        status,
        remark,
      };
      let result = null;
      if (isNew) {
        payload = {
          ...payload,
        };
        result = await this.addDictType(payload);
      } else {
        payload = {
          ...payload,
          dictId,
        };
        result = await this.updateDictType(payload);
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
            status: 0,
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
        dictId,
        dictName,
        dictType,
        status,
        remark,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          dictId,
          dictName,
          dictType,
          status: +status,
          remark,
        };
      });
    },
  },
};
</script>
