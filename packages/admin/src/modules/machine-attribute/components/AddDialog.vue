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
              <v-autocomplete
                clearable
                :rules="rules.isRequired"
                class="mx-3 mt-2"
                :items="machineTypeList"
                item-text="typeName"
                :disabled="!isNew"
                :label="`${this.$t('machineAttribute.table.typeName')}*`"
                v-model="tabledataobj.typeObj"
                return-object
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
                        {{ item.typeId }}
                      </v-list-item-subtitle>
                      <!-- <v-list-item-subtitle>
                        {{ item.processDesc }}
                      </v-list-item-subtitle> -->
                    </v-list-item-content>
                  </div>
                </template>
              </v-autocomplete>
              <v-autocomplete
                clearable
                :rules="rules.isRequired"
                class="mx-3 mt-2"
                :items="processList"
                item-text="processName"
                item-value="processId"
                :label="`${this.$t('machineAttribute.table.processName')}*`"
                v-model="tabledataobj.processId"
              >
                <template v-slot:item="{ item }">
                  <div
                    class="d-flex justify-space-between custom-autocomplete"
                    style="width:100%"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.processName }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.processNumber }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        {{ item.processDesc }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </div>
                </template>
              </v-autocomplete>
              <v-autocomplete
                clearable
                :rules="rules.isRequired"
                class="mx-3 mt-2"
                :items="transportList"
                item-text="transportName"
                :label="`${$t('machineAttribute.table.transportName')}*`"
                v-model="tabledataobj.transportObj"
                return-object
              >
                <template v-slot:item="{ item }">
                  <div
                    class="d-flex justify-space-between custom-autocomplete"
                    style="width:100%"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.transportName }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.transportNumber }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        {{ item.transportDesc }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </div>
                </template>
              </v-autocomplete>
              <v-text-field
                class="mx-3 mt-2"
                clearable
                :rules="rules.numberWithOneDecimal"
                :label="`${$t('machineAttribute.table.stayTime')}`"
                v-model="tabledataobj.stayTime"
              ></v-text-field>
              <v-row>
                <v-col cols="12">
                  <v-checkbox
                    class="mx-3 mt-2"
                    v-model="tabledataobj.isAssignDevice"
                    :label="`${$t('machineAttribute.table.isAssignDevice')}`"
                    hide-details
                    dense
                    ></v-checkbox>
                </v-col>
                <v-col cols="12">
                  <v-checkbox
                    class="mx-3 mt-2"
                    v-model="tabledataobj.isGenerateTask"
                    :label="`${$t('machineAttribute.table.isGenerateTask')}`"
                    hide-details
                    dense
                    ></v-checkbox>
                </v-col>
                <v-col cols="12">
                  <v-checkbox
                    class="mx-3 mt-2"
                    v-model="tabledataobj.isPullTask"
                    :label="`${$t('machineAttribute.table.isPullTask')}`"
                    hide-details
                    dense
                    ></v-checkbox>
                </v-col>

              </v-row>
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
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'AttributeAddDialog',
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
    ...mapState('machineAttribute', ['transportList', 'processList', 'machineTypeList']),
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
    ...mapActions('machineAttribute', [
      'getTansportList',
      'getProcessList',
      'getMachineTypeList',
      'addMachineAttribute',
      'editMachineAttribute',
    ]),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const { isNew, tabledataobj } = this;
      const {
        attributeId,
        typeObj,
        transportObj,
        processId,
        stayTime,
        isAssignDevice,
        isGenerateTask,
        isPullTask,
      } = tabledataobj;
      const { typeId, workshopId: workshopIdInType } = typeObj;
      const { transportId, workshopId: workshopIdInTransport } = transportObj;
      if (workshopIdInType !== workshopIdInTransport) {
        this.setAlert({
          show: true,
          type: 'error',
          // message: '设备类型关联的车间和行车关联的不一致！',
          message: this.$t('machineAttribute.message.error'),

        });
        return;
      }
      let payload = {
        transportId,
        typeId,
        processId,
        stayTime,
        isAssignDevice: this.$getFormatNumber(isAssignDevice),
        isGenerateTask: this.$getFormatNumber(isGenerateTask),
        isPullTask: this.$getFormatNumber(isPullTask),
      };
      let result = null;
      if (isNew) {
        result = await this.addMachineAttribute(payload);
      } else {
        payload = {
          ...payload,
          attributeId,
        };
        result = await this.editMachineAttribute(payload);
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
      await this.getMachineTypeList();
      await this.getProcessList();
      await this.getTansportList();
      const { isNew, selectedTableList } = this;
      if (!selectedTableList.length || isNew) {
        this.reset();
        return;
      }
      const {
        attributeId,
        transportId,
        typeId,
        processId,
        stayTime,
        isAssignDevice,
        isGenerateTask,
        isPullTask,
        processName,
        transportName,
        typeName,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          attributeId,
          transportId,
          typeId,
          processId,
          stayTime,
          isAssignDevice: isAssignDevice === '1',
          isGenerateTask: isGenerateTask === '1',
          isPullTask: isPullTask === '1',
          processName,
          transportName,
          typeName,
        };
      });
    },
  },
};
</script>
