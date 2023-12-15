<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card
          height="77"
          class="mb-3"
          elevation="0"
          color="bg"
        >
          <div
            class="d-flex align-center px-4"
            style="height: 100%"
          >
            <tab-layout
              :items="[
                { tabName: $t('maintenance.tab.detail') },
                { tabName: $t('maintenance.tab.attachment') },
              ]"
              :tab="tab"
              @changeTab="handleChangeTab"
            />
            <v-spacer></v-spacer>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="error"
              @click="handleDelete"
              :disabled="selectedTableList.length === 0"
              v-if="tab === 0 && isBtnAccess('basic:maintenance_item:remove')"
            >
              <v-icon
                left
                small
                >mdi-delete</v-icon
              >
              {{ $t('btn.delete') }}
            </v-btn>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="success"
              @click="
                isNew = false;
                addMaintenancDetaileDialog = true;
              "
              :disabled="selectedTableList.length !== 1"
              v-if="tab === 0 && isBtnAccess('basic:maintenance_item:edit')"
            >
              <v-icon
                left
                small
                >mdi-pencil</v-icon
              >
              {{ $t('btn.edit') }}
            </v-btn>
            <v-btn
              small
              class="text-none"
              color="primary"
              @click="
                isNew = true;
                addMaintenancDetaileDialog = true;
              "
              v-if="tab === 0 && isBtnAccess('system:maintenaceSchemaFile:upload')"
            >
              <v-icon
                left
                small
                >mdi-plus</v-icon
              >
              {{ $t('btn.add') }}
            </v-btn>
            <v-btn
              small
              class="text-none"
              color="primary"
              @click="addAttachmentDialog = true"
              v-if="tab === 1 && isBtnAccess('basic:maintenanceSchemaFile:upload')"
            >
              <v-icon
                left
                small
                >mdi-plus</v-icon
              >
              {{ $t('maintenance.btn.addAttachment') }}
            </v-btn>
          </div>
        </v-card>
        <v-card
          :height="cardHeight"
          class=""
          elevation="0"
          color="bg"
        >
          <v-tabs-items
            v-model="tab"
            class="pa-4"
          >
            <v-tab-item>
              <v-row no-gutters>
                <v-col>
                  <base-grid
                    ref="maintenanceDetailGrid"
                    :elementName="elementName"
                    :restoreColumn="true"
                    :options="options"
                    v-model="selectedTableList"
                  />
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <attachment-ag-grid
                :height="tableHeight"
                :attachmentList="attachmentList"
                :isAccessDownload="isBtnAccess('basic:maintenanceSchemaFile:download')"
                :isAccessPreview="isBtnAccess('basic:maintenanceSchemaFile:preview')"
                :isAccessDelete="isBtnAccess('basic:maintenanceSchemaFile:remove')"
                @getTableList="refresh"
              />
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
    <add-maintenance-detail-dialog
      :addDialog="addMaintenancDetaileDialog"
      :selectedTableList="selectedTableList"
      :maintenanceId="curMaintenanceId"
      :isNew="isNew"
      @closeDialog="addMaintenancDetaileDialog = false"
      @getTableList="refresh"
    />
    <add-attachment-dialog
      :addDialog="addAttachmentDialog"
      :maintenanceId="curMaintenanceId"
      @closeDialog="addAttachmentDialog = false"
      @getTableList="refresh"
    />
  </v-container>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import TabLayout from '@/components/commonUI/TabLayout.vue';
import AttachmentAgGrid from '@/components/commonUI/attachmentTable/AttachmentAgGrid.vue';
import CheckBoxMenu from './CheckBoxMenu.vue';
import AddMaintenanceDetailDialog from './AddMaintenanceDetailDialog.vue';
import AddAttachmentDialog from './AddAttachmentDialog.vue';
import TypeBtn from './TypeBtn.vue';

