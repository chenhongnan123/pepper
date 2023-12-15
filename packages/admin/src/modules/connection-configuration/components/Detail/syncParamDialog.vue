<template>
<div>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="1000px"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            $t('connectionConfiguration.dialog.syncParams')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height: 420px;">
        <v-form
          ref="form"
          lazy-validation
        >
          <v-row>
            <v-col cols="12">
              <base-grid
                ref="syncGrid"
                elementName="syncParam"
                :restoreColumn="true"
                :options="options"
                v-model="selectedTableList"
              />
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
</div>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';

export default {
  name: 'syncParamDialog',
  data() {
    return {
      syncGridApi: null,
      options: {
        headers: [
          {
            field: 'no',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            maxWidth: 100,
            headerName: 'connectionConfiguration.table.number',
            filter: 'agTextColumnFilter',
            // eslint-disable-next-line
            valueGetter: (params) => params.node?.rowIndex + 1,
          },
          {
            field: 'identifierLabel',
            headerName: 'connectionConfiguration.parameterTable.identifierLabel',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'namespace',
            headerName: 'connectionConfiguration.parameterTable.namespace',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'parameterDataType',
            headerName: 'connectionConfiguration.parameterTable.parameterDataType',
            filter: 'agTextColumnFilter',
            valueGetter: (params) => {
              if (params.data.parameterDataType) {
                const type = this.dataTypeList
                  .find((m) => m.dictValue === String(params.data.parameterDataType));
                if (type) {
                  return type.dictLabel;
                }
                return params.data.parameterDataType;
              }
              return 'null';
            },
          },
          {
            field: 'status',
            maxWidth: 100,
            headerName: 'connectionConfiguration.parameterTable.status',
            filter: 'agTextColumnFilter',
            valueGetter: (params) => {
              if (params.data.status === 0) {
                return '可读';
              }
              if (params.data.status === 2) {
                return '不可读';
              }
              return params.data.status;
            },
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: 400,
        rowHeight: 35,
      },
      prefix: '',
      selectedTableList: [],
      ignoreList: [],
    };
  },
  props: {
    syncParamDialog: {
      type: Boolean,
      required: true,
    },
    connection: {
      type: Object,
      required: true,
    },
  },
  components: {
    BaseGrid,
  },
  computed: {
    ...mapState('helper', ['numberEmpty']),
    ...mapState('connectionConfiguration', [
      'parameterList',
      'syncParamList',
      'dataTypeList',
    ]),
    dialog: {
      get() {
        return this.syncParamDialog;
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
      'addBatchParameter',
      'getSyncParamList',
      'getParametersById',
      'getConnectionDetailByIdAndType',
    ]),
    async handleSave() {
      if (!this.selectedTableList.length === 0) {
        return;
      }
      const { prefix } = this;
      const {
        connectionId,
        connectionType,
      } = this.connection;
      await this.getParametersById(this.connection);
      const ignoreList = this.selectedTableList
        .filter((item) => this.parameterList
          .some((p) => p.identifierLabel === item.identifierLabel));
      const payload = this.selectedTableList
        .filter((item) => !this.parameterList
          .some((p) => p.identifierLabel === item.identifierLabel))
        .map((item) => {
          const obj = {
            connectionId,
            connectionType,
            parameterName: item.identifierLabel,
            identifierLabel: item.identifierLabel,
            namespace: item.namespace,
            parameterDataType: item.parameterDataType,
            maxDecimal: 3,
          };
          const nameArr = item.identifierLabel.split(`${prefix}.`);
          if (nameArr.length) {
            // 去掉前后空格
            obj.parameterNumber = nameArr[nameArr.length - 1].replace(/(^\s*)|(\s*$)/g, '').replace('.', '_');
          } else {
            obj.parameterNumber = item.identifierLabel.replace('.', '_');
          }
          return obj;
        });
      // console.log(payload, 'payload');
      if (payload.length) {
        const result = await this.addBatchParameter(payload);
        if (result) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'successAction',
          });
          this.$emit('getTableList');
          this.dialog = false;
        }
      } else {
        this.dialog = false;
      }
      if (ignoreList.length) {
        this.$emit('handleIgnore', ignoreList);
      }
    },
    reset() {
      if (this.$refs.syncGrid) {
        this.$refs.syncGrid.gridApi.deselectAll();
        this.ignoreList = [];
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      this.reset();
      await this.getSyncParamList();
      this.options.rowData = this.syncParamList;
      const {
        connectionId,
        connectionType,
      } = this.connection;
      const connection = await this.getConnectionDetailByIdAndType({
        connectionId,
        connectionType,
      }) || {};
      const { prefix } = connection;
      this.prefix = prefix || '';
    },
  },
};
</script>
