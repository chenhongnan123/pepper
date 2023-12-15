<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="800px"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            !isAddNew
            ? $t('connectionConfiguration.dialog.editparameter')
            : $t('connectionConfiguration.dialog.addparameter')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="">
        <v-form
          ref="form"
          lazy-validation
        >
          <v-row>
            <v-col cols="6">
              <v-text-field
                class="mt-3"
                clearable
                dense
                :rules="rules.paramNumber"
                :label="`${$t('connectionConfiguration.parameterTable.parameterNumber')}*`"
                v-model="tabledataobj.parameterNumber"
                :counter="100"
              ></v-text-field>
              <v-text-field
                class="mt-3"
                clearable
                dense
                :rules="rules.name"
                :label="`${$t('connectionConfiguration.parameterTable.parameterName')}*`"
                v-model="tabledataobj.parameterName"
                :counter="50"
              ></v-text-field>
              <v-text-field
                class="mt-3"
                clearable
                dense
                :label="$t('connectionConfiguration.parameterTable.parameterDescription')"
                v-model="tabledataobj.parameterDescription"
              ></v-text-field>
              <v-autocomplete
                class="mt-3"
                clearable
                dense
                :label="`${$t('connectionConfiguration.parameterTable.parameterDataType')}*`"
                :items="dataTypeList"
                item-text="dictLabel"
                item-value="dictValue"
                v-model="tabledataobj.parameterDataType"
                :rules="rules.isRequired"
              >
                <template v-slot:item="{ item }">
                <div
                  class="d-flex justify-space-between custom-autocomplete"
                  style="width:100%"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.dictLabel }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ item.dictValue }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{ item.remark }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-icon v-if="item.disabled">mdi-cancel</v-icon>
                </div>
                </template>
              </v-autocomplete>
              <v-text-field
                class="mt-3"
                clearable
                dense
                :label="`${$t('connectionConfiguration.parameterTable.dbAddress')}*`"
                v-model="tabledataobj.dbAddress"
                :rules="rules.datablock"
                v-if="connection.connectionType === '1'"
              ></v-text-field>
              <v-text-field
                class="mt-3"
                clearable
                dense
                :label="`${$t('connectionConfiguration.parameterTable.startAddress')}*`"
                v-model="tabledataobj.startAddress"
                :rules="rules.interge"
                v-if="connection.connectionType === '1'"
              ></v-text-field>
              <v-text-field
                class="mt-3"
                clearable
                dense
                :label="`${$t('connectionConfiguration.parameterTable.mcAddress')}*`"
                v-model="tabledataobj.mcAddress"
                :rules="rules.interge"
                v-if="connection.connectionType === '4'"
              ></v-text-field>
              <v-text-field
                class="mt-3"
                clearable
                dense
                :label="`${$t('connectionConfiguration.parameterTable.modbusStartAddress')}*`"
                v-model="tabledataobj.modbusStartAddress"
                :rules="rules.interge"
                v-if="connection.connectionType === '5'"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                class="mt-3"
                clearable
                dense
                :label="`${$t('connectionConfiguration.parameterTable.ethernetName')}*`"
                v-model="tabledataobj.ethernetName"
                :rules="rules.number"
                v-if="connection.connectionType === '3'"
              ></v-text-field>
              <v-text-field
                class="mt-3"
                clearable
                type="number"
                dense
                :label="`${$t('connectionConfiguration.parameterTable.size')}*`"
                v-model="tabledataobj.size"
                :rules="rules.interge"
                v-if="connection.connectionType === '1'
                  || connection.connectionType === '4'
                  || connection.connectionType === '5'"
              ></v-text-field>
              <v-text-field
                class="mt-3"
                clearable
                type="number"
                dense
                :label="`${$t('connectionConfiguration.parameterTable.bitNumber')}*`"
                v-model="tabledataobj.bitNumber"
                :rules="rules.interge"
                v-if="connection.connectionType === '1'
                  || connection.connectionType === '5'"
              ></v-text-field>
              <v-text-field
                class="mt-3"
                clearable
                dense
                :label="`${$t('connectionConfiguration.parameterTable.namespace')}*`"
                v-model="tabledataobj.namespace"
                :rules="rules.interge"
                v-if="connection.connectionType === '2'"
              ></v-text-field>
              <v-text-field
                class="mt-3"
                clearable
                dense
                :label="`${$t('connectionConfiguration.parameterTable.identifierLabel')}*`"
                v-model="tabledataobj.identifierLabel"
                :rules="rules.isRequired"
                v-if="connection.connectionType === '2'"
              ></v-text-field>
              <v-text-field
                class="mt-3"
                clearable
                dense
                :label="`${$t('connectionConfiguration.parameterTable.maxDecimal')}*`"
                type="number"
                v-model="tabledataobj.maxDecimal"
                :rules="rules.interge"
                v-if="connection.connectionType === '1' || connection.connectionType === '2'"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="mb-2">
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          small
          text
          class="mr-2"
          @click="reset"
          v-if="isAddNew"
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
  data() {
    return {
      tabledataobj: {},
      showUpperLimit: true,
      showLowerLimit: true,
    };
  },
  props: {
    paramDialog: {
      type: Boolean,
      required: true,
    },
    isAddNew: {
      type: Boolean,
      required: true,
    },
    selectedTableList: {
      type: Array,
    },
    connection: {
      type: Object,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('helper', ['numberEmpty']),
    ...mapState('connectionConfiguration', [
      'dataTypeList',
    ]),
    dialog: {
      get() {
        return this.paramDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    deviceCode() {
      return this.$route.params.id || '';
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('connectionConfiguration', [
      'addParameter',
      'updateParameter',
      'getDataTypeList',
    ]),
    // 重新定义过滤器，支持多字段过滤
    filterFunc(item, queryText, itemText) {
      if (!queryText) {
        return true;
      }
      return itemText.toLowerCase().indexOf(queryText.toLowerCase()) > -1
      || item.dataTypeNum.toLowerCase().indexOf(queryText.toLowerCase()) > -1;
    },
    filterProductFunc(item, queryText, itemText) {
      if (!queryText) {
        return true;
      }
      return itemText.toLowerCase().indexOf(queryText.toLowerCase()) > -1
      || item.productCode.toLowerCase().indexOf(queryText.toLowerCase()) > -1;
    },
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        connectionId,
        connectionType,
      } = this.connection;
      const {
        parameterId,
        parameterName,
        parameterNumber,
        parameterDescription,
        parameterDataType,
        bitNumber,
        dbAddress,
        ethernetName,
        mcAddress,
        modbusStartAddress,
        identifierLabel,
        maxDecimal,
        namespace,
        size,
        startAddress,
      } = this.tabledataobj;
      const payload = {
        parameterId,
        connectionId,
        connectionType,
        parameterName,
        parameterNumber,
        parameterDescription,
        parameterDataType,
        bitNumber,
        dbAddress,
        ethernetName,
        mcAddress,
        modbusStartAddress,
        identifierLabel,
        maxDecimal,
        namespace,
        size,
        startAddress,
      };
      // console.log(payload, 'payload');
      let result = null;
      if (this.isAddNew) {
        delete payload.parameterId;
        result = await this.addParameter(payload);
      } else {
        result = await this.updateParameter(payload);
      }
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        if (this.isAddNew) {
          this.$emit('getTableList');
        } else {
          this.$emit('getTableList', 1);
        }
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
      await this.getDataTypeList();
      const {
        selectedTableList,
      } = this;
      if (this.isAddNew) {
        this.reset();
        return;
      }
      if (selectedTableList.length) {
        const {
          parameterId,
          parameterName,
          parameterNumber,
          parameterDescription,
          parameterDataType,
          bitNumber,
          dbAddress,
          identifierLabel,
          maxDecimal,
          namespace,
          size,
          startAddress,
          ethernetName,
          mcAddress,
          modbusStartAddress,
        } = selectedTableList[0];
        this.$nextTick(async () => {
          this.tabledataobj = {
            ...this.tabledataobj,
            parameterId,
            parameterName,
            parameterNumber,
            parameterDescription,
            parameterDataType: String(parameterDataType),
            bitNumber,
            dbAddress,
            identifierLabel,
            maxDecimal,
            namespace,
            size,
            startAddress,
            ethernetName,
            mcAddress,
            modbusStartAddress,
          };
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  .custom-autocomplete {
    ::v-deep .v-list-item__subtitle, .v-list-item__title {
      line-height: normal!important;
    }
  } /* 解决windows系统list-item组件内容_遮挡显示问题 */
</style>
