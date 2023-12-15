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
        <v-form ref="form" lazy-validation>
          <v-text-field
            class="mx-3 mt-1"
            clearable
            :rules="rules.limit50LenStrRequire"
            :label="`${$t('spotCheckPlan.table.checkName')}*`"
            v-model="tabledataobj.checkName"
            counter="50"
          ></v-text-field>
          <v-autocomplete
            clearable
            :rules="rules.isRequired"
            class="mx-3 mt-2"
            :items="machineList"
            :item-text="item => item.deviceName + ' ' + item.deviceNumber"
            item-value="deviceId"
            :filter="customFilter"
            :label="`${$t('spotCheckPlan.label.device')}*`"
            v-model="tabledataobj.deviceId"
          >
            <template v-slot:item="{ item }">
              <div
                class="d-flex justify-space-between custom-autocomplete"
                style="width: 100%"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.deviceName }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.deviceNumber }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <!-- {{ item.workshopDesc }} -->
                  </v-list-item-subtitle>
                </v-list-item-content>
              </div>
            </template>
          </v-autocomplete>
          <v-text-field
            class="mx-3 mt-1"
            clearable
            :rules="rules.numberWithOneDecimal"
            :label="`${$t('spotCheckPlan.table.spotCheckFrequency')}*`"
            v-model="tabledataobj.spotCheckFrequency"
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
  name: 'ParameterAddDialog',
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
  computed: {
    ...mapState('spotCheckPlan', ['machineList']),
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
      return this.$getSpotCheckRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('spotCheckPlan', [
      'getMachineList',
      'addSpotCheckPlan',
      'updateSpotCheckPlan',
    ]),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const { isNew, tabledataobj } = this;

      const {
        checkId,
        deviceId,
        checkName,
        spotCheckFrequency,
      } = tabledataobj;

      let payload = {
        checkName,
        deviceId,
        spotCheckFrequency,
      };
      let result = null;
      if (isNew) {
        payload = {
          ...payload,
        };
        result = await this.addSpotCheckPlan(payload);
      } else {
        payload = {
          ...payload,
          checkId,
        };
        result = await this.updateSpotCheckPlan(payload);
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
    // 按照 deviceNumber deviceName 来搜索
    customFilter(item, queryText) {
      return item.deviceName.includes(queryText) ||
       item.deviceNumber.includes(queryText);
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        this.reset();
        return;
      }
      await this.getMachineList();
      const { isNew, selectedTableList } = this;
      if (!selectedTableList.length || isNew) {
        this.reset();
        return;
      }
      const {
        checkId,
        deviceId,
        checkName,
        spotCheckFrequency,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          checkId,
          deviceId,
          checkName,
          spotCheckFrequency,
        };
      });
    },
  },
};
</script>
