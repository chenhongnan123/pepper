<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="moreInfo?'800px':'400px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            isNew
            ? $t('maintenance.dialog.addMaintenanceType')
            : $t('maintenance.dialog.editMaintenanceType')
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
            class="mx-3 mt-3"
            clearable
            :rules="rules.name"
            :label="`${$t('maintenance.table.typeName')}*`"
            :counter="50"
            v-model="tabledataobj.dictCode"
          ></v-text-field>
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
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  name: 'MaintenanceTypeAddDialog',
  data() {
    return {
      tabledataobj: {
      },
      moreInfo: false,
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    selectedTableList: {
      type: Array,
    },
    isNew: {
      type: Boolean,
    },
  },
  computed: {
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
      return this.$getMaintenanceRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('maintenance', ['handleMaintenanceType']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        isNew,
        tabledataobj,
      } = this;
      const {
        id,
        dictCode,
      } = tabledataobj;
      const payload = {
        dictCode,
        languageValue: dictCode,
        dictType: 'xxcus_rlmt_operationSchemeType',
        languageType: 'zhHans',
        defaultFlag: 'N',
        sort: 0,
      };
      let result = null;
      if (isNew) {
        result = await this.handleMaintenanceType({
          action: 'create',
          payload,
        });
      } else {
        payload.id = id;
        result = await this.handleMaintenanceType({
          action: 'update',
          payload,
        });
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
          this.tabledataobj = {};
          this.moreInfo = false;
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      const {
        selectedTableList,
      } = this;
      // console.log(this.rules, 'rules');
      if (!selectedTableList.length || this.isNew) {
        this.reset();
        return;
      }
      const {
        id,
        dictCode,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          id,
          dictCode,
        };
      });
    },
  },
};
</script>
