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
                :rules="rules.limit50LenStrRequire"
                :label="`${$t('machineType.table.typeName')}*`"
                v-model="tabledataobj.typeName"
                :counter="50"
              ></v-text-field>
              <v-autocomplete
                clearable
                :rules="rules.isRequired"
                class="mx-3 mt-2"
                :items="dictDataList"
                item-text="dictLabel"
                item-value="dictCode"
                :label="`${$t('machineType.label.type')}*`"
                v-model="tabledataobj.typeDictCode"
              ></v-autocomplete>
              <v-autocomplete
                clearable
                :rules="rules.isRequired"
                class="mx-3 mt-2"
                :items="workshopList"
                item-text="workshopName"
                item-value="workshopId"
                :label="`${$t('machineType.label.workshop')}*`"
                v-model="tabledataobj.workshopId"
              >
                <template v-slot:item="{ item }">
                  <div
                    class="d-flex justify-space-between custom-autocomplete"
                    style="width:100%"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.workshopName }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.workshopNumber }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        {{ item.workshopDesc }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </div>
                  </template>
              </v-autocomplete>
              <v-checkbox
                :label="`${$t('machineType.table.isCheckType')}`"
                v-model="tabledataobj.isCheckType">
              </v-checkbox>
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
  name: 'WorkshopAddDialog',
  data() {
    return {
      tabledataobj: {
        isCheckType: false,
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
  components: {},
  computed: {
    ...mapState('machineType', ['dictDataList', 'workshopList']),
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
    ...mapActions('machineType', [
      'addMachineType',
      'editMachineType',
      'getDictDataList',
      'getWorkshopList',
    ]),
    async handleSave() {
      console.log(this.tabledataobj);
      if (!this.$refs.form.validate()) {
        return;
      }
      const { isNew, tabledataobj } = this;
      const {
        typeId,
        typeName,
        isCheckType,
        typeDictCode,
        workshopId,
      } = tabledataobj;
      let payload = {
        typeName,
        isCheckType: isCheckType ? '1' : '0',
        typeDictCode,
        workshopId,
      };
      let result = null;
      if (isNew) {
        result = await this.addMachineType(payload);
      } else {
        payload = {
          ...payload,
          typeId,
        };
        result = await this.editMachineType(payload);
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
            isCheckType: false,
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
      await this.getWorkshopList();
      await this.getDictDataList('basic_device_type');
      const { isNew, selectedTableList } = this;
      if (!selectedTableList.length || isNew) {
        this.reset();
        return;
      }
      const {
        typeId,
        typeName,
        isCheckType,
        workshopId,
        typeDictLabel,
        typeDictCode,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          typeId,
          typeName,
          isCheckType: Number(isCheckType),
          workshopId,
          dictLabel: typeDictLabel,
          typeDictCode,
        };
      });
    },
  },
};
</script>
