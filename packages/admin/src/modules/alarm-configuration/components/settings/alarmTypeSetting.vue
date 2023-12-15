<template>
  <div>
    <portal to="settings-header-left"
      v-if="pagePortalMode.alarmTypeSetting"
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

export default {
  name: 'alarmTypeSetting',
  data() {
    return {
      elementName: 'alarmTypeSetting',
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
        'dataTypeCategory',
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
    ...mapState('communicationConnection', ['paramTypeList']),
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
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    ...mapActions('communicationConnection', ['getParamTypeList']),
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
        setTimeout(() => {
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
          headerName: `communicationConnection.settingTable.${item}`,
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
      this.$router.push({ path: `/connection-configuration/detail/${id}` });
    },
  },
};
</script>
