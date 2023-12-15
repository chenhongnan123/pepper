<template>
  <v-container fluid>
    <portal
      to="app-header"
      v-if="pagePortalMode.alarmCode"
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
            <!-- 折叠按钮 -->
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
              v-if="isBtnAccess('basic:code:remove')"
            >
              <v-icon left small>mdi-delete</v-icon>
              {{ $t('btn.delete') }}
            </v-btn>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="success"
              @click="
                editDialog = true;
              "
              :disabled="selectedTableList.length !== 1"
              v-if="isBtnAccess('basic:code:edit')"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('btn.edit') }}
            </v-btn>
            <v-btn
              small
              class="text-none"
              color="primary"
              @click="addDialog = true"
              v-if="isBtnAccess('basic:code:add')"
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
                ref="alarmCodeGrid"
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
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import AddDialog from '../components/AddDialog.vue';
import EditDialog from '../components/EditDialog.vue';
import CheckBox from '../components/CheckBox.vue';

export default {
  name: 'alarmCode',
  components: {
    BaseGrid,
    AddDialog,
    EditDialog,
    CheckBox,
  },
  data() {
    return {
      elementName: 'alarmCode',
      tableHeight: document.body.clientHeight - 210,
      options: {
        headers: [
          {
            field: 'parentBomName',
            rowGroup: true,
            hide: true,
            valueFormatter: (params) => `层级名称：${params.value || '-'}`,
          },
          {
            field: 'bomName',
            rowGroup: true,
            hide: true,
            valueFormatter: (params) => `部件名称：${params.value || '-'}`,
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
            field: 'alarmCode',
            headerName: 'alarmCode.table.alarmCode',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'alarmName',
            headerName: 'alarmCode.table.alarmName',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'joinScore',
            headerName: 'alarmCode.table.joinScore',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'CheckBox',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'parameterName',
            headerName: 'alarmCode.table.parameterName',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'parameterNumber',
            headerName: 'alarmCode.table.parameterNumber',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'updateBy',
            headerName: 'alarmCode.table.updateBy',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'updateTime',
            headerName: 'alarmCode.table.updateTime',
            filter: 'agTextColumnFilter',
          },
        ],
        rowData: [],
        rowDataId: 'alarmCodeId',
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        groupDisplayType: 'groupRows',
        pagination: false,
      },
      selectedTableList: [],
      addDialog: false,
      editDialog: false,
      expand: true,
    };
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapState('alarmCode', ['alarmList']),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {},
  created() {
    this.getTableList();
  },
  deactivated() {},
  methods: {
    ...mapActions('alarmCode', ['getAlarmList', 'deleteAlarm']),
    ...mapMutations('helper', ['setAlert']),
    refresh() {
      this.getTableList();
      this.selectedTableList = [];
      // this.expand = true;
    },
    async getTableList() {
      await this.getAlarmList();
      this.options.rowData = this.alarmList;
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
          idList.push(item.alarmCodeId);
        });
        const result = await this.deleteAlarm(idList);
        if (result) {
          this.refresh();
        }
      }
    },
    handleExpand() {
      if (this.expand) {
        this.$refs.alarmCodeGrid.gridApi.collapseAll();
      } else {
        this.$refs.alarmCodeGrid.gridApi.expandAll();
      }
      this.expand = !this.expand;
    },
  },
};
</script>
