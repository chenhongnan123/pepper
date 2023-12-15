<template>
  <v-container
    fluid
    class="darkNoBgColor"
  >
    <portal
      to="app-header"
      v-if="pagePortalMode.machineList"
    >
      {{ $t(`modules.${moduleName}`) }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="init"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <v-row dense class="ml-2">
      <v-col cols="2">
        <v-card
          :height="clientHeight - 120"
          elevation="0"
          color="bg"
          class="mr-1"
        >
          <div
            class="text-h6 px-4 pt-2"
          >
            {{$t('machineList.label.machinetype')}}
          </div>
          <div class="d-flex px-4">
            <v-text-field
              v-model="searchVal"
              append-icon="mdi-magnify"
              hide-details
              clearable
              :label="$t('machineList.label.searchmachinetype')"
            ></v-text-field>
          </div>
          <v-treeview
            v-if="openall"
            :open-all="openall"
            class="mt-2 px-4"
            :style="`height: ${tableHeight}px;overflow-y: scroll;cursor: pointer;`"
            dense
            item-key="id"
            item-text="label"
            :active.sync="activefloder"
            activatable
            return-object
            :items="treeList"
            :filter="filterType"
            :search="searchVal"
            @update:active="handleActive"
          >
          </v-treeview>
        </v-card>
      </v-col>
      <v-col cols="10">
        <v-card
          height="77"
          class="mb-3"
          elevation="0"
          color="bg"
        >
          <div class="d-flex align-center px-4" style="height:100%">
            <v-spacer></v-spacer>
            <v-btn
              v-if="isBtnAccess('basic:device:remove')"
              small
              outlined
              class="text-none mr-2"
              color="error"
              @click="handleDelete"
              :disabled="selectedTableList.length === 0"
            >
              <v-icon left small>mdi-delete</v-icon>
              {{ $t('btn.delete') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('basic:device:edit')"
              small
              outlined
              class="text-none mr-2"
              color="success"
              :disabled="selectedTableList.length === 0 || selectedTableList.length > 1"
              @click="isNew = false, addDialog = true"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('btn.edit') }}
            </v-btn>
            <v-btn
              outlined
              small
              class="text-none mr-2"
              :disabled="!typeId"
              color="warning"
              @click="handleExportSample"
              v-if="isBtnAccess('basic:device:template')"
            >
              <v-icon left small>mdi-download</v-icon>
              {{ $t('btn.exportSample') }}
            </v-btn>
            <!-- eslint-disable-next-line -->
            <input
              type="file"
              accept=".xlsx"
              ref="uploader"
              class="d-none"
              id="uploadFiles"
              @change="onFilesChanged"
              v-if="isBtnAccess('basic:device:import')"
            />
            <v-btn
              outlined
              small
              class="text-none mr-2"
              color="warning"
              :disabled="!typeId"
              @click="handleImportClick"
              v-if="isBtnAccess('basic:device:import')"
            >
              <v-icon left small>mdi-upload</v-icon>
              {{ $t('btn.import') }}
            </v-btn>
            <v-btn
              small
              class="text-none"
              color="primary"
              :disabled="!typeId"
              @click="isNew = true, addDialog = true"
              v-if="isBtnAccess('basic:device:add')"
            >
              <v-icon left small>mdi-plus</v-icon>
              {{ $t('btn.add') }}
            </v-btn>
          </div>
        </v-card>
        <v-card
          :height="tableHeight"
          class=""
          elevation="0"
          color="bg"
        >
          <v-row no-gutters class="pa-4">
            <v-col>
              <base-grid
                ref="machineListGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="options"
                v-model="selectedTableList"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <add-dialog
      :addDialog="addDialog"
      :isNew="isNew"
      @closeDialog="addDialog = false"
      @getTableList="refreshTableList"
      :selectedTableList="selectedTableList"
      :typeId="typeId"
      :rules="rules"
    />
  </v-container>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';
import moment from 'moment';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import AddDialog from '../components/AddDialog.vue';
import TextBtn from '../components/TextBtn.vue';
import ActionMenu from '../components/ActionMenu.vue';

export default {
  name: 'machineList',
  data() {
    return {
      moment,
      elementName: 'machineList',
      clientHeight: document.body.clientHeight,
      openall: false,
      activefloder: [], // 选中的车间 或者 设备属性
      searchVal: '',
      typeId: null,
      workshopId: null,
      tableHeight: document.body.clientHeight - 210,
      selectedTableList: [],
      machineListHeaders: [
        'no',
        'onlineStatus',
        // 'deviceId',
        'deviceNumber',
        'deviceName',
        'processNumber',
        'processName',
        'transportName',
        'isAssignProduct',
        'updateBy',
        'updateTime',
      ],
      gridApi: null,
      options: {
        headers: [],
        rowData: [],
        rowDataId: 'deviceId',
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
      },
      isNew: true,
      addDialog: false,
      editDialog: false,
      treeList: [], // 左侧的树状列表
      inputEnd: true,
    };
  },
  components: {
    BaseGrid,
    ActionMenu,
    AddDialog,
    TextBtn,
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  created() {
    this.init();
  },
  mounted() {
    this.gridApi = this.$refs.machineListGrid.gridApi;
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    ...mapMutations('machineList', ['setMachineList']),
    ...mapActions('machineList', [
      'getMachineList',
      'getMachineTypeList',
      'deleteMachine',
      'excelExport',
      'excelImport',
    ]),
    async init() {
      // 获取左侧设备类型列表
      await this.getMachineTypeList();
      this.treeList = this.formatMachineType(this.machineTypeList);
      this.initTableHeaders();
      this.openall = true; // 展开所有节点
      const { typeId, workshopId } = this.$route.params;
      // 优先根据workshopId获取设备
      if (workshopId) {
        this.workshopId = workshopId;
        this.activefloder = [{ workshopId, id: `workshopId_${workshopId}` }];
      } else if (typeId) {
        // 其次根据typeId获取设备
        // eslint-disable-next-line
        this.typeId = typeId,
        this.activefloder = [{ typeId, id: `typeId_${typeId}` }];
      } else {
        // 第一次进来根据第一个typeId获取数据
        const firstTypeId = this.treeList[0].children[0].typeId;
        this.typeId = firstTypeId;
        this.activefloder = [
          {
            typeId: firstTypeId,
            id: `typeId_${firstTypeId}`,
          },
        ];
      }
    },
    // 刷新设备列表，若已选设备类型，则直接按typeId刷新设备列表
    refreshTableList() {
      if (this.activefloder.length > 0) {
        const { workshopId, typeId } = this.activefloder[0];
        this.getTableList({
          workshopId,
          typeId,
        });
      }
    },
    handleActive() {
      if (this.activefloder.length > 0) {
        const { typeId, workshopId } = this.activefloder[0];
        this.typeId = typeId;
        this.workshopId = workshopId;
      } else {
        this.typeId = null;
        this.workshopId = null;
        this.options.rowData = [];
        this.setMachineList([]);
      }
    },
    // 获取设备属性列表接口
    async getTableList(params) {
      await this.getMachineList(params);
      this.options.rowData = this.machineList;
      this.resetSelect();
    },
    // 重置选择
    resetSelect() {
      if (this.gridApi) {
        this.gridApi.deselectAll();
      }
    },
    async handleDelete() {
      if (
        await this.$root.$confirm.open(
          this.$t('dialog.deleterecord'),
          this.$t('dialog.deleterecordconfirm'),
        )
      ) {
        const idArr = this.selectedTableList.map((item) => item.deviceId);
        const ids = idArr.join(',');
        const result = await this.deleteMachine(ids);
        if (result) {
          this.refreshTableList();
        }
      }
    },
    // 下载模板文件
    async handleExportSample() {
      await this.excelExport();
    },
    // 点击导入按钮
    handleImportClick() {
      this.$refs.uploader.click();
    },
    // 文件上传
    async onFilesChanged(event) {
      const payload = new FormData();
      payload.append('file', event.target.files[0]);
      payload.append('updateSupport', 0); // 表示更新已存在的用户数据
      const result = await this.excelImport({
        typeId: this.typeId,
        payload,
      });
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.refreshTableList();
      }
      document.getElementById('uploadFiles').value = null;
    },
    // 导出模板
    async handleExport() {
      await this.excelExport();
    },
    initTableHeaders() {
      let headers = [];
      headers = this.machineListHeaders.map((item, index) => {
        const obj = {
          field: item,
          headerName: this.$t(`machineList.table.${item}`),
          index,
          filter: 'agTextColumnFilter',
          checkboxSelection: index === 0,
          headerCheckboxSelection: index === 0,
        };
        if (item === 'no') {
          obj.valueGetter = 'node.rowIndex + 1';
        }
        if (item === 'onlineStatus') {
          obj.cellRendererSelector = () => ({
            component: 'ActionMenu',
            params: {
              that: this,
            },
          });
        }
        if (item === 'deviceNumber') {
          obj.cellRendererSelector = () => ({
            component: 'TextBtn',
            params: {
              currentRowInfo: this,
              workshopId: this.activefloder[0]?.workshopId,
            },
          });
        }
        if (item === 'isAssignProduct') {
          obj.valueFormatter = (params) => {
            const { value } = params;
            if (value) {
              return value === '0' ? '否' : '是';
            }
            return null;
          };
        }
        return obj;
      });
      this.options.headers = headers;
    },
  },
  computed: {
    ...mapState('machineList', ['machineList', 'machineTypeList']),
    ...mapGetters('machineList', ['formatMachineType']),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('helper', ['pagePortalMode']),
    moduleName() {
      return this.$route.name;
    },
    rules() {
      return this.$getUserRules();
    },
    filterType() {
      return (item, search) => {
        if (item.workshopId) return null;
        return item.label.includes(search);
      };
    },
  },
  watch: {
    typeId(typeId) {
      if (typeId) {
        // 根据设备类型获取设备
        this.getTableList({ typeId });
      }
    },
    async workshopId(workshopId) {
      if (workshopId) {
        // 根据 车间id获取设备
        this.getTableList({ workshopId });
      }
    },
  },
};
</script>
