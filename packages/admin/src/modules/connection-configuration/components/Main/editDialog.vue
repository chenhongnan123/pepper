<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="tabledataobj.connectionType ? '800px' : '400px'"
  >
    <v-card
      style="overflow: hidden"
      max-height="500"
    >
      <v-row>
        <v-col :cols="tabledataobj.connectionType ? 6 : 12">
          <v-card-title primary-title>
            <span>
              {{ $t('connectionConfiguration.dialog.editconnectioninfo') }}
            </span>
            <v-spacer></v-spacer>
            <v-btn
              icon
              small
              @click="dialog = false"
              v-if="!tabledataobj.connectionType"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text style="height: 320px;">
            <v-form ref="formleft" v-model="valid" lazy-validation>
              <v-text-field
                clearable
                :label="`${$t('connectionConfiguration.table.deviceCode')}*`"
                v-model="tabledataobj.connectionNumber"
                :rules="rules.number"
                :counter="50"
              ></v-text-field>
              <v-text-field
                class="mt-3"
                clearable
                :label="`${$t('connectionConfiguration.table.deviceName')}*`"
                v-model="tabledataobj.connectionName"
                :rules="rules.name"
                :counter="50"
              ></v-text-field>
              <v-text-field
                class="mt-3"
                clearable
                :label="`${$t('connectionConfiguration.table.deviceDesc')}`"
                v-model="tabledataobj.connectionDescription"
                :rules="rules.description"
                :counter="500"
              ></v-text-field>
              <v-autocomplete
                class="mt-3"
                clearable
                item-text="text"
                item-value="value"
                :label="`${$t('connectionConfiguration.table.deviceCommunicateType')}*`"
                :items="items"
                :rules="rules.isRequired"
                v-model="tabledataobj.connectionType"
                disabled
                @change="communicateTypeChange"
              ></v-autocomplete>
            </v-form>
          </v-card-text>
          <v-card-actions
            v-if="!tabledataobj.connectionType"
            class="mb-2"
          >
            <v-spacer></v-spacer>
            <v-btn
              color="warning"
              small
              text
              class="mr-2"
              @click="reset"
            >{{ $t('btn.eliminate') }}</v-btn>
            <v-btn
              color="primary"
              small
              class="text-none"
              @click="handleSave"
            >{{ $t('btn.save') }}</v-btn>
          </v-card-actions>
        </v-col>
        <v-divider
          v-if="tabledataobj.connectionType"
          vertical
        ></v-divider>
        <v-col cols="6" v-if="tabledataobj.connectionType">
          <v-card-title primary-title>
            <span>{{ $t('connectionConfiguration.dialog.connectionparameter') }}</span>
            <v-spacer></v-spacer>
            <v-btn
              icon
              small
              @click="dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text style="height: 320px;">
            <v-form ref="formright" v-model="valid" lazy-validation>
              <!-- ip地址 -->
              <v-text-field
                clearable
                :rules="rules.ip"
                :label="`${$t('connectionConfiguration.table.deviceIp')}*`"
                v-model="tabledataobj.ip"
                hint="Hint: 127.168.1.1"
              ></v-text-field>
              <!-- 端口号 -->
              <v-text-field
                class="mt-3"
                clearable
                :rules="rules.port"
                :label="`${$t('connectionConfiguration.table.devicePort')}*`"
                v-model="tabledataobj.port"
                v-if="tabledataobj.connectionType === '3'
                  || tabledataobj.connectionType === '4'
                  || tabledataobj.connectionType === '5'"
              ></v-text-field>
              <!-- 机架号 -->
              <v-text-field
                class="mt-3"
                clearable
                :rules="rules.rackandslot"
                :label="`${$t('connectionConfiguration.table.deviceArea')}*`"
                v-model="tabledataobj.slot"
                hint="Hint: 1"
                v-if="tabledataobj.connectionType === '1'"
              ></v-text-field>
              <!-- 站点 -->
              <v-text-field
                class="mt-3"
                clearable
                :rules="rules.rackandslot"
                :label="`${$t('connectionConfiguration.table.deviceSlot')}*`"
                v-model="tabledataobj.rack"
                v-if="tabledataobj.connectionType === '1'"
              ></v-text-field>
              <!-- 节点Url -->
              <v-row no-gutters v-if="tabledataobj.connectionType === '2'">
                <v-col cols="6" class="pr-2">
                  <v-text-field
                    class="mt-3"
                    :label="`${$t('connectionConfiguration.table.opcuaUrl')}*`"
                    :value="urlPre"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    class="mt-3"
                    clearable
                    :rules="rules.isRequired"
                    :label="`${$t('connectionConfiguration.table.endpoint')}*`"
                    v-model="tabledataobj.endpoint"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- 类名 -->
              <v-text-field
                class="mt-3"
                clearable
                :rules="rules.prefix"
                :label="`${$t('connectionConfiguration.table.prefix')}*`"
                v-model="tabledataobj.prefix"
                v-if="tabledataobj.connectionType === '2'"
              ></v-text-field>
              <!-- 采集频率 -->
              <v-autocomplete
                class="mt-3"
                clearable
                item-text="text"
                item-value="value"
                :label="`${$t('connectionConfiguration.table.timeout')}*`"
                :items="timeoutList"
                :rules="rules.isRequired"
                v-model="tabledataobj.timeout"
              ></v-autocomplete>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              small
              class="text-none"
              @click="handleSave"
            >{{ $t('btn.save') }}</v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
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
  name: 'editConnection',
  data() {
    return {
      valid: true,
      urlPre: 'opc.tcp://',
      tabledataobj: {
      },
    };
  },
  props: {
    editDialog: {
      type: Boolean,
      required: true,
    },
    selectedTableList: {
      type: Array,
      required: false,
    },
    rules: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('helper', ['currentLocale']),
    ...mapState('connectionConfiguration', ['protocalList', 'timeoutList']),
    dialog: {
      get() {
        return this.editDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    items() {
      if (this.protocalList?.length) {
        return this.protocalList;
      }
      return [];
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('connectionConfiguration', [
      'updateConnection',
      'getConnectionDetailByIdAndType',
    ]),
    communicateTypeChange() {
      if (this.$refs.formright) {
        this.$refs.formright.reset();
      }
    },
    async handleSave() {
      if (!this.$refs.formleft.validate() || !this.$refs.formright.validate()) {
        return;
      }
      const { tabledataobj, urlPre } = this;
      const {
        connectionName,
        connectionNumber,
        connectionDescription,
        connectionType,
        ip,
        endpoint,
        port,
        slot,
        rack,
        timeout,
        prefix,
        connectionId,
      } = tabledataobj;
      const payload = {
        connectionName,
        connectionNumber,
        connectionDescription,
        connectionType,
        ip,
        endpoint: `${urlPre}${ip}:${endpoint}`,
        port: Number(port),
        slot: Number(slot),
        rack: Number(rack),
        timeout,
        prefix,
        connectionId,
      };
      const result = await this.updateConnection(payload);
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.reset();
        this.dialog = false;
        this.$emit('getTableList');
      }
    },
    reset() {
      if (this.$refs.formleft) {
        this.$refs.formleft.reset();
      }
      if (this.$refs.formright) {
        this.$refs.formright.reset();
      }
      this.$nextTick(() => {
        this.tabledataobj = {
        };
      });
    },
  },
  watch: {
    async dialog() {
      const { selectedTableList } = this;
      if (selectedTableList.length === 0) {
        this.reset();
        return;
      }
      const {
        connectionId,
        connectionType,
        connectionName,
        connectionNumber,
        connectionDescription,
        ip,
        timeout,
      } = selectedTableList[0];
      const connection = await this.getConnectionDetailByIdAndType({
        connectionId,
        connectionType,
      });
      if (connection) {
        const {
          endpoint,
          port,
          slot,
          rack,
          prefix,
        } = connection;
        this.$nextTick(async () => {
          this.tabledataobj = {
            connectionName,
            connectionNumber,
            connectionDescription,
            connectionType,
            ip,
            endpoint: endpoint ? endpoint.split(':')[2] : '',
            port,
            slot,
            rack,
            connectionId,
            timeout,
            prefix,
          };
        });
      }
    },
  },
};
</script>
