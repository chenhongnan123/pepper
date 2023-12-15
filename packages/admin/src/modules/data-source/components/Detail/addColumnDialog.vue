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
            $t('dataSource.dialog.addColumn')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-row>
            <v-col cols="12">
              <v-row dense>
                <v-col :cols="12">
                  <base-grid
                    ref="paramsGrid"
                    elementName="paramsForSelect"
                    :restoreColumn="true"
                    :options="options"
                    v-model="selectedParams"
                  />
                </v-col>
              </v-row>
              <div class="rounded grey-thin-border mt-3">
                <v-simple-table
                  :height="220"
                  fixed-header
                  dense
                >
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">
                         {{ $t('connectionConfiguration.table.number') }}
                        </th>
                        <th class="text-left" style="min-width:250px!important">
                         {{ $t('dataSource.label.columnName') }}
                        </th>
                        <th class="text-left" style="min-width:85px!important">
                         {{ $t('connectionConfiguration.table.deviceName') }}
                        </th>
                        <th class="text-left" style="min-width:150px!important">
                         {{ $t('connectionConfiguration.parameterTable.parameterNumber') }}
                        </th>
                        <th class="text-left" style="min-width:150px!important">
                         {{ $t('connectionConfiguration.parameterTable.parameterName') }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, key) in plcParams"
                        :key="key"
                      >
                        <td>{{ key + 1 }}</td>
                        <td>
                          <v-text-field
                            outlined
                            clearable
                            dense
                            class="mt-2"
                            v-model="plcParams[key].columnName"
                            :rules="rules.name"
                          ></v-text-field>
                        </td>
                        <td>{{ item.connectionName }}</td>
                        <td>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <div
                                class="d-flex justify-space-between"
                              >
                                <span
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                {{item.parameterNumber}}
                                </span>
                              </div>
                            </template>
                            <span>{{item.parameterNumber}}</span>
                          </v-tooltip>
                        </td>
                        <td>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <div
                                class="d-flex justify-space-between"
                              >
                                <span
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                {{item.parameterName}}
                                </span>
                              </div>
                            </template>
                            <span>{{item.parameterName}}</span>
                          </v-tooltip>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="mb-2">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="handleSave"
          :disabled="plcParams.length === 0"
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
import BaseGrid from '@/components/aggrid/BaseGrid.vue';

export default {
  name: 'addColumnDialog',
  data() {
    return {
      options: {
        headers: [
          {
            field: 'no',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            maxWidth: 100,
            headerName: 'dataSource.table.no',
            filter: 'agTextColumnFilter',
            // eslint-disable-next-line
            valueGetter: (params) => params.node?.rowIndex + 1,
          },
          {
            field: 'connectionName',
            headerName: 'connectionConfiguration.table.deviceName',
            filter: 'agTextColumnFilter',
            // eslint-disable-next-line
          },
          {
            field: 'connectionTypeName',
            headerName: 'connectionConfiguration.table.deviceCommunicateType',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'parameterNumber',
            headerName: 'connectionConfiguration.parameterTable.parameterNumber',
            filter: 'agTextColumnFilter',
            minWidth: 150,
          },
          {
            field: 'parameterName',
            headerName: 'connectionConfiguration.parameterTable.parameterName',
            filter: 'agTextColumnFilter',
            minWidth: 150,
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: 320,
        pagination: false,
        rowHeight: 30,
      },
      selectedParams: [],
      plcParams: [],
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    dataSource: {
      type: Object,
      required: true,
    },
  },
  components: {
    BaseGrid,
  },
  computed: {
    ...mapState('helper', ['numberEmpty']),
    ...mapState('dataSource', [
      'parameterList',
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
      return this.$getDataSourceRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('dataSource', [
      'addParameter',
      'getParameterList',
    ]),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      if (this.plcParams.length === 0) {
        return;
      }
      const {
        dataSourceId,
      } = this.dataSource;
      const payload = this.plcParams.map((item) => {
        const obj = {
          dataSourceId,
          connectionParameterNumber: `${item.connectionNumber}_${item.parameterNumber}`,
          columnName: item.columnName,
          parameterId: item.parameterId,
          parameterDataType: item.parameterDataType,
        };
        return obj;
      });
      // console.log(payload, 'payload');
      const result = await this.addParameter(payload);
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.$emit('getTableList');
        this.dialog = false;
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.selectedParams = [];
          this.plcParams = [];
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      await this.getParameterList();
      this.options.rowData = this.parameterList;
      this.reset();
    },
    selectedParams(val) {
      const { plcParams } = this;
      const filterList = val.filter((v) => !plcParams.some((p) => p.parameterId === v.parameterId))
        .map((f) => {
          const obj = {
            ...f,
            columnName: f.parameterName,
          };
          return obj;
        });
      this.plcParams.push(...filterList);
      this.plcParams = this.plcParams
        .filter((p) => val.some((v) => p.parameterId === v.parameterId));
    },
  },
};
</script>
