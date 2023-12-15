<template>
  <div>
    <portal to="app-header" v-if="pagePortalMode.dataTypeSetting">
      <v-btn
        icon
        small
        class="mr-2 mb-1"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ $t('modules.dataTypeSetting') }}
    </portal>
    <portal
      to="settings-header-left"
      v-if="pagePortalMode.dataTypeSetting"
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
          ref="dataTypeGrid"
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

export default {
  name: 'dataTypeSetting',
  data() {
    return {
      elementName: 'dataTypeSetting',
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
        'dictValue',
        'dictLabel',
        'remark',
      ],
    };
  },
  components: {
    BaseGrid,
    CheckBox,
  },
  computed: {
    ...mapState('connectionConfiguration', ['dataTypeList']),
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
  },
  deactivated() {
  },
  beforeDestroy() {
  },
  methods: {
    ...mapMutations('helper', [
      'setAlert',
    ]),
    ...mapActions('connectionConfiguration', ['getDataTypeList']),
    init() {
      this.initTableHeaders();
      this.getTableList();
    },
    async getTableList() {
      const result = await this.getDataTypeList();
      if (result) {
        this.options.rowData = this.dataTypeList;
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
        if (item === 'no') {
          obj.maxWidth = 100;
          // eslint-disable-next-line
          obj.valueGetter = (params) => params.node?.rowIndex + 1;
        }
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
