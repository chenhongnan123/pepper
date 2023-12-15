<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.expertKnowledgeSetting">
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
              small
              outlined
              class="text-none mr-2"
              color="error"
              @click="handleDelete"
              :disabled="selectedTableList.length !== 1"
              v-if="isBtnAccess('system:expertiseDictData:remove')"
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
              v-if="isBtnAccess('system:expertiseDictData:edit')"
              @click="isNew = false;addDialog = true"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('btn.edit') }}
            </v-btn>
            <v-btn
              small
              class="text-none"
              color="primary"
              @click="isNew = true;addDialog = true"
              v-if="isBtnAccess('system:expertiseDictData:add')"
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
                ref="expertKnowledgeTypeGrid"
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
    <add-expert-knowledge-type-dialog
      :addDialog="addDialog"
      :selectedTableList="selectedTableList"
      :isNew="isNew"
      @closeDialog="addDialog = false"
      @getTableList="refresh"
    />
  </v-container>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import AddExpertKnowledgeTypeDialog from '../components/setting/AddExpertKnowledgeTypeDialog.vue';

export default {
  name: 'maintenanceSetting',
  components: {
    BaseGrid,
    AddExpertKnowledgeTypeDialog,
  },
  data() {
    return {
      elementName: 'maintenanceSetting',
      tableHeight: document.body.clientHeight - 210,
      expertKnowledgeTypeGridApi: null,
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'No.',
            filter: 'agTextColumnFilter',
            index: 0,
            checkboxSelection: (params) =>
              params.data.isDefault !== 'Y',
            headerCheckboxSelection: true,
            // eslint-disable-next-line
            valueGetter: (params) => params.node?.rowIndex + 1,
          },
          {
            field: 'dictValue',
            headerName: 'expertKnowledge.table.typeNumber',
            filter: 'agTextColumnFilter',
            index: 1,
          },
          {
            field: 'dictLabel',
            headerName: 'expertKnowledge.table.typeName',
            filter: 'agTextColumnFilter',
            index: 1,
          },
          {
            field: 'updateBy',
            headerName: 'expertKnowledge.table.modifyBy',
            filter: 'agTextColumnFilter',
            index: 2,
          },
          {
            field: 'updateTime',
            headerName: 'expertKnowledge.table.modifyTime',
            filter: 'agTextColumnFilter',
            index: 3,
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
      },
      selectedTableList: [],
      addDialog: false,
      isNew: true,
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
      'currentLocale',
    ]),
    ...mapState('expertKnowledge', [
      'expertKnowledgeTypeList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {
    this.expertKnowledgeTypeGridApi = this.$refs.expertKnowledgeTypeGrid.gridApi;
  },
  beforeDestroy() {
  },
  created() {
    this.getTableList();
  },
  deactivated() {
  },
  methods: {
    ...mapActions('expertKnowledge', ['getExpertKnowledgeTypeList', 'deleteExpertKnowledgeType']),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh() {
      this.resetSelect();
      this.getTableList();
    },
    goBack() {
      this.$router.push({ name: 'expertKnowledge' });
    },
    async getTableList() {
      await this.getExpertKnowledgeTypeList(true);
      this.options.rowData = this.expertKnowledgeTypeList.map(
        (item, index) => ({
          ...item,
          id: index + 1,
        }),
      );
    },
    resetSelect() {
      if (this.expertKnowledgeTypeGridApi) {
        this.expertKnowledgeTypeGridApi.deselectAll();
      }
    },
    async handleDelete() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        let ids = '';
        this.selectedTableList.forEach((item) => {
          ids += ids ? `,${item.dictCode}` : item.dictCode;
        });
        const result = await this.deleteExpertKnowledgeType(ids);
        if (result) {
          this.refresh();
        }
      }
    },
  },
};
</script>
