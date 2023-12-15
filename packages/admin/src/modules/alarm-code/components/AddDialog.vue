<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'1300px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden">
      <v-card-title primary-title>
        <span>
          {{ $t('btn.add') }}
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
        <v-row
          justify="center"
          dense
        >
          <v-col cols="6">
            <selectable-bom-tree
              class="mx-3 mt-4"
              ref="selectableBomTree"
              :height="585"
              :bomList="formatBomList(bomList)"
              :isMultiple="false"
              :isShowMaintenancePart="false"
              :isShowMainPart="false"
              bomErrMsg=""
              alarmDisabledKey="isKeyDisabled"
              itemChildren="childrenBomList"
              itemKey="bomId"
              itemText="bomName"
              placeholder="alarmCode.dialog.searchPart"
            />
          </v-col>
          <v-col cols="6">
            <v-card-text>
              <v-row dense>
                <v-col :cols="12">
                  <div
                    class="mb-2"
                    style="color: #333;font-size: 20px;"
                  >
                    {{ $t('alarmCode.label.parameter') }}
                  </div>
                  <base-grid
                    ref="alarmParamsGrid"
                    elementName="alarmParamsGrid"
                    :restoreColumn="true"
                    :options="options"
                    v-model="selectedParams"
                  />
                </v-col>
              </v-row>
              <v-form
                ref="form"
                lazy-validation
              >
                <div class="rounded grey-thin-border mt-3">
                  <v-simple-table
                    :height="220"
                    fixed-header
                    dense
                    ref="form"
                    lazy-validation
                  >
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">
                            {{ $t('connectionConfiguration.table.number') }}
                          </th>
                          <th
                            class="text-left"
                            style="min-width: 200px !important"
                          >
                            {{ $t('alarmCode.table.alarmCode') }}
                          </th>
                          <th
                            class="text-left"
                            style="min-width: 200px !important"
                          >
                            {{ $t('alarmCode.table.alarmName') }}
                          </th>
                          <th
                            class="text-left"
                            style="min-width: 85px !important"
                          >
                            {{ $t('connectionConfiguration.table.deviceName') }}
                          </th>
                          <th
                            class="text-left"
                            style="min-width: 85px !important"
                          >
                            {{ $t('connectionConfiguration.parameterTable.parameterNumber') }}
                          </th>
                          <th
                            class="text-left"
                            style="min-width: 85px !important"
                          >
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
                              v-model="plcParams[key].alarmCode"
                              :rules="rules.name"
                              :counter="50"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              outlined
                              clearable
                              dense
                              class="mt-2"
                              v-model="plcParams[key].alarmName"
                              :rules="rules.name"
                              :counter="50"
                            ></v-text-field>
                          </td>
                          <td>{{ item.connectionName }}</td>
                          <td>{{ item.parameterNumber }}</td>
                          <td>{{ item.parameterName }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
              </v-form>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mt-4">
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          small
          text
          class="mr-2"
          @click="reset"
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
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import selectableBomTree from '@/components/commonUI/SelectableBomTree.vue';

export default {
  name: 'AlarmAddDialog',
  data() {
    return {
      tabledataobj: {},
      searchVal: '',
      selectfloder: [],
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
          },
          {
            field: 'parameterName',
            headerName: 'connectionConfiguration.parameterTable.parameterName',
            filter: 'agTextColumnFilter',
          },
        ],
        rowData: [],
        rowId: 'bomId',
        sideBar: {
          hiddenByDefault: true,
        },
        height: 320,
        pagination: false,
        rowHeight: 20,
      },
      openall: false,
      plcParams: [],
      selectedParams: [],
      gridApi: null,
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    BaseGrid,
    selectableBomTree,
  },
  computed: {
    ...mapState('alarmCode', ['bomList', 'parameterList']),
    ...mapGetters('alarmCode', ['formatBomList']),
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
      return this.$getMaintenanceRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('alarmCode', ['getBomList', 'getParameterList', 'addAlarm']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const { plcParams, selectedParams } = this;
      const { selectfloder } = this.$refs.selectableBomTree;
      if (!Object.keys(selectfloder).length) {
        this.setAlert({
          show: true,
          type: 'error',
          message: this.$t('alarmCode.label.misspart'),
        });
        return;
      }
      if (selectedParams.length === 0) {
        this.setAlert({
          show: true,
          type: 'error',
          message: this.$t('alarmCode.label.misscode'),
        });
        return;
      }
      if (this.hasDuplicateNumber(plcParams, 'alarmCode')) {
        this.setAlert({
          show: true,
          type: 'error',
          message: this.$t('alarmCode.verification.duplicate'),
        });
        return;
      }
      let result = null;
      let payload = plcParams.map((item) => {
        const obj = {
          alarmCode: item.alarmCode,
          // alarmCodeId: 0,
          alarmName: item.alarmName,
          bomId: selectfloder[0].bomId,
          parameterId: item.parameterId,
        };
        return obj;
      });
      payload = [...payload];
      result = await this.addAlarm(payload);
      if (result) {
        this.$emit('getTableList');
        this.dialog = false;
      }
    },
    // 校验是否写了重复代码
    hasDuplicateNumber(arr, field) {
      const codeSet = new Set();
      return arr.some((obj) => codeSet.size === codeSet.add(obj[field]).size);
    },
    reset() {
      this.$nextTick(() => {
        this.tabledataobj = {};
        this.selectedParams = [];
        this.$refs.selectableBomTree.selectfloder = [];
        this.plcParams = [];
      });
      this.$refs.alarmParamsGrid.gridApi.deselectAll();
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      await this.getBomList();
      await this.getParameterList(12); // 12是布尔类型的参数
      this.options.rowData = this.parameterList;
    },
    selectedParams(val) {
      const { plcParams } = this;
      const filterList = val
        .filter((v) => !plcParams.some((p) => p.parameterId === v.parameterId))
        .map((f) => {
          console.log(f);
          const obj = {
            ...f,
            columnName: f.parameterName,
            alarmName: f.parameterName,
            alarmCode: f.parameterNumber,
          };
          return obj;
        });
      this.plcParams.push(...filterList);
      this.plcParams = this.plcParams.filter((p) =>
        val.some((v) => p.parameterId === v.parameterId));
    },
  },
};
</script>
