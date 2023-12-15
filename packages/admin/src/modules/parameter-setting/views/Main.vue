<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.parameterSetting">
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
          <div class="d-flex align-center px-4" style="height:100%">
            <v-spacer></v-spacer>
            <v-btn
              outlined
              small
              class="text-none mr-2"
              color="error"
              :disabled="selectedTableList.length === 0"
              @click="handleDelete"
              v-if="isBtnAccess('system:config:remove')"
            >
              <v-icon left small>mdi-delete</v-icon>
              {{ $t('btn.delete') }}
            </v-btn>
            <v-btn
              :disabled="selectedTableList.length !== 1"
              outlined
              small
              class="text-none mr-2"
              color="success"
              v-if="isBtnAccess('system:config:edit')"
              @click="isNew = false; addDialog = true"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('btn.edit') }}
            </v-btn>
            <v-btn
              small
              class="text-none"
              color="primary"
              @click="isNew = true; addDialog = true"
              v-if="isBtnAccess('system:config:add')"
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
                ref="parameterSettingGrid"
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
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import AddDialog from '../components/AddDialog.vue';
import TextBtn from '../components/TextBtn.vue';

export default {
  name: 'parameterSetting',
  components: {
    BaseGrid,
    AddDialog,
    TextBtn,
  },
  data() {
    return {
      elementName: 'parameterSetting',
      tableHeight: document.body.clientHeight - 210,
      options: {
        headers: [
          {
            field: 'no',
            headerName: this.$t('parameterSetting.table.no'),
            filter: 'agTextColumnFilter',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            valueGetter: 'node.rowIndex + 1',
          },
          {
            field: 'configName',
            headerName: this.$t('parameterSetting.table.configName'),
            filter: 'agTextColumnFilter',
          },
          {
            field: 'configKey',
            headerName: this.$t('parameterSetting.table.configKey'),
            filter: 'agTextColumnFilter',
            cellRenderer: (params) => {
              const { value } = params;
              return `<span style="color: var(--v-primary-base);">${value}</span>`;
            },
          },
          {
            field: 'configValue',
            headerName: this.$t('parameterSetting.table.configValue'),
            filter: 'agTextColumnFilter',
            cellRenderer: (params) => {
              const { value } = params;
              return `<span style="color: var(--v-primary-base);">${value}</span>`;
            },
          },
          {
            field: 'configType',
            headerName: this.$t('parameterSetting.table.configType'),
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'TextBtn',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'remark',
            headerName: this.$t('parameterSetting.table.remark'),
            filter: 'agTextColumnFilter',
          },
          {
            field: 'createTime',
            headerName: this.$t('parameterSetting.table.createTime'),
            filter: 'agTextColumnFilter',
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        rowDataId: 'configId', // 传递对象的唯一标识符
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        pagination: true,
      },
      selectedTableList: [],
      addDialog: false,
      isNew: true,
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('parameterSetting', [
      'parameterList',
    ]),
    moduleName() {
      return this.$route.name;
    },
  },
  created() {
    this.getTableList();
  },
  methods: {
    ...mapActions('parameterSetting', [
      'getParameterList',
      'deleteParameter',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh() {
      this.getTableList();
    },
    async getTableList() {
      this.selectedTableList = [];
      await this.getParameterList();
      this.options.rowData = this.parameterList;
    },
    async handleDelete() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        const idList = [];
        this.selectedTableList.forEach((item) => {
          idList.push(item.configId);
        });
        const result = await this.deleteParameter(idList);
        if (result) {
          this.refresh();
        }
      }
    },
  },
};
</script>
