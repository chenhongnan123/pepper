<template>
  <v-container fluid>
    <portal
      to="app-header"
      v-if="pagePortalMode.maintenanceMain"
    >
      {{ $t(`modules.${moduleName}`) }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="refresh"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
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
            <v-spacer></v-spacer>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="error"
              @click="handleDelete"
              :disabled="selectedTableList.length === 0"
              v-if="isBtnAccess('basic:maintenance_schema:remove')"
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
              :disabled="selectedTableList.length !== 1"
              @click="
                isNew = false;
                addDialog = true;
              "
              v-if="isBtnAccess('basic:maintenance_schema:edit')"
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
                addDialog = true;
              "
              v-if="isBtnAccess('basic:maintenance_schema:add')"
            >
              <v-icon
                left
                small
                >mdi-plus</v-icon
              >
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
          <v-row
            no-gutters
            class="pa-4"
          >
            <v-col>
              <base-grid
                ref="maintenanceGrid"
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
      :selectedTableList="selectedTableList"
      :isNew="isNew"
      @closeDialog="addDialog = false"
      @getTableList="refresh"
    />
    <!-- <DeleteFailedDialog
      :isShowDialog="isShowDeleteFailedDialog"
      @closeDialog="isShowDeleteFailedDialog = false"
      :deleteFailedList="deleteFailedList"
      @getTableList="getTableList"
    /> -->
  </v-container>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
// import DeleteFailedDialog from '@/components/commonUI/DeleteFailedDialog.vue';
import LinkBtn from '../components/main/LinkBtn.vue';
import ActiveMenu from '../components/main/ActiveMenu.vue';
import AddDialog from '../components/main/AddDialog.vue';

export default {
  name: 'maintenanceMain',
  components: {
    BaseGrid,
    // DeleteFailedDialog,
    LinkBtn,
    ActiveMenu,
    AddDialog,
  },
  data() {
    return {
      elementName: 'maintenanceMain',
      tableHeight: document.body.clientHeight - 210,
      maintenanceGridApi: null,
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
            field: 'schemaTypeLabel',
            headerName: 'maintenance.table.schemaTypeLabel',
            filter: 'agTextColumnFilter',
            index: 1,
          },
          {
            field: 'schemaCode',
            headerName: 'maintenance.table.schemaCode',
            filter: 'agTextColumnFilter',
            index: 2,
            cellRendererSelector: () => ({
              component: 'LinkBtn',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'schemaName',
            headerName: 'maintenance.table.schemaName',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'schemaDesc',
            headerName: 'maintenance.table.schemaDesc',
            filter: 'agTextColumnFilter',
            index: 4,
          },
          {
            field: 'status',
            headerName: 'maintenance.table.active',
            index: 5,
            cellRendererSelector: () => ({
              component: 'ActiveMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'updateBy',
            headerName: 'maintenance.table.updateBy',
            filter: 'agTextColumnFilter',
            index: 6,
          },
          {
            field: 'updateTime',
            headerName: 'maintenance.table.updateTime',
            filter: 'agTextColumnFilter',
            index: 7,
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
      addDialog: false,
      isNew: true,
      isShowDeleteFailedDialog: false,
      deleteFailedList: [],
    };
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapState('maintenance', ['maintenanceList']),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
    this.maintenanceGridApi = this.$refs.maintenanceGrid.gridApi;
  },
  created() {
    this.getTableList();
  },
  deactivated() {
    this.setPageHeader(false);
    // this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapActions('maintenance', ['getMaintenanceList', 'deleteMaintenance']),
    ...mapMutations('helper', ['setPageHeader', 'setAppHeaderHeight', 'setAlert']),
    refresh() {
      this.getTableList();
      this.resetSelect();
    },
    goSetting() {
      this.$router.push({ name: 'maintenanceSetting' });
    },
    async getTableList() {
      await this.getMaintenanceList();
      this.options.rowData = this.maintenanceList;
    },
    resetSelect() {
      if (this.maintenanceGridApi) {
        this.maintenanceGridApi.deselectAll();
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
        const result = await this.deleteMaintenance(idList);
        if (result) {
          this.refresh();
        }
      }
    },
  },
};
</script>
