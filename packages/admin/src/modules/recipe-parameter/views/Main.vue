<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.recipeParameter">
      {{ $t(`modules.${moduleName}`) }}
      <v-btn icon small class="ml-2 mb-1" @click="refresh">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card height="77" class="mb-3" elevation="0" color="bg">
          <div class="d-flex align-center px-4" style="height: 100%">
            <tab-layout
              :items="[
                {tabName: $t('recipeParameter.table.recipe1')},
                {tabName: $t('recipeParameter.table.recipe2')},
              ]"
              :tab="recipeType"
              @changeTab="handleChangeTab"
            />
            <v-spacer></v-spacer>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="error"
              @click="handleDelete"
              :disabled="selectedTableList.length === 0"
              v-if="isBtnAccess('basic:parameter:remove')"
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
              v-if="isBtnAccess('basic:parameter:edit')"
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
              v-if="isBtnAccess('basic:parameter:add')"
            >
              <v-icon left small>mdi-plus</v-icon>
              {{ $t('btn.add') }}
            </v-btn>
          </div>
        </v-card>
        <v-card :height="tableHeight" class="" elevation="0" color="bg">
          <v-tabs-items v-model="recipeType" class="pa-4">
            <v-tab-item>
              <v-row no-gutters>
                <v-col>
                  <base-grid
                    ref="headDropGrid"
                    elementName="headDrop"
                    :restoreColumn="true"
                    :options="headDropOptions"
                    v-model="selectedTableList"
                    key="headDropGrid"
                  />
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
            <v-row no-gutters>
                <v-col>
                  <base-grid
                    ref="sinterGrid"
                    elementName="sinter"
                    :restoreColumn="true"
                    :options="sinterOptions"
                    v-model="selectedTableList"
                    key="cbmGrid"
                  />
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
    <add-dialog
      :addDialog="addDialog"
      :recipeType="recipeType"
      :isNew="isNew"
      :selectedTableList="selectedTableList"
      @closeDialog="addDialog = false"
      @getTableList="refreshTableList"
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
import TabLayout from '@/components/commonUI/TabLayout.vue';
import AddDialog from '../components/AddDialog.vue';

export default {
  name: 'recipeParameter',
  components: {
    BaseGrid,
    AddDialog,
    TabLayout,
  },
  data() {
    return {
      elementName: 'recipeParameter',
      headers: [
        'no',
        'parameterTag',
        'tablePosition',
        'updateBy',
        'updateTime',
      ],
      tableHeight: document.body.clientHeight - 210,
      headDropGrid: null,
      headDropOptions: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        rowDataId: 'recipeParameterId',
      },
      sinterOptions: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        rowDataId: 'recipeParameterId',
      },
      selectedTableList: [], // 坠头配方
      addDialog: false,
      isNew: true,
      recipeType: 0, // 0坠头配方，1烧结配方
    };
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapState('recipeParameter', ['productList', 'tabviewindex']),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {
    this.headDropGrid = this.$refs.headDropGrid.gridApi;
  },
  created() {
    this.getTableList();
    this.initHeaders();
  },
  deactivated() {},
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('recipeParameter', ['setViewIndex']),
    ...mapActions('recipeParameter', [
      'getParameterList',
      'deleteParameter',
    ]),
    refresh() {
      this.getTableList();
      this.resetSelect();
    },
    async getTableList() {
      this.selectedTableList = [];
      const result1 = await this.getParameterList(0); // 坠头配方参数
      const result2 = await this.getParameterList(1); // 烧结配方参数
      this.headDropOptions.rowData = result1;
      this.sinterOptions.rowData = result2;
      this.setAlert({
        show: true,
        type: 'success',
        message: 'successAction',
      });
    },
    // 根据recipeType 刷新列表
    async refreshTableList() {
      const { recipeType } = this;
      this.selectedTableList = [];
      const result = await this.getParameterList(recipeType);
      if (recipeType === 0) {
        this.headDropOptions.rowData = result;
      } else {
        this.sinterOptions.rowData = result;
      }
    },
    initHeaders() {
      let headers = [];
      headers = this.headers.map((item, index) => {
        const obj = {
          field: item,
          headerName: this.$t(`recipeParameter.table.${item}`),
          index,
          filter: 'agTextColumnFilter',
          checkboxSelection: index === 0,
          headerCheckboxSelection: index === 0,
        };
        if (item === 'no') {
          obj.valueGetter = 'node.rowIndex + 1';
        }
        if (item === 'tablePosition') {
          obj.valueFormatter = (params) => {
            const { value } = params;
            if (value) {
              return value.replace(':', '');
            }
            return null;
          };
        }
        return obj;
      });
      this.headDropOptions.headers = headers;
      this.sinterOptions.headers = headers;
    },
    resetSelect() {
      if (this.recipeParameterGrid) {
        this.recipeParameterGrid.deselectAll();
      }
    },
    async handleChangeTab(recipeType) {
      this.recipeType = recipeType;
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
          ids += ids ? `,${item.recipeParameterId}` : item.recipeParameterId;
        });
        const result = await this.deleteParameter(ids);
        if (result) {
          this.refreshTableList();
        }
      }
    },
  },
  watch: {
    recipeType() {
      this.refreshTableList();
      this.selectedTableList = [];
    },
  },
};
</script>
