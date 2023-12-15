<template>
  <v-container fluid>
    <portal to="app-header">
      {{ $t('test') }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="init(),asyncGridApi.deselectAll()"
      >
        <v-icon
          v-text="'mdi-refresh'"
        />
      </v-btn>
      <!-- <v-btn @click="options.rowData = [];">
        reset
      </v-btn> -->
    </portal>
    <!-- <portal to="page-header">
      {{ $t('test') }} 就好比小舅说你小舅说
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="pepperGridApi.deselectAll()"
      >
        <v-icon
          v-text="'mdi-refresh'"
        />
      </v-btn>
      <v-btn @click="options.rowData = [];">
        reset
      </v-btn>
    </portal> -->
    <!-- <v-autocomplete
      :items="items"
      label="Read-only"
    >
    <template v-slot:item="{ item }">
      <v-list-item-content>
        <img :src="`https://fanyi-cdn.cdn.bcebos.com/static/translation/${img}/header/logo_e835568.png`" alt="">
        <v-list-item-title v-text="item"></v-list-item-title>
      </v-list-item-content>
    </template>
    </v-autocomplete> -->
    <!-- <hr>
    测试 组件：
      <SidebarLayout />
    <hr> -->
    <!-- <span class="fi fi-br" style="font-size: 30px;"></span> -->
    <v-row
      class="text-center"
      no-gutters
    >
      <v-col>
        <!-- {{ selectedRows }} -->
        <!-- <pepper-grid
          ref="pepperGrid"
          v-model="selectedRows"
          :options="options"
        /> -->
        <async-grid
          ref="asyncGrid"
          v-model="selectedRows"
          :options="options"
          :method="'systemGet'"
          :url="request.url"
          :parameters="request.params"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';
import PepperGrid from '@/components/aggrid/PepperGrid.vue';
import AsyncGrid from '@/components/aggrid/AsyncGrid.vue';
import GridIcon from '@/components/aggrid/GridIcon.vue';
import GridDateFilter from '@/components/aggrid/GridDateFilter.vue';
import SidebarLayout from '@/components/commonUI/SidebarLayout.vue';

export default {
  name: 'HelloWorld',
  components: {
    PepperGrid,
    AsyncGrid,
    GridIcon,
    GridDateFilter,
    SidebarLayout,
  },
  mounted() {
    this.setPageHeader(true);
    this.setAppHeaderHeight(100);
    // this.pepperGridApi = this.$refs.pepperGrid.gridApi;
    this.asyncGridApi = this.$refs.asyncGrid.gridApi;
    // 表格数据加载必须放在mounted钩子函数中
    this.init();
    // const time = new Date().getTime();
  },
  created() {
    // this.init();
  },
  beforeDestroy() {
    this.setPageHeader(false);
    // this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
    ]),
    init() {
      if (this.$refs.asyncGrid) {
        this.$refs.asyncGrid.init();
      }
    },
  },
  data: () => ({
    img: 'img',
    value1: '',
    items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
    pepperGridApi: null,
    asyncGridApi: null,
    selectedRows: [],
    options: {
      headers: [
        {
          field: 'no',
          checkboxSelection: true,
          headerCheckboxSelection: true,
          maxWidth: 100,
          headerName: 'operationLog.table.no',
          filter: 'agTextColumnFilter',
          valueGetter: 'node.rowIndex + 1',
          index: 0,
        },
        {
          field: 'title',
          headerName: 'operationLog.table.systemModule',
          filter: 'agTextColumnFilter',
          index: 1,
        },
        {
          field: 'operName',
          headerName: 'operationLog.table.operatorName',
          filter: 'agTextColumnFilter',
          index: 2,
        },
        {
          field: 'operIp',
          headerName: 'operationLog.table.ip',
          filter: 'agTextColumnFilter',
          index: 3,
        },
        {
          field: 'operTime',
          headerName: 'operationLog.table.operationTime',
          filter: 'agTextColumnFilter',
          index: 4,
        },
      ],
      rowData: [],
      sideBar: {
        hiddenByDefault: true,
      },
      height: document.body.clientHeight - 240,
    },
    request: {
      url: '/operlog/list',
      params: {
        orderByColumn: 'operTime',
        isAsc: 'descending',
      },
    },
  }),
};
</script>
