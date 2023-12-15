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
                :disabled="!isNew"
                :rules="rules.limit20LenStrRequire"
                :label="`${$t('transportManagement.table.transportNumber')}*`"
                v-model="tabledataobj.transportNumber"
                :counter="20"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-2"
                clearable
                :rules="rules.limit50LenStrRequire"
                :label="`${$t('transportManagement.table.transportName')}*`"
                v-model="tabledataobj.transportName"
                :counter="50"
              ></v-text-field>
              <v-autocomplete
                class="mx-3 mt-1"
                :label="`${$t('transportManagement.table.workshopName')}*`"
                :rules="rules.isRequired"
                :items="workshopList"
                item-text="workshopName"
                item-value="workshopId"
                v-model="tabledataobj.workshopId"
              ></v-autocomplete>
              <v-text-field
                class="mx-3 mt-2"
                clearable
                :rules="rules.limit100LenStr"
                :label="`${$t('transportManagement.table.transportDesc')}`"
                v-model="tabledataobj.transportDesc"
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
          v-if="isNew"
          @click="reset"
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
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'TransportAddDialog',
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
    ...mapState('transportManagement', ['workshopList']),
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
    ...mapActions('transportManagement', [
      'getWorkshopList',
      'addTransport',
      'editTransport',
    ]),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const { isNew, tabledataobj } = this;
      const {
        transportId,
        transportNumber,
        transportName,
        workshopId,
        transportDesc,
      } = tabledataobj;
      let payload = {
        transportNumber,
        transportName,
        workshopId,
        transportDesc,
      };
      let result = null;
      if (isNew) {
        result = await this.addTransport(payload);
      } else {
        payload = {
          ...payload,
          transportId,
        };
        result = await this.editTransport(payload);
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
      await this.getWorkshopList();
      const { isNew, selectedTableList } = this;
      if (!selectedTableList.length || isNew) {
        this.reset();
        return;
      }
      const {
        transportId,
        transportNumber,
        transportName,
        workshopId,
        transportDesc,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          transportId,
          transportNumber,
          transportName,
          workshopId,
          transportDesc,
        };
      });
    },
  },
};
</script>
