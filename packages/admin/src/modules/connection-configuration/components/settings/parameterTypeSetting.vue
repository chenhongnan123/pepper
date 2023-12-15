<template>
  <div>
    <portal to="app-header" v-if="pagePortalMode.parameterTypeSetting">
      <v-btn
        icon
        small
        class="mr-2 mb-1"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ $t('modules.parameterTypeSetting') }}
    </portal>
    <portal to="settings-header-left"
      v-if="pagePortalMode.parameterTypeSetting"
    >
      <v-btn
        icon
        small
        class="ml-2"
        @click="getTableList"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <v-row
      class="text-center"
      no-gutters
    >
      <v-col :cols="12">
        <base-grid
          ref="parameterTypeGrid"
          :elementName="elementName"
          :restoreColumn="true"
          :options="options"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import CheckBox from './CheckBox.vue';

let timer = null;
export default {
  name: 'parameterTypeSetting',
  data() {
    return {
      elementName: 'parameterTypeSetting',
      clientheight: document.body.clientHeight,
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 260,
      },
      headers: [
        'no',
        'dataTypeNum',
        'dataTypeLen',
        'dataTypeName',
        'dataTypeDesc',
        'enabledFlag',
      ],
    };
  },
  components: {
    BaseGrid,
    CheckBox,
  },
  computed: {
    ...mapState('connectionConfiguration', ['paramTypeList']),
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    moduleName() {
      return this.$route.name;
    },
  },
  created() {
    this.init();
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  beforeDestroy() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    ...mapActions('connectionConfiguration', ['getParamTypeList']),
    init() {
      this.initTableHeaders();
      this.getTableList();
    },
    async getTableList() {
      const payload = {
        API_ROUTE_PATH: 'XXCUS_RST_PARAMS_TYPE',
      };
      const result = await this.getParamTypeList(payload);
      if (result) {
        timer = setTimeout(() => {
          this.options.rowData = this.paramTypeList;
        }, 400);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
      }
    },
    initTableHeaders() {
      const headers = this.headers.map((item, index) => {
        const obj = {
          field: item,
          headerName: `connectionConfiguration.settingTable.${item}`,
          index,
          filter: 'agTextColumnFilter',
          checkboxSelection: false,
          headerCheckboxSelection: false,
        };
        if (item === 'enabledFlag') {
          delete obj.filter;
          obj.cellRendererSelector = () => ({
            component: 'CheckBox',
          });
        }
        return obj;
      });
      this.options.headers = headers;
    },
    goBack() {
      const { id } = this.$route.params;
      if (id === 0) {
        // id=0时，返回主页面
        this.$router.push({ path: '/connection-configuration' });
      } else {
        this.$router.push({ path: `/connection-configuration/detail/${id}` });
      }
    },
  },
};
</script>
