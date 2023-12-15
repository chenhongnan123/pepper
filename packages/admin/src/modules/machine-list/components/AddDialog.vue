<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'400px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            isNew
            ? $t('btn.add')
            : $t('btn.edit')
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
            :label="`${$t('machineList.table.deviceNumber')}*`"
            :rules="rules.limit50LenStrRequire"
            :disabled="!isNew"
            :counter="50"
            v-model="tabledataobj.deviceNumber"
          ></v-text-field>
          <v-text-field
            class="mx-3 mt-1"
            clearable
            :label="`${$t('machineList.table.deviceName')}*`"
            :rules="rules.limit50LenStrRequire"
            :counter="50"
            v-model="tabledataobj.deviceName"
          ></v-text-field>
          <v-checkbox
            class="mx-3 mt-1"
            :label="`${$t('machineList.table.isAssignProduct')}`"
            v-model="tabledataobj.isAssignProduct">
          </v-checkbox>
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
  // mapState,
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  name: 'MachineAddDialog',
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
    typeId: {
      type: Number,
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
      return this.$getNetworkingRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('machineList', ['addMachine', 'updateMachine']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        isNew,
        tabledataobj,
      } = this;

      const {
        deviceId,
        deviceName,
        deviceNumber,
        isAssignProduct,
      } = tabledataobj;

      let payload = {
        typeId: this.typeId,
        deviceName,
        deviceNumber,
        isAssignProduct: isAssignProduct ? '1' : '0',
      };
      let result = null;
      if (isNew) {
        payload = {
          ...payload,
        };
        result = await this.addMachine(payload);
      } else {
        payload = {
          ...payload,
          deviceId,
        };
        result = await this.updateMachine(payload);
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
        deviceId,
        deviceName,
        deviceNumber,
        isAssignProduct,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          deviceId,
          deviceName,
          deviceNumber,
          isAssignProduct: Number(isAssignProduct),
        };
      });
    },
  },
};
</script>
