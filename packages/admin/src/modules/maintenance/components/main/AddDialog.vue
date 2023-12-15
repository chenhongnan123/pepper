<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="400px"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden">
      <v-card-title primary-title>
        <span>
          {{
            isNew
              ? $t('maintenance.dialog.addMaintenance')
              : $t('maintenance.dialog.editMaintenance')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn
          icon
          small
          @click="dialog = false"
          color="primary"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-autocomplete
            clearable
            :rules="rules.isRequired"
            :label="`${$t('maintenance.table.schemaType')}*`"
            class="mx-3 mt-3"
            v-model="tabledataobj.schemaType"
            :items="maintenanceTypeList"
            item-text="dictLabel"
            item-value="dictValue"
          >
          </v-autocomplete>
          <v-text-field
            class="mx-3 mt-3"
            clearable
            :rules="rules.name"
            :label="`${$t('maintenance.table.schemaCode')}*`"
            :counter="50"
            v-model="tabledataobj.schemaCode"
          ></v-text-field>
          <v-text-field
            class="mx-3 mt-3"
            clearable
            :rules="rules.name"
            :label="`${$t('maintenance.table.schemaName')}*`"
            :counter="50"
            v-model="tabledataobj.schemaName"
          ></v-text-field>
          <v-text-field
            class="mx-3 mt-3"
            clearable
            :label="`${$t('maintenance.table.schemaDesc')}`"
            v-model="tabledataobj.schemaDesc"
            counter="500"
            :rules="rules.over500"
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
          {{ $t('btn.eliminate') }}
        </v-btn>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="handleSave"
        >
          {{ $t('btn.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'MaintenanceAddDialog',
  data() {
    return {
      tabledataobj: {},
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
    ...mapState('helper', ['currentLocale']),
    ...mapState('maintenance', ['maintenanceTypeList']),
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
    ...mapActions('maintenance', ['addMaintenance', 'updateMaintenance', 'getMaintenanceTypeList']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const { isNew, tabledataobj } = this;
      const {
        id,
        schemaType,
        schemaName,
        schemaCode,
        schemaDesc,
      } = tabledataobj;
      let payload = {
        id,
        schemaType,
        schemaName,
        schemaCode,
        schemaDesc,
      };
      let result = null;
      if (isNew) {
        payload = {
          ...payload,
        };
        result = await this.addMaintenance(payload);
      } else {
        payload = {
          ...payload,
          id,
        };
        result = await this.updateMaintenance(payload);
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
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      await this.getMaintenanceTypeList('sys_schema_type');
      const { selectedTableList } = this;
      // console.log(this.rules, 'rules');
      if (!selectedTableList.length || this.isNew) {
        this.reset();
        return;
      }
      const {
        id,
        schemaType,
        schemaName,
        schemaCode,
        schemaDesc,
        // status,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          id,
          schemaType,
          schemaName,
          schemaCode,
          schemaDesc,
        };
      });
    },
  },
};
</script>
