<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.expertKnowledge">
      {{ $t(`modules.${moduleName}`) }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="goSetting"
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
              small
              outlined
              class="text-none mr-2"
              color="error"
              @click="handleDelete"
              :disabled="selectedTableList.length === 0"
              v-if="isBtnAccess('basic:expertise:remove')"
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
              v-if="isBtnAccess('basic:expertise:edit')"
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
              v-if="isBtnAccess('basic:expertise:add')"
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
                ref="expertKnowledgeGrid"
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
  </v-container>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import NumberMenu from '../components/main/NumberMenu.vue';
import ActiveMenu from '../components/main/ActiveMenu.vue';
import AddDialog from '../components/main/AddDialog.vue';

export default {
  name: 'expertKnowledge',
  components: {
    BaseGrid,
    NumberMenu,
    ActiveMenu,
    AddDialog,
  },
  data() {
    return {
      elementName: 'expertKnowledge',
      tableHeight: document.body.clientHeight - 210,
      expertKnowledgeGridApi: null,
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'No.',
            filter: 'agTextColumnFilter',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            // eslint-disable-next-line
            valueGetter: (params) => params.node?.rowIndex + 1,
          },
          {
            field: 'expertiseType',
            headerName: 'expertKnowledge.table.type',
            filter: 'agTextColumnFilter',
            valueGetter: (params) => {
              if (params.data.expertiseType) {
                const type = this.expertKnowledgeTypeList
                  .find((m) => m.dictValue === String(params.data.expertiseType));
                if (type) {
                  return type.dictLabel;
                }
                return params.data.expertiseType;
              }
              return '-';
            },
          },
          {
            field: 'expertiseNumber',
            headerName: 'expertKnowledge.table.number',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'NumberMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'expertiseName',
            headerName: 'expertKnowledge.table.name',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'alarmCode',
            headerName: 'expertKnowledge.table.errorCode',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'partName',
            headerName: 'expertKnowledge.table.errorPosition',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'active',
            headerName: 'expertKnowledge.table.active',
            cellRendererSelector: () => ({
              component: 'ActiveMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'updateBy',
            headerName: 'expertKnowledge.table.modifyBy',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'updateTime',
            headerName: 'expertKnowledge.table.modifyTime',
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
      selectedTableList: [],
      addDialog: false,
      isNew: true,
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('expertKnowledge', [
      'expertKnowledgeList',
      'expertKnowledgeTypeList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {
    this.expertKnowledgeGridApi = this.$refs.expertKnowledgeGrid.gridApi;
    this.getTableList();
  },
  created() {
  },
  deactivated() {
  },
  methods: {
    ...mapActions('expertKnowledge', ['getExpertKnowledgeList', 'deleteExpertKnowledge', 'getExpertKnowledgeTypeList']),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh() {
      this.getTableList();
      this.resetSelect();
    },
    goSetting() {
      this.$router.push({ name: 'expertKnowledgeSetting' });
    },
    async getTableList() {
      await this.getExpertKnowledgeTypeList();
      await this.getExpertKnowledgeList(true);
      this.options.rowData = this.expertKnowledgeList;
    },
    resetSelect() {
      if (this.expertKnowledgeGridApi) {
        this.expertKnowledgeGridApi.deselectAll();
      }
    },
    async handleDelete() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        const idList = [];
        this.selectedTableList.forEach((item) => {
          idList.push(item.expertiseId);
        });
        const result = await this.deleteExpertKnowledge(idList);
        if (result) {
          this.refresh();
        }
      }
    },
  },
};
</script>
