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
                :items="machineList"
                item-text="deviceNumber"
                item-value="deviceId"
                return-object
                :disabled="!isNew"
                :label="`${this.$t('recipeManagement.table.deviceNumber')}*`"
                v-model="device"
              >
                <template v-slot:item="{ item }">
                  <div
                    class="d-flex justify-space-between custom-autocomplete"
                    style="width:100%"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.deviceNumber }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.deviceName }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        {{ item.deviceName }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </div>
                </template>
              </v-autocomplete>
              <v-text-field
                class="mx-3 mt-2"
                clearable
                :rules="rules.isRequired"
                :label="`${$t('recipeManagement.table.recipeVersion')}*`"
                v-model="recipeVersion"
                :disabled="!isNew"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-2"
                clearable
                :label="`${$t('recipeManagement.table.remark')}`"
                v-model="remark"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="mt-4">
        <v-spacer></v-spacer>
        <v-btn color="warning" small text class="mr-2" @click="reset">
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
import moment from 'moment';
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'ProductAddDialog',
  data() {
    return {
      machineList: [],
      device: null,
      recipeVersion: '',
      remark: '',
      serialNumberCount: null,
      serialNumberId: null,
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
    recipeType: {
      type: Number,
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
    ...mapActions('recipeManagement', [
      'getList',
      'addRecipe',
      'editRecipe',
    ]),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        isNew,
        device,
        recipeVersion,
        remark,
        recipeType,
        serialNumberCount,
        serialNumberId,
      } = this;
      const payload = {
        deviceId: device.deviceId,
        recipeVersion,
        remark,
        recipeType,
        status: 0,
        serialNumberCount,
        serialNumberId,
      };
      let result = null;
      if (isNew) {
        result = await this.addRecipe(payload);
      } else {
        result = await this.editRecipe(payload);
      }
      if (result) {
        this.$emit('getTableList');
        this.dialog = false;
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
        this.$nextTick(() => {
          if (this.isNew) {
            this.device = null;
            this.recipeVersion = '';
          }
          this.remark = '';
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
      this.machineList = await this.getList({
        elementName: 'device/simple',
      });
      const { isNew, selectedTableList } = this;
      if (!selectedTableList.length || isNew) {
        this.reset();
        return;
      }
      const {
        deviceId,
        recipeVersion,
        remark,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.device = {
          deviceId,
        };
        this.recipeVersion = recipeVersion;
        this.remark = remark;
      });
    },
    device: {
      async handler(device) {
        if (!device) {
          this.recipeVersion = '';
          return;
        }
        if (!this.isNew) {
          return;
        }
        console.log(device, 'device');
        const serialNumberKey = `${device.deviceNumber}-${moment().format('yyyyMMDD')}`;
        const serialNumberObj = await this.getList({
          elementName: 'number',
          query: `?serialNumberGroup=recipe&serialNumberKey=${serialNumberKey}`,
        });
        let serialNumberCount = '01';
        if (serialNumberObj.length > 0) {
          serialNumberCount = `${serialNumberObj[0].serialNumberCount + 1}`.padStart(2, 0);
          this.serialNumberId = serialNumberObj[0].serialNumberId;
          this.serialNumberCount = serialNumberCount;
        }
        this.recipeVersion = `${serialNumberKey}${serialNumberCount}`;
      },
    },
  },
};
</script>
