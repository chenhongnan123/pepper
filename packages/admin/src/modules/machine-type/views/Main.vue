<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.machineType">
      {{ $t(`modules.${moduleName}`) }}
      <v-btn icon small class="ml-2 mb-1" @click="refresh">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card height="77" class="mb-3" elevation="0" color="bg">
          <div class="d-flex align-center px-4" style="height: 100%">
            <v-spacer></v-spacer>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="error"
              @click="handleDelete"
              :disabled="selectedTableList.length === 0"
              v-if="isBtnAccess('basic:type:remove')"
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
                isNew = false;
                addDialog = true;
              "
              :disabled="selectedTableList.length !== 1"
              v-if="isBtnAccess('basic:type:edit')"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('btn.edit') }}
            </v-btn>
            <v-btn
              small
              class="text-none mr-2"
              color="primary"
              @click="
                isNew = true;
                addDialog = true;
              "
              v-if="isBtnAccess('basic:type:add')"
            >
              <v-icon left small>mdi-plus</v-icon>
              {{ $t('btn.add') }}
            </v-btn>
          </div>
        </v-card>
        <v-card :height="tableHeight" class="" elevation="0" color="bg">
          <v-row no-gutters class="pa-4">
            <v-col>
              <base-grid
                ref="machineTypeGrid"
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
      :selectedTableList="selectedTableList"
      @closeDialog="addDialog = false"
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

export default {
  name: 'machineType',
  components: {
    BaseGrid,
    AddDialog,
  },
  data() {
    return {
      elementName: 'machineType',
      machineTypeHeaders: [
        'no',
        'typeName',
        'typeDictLabel',
        'isCheckType',
        'workshopName',
        'updateBy',
        'updateTime',
      ],
      tableHeight: document.body.clientHeight - 210,
      machineTypeGrid: null,
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        rowDataId: 'typeId',
      },
      selectedTableList: [],
      addDialog: false,
      isNew: true,
    };
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapState('machineType', ['machineTypeList']),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {
    this.machineTypeGrid = this.$refs.machineTypeGrid.gridApi;
  },
  created() {
    this.getTableList();
    this.initTableHeaders();
  },
  deactivated() {},
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('machineType', [
      'getMachineTypeList',
      'deleteMachineType',
      'excelExport',
      'excelImport',
    ]),
    refresh() {
      this.getTableList();
      this.resetSelect();
    },
    async getTableList() {
      await this.getMachineTypeList(true);
      this.options.rowData = this.machineTypeList;
    },
    initTableHeaders() {
      let headers = [];
      headers = this.machineTypeHeaders.map((item, index) => {
        const obj = {
          field: item,
          headerName: this.$t(`machineType.table.${item}`),
          index,
          filter: 'agTextColumnFilter',
          checkboxSelection: index === 0,
          headerCheckboxSelection: index === 0,
        };
        if (item === 'no') {
          obj.valueGetter = 'node.rowIndex + 1';
        }
        if (item === 'isCheckType') {
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
    resetSelect() {
      if (this.machineTypeGrid) {
        this.machineTypeGrid.deselectAll();
      }
    },
    async handleDelete() {
      if (
        await this.$root.$confirm.open(
          this.$t('dialog.deleterecord'),
          this.$t('dialog.deleterecordconfirm'),
        )
      ) {
        let ids = '';
        this.selectedTableList.forEach((item) => {
          ids += ids ? `,${item.typeId}` : item.typeId;
        });
        const result = await this.deleteMachineType(ids);
        if (result) {
          this.refresh();
        }
      }
    },
  },
};
</script>
