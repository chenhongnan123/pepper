<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'400px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden">
      <v-card-title primary-title>
        <span>
          {{ isNew ? $t('btn.add') : $t('btn.edit') }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-row justify="center" dense>
            <v-col cols="12">
              <v-text-field
                class="mx-3 mt-2"
                clearable
                :rules="rules.limit20LenStrRequire"
                :label="`${$t('workshopManagement.table.workshopNumber')}*`"
                v-model="tabledataobj.workshopNumber"
                :disabled="!isNew"
                :counter="20"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-2"
                clearable
                :rules="rules.limit50LenStrRequire"
                :label="`${$t('workshopManagement.table.workshopName')}*`"
                v-model="tabledataobj.workshopName"
                :counter="50"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-2"
                clearable
                :rules="rules.limit100LenStr"
                :label="`${$t('workshopManagement.table.workshopDesc')}`"
                v-model="tabledataobj.workshopDesc"
                :counter="100"
              ></v-text-field>
            </v-col>
          </v-row>
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
        <v-btn color="primary" small class="text-none" @click="handleSave">
          {{ $t('btn.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'WorkshopAddDialog',
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
    isNew: {
      type: Boolean,
    },
    selectedTableList: {
      type: Array,
    },
  },
  components: {},
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
      return this.$getBasicRuls();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('workshopManagement', [
      'addWorkshop',
      'editWorkshop',
    ]),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const { isNew, tabledataobj } = this;
      const {
        workshopId,
        workshopName,
        workshopNumber,
        workshopDesc,
      } = tabledataobj;
      let payload = {
        workshopName,
        workshopNumber,
        workshopDesc,
      };
      let result = null;
      if (isNew) {
        result = await this.addWorkshop(payload);
      } else {
        payload = {
          ...payload,
          workshopId,
        };
        result = await this.editWorkshop(payload);
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
        this.reset();
        return;
      }
      const { isNew, selectedTableList } = this;
      if (!selectedTableList.length || isNew) {
        this.reset();
        return;
      }
      const {
        workshopId,
        workshopName,
        workshopNumber,
        workshopDesc,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          workshopId,
          workshopName,
          workshopNumber,
          workshopDesc,
        };
      });
    },
  },
};
</script>
