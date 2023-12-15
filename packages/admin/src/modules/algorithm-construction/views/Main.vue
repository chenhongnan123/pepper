<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.algorithmConstruction">
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
    <v-row no-gutters>
      <v-col cols="12">
        <v-card
          height="77"
          class="mb-3"
          elevation="0"
          color="bg"
        >
          <div class="d-flex align-center px-4" style="height:100%">
            <v-spacer></v-spacer>
            <v-btn
              outlined
              small
              class="text-none mr-2"
              color="primary"
              @click="handleExpand"
            >
              <v-icon left small>mdi-swap-vertical</v-icon>
              {{ $t('btn.extendOrFold') }}
            </v-btn>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="error"
              @click="handleDelete"
              :disabled="selectedTableList.length === 0"
              v-if="isBtnAccess('basic:model:remove')"
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
              v-if="isBtnAccess('basic:model:edit')"
              @click="editDialog = true"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('btn.edit') }}
            </v-btn>
            <v-btn
              small
              class="text-none"
              color="primary"
              @click="isNew = true;addDialog = true"
              v-if="isBtnAccess('basic:model:insert')"
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
                ref="eventGrid"
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
      @closeDialog="addDialog = false"
      @getTableList="refresh"
    />
    <edit-dialog
      :editDialog="editDialog"
      :selectedTableList="selectedTableList"
      @closeDialog="editDialog = false"
      @getTableList="refresh"
    />
  </v-container>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
  mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import AddDialog from '../components/AddDialog.vue';
import EditDialog from '../components/EditDialog.vue';
import StatusMenu from '../components/StatusMenu.vue';
import SpcMenu from '../components/SpcMenu.vue';
import BoardMenu from '../components/BoardMenu.vue';

export default {
  name: 'algorithmConstruction',
  components: {
    BaseGrid,
    AddDialog,
    StatusMenu,
    SpcMenu,
    BoardMenu,
    EditDialog,
  },
  data() {
    return {
      elementName: 'algorithmConstruction',
      tableHeight: document.body.clientHeight - 210,
      eventGridApi: null,
      options: {
        headers: [
          {
            field: 'parentBomName',
            rowGroup: true,
            hide: true,
            valueFormatter: (params) => `${this.$t('algorithmConstruction.table.bomName')}: ${params.value || '-'}`,
          },
          {
            field: 'bomName',
            rowGroup: true,
            hide: true,
            valueFormatter: (params) => `${this.$t('algorithmConstruction.table.productName')}: ${params.value || '-'}`,
          },
          {
            field: 'no',
            headerName: 'No.',
            minwidth: 100,
            filter: false,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            // eslint-disable-next-line
            cellRenderer: (params) => `<span style="margin-left: 60px">${params.node?.childIndex + 1}</span>`,
          },
          {
            field: 'eventName',
            headerName: 'algorithmConstruction.table.name',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'SpcMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'eventDescription',
            headerName: 'algorithmConstruction.table.description',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'type',
            headerName: 'algorithmConstruction.table.algorithmType',
            filter: 'agTextColumnFilter',
            valueGetter: (params) => {
              if (!params.data) {
                return '-';
              }
              if (params.data.type === '0') {
                return this.$t('algorithmConstruction.dialog.standard');
              }
              if (params.data.type === '1') {
                return this.$t('algorithmConstruction.dialog.custom');
              }
              return params.data.type;
            },
          },
          {
            field: 'active',
            headerName: 'algorithmConstruction.table.status',
            cellRendererSelector: () => ({
              component: 'StatusMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'updateBy',
            headerName: 'algorithmConstruction.table.lastUpdateByName',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'updateTime',
            headerName: 'algorithmConstruction.table.lastUpdateDate',
            filter: 'agTextColumnFilter',
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        groupDisplayType: 'groupRows',
        pagination: false,
        isRowSelectable: null,
      },
      selectedTableList: [],
      addDialog: false,
      editDialog: false,
      isNew: true,
      expand: true,
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('algorithmConstruction', [
      'algorithmModelList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  created() {
    this.getTableList();
    this.options.isRowSelectable = (params) => !params.group;
  },
  mounted() {
    this.eventGridApi = this.$refs.eventGrid.gridApi;
  },
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapActions('algorithmConstruction', [
      'getAlgorithmModelList',
      'deleteAlgorithmModel',
    ]),
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    refresh() {
      this.getTableList();
      this.resetSelect();
    },
    async getTableList() {
      await this.getAlgorithmModelList(true);
      this.options.rowData = this.algorithmModelList;
    },
    resetSelect() {
      if (this.eventGridApi) {
        this.eventGridApi.deselectAll();
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
        const ids = idList.join(',');
        const result = await this.deleteAlgorithmModel(ids);
        if (result) {
          this.refresh();
        }
      }
    },
    handleExpand() {
      if (this.expand) {
        this.$refs.eventGrid.gridApi.collapseAll();
      } else {
        this.$refs.eventGrid.gridApi.expandAll();
      }
      this.expand = !this.expand;
    },
  },
};
</script>