export default {
  name: 'maintenanceDetailComponent',
  data() {
    return {
      elementName: 'maintenanceDetailComponent',
      cardHeight: document.body.clientHeight - 220,
      tableHeight: document.body.clientHeight - 240,
      tab: 0,
      maintenanceDetailGridApi: null,
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'No.',
            filter: 'agTextColumnFilter',
            index: 0,
            checkboxSelection: true,
            headerCheckboxSelection: true,
          },
          {
            field: 'checkItem',
            headerName: 'maintenance.table.checkItem',
            filter: 'agTextColumnFilter',
            index: 1,
          },
          {
            field: 'checkItemDesc',
            headerName: 'maintenance.table.checkItemDescription',
            filter: 'agTextColumnFilter',
            index: 2,
          },
          {
            field: 'itemType',
            headerName: 'maintenance.table.checkItemType',
            filter: 'agTextColumnFilter',
            index: 3,
            valueGetter: (params) => {
              const { itemType } = params.data;
              if (itemType) {
                const type = this.maintenanceTypeList.find((item) => item.dictValue === itemType);
                console.log(type, 'type');
                if (type) {
                  return type?.dictLabel;
                }
                return itemType;
              }
              return '-';
            },
          },
          {
            field: 'theoreticalUpperLimit',
            headerName: 'maintenance.table.upperLimit',
            filter: 'agTextColumnFilter',
            index: 4,
          },
          {
            field: 'theoreticalLowerBound',
            headerName: 'maintenance.table.lowerLimit',
            filter: 'agTextColumnFilter',
            index: 5,
          },
          {
            field: 'associateBomName',
            headerName: 'maintenance.table.relatedBom',
            filter: 'agTextColumnFilter',
            index: 6,
          },
          {
            field: 'required',
            headerName: 'maintenance.table.isRequired',
            index: 7,
            cellRendererSelector: () => ({
              component: 'CheckBoxMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'updateBy',
            headerName: 'maintenance.table.updateBy',
            filter: 'agTextColumnFilter',
            index: 9,
          },
          {
            field: 'updateTime',
            headerName: 'maintenance.table.updateTime',
            filter: 'agTextColumnFilter',
            index: 10,
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
      },
      selectedTableList: [],
      addMaintenancDetaileDialog: false,
      addAttachmentDialog: false,
      isNew: true,
    };
  },
  components: {
    TabLayout,
    BaseGrid,
    CheckBoxMenu,
    AddMaintenanceDetailDialog,
    AttachmentAgGrid,
    AddAttachmentDialog,
    TypeBtn,
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('partManagement', ['partDetail']),
    ...mapState('maintenance', ['attachmentList', 'curMaintenance', 'checkItemList', 'maintenanceTypeList']),
    // 模块名称
    moduleName() {
      return this.$route.name;
    },
    curMaintenanceId() {
      return String(this.$route.params.id) || null;
    },
    // 父页面名称
    pageName() {
      return this.$route.params.page;
    },
    curMaintenanceName() {
      return this.curMaintenance.operationSchemeHeaderName || '-';
    },
  },
  async activated() {
    this.setPageHeader(true);
    this.setAppHeaderHeight(120);
    // 每次进入详情页根据id查询零件详情/附件列表/任务列表
    this.maintenanceDetailGridApi = this.$refs.maintenanceDetailGrid.gridApi;
    this.refresh();
  },
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapMutations('helper', ['setPageHeader', 'setAppHeaderHeight', 'setAlert']),
    ...mapActions('maintenance', [
      'getAttachmentList',
      'getCheckItemList',
      'deleteCheckItem',
    ]),
    refresh() {
      this.resetSelect();
      if (!this.tab) {
        this.getTableList();
      } else {
        this.getAttachmentTableList();
      }
    },
    async getTableList() {
      await this.getCheckItemList(this.curMaintenanceId);
      this.options.rowData = this.checkItemList;
    },
    // 获取附件列表
    async getAttachmentTableList() {
      await this.getAttachmentList({
        module: this.moduleName,
        outsideId: this.curMaintenanceId,
      });
    },
    resetSelect() {
      if (this.maintenanceDetailGridApi) {
        this.maintenanceDetailGridApi.deselectAll();
      }
    },
    async handleDelete() {
      if (
        await this.$root.$confirm.open(
          this.$t('dialog.deleterecord'),
          this.$t('dialog.deleterecordconfirm'),
        )
      ) {
        const idList = [];
        this.selectedTableList.forEach((item) => {
          idList.push(item.id);
        });
        const result = await this.deleteCheckItem(idList);
        if (result) {
          this.refresh();
        }
      }
    },
    handleChangeTab(tab) {
      this.tab = tab;
    },
    goBack() {
      if (this.pageName === 'maintenanceMain') {
        this.$router.push({ name: 'maintenanceMain' });
      } else if (this.pageName === 'maintenancePlan') {
        this.$router.push({ name: 'maintenancePlan' });
      }
    },
  },
  watch: {
    tab() {
      this.refresh();
    },
  },
};
</script>

<style lang="scss" scoped></style>
