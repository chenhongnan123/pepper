<template>
  <v-container fluid class="darkNoBgColor">
    <portal to="app-header">
      测试2
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="baseGridApi.deselectAll();"
      >
        <v-icon
          v-text="'mdi-refresh'"
        />
      </v-btn>
    </portal>
    <portal to="page-header">
    </portal>
    <v-toolbar
      flat
      dense
      class="pa-0 nopadding"
      style="width: 100%;"
    >
      <div style="display: flex;width: 50%;">
        <tab-layout
          :items="tabItems"
          :tab="tab"
          @changeTab="handleChangeTab"
        />
      </div>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        small
        class="ml-2 mb-1"
        @click="testDialog = true"
      >
        新增
      </v-btn>
    </v-toolbar>
    <div class="mt-2">
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="(item, key) in tabItems"
          :key="`tab_item_${key}`"
          :eager="true"
        >
          <div v-if="item.index === 0">
            <file-upload
              ref="uploadComponent"
              :multiple="true"
              :width="'400px'"
              :height="'300px'"
            />
          </div>
          <div v-if="item.index === 1">
            <pic-upload
              ref="picUpload"
              :url="''"
              :width="'400px'"
              :height="'300px'"
            />
          </div>
          <div v-if="item.index === 2">
            <v-row
              class="text-center"
              no-gutters
            >
              <v-col :cols="12">
                <base-grid
                  ref="BaseGrid"
                  v-model="selectedRows"
                  :elementName="elementName"
                  :restoreColumn="true"
                  :options="options1"
                />
              </v-col>
            </v-row>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </div>
    <test-dialog
      :testDialog="testDialog"
      @closeDialog="testDialog = false"
    />
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import GridIcon from '@/components/aggrid/GridIcon.vue';
import GridDateFilter from '@/components/aggrid/GridDateFilter.vue';
import FileUpload from '@/components/commonUI/FileUpload.vue';
import PicUpload from '@/components/commonUI/PicUpload.vue';
import TabLayout from '@/components/commonUI/TabLayout.vue';
import TestDialog from './TestDialog.vue';

export default {
  name: 'HelloWorld',
  components: {
    BaseGrid,
    GridIcon,
    GridDateFilter,
    FileUpload,
    TestDialog,
    PicUpload,
    TabLayout,
  },
  mounted() {
    this.baseGridApi = this.$refs.BaseGrid.gridApi;
    for (let i = 0; i < 10000; i += 1) {
      const obj = {
        field1: `text${i + 1}`,
        field2: '2023-01-01 10:00:00',
        field3: `test${i + 1}`,
        field4: i + 1,
        field5: `test${i + 1}`,
        field6: `test${i + 1}`,
        field7: `test${i + 1}`,
        field8: `test${i + 1}`,
        field9: `test${i + 1}`,
        field10: `test${i + 1}`,
        field11: `test${i + 1}`,
        field12: `test${i + 1}`,
      };
      this.options1.rowData.push(obj);
    }
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
    ]),
    handleChangeTab(tab) {
      this.tab = tab;
    },
  },
  data: () => ({
    elementName: 'test',
    testDialog: false,
    baseGridApi: null,
    selectedRows: [],
    options1: {
      headers: [
        {
          field: 'field1',
          checkboxSelection: true,
          headerCheckboxSelection: true,
          filter: 'agTextColumnFilter',
          filterParams: {
            apply: true,
            textMatcher: () => true,
          },
          index: 0,
        },
        {
          field: 'field2',
          filter: 'GridDateFilter',
          index: 1,
        },
        {
          field: 'field3',
          // pinned: 'left',
          filter: 'agTextColumnFilter',
          index: 2,
        },
        {
          field: 'field4',
          filter: 'agTextColumnFilter',
          index: 3,
        },
        {
          field: 'field5',
          filter: 'agTextColumnFilter',
          index: 4,
        },
        {
          field: 'field6',
          filter: 'agTextColumnFilter',
          index: 5,
        },
        {
          field: 'field7',
          filter: 'agTextColumnFilter',
          index: 3,
        },
        {
          field: 'field8',
          filter: 'agTextColumnFilter',
          index: 4,
        },
        {
          field: 'field9',
          filter: 'agTextColumnFilter',
          index: 5,
        },
        {
          field: 'field10',
          filter: 'agTextColumnFilter',
          index: 3,
        },
        {
          field: 'field11',
          filter: 'agTextColumnFilter',
          index: 4,
        },
        {
          field: 'field12',
          filter: 'agTextColumnFilter',
          index: 5,
        },
      ],
      rowData: [],
      defaultColDef: {
        flex: 1,
      },
      height: document.body.clientHeight - 150,
      pagination: true,
      sideBar: {
        hiddenByDefault: true,
      },
    },
    tabItems: [
      {
        tabName: 'File Upload',
        index: 0,
      },
      {
        tabName: 'Pic Upload',
        index: 1,
      },
      {
        tabName: 'Table',
        index: 2,
      },
    ],
    tab: 2, // 默认第三个选项卡
  }),
};
</script>
