<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.addProductTransfer">
      <v-btn class="mb-1" icon @click="$router.push('/product-transfer')">
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
              <div>{{ $t('productTransfer.label.deviceType') }}</div>
              <div>
                <v-autocomplete
                  class="mt-3"
                  style="width: 50%"
                  clearable
                  :label="$t('productTransfer.label.devicetypedropdown')"
                  item-text="typeName"
                  item-value="typeId"
                  :items="machineTypeList"
                  v-model="machineTypeId"
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
                ref="machineTypeGrid"
                elementName="machineTypeGrid"
                :restoreColumn="true"
                :options="machineTypeOption"
                v-model="selectedMachineTypeList"
              />
            </v-col>
            <v-col cols="6">
              <div>{{ $t('productTransfer.label.product') }}</div>
              <!-- <div>
                 <v-autocomplete
                  style="width: 50%"
                  disabled
                  class="mt-3"
                  clearable
                  label="设备类型下拉"
                  item-text="typeName"
                  item-value="typeId"
                  :items="productList"
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
              </div> -->
              <base-grid
                class="mt-3"
                style="width: 90%"
                ref="productGrid"
                elementName="productGrid"
                :restoreColumn="true"
                :options="productOption"
                v-model="selectedProductList"
              />
            </v-col>
          </v-row>
          <v-row no-gutters class="pa-4">
            <v-col cols="12" class="d-flex">
              <span>{{ $t('productTransfer.label.machineproduclist') }}</span>
              <v-spacer></v-spacer>
              <v-btn
                small
                class="text-none mr-2"
                color="error"
                outlined
                :disabled="selectedTableList.length === 0"
                @click="reduce"
              >
                {{ $t('productTransfer.btn.reduce') }}
              </v-btn>
              <v-btn
                small
                class="text-none mr-2"
                color="primary"
                :disabled="loadbtnabled"
                @click="load"
              >
                {{ $t('productTransfer.btn.load') }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row no-gutters class="pa-4">
            <v-col cols="12">
              <base-grid
                ref="totalGrid"
                elementName="totalGrid"
                :restoreColumn="true"
                :options="totalOption"
                v-model="selectedTableList"
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
                :disabled="totalOption.rowData.length === 0"
                @click="saveExit"
              >
                {{ $t('productTransfer.btn.saveexit') }}
              </v-btn>
              <v-btn
                small
                class="text-none mr-2"
                color="primary"
                :disabled="totalOption.rowData.length === 0"
                @click="save"
              >
                {{ $t('productTransfer.btn.save') }}
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
  name: 'addProductTransfer',
  data() {
    return {
      clientHeight: document.body.clientHeight,
      elementName: 'addProductTransfer',
      machineTypeOption: {
        headers: [
          {
            field: 'no',
            checkboxSelection: true,
            headerName: this.$t('productTransfer.table.no'),
            valueGetter: 'node.rowIndex + 1',
            index: 1,
            filter: 'agTextColumnFilter',
          },
          {
            field: 'deviceName',
            headerName: this.$t('productTransfer.table.deviceName'),
            filter: 'agTextColumnFilter',
          },
          {
            field: 'deviceNumber',
            headerName: this.$t('productTransfer.table.deviceNumber'),
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
      productOption: {
        headers: [
          {
            field: 'no',
            checkboxSelection: true,
            headerName: this.$t('productTransfer.table.no'),
            valueGetter: 'node.rowIndex + 1',
            filter: 'agTextColumnFilter',
            headerCheckboxSelection: true,
          },
          {
            field: 'productName',
            headerName: this.$t('productTransfer.table.productName'),
            filter: 'agTextColumnFilter',
          },
          {
            field: 'productNumber',
            headerName: this.$t('productTransfer.table.productNumber'),
            filter: 'agTextColumnFilter',
          },
          {
            field: 'productModel',
            headerName: this.$t('productTransfer.table.productModel'),
            filter: 'agTextColumnFilter',
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        rowDataId: 'productId', // 传递对象的唯一标识符
        height: document.body.clientHeight - 343 - (document.body.clientHeight - 410) * 0.4,
        rowHeight: 35,
        pagination: false,
      },
      totalOption: {
        headers: [
          {
            field: 'no',
            checkboxSelection: true,
            headerName: this.$t('productTransfer.table.no'),
            valueGetter: 'node.rowIndex + 1',
            filter: 'agTextColumnFilter',
            headerCheckboxSelection: true,
          },
          {
            field: 'deviceName',
            headerName: this.$t('productTransfer.table.deviceName'),
            filter: 'agTextColumnFilter',
          },
          {
            field: 'deviceNumber',
            headerName: this.$t('productTransfer.table.deviceNumber'),
            filter: 'agTextColumnFilter',
          },
          {
            field: 'productName',
            headerName: this.$t('productTransfer.table.productName'),
            filter: 'agTextColumnFilter',
          },
          {
            field: 'productNumber',
            headerName: this.$t('productTransfer.table.productNumber'),
          },
          {
            field: 'productModel',
            headerName: this.$t('productTransfer.table.productModel'),
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: (document.body.clientHeight - 410) * 0.4,
        rowHeight: 35,
        pagination: false,
      },
      selectedMachineTypeList: [], // ag grid 选中
      machineTypeId: null, // autocomplate 选中 是id
      selectedProductList: [],
      ignorelist: [],
      ignoreDialog: false,
      selectedTableList: [], // aggrid 选中的设备产品关系清单
      machineTypeGrid: null,
      productGrid: null,
      totalGrid: null,
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
    this.machineTypeGrid = this.$refs.machineTypeGrid.gridApi;
    this.productGrid = this.$refs.productGrid.gridApi;
    this.totalGrid = this.$refs.totalGrid.gridApi;
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapState('productTransfer', ['machineTypeList', 'productList']),
    moduleName() {
      return this.$route.name;
    },
    loadbtnabled() {
      return this.selectedMachineTypeList.length === 0
        || this.selectedProductList.length === 0;
    },
    ignoreHeader() {
      return [
        {
          text: this.$t('productTransfer.table.no'),
          value: 'no',
          width: 50,
          sortable: false,
        },
        {
          text: this.$t('productTransfer.table.deviceName'),
          value: 'deviceName',
          width: 130,
          sortable: true,
        },
        {
          text: this.$t('productTransfer.table.deviceNumber'),
          value: 'deviceNumber',
          width: 130,
          sortable: true,
        },
        {
          text: this.$t('productTransfer.table.productName'),
          value: 'productName',
          width: 130,
          sortable: true,
        },
        {
          text: this.$t('productTransfer.table.productNumber'),
          value: 'productNumber',
          width: 130,
          sortable: true,
        },
        {
          text: this.$t('productTransfer.table.productModel'),
          value: 'productModel',
          width: 130,
          sortable: true,
        },
      ];
    },
  },
  methods: {
    ...mapActions('productTransfer', [
      'getMachineTypeList',
      'getProductList',
      'getMachineList',
      'addProductTransfer',
    ]),
    ...mapMutations('productTransfer', ['setMachineTypeList']),
    async init() {
      await this.getMachineTypeList();
      await this.getProductList();
      this.productOption.rowData = this.productList;
    },
    refresh() {
      this.init();
      this.resetRowData();
      this.resetSelectedTypeId();
    },
    resetSelect() {
      this.machineTypeGrid.deselectAll();
      this.productGrid.deselectAll();
      this.totalGrid.deselectAll();
    },
    resetRowData() {
      this.machineTypeOption.rowData = [];
      this.totalOption.rowData = [];
    },
    resetSelectedTypeId() {
      this.machineTypeId = null;
    },
    reduce() {
      let transferList = this.totalOption.rowData;
      this.selectedTableList.forEach((item) => {
        this.$set(transferList, item.no - 1, null);
      });
      transferList = transferList.filter((i) => i).map((item, index) => ({ // 去掉为null的数据
        ...item,
        no: index + 1,
      }));
      this.totalOption.rowData = transferList;
      this.totalGrid.deselectAll();
    },
    load() {
      const { selectedMachineTypeList, selectedProductList } = this;
      let currentTransferList = [];
      this.ignorelist = [];
      for (let i = 0; i < selectedMachineTypeList.length; i += 1) {
        for (let k = 0; k < selectedProductList.length; k += 1) {
          currentTransferList.push({
            id: `${selectedMachineTypeList[i].deviceId}-${selectedProductList[k].productId}`,
            deviceId: selectedMachineTypeList[i].deviceId,
            deviceNumber: selectedMachineTypeList[i].deviceNumber,
            deviceName: selectedMachineTypeList[i].deviceName,
            productId: selectedProductList[k].productId,
            productNumber: selectedProductList[k].productNumber,
            productName: selectedProductList[k].productName,
            productModel: selectedProductList[k].productModel,
          });
        }
      }
      const { rowData } = this.totalOption; // 拿到已有的设备产品关系列表
      this.ignorelist = currentTransferList
        .filter((item) => rowData
          .some((record) => (
            item.deviceId === record.deviceId
            && item.productId === record.productId
          )));
      currentTransferList = currentTransferList
        .filter((item) => (!rowData
          .some((record) => (
            item.deviceId === record.deviceId
            && item.productId === record.productId
          ))));

      if (this.ignorelist.length > 0) {
        this.ignoreDialog = true;
      }
      const transferList = [...rowData, ...currentTransferList]
        .map((item, index) => ({
          ...item,
          no: index + 1,
        }));
      this.totalOption.rowData = transferList;
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
      if (result) this.$router.push('/product-transfer');
    },
    async submit() {
      const { rowData } = this.totalOption;
      const payload = rowData.map((item) => ({
        deviceId: item.deviceId,
        productId: item.productId,
      }));
      const result = await this.addProductTransfer(payload);
      return result;
    },
  },
  watch: {
    async machineTypeId(typeId) {
      if (typeId) {
        const result = await this.getMachineList(typeId);
        this.machineTypeOption.rowData = result;
      } else {
        this.machineTypeGrid.deselectAll();
        this.machineTypeOption.rowData = [];
        // this.machineTypeGrid.setRowData([]);
      }
    },
  },
};
</script>
