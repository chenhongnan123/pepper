<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.roadmapManagement">
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
              :disabled="selectedTableList.length === 0"
              v-if="isBtnAccess('basic:roadmap:remove')"
            >
              <v-icon left small>mdi-delete</v-icon>
              {{ $t('btn.delete') }}
            </v-btn>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="success"
              @click="isNew = false;addDialog = true"
              :disabled="selectedTableList.length !== 1"
              v-if="isBtnAccess('basic:roadmap:edit')"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('btn.edit') }}
            </v-btn>
            <v-btn
              small
              class="text-none"
              color="primary"
              @click="isNew = true;addDialog = true"
              v-if="isBtnAccess('basic:roadmap:add')"
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
                ref="roadmapManagementGrid"
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
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import AddDialog from '../components/AddDialog.vue';
import ActiveMenu from '../components/ActiveMenu.vue';
import DetailMenu from '../components/DetailMenu.vue';

export default {
  name: 'roadmapManagement',
  components: {
    BaseGrid,
    AddDialog,
    ActiveMenu,
    DetailMenu,
  },
  data() {
    return {
      elementName: 'roadmapManagement',
      tableHeight: document.body.clientHeight - 210,
      roadmapManagementGridApi: null,
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'roadmapManagement.table.no',
            filter: 'agTextColumnFilter',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            // eslint-disable-next-line
            valueGetter: (params) => params.node?.rowIndex + 1,
          },
          {
            field: 'roadmapName',
            headerName: 'roadmapManagement.table.name',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'DetailMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'productNumber',
            headerName: 'roadmapManagement.table.productNumber',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'productName',
            headerName: 'roadmapManagement.table.productName',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'productModel',
            headerName: 'roadmapManagement.table.device',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'roadmapVersion',
            headerName: 'roadmapManagement.table.version',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'status',
            headerName: 'roadmapManagement.table.status',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'ActiveMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'updateBy',
            headerName: 'roadmapManagement.table.modifyBy',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'updateTime',
            headerName: 'roadmapManagement.table.modifyTime',
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
    ...mapState('roadmapManagement', [
      'roadmapList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {
    this.roadmapManagementGridApi = this.$refs.roadmapManagementGrid.gridApi;
  },
  created() {
    this.getTableList();
  },
  deactivated() {
  },
  methods: {
    ...mapActions('roadmapManagement', [
      'getRoadmapList',
      'deleteRoadmap',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh() {
      this.getTableList();
      this.resetSelect();
    },
    async getTableList() {
      await this.getRoadmapList(true);
      this.options.rowData = this.roadmapList;
    },
    resetSelect() {
      if (this.roadmapManagementGridApi) {
        this.roadmapManagementGridApi.deselectAll();
      }
    },
    async handleDelete() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        let roadmapIds = '';
        this.selectedTableList.forEach((item) => {
          roadmapIds += roadmapIds ? `,${item.roadmapId}` : item.roadmapId;
        });
        const result = await this.deleteRoadmap(roadmapIds);
        if (result) {
          this.refresh();
        }
      }
    },
  },
};
</script>
