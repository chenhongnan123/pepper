<template>
  <v-container
    fluid
    class="darkNoBgColor"
  >
    <portal
      to="app-header"
      v-if="pagePortalMode.connectionConfiguration"
    >
      {{ $t(`modules.${moduleName}`) }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="goSettings"
      >
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>
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
          <div class="d-flex align-center px-4" style="height:100%">
            <v-spacer></v-spacer>
            <v-btn
              v-if="isBtnAccess('basic:connection:remove')"
              small
              outlined
              class="text-none mr-2"
              color="error"
              @click="handleDelete"
              :disabled="selectedTableList.length  === 0"
            >
              <v-icon left small>mdi-delete</v-icon>
              {{ $t('btn.delete') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('basic:connection:edit')"
              small
              outlined
              class="text-none mr-2"
              color="success"
              @click="editDialog = true"
              :disabled="selectedTableList.length > 1 || selectedTableList.length  === 0"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('btn.edit') }}
            </v-btn>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="primary"
              @click="handleMonitor"
              :disabled="selectedTableList.length  === 0"
            >
              {{ $t('connectionConfiguration.btn.collectionMonitor') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('basic:connection:add')"
              small
              color="primary"
              class="text-none"
              @click="addDialog = true"
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
                ref="connectionGrid"
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
      :rules="rules"
    />
    <edit-dialog
      :editDialog="editDialog"
      @closeDialog="editDialog = false"
      @getTableList="refresh"
      :selectedTableList="selectedTableList"
      :rules="rules"
    />
    <monitor-dialog
      :monitorDialog="monitorDialog"
      @closeDialog="monitorDialog = false"
      :selectedTableList="selectedTableList"
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
import TextBtn from '../components/Main/TextBtn.vue';
import AssignSwitch from '../components/Main/AssignSwitch.vue';
import addDialog from '../components/Main/addDialog.vue';
import editDialog from '../components/Main/editDialog.vue';
import monitorDialog from '../components/Main/monitorDialog.vue';
import StatusMenu from '../components/Main/StatusMenu.vue';

export default {
  // eslint-disable-next-line
  name: 'connectionConfiguration',
  data() {
    return {
      moment,
      elementName: 'connectionList',
      tableHeight: document.body.clientHeight - 210,
      selectedTableList: [],
      connectionGridApi: null,
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
            field: 'onlineStatus',
            headerName: 'connectionConfiguration.table.onlineStatus',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'StatusMenu',
              params: {
                that: this,
              },
            }),
            valueGetter: (params) => {
              if (params.data.onlineStatus === '1') {
                return this.$t('connectionConfiguration.table.online');
              }
              return this.$t('connectionConfiguration.table.offline');
            },
          },
          {
            field: 'connectionNumber',
            headerName: 'connectionConfiguration.table.deviceCode',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'TextBtn',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'connectionName',
            headerName: 'connectionConfiguration.table.deviceName',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'connectionDescription',
            headerName: 'connectionConfiguration.table.deviceDesc',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'connectionType',
            headerName: 'connectionConfiguration.table.deviceCommunicateType',
            filter: 'agTextColumnFilter',
            valueGetter: (params) => {
              if (params.data.connectionType) {
                const type = this.protocalList.find((m) => m.value === params.data.connectionType);
                if (type) {
                  return type.text;
                }
                return params.data.connectionType;
              }
              return '-';
            },
          },
          {
            field: 'ip',
            headerName: 'connectionConfiguration.table.connectionAddress',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'timeout',
            headerName: 'connectionConfiguration.table.timeout',
            filter: 'agTextColumnFilter',
            valueGetter: (params) => {
              if (params.data.timeout) {
                const type = this.timeoutList.find((m) => m.value === params.data.timeout);
                if (type) {
                  return type.text;
                }
                return params.data.timeout;
              }
              return '-';
            },
          },
          {
            field: 'active',
            headerName: 'connectionConfiguration.table.active',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'AssignSwitch',
              params: {
                that: this,
                field: 'active',
              },
            }),
          },
          {
            field: 'updateBy',
            headerName: 'connectionConfiguration.table.updateBy',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'updateTime',
            headerName: 'connectionConfiguration.table.updateTime',
            filter: 'agTextColumnFilter',
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
      },
      addDialog: false,
      editDialog: false,
      monitorDialog: false,
    };
  },
  components: {
    BaseGrid,
    TextBtn,
    AssignSwitch,
    addDialog,
    editDialog,
    monitorDialog,
    StatusMenu,
  },
  activated() {
  },
  deactivated() {
  },
  created() {
    this.init();
  },
  mounted() {
    this.connectionGridApi = this.$refs.connectionGrid.gridApi;
  },
  beforeDestroy() {
  },
  methods: {
    ...mapMutations('helper', [
      'setAlert',
    ]),
    ...mapActions('connectionConfiguration', [
      'getConnectionList',
      'delConnection',
    ]),
    refresh() {
      this.init();
      this.resetSelect();
    },
    async init() {
      await this.getConnectionList(true);
      this.options.rowData = this.connectionList;
    },
    // 重置选择
    resetSelect() {
      if (this.connectionGridApi) {
        this.connectionGridApi.deselectAll();
      }
    },
    async handleDelete() {
      if (
        await this.$root.$confirm.open(
          this.$t('connectionConfiguration.dialog.deleterecord'),
          this.$t('connectionConfiguration.dialog.deleterecordconfirm'),
        )
      ) {
        let connectionIds = '';
        this.selectedTableList.forEach((item) => {
          connectionIds += connectionIds ? `,${item.connectionId}` : item.connectionId;
        });
        const result = await this.delConnection(connectionIds);
        if (result) {
          this.refresh();
        }
      }
    },
    async handleMonitor() {
      this.monitorDialog = true;
    },
    goSettings() {
      this.$router.push({
        name: 'dataTypeSetting',
        params: {
          id: 0,
        },
      });
    },
  },
  computed: {
    ...mapState('connectionConfiguration', ['connectionList', 'protocalList', 'timeoutList']),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('helper', ['pagePortalMode']),
    moduleName() {
      return this.$route.name;
    },
    rules() {
      return this.$getConnectionRules();
    },
  },
};
</script>
