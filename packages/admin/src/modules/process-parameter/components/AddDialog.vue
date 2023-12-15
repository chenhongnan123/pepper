<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'480px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            isNew
            ? $t('processParameter.dialog.add')
            : $t('processParameter.dialog.edit')
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
          <v-row
            justify="center"
            dense
          >
            <v-col cols="12" >
              <v-autocomplete
                clearable
                :rules="rules.isRequired"
                :label="`${$t('processParameter.table.productNumber')}*`"
                class="mx-3 mt-2"
                v-model="tabledataobj.productId"
                :items="productList"
                item-text="productName"
                item-value="productId"
              >
                <template #item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.productName }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.productName }}</v-list-item-subtitle>
                    <v-list-item-subtitle>{{ item.productDesc }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
              <v-autocomplete
                clearable
                :rules="rules.isRequired"
                :label="`${$t('processParameter.table.processNumber')}*`"
                class="mx-3 mt-2"
                v-model="tabledataobj.processId"
                :items="processList"
                item-text="processName"
                item-value="processId"
              >
                <template #item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.processName }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.processNumber }}</v-list-item-subtitle>
                    <v-list-item-subtitle>{{ item.processDesc }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :rules="rules.name"
                :label="`${$t('processParameter.table.mesLabel')}*`"
                v-model="tabledataobj.mesLabel"
                :counter="50"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :rules="rules.name"
                :label="`${$t('processParameter.table.label')}*`"
                v-model="tabledataobj.processParamLabel"
                :counter="50"
              ></v-text-field>
              <div class="mx-3 mt-1">{{ `${$t('processParameter.table.type')}*` }}</div>
              <v-radio-group
                v-model="tabledataobj.type"
                row
                class="mx-3 mt-0"
                :rules="rules.isRequired"
                dense
              >
                <v-radio
                  :label="$t('processParameter.label.type.0')"
                  :value="'0'"
                ></v-radio>
                <v-radio
                  :label="$t('processParameter.label.type.1')"
                  :value="'1'"
                ></v-radio>
              </v-radio-group>
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
  name: 'processParamAddDialog',
  data() {
    return {
      tabledataobj: {
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
  components: {
  },
  computed: {
    ...mapState('processParameter', [
      'productList',
      'processList',
    ]),
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
      return this.$getDeptRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('processParameter', [
      'getProductList',
      'getProcessList',
      'addProcessParam',
      'editProcessParam',
    ]),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        isNew,
        tabledataobj,
      } = this;
      const {
        processParamId,
        processParamLabel,
        mesLabel,
        processId,
        productId,
        type,
      } = tabledataobj;
      let payload = {
        processParamLabel,
        mesLabel,
        processId,
        productId,
        type,
        delFlag: 0,
      };
      let result = null;
      if (isNew) {
        result = await this.addProcessParam(payload);
      } else {
        payload = {
          ...payload,
          processParamId,
        };
        result = await this.editProcessParam(payload);
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
      await this.getProductList();
      await this.getProcessList();
      const { selectedTableList, isNew } = this;
      if (isNew || selectedTableList.length === 0) {
        this.reset();
        return;
      }
      this.$nextTick(() => {
        this.tabledataobj = {
          ...selectedTableList[0],
        };
      });
    },
  },
};
</script>
