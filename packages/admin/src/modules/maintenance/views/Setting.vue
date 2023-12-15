<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.maintenanceSetting">
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
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
    <portal to="page-header">
    </portal>
    <div class="d-flex mb-2">
      <v-spacer></v-spacer>
      <v-btn
        small
        outlined
        class="text-none mr-2"
        color="error"
        @click="handleDelete"
        :disabled="selectedTableList.length === 0"
        v-if="isBtnAccess('maintenance_setting_type_delete')"
      >
        <v-icon left small>mdi-delete</v-icon>
        {{ $t('btn.delete') }}
      </v-btn>
      <v-btn
        small
        outlined
        class="text-none mr-2"
        color="success"
        :disabled="selectedTableList.length !== 1"
        v-if="isBtnAccess('maintenance_setting_type_edit')"
        @click="isNew = false;addMaintenanceTypeDialog = true"
      >
        <v-icon left small>mdi-pencil</v-icon>
        {{ $t('btn.edit') }}
      </v-btn>
      <v-btn
        small
        class="text-none"
        color="primary"
        @click="isNew = true;addMaintenanceTypeDialog = true"
        v-if="isBtnAccess('maintenance_setting_type_add')"
      >
        <v-icon left small>mdi-plus</v-icon>
        {{ $t('btn.add') }}
      </v-btn>
    </div>
    <v-row no-gutters>
      <v-col>
        <base-grid
          ref="maintenanceTypeGrid"
          :elementName="elementName"
          :restoreColumn="true"
          :options="options"
          v-model="selectedTableList"
        />
      </v-col>
    </v-row>
    <add-maintenance-type-dialog
      :addDialog="addMaintenanceTypeDialog"
      :selectedTableList="selectedTableList"
      :isNew="isNew"
      @closeDialog="addMaintenanceTypeDialog = false"
      @getTableList="refresh"
    />
  </v-container>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import AddMaintenanceTypeDialog from '../components/setting/AddMaintenanceTypeDialog.vue';

export default {
  name: 'maintenanceSetting',
  components: {
    BaseGrid,
    AddMaintenanceTypeDialog,
  },
  data() {
    return {
      elementName: 'maintenanceSetting',
      maintenanceTypeGridApi: null,
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
            field: 'languageValue',
            headerName: 'maintenance.table.typeName',
            filter: 'agTextColumnFilter',
            index: 1,
          },
          {
            field: 'userName',
            headerName: 'maintenance.table.modifyBy',
            filter: 'agTextColumnFilter',
            index: 2,
          },
          {
            field: 'lastUpdateTime',
            headerName: 'maintenance.table.modifyTime',
            filter: 'agTextColumnFilter',
            index: 3,
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 220,
      },
      selectedTableList: [],
      addMaintenanceTypeDialog: false,
      isNew: true,
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
      'currentLocale',
    ]),
    ...mapState('maintenance', [
      'maintenanceTypeList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
    maintenanceTypes() {
      const { currentLocale, maintenanceTypeList } = this;
      const listByLanguage = maintenanceTypeList.filter((m) => m.type === currentLocale);
      if (listByLanguage.length) {
        const { dictVoList } = listByLanguage[0];
        return dictVoList.map((item, index) => {
          const obj = {
            ...item,
            no: index + 1,
          };
          return obj;
        });
      }
      return [];
    },
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
    this.maintenanceTypeGridApi = this.$refs.maintenanceTypeGrid.gridApi;
  },
  created() {
    this.getTableList();
  },
  deactivated() {
    this.setPageHeader(false);
    // this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapActions('maintenance', ['getMaintenanceTypeList', 'handleMaintenanceType']),
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    refresh() {
      this.resetSelect();
      this.getTableList();
    },
    goBack() {
      this.$router.push({ name: 'maintenanceMain' });
    },
    async getTableList() {
      await this.getMaintenanceTypeList(true);
      this.options.rowData = this.maintenanceTypes;
    },
    resetSelect() {
      if (this.maintenanceTypeGridApi) {
        this.maintenanceTypeGridApi.deselectAll();
      }
    },
    async handleDelete() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        const idList = [];
        this.selectedTableList.forEach((item) => {
          idList.push(item.id);
        });
        const result = await this.handleMaintenanceType({
          action: 'delete',
          payload: {
            dictType: 'xxcus_rlmt_operationSchemeType',
            idList,
          },
        });
        if (result) {
          this.refresh();
        }
      }
    },
  },
};
</script>
