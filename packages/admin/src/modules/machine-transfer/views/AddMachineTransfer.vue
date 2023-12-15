<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.addMachineTransfer">
      <v-btn class="mb-1" icon @click="$router.push('/machine-transfer')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ $t(`modules.${moduleName}`) }}
      <v-btn icon small class="ml-2 mb-1" @click="refresh">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card class="" elevation="0" color="bg">
          <v-row no-gutters class="pa-4">
            <v-col cols="6">
              <div>{{ $t('machineTransfer.label.sourceDeviceType') }}</div>
              <div>
                <v-autocomplete
                  class="mt-3"
                  style="width: 50%"
                  clearable
                  :label="$t('machineTransfer.label.devicetypedropdown')"
                  item-text="typeName"
                  item-value="typeId"
                  :items="sourceTypeList"
                  v-model="sourceTypeId"
                >
                  <template v-slot:item="{ item }">
                    <div class="d-flex justify-space-between" style="width: 100%">
                      <v-list-item-content>
                        <v-list-item-title v-text="item.typeName"></v-list-item-title>
                        <v-list-item-subtitle
                          v-text="item.typeId"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                    </div>
                  </template>
                </v-autocomplete>
              </div>
              <base-grid
                style="width: 90%"
                ref="sourceTypeGrid"
                elementName="sourceTypeGrid"
                :restoreColumn="true"
                :options="sourceTypeOption"
                v-model="selectedSourceTypeList"
              />
            </v-col>
            <v-col cols="6">
              <div>{{ $t('machineTransfer.label.targetDeviceType') }}</div>
              <div>
                <v-autocomplete
                  style="width: 50%"
                  class="mt-3"
                  clearable
                  :label="`${$t('machineTransfer.label.devicetypedropdown')}`"
                  item-text="typeName"
                  item-value="typeId"
                  :items="targetTypeList"
                  v-model="targetTypeId"
                >
                  <template v-slot:item="{ item }">
                    <div class="d-flex justify-space-between" style="width: 100%">
                      <v-list-item-content>
                        <v-list-item-title v-text="item.typeName"></v-list-item-title>
                        <v-list-item-subtitle
                          v-text="item.typeId"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                    </div>
                  </template>
                </v-autocomplete>
              </div>
              <base-grid
                style="width: 90%"
                ref="targetTypeGrid"
                elementName="targetTypeGrid"
                :restoreColumn="true"
                :options="targetTypeOption"
                v-model="selectedTargetTypeList"
              />
            </v-col>
          </v-row>
          <v-row no-gutters class="pa-4">
            <v-col cols="12" class="d-flex">
              <span>{{ $t('machineTransfer.label.machineTransferList') }}</span>
              <v-spacer></v-spacer>
              <v-btn
                small
                class="text-none mr-2"
                color="error"
                outlined
                :disabled="selectedTypeList.length === 0"
                @click="reduce"
              >
                {{ $t('machineTransfer.btn.reduce') }}
              </v-btn>
              <v-btn
                small
                class="text-none mr-2"
                color="primary"
                :disabled="loadbtnabled"
                @click="load"
              >
                {{ $t('machineTransfer.btn.load') }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row no-gutters class="pa-4">
            <v-col cols="12">
              <base-grid
                ref="totalTypeGrid"
                elementName="totalTypeGrid"
                :restoreColumn="true"
                :options="totalTypeOption"
                v-model="selectedTypeList"
              />
            </v-col>
          </v-row>
          <v-row no-gutters class="pa-4">
            <v-col cols="12" class="d-flex justify-end">
              <v-btn
                small
                class="text-none mr-2"
                color="primary"
                outlined
                :disabled="totalTypeOption.rowData.length === 0"
                @click="saveExit"
              >
                {{ $t('machineTransfer.btn.saveexit') }}
              </v-btn>
              <v-btn
                small
                class="text-none mr-2"
                color="primary"
                :disabled="totalTypeOption.rowData.length === 0"
                @click="save"
              >
                {{ $t('machineTransfer.btn.save') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <ignore-dialog
      :ignoreDialog="ignoreDialog"
      @closeDialog="ignoreDialog = false"
      :items="ignorelist"
      :headers="ignoreHeader"
    />
  </v-container>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
  // mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import IgnoreDialog from '../components/IgnoreDialog.vue';

export default {
  name: 'AddParameterTransfer',
  data() {
    return {
      clientHeight: document.body.clientHeight,
      elementName: 'addMachineTransfer',
      sourceTypeOption: {
        headers: [
          {
            field: 'no',
            checkboxSelection: true,
            headerName: this.$t('machineTransfer.table.no'),
            valueGetter: 'node.rowIndex + 1',
            index: 1,
            filter: 'agTextColumnFilter',
          },
          {
            field: 'deviceName',
            headerName: this.$t('machineTransfer.table.deviceName'),
            filter: 'agTextColumnFilter',
          },
          {
            field: 'deviceNumber',
            headerName: this.$t('machineTransfer.table.deviceNumber'),
            filter: 'agTextColumnFilter',
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        rowDataId: 'deviceId', // 传递对象的唯一标识符
        rowSelection: 'single', // 单选
        height: (document.body.clientHeight - 410) * 0.6,
        rowHeight: 35,
        pagination: false,
      },
      targetTypeOption: {
        headers: [
          {
            field: 'no',
            checkboxSelection: true,
            headerName: this.$t('machineTransfer.table.no'),
            valueGetter: 'node.rowIndex + 1',
            filter: 'agTextColumnFilter',
            headerCheckboxSelection: true,
          },
          {
            field: 'deviceName',
            headerName: this.$t('machineTransfer.table.deviceName'),
            filter: 'agTextColumnFilter',
          },
          {
            field: 'deviceNumber',
            headerName: this.$t('machineTransfer.table.deviceNumber'),
            filter: 'agTextColumnFilter',
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        rowDataId: 'deviceId', // 传递对象的唯一标识符
        height: (document.body.clientHeight - 410) * 0.6,
        // height: document.body.clientHeight - 240,
        rowHeight: 35,
        pagination: false,
      },
      totalTypeOption: {
        headers: [
          {
            field: 'no',
            checkboxSelection: true,
            headerName: this.$t('machineTransfer.table.no'),
            filter: 'agTextColumnFilter',
            headerCheckboxSelection: true,
          },
          {
            field: 'sourceDeviceName',
            headerName: this.$t('machineTransfer.table.sourceDeviceName'),
            filter: 'agTextColumnFilter',
          },
          {
            field: 'sourceDeviceNumber',
            headerName: this.$t('machineTransfer.table.sourceDeviceNumber'),
            filter: 'agTextColumnFilter',
          },
          {
            field: 'targetDeviceName',
            headerName: this.$t('machineTransfer.table.targetDeviceName'),
            filter: 'agTextColumnFilter',
          },
          {
            field: 'targetDeviceNumber',
            headerName: this.$t('machineTransfer.table.targetDeviceNumber'),
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: (document.body.clientHeight - 410) * 0.4,
        // height: document.body.clientHeight - 718,
        rowHeight: 35,
        pagination: false,
      },
      selectedSourceTypeList: [], // ag grid 选中
      sourceTypeId: null, // autocomplate 选中 是id
      selectedTargetTypeList: [],
      targetTypeId: null,
      ignorelist: [],
      ignoreDialog: false,
      selectedTypeList: [], // aggrid 选中的流转设备清单
      sourceTypeGrid: null,
      targetTypeGrid: null,
      totalTypeGrid: null,
    };
  },
  components: {
    BaseGrid,
    IgnoreDialog,
  },
  created() {
    this.init();
  },
  // activated() {
  mounted() {
    this.sourceTypeGrid = this.$refs.sourceTypeGrid.gridApi;
    this.targetTypeGrid = this.$refs.targetTypeGrid.gridApi;
    this.totalTypeGrid = this.$refs.totalTypeGrid.gridApi;
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapState('machineTransfer', ['machineTypeList']),
    moduleName() {
      return this.$route.name;
    },
    sourceTypeList() { // 来源设备类型
      return this.machineTypeList.filter((item) => item.typeId !== this.targetTypeId);
    },
    targetTypeList() { // 目标设备类型
      return this.machineTypeList.filter((item) => item.typeId !== this.sourceTypeId);
    },
    loadbtnabled() {
      return this.selectedSourceTypeList.length === 0
        || this.selectedTargetTypeList.length === 0;
    },
    ignoreHeader() {
      return [
        {
          text: this.$t('machineTransfer.table.no'),
          value: 'no',
          width: 50,
          sortable: false,
        },
        {
          text: this.$t('machineTransfer.table.sourceDeviceName'),
          value: 'sourceDeviceName',
          width: 130,
          sortable: true,
        },
        {
          text: this.$t('machineTransfer.table.sourceDeviceNumber'),
          value: 'sourceDeviceNumber',
          width: 130,
          sortable: true,
        },
        {
          text: this.$t('machineTransfer.table.targetDeviceName'),
          value: 'targetDeviceName',
          width: 130,
          sortable: true,
        },
        {
          text: this.$t('machineTransfer.table.targetDeviceNumber'),
          value: 'targetDeviceNumber',
          width: 130,
          sortable: true,
        },
      ];
    },
  },
  methods: {
    ...mapActions('machineTransfer', [
      'getMachineTypeList',
      'getMachineList',
      'addMachineTransfer',
    ]),
    ...mapMutations('machineTransfer', ['setMachineTypeList']),
    async init() {
      await this.getMachineTypeList();
    },
    refresh() {
      this.init();
      this.resetRowData();
      this.resetSelectedTypeId();
    },
    resetSelect() {
      if (this.sourceTypeGrid) {
        this.sourceTypeGrid.deselectAll();
      }
      if (this.targetTypeGrid) {
        this.targetTypeGrid.deselectAll();
      }
      if (this.totalTypeGrid) {
        this.totalTypeGrid.deselectAll();
      }
    },
    resetRowData() {
      this.totalTypeOption.rowData = [];
      this.sourceTypeOption.rowData = [];
      this.targetTypeOption.rowData = [];
    },
    // 清空autocomplete选中的typeId
    resetSelectedTypeId() {
      this.sourceTypeId = null;
      this.targetTypeId = null;
    },
    reduce() {
      let transferList = this.totalTypeOption.rowData;
      this.selectedTypeList.forEach((item) => {
        this.$set(transferList, item.no - 1, null);
      });
      transferList = transferList.filter((i) => i).map((item, index) => ({ // 去掉为null的数据
        ...item,
        no: index + 1,
      }));
      this.totalTypeOption.rowData = transferList;
      this.totalTypeGrid.deselectAll();
    },
    load() {
      const { selectedSourceTypeList, selectedTargetTypeList } = this;
      let currentMachineList = [];
      this.ignorelist = [];
      for (let i = 0; i < selectedSourceTypeList.length; i += 1) {
        for (let k = 0; k < selectedTargetTypeList.length; k += 1) {
          currentMachineList.push({
            id: `${selectedSourceTypeList[i].deviceId}-${selectedTargetTypeList[k].deviceId}`,
            sourcemachineid: selectedSourceTypeList[i].deviceId,
            sourceDeviceNumber: selectedSourceTypeList[i].deviceNumber,
            sourceDeviceName: selectedSourceTypeList[i].deviceName,
            targetmachineid: selectedTargetTypeList[k].deviceId,
            targetDeviceNumber: selectedTargetTypeList[k].deviceNumber,
            targetDeviceName: selectedTargetTypeList[k].deviceName,
          });
        }
      }
      const { rowData } = this.totalTypeOption; // 拿到已有的设备流转清单
      this.ignorelist = currentMachineList
        .filter((item) => rowData
          .some((record) => (
            item.targetmachineid === record.targetmachineid
            && item.sourcemachineid === record.sourcemachineid
          )));
      // 去重
      currentMachineList = currentMachineList
        .filter((item) => (!rowData
          .some((record) => (
            item.targetmachineid === record.targetmachineid
            && item.sourcemachineid === record.sourcemachineid
          ))));

      if (this.ignorelist.length > 0) {
        this.ignoreDialog = true;
      }
      const transferList = [...rowData, ...currentMachineList]
        .map((item, index) => ({
          ...item,
          no: index + 1, // reduce的时候需要no
        }));
      this.totalTypeOption.rowData = transferList;
      this.resetSelect();
    },
    async save() {
      const result = await this.submit();
      if (result) {
        this.resetSelect();
        this.resetRowData();
        this.resetSelectedTypeId();
      }
    },
    async saveExit() {
      const result = await this.submit();
      if (result) this.$router.push({ name: 'machineTransfer' });
    },
    async submit() {
      const { rowData } = this.totalTypeOption;
      const payload = rowData.map((item) => ({
        sourceDeviceId: item.sourcemachineid,
        targetDeviceId: item.targetmachineid,
      }));
      const result = await this.addMachineTransfer(payload);
      return result;
    },
  },
  watch: {
    async targetTypeId(typeId) {
      if (typeId) { // clear的时候 typeId是 null
        const result = await this.getMachineList(typeId);
        this.targetTypeOption.rowData = result;
      } else {
        this.targetTypeOption.rowData = [];
        this.targetTypeGrid.deselectAll();
      }
    },
    async sourceTypeId(typeId) {
      if (typeId) {
        const result = await this.getMachineList(typeId);
        this.sourceTypeOption.rowData = result;
      } else {
        this.sourceTypeOption.rowData = [];
        this.sourceTypeGrid.deselectAll();
      }
    },
  },
};
</script>
