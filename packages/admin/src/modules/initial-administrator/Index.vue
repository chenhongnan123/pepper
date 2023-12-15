<template>
  <v-container fluid>
    <portal to="app-header">
      {{ $t(`modules.${moduleName}`) }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="refresh"
      >
        <v-icon
          v-text="'mdi-refresh'"
        />
      </v-btn>
    </portal>
    <portal to="page-header">
    </portal>
    <v-row
      class="text-center"
      no-gutters
    >
      <v-col>
        <base-grid
          ref="BaseGrid"
          :elementName="elementName"
          :restoreColumn="true"
          :options="options"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import FactoryField from './components/FactoryField.vue';
import ActionMenu from './components/ActionMenu.vue';

export default {
  name: 'initialAdministrator',
  data() {
    return {
      elementName: 'InitialAdministrator',
      clientheight: document.body.clientHeight,
      options: {
        headers: [
          {
            field: 'name',
            headerName: 'initialAdministrator.factory',
            filter: 'agTextColumnFilter',
            index: 0,
            cellRendererSelector: () => ({
              component: 'FactoryField',
              params: {
              },
            }),
          },
          {
            field: 'userName',
            headerName: 'initialAdministrator.account',
            filter: 'agTextColumnFilter',
            index: 1,
          },
          {
            field: 'password',
            headerName: 'initialAdministrator.password',
            filter: 'agTextColumnFilter',
            index: 2,
          },
          {
            field: 'lastName',
            headerName: 'initialAdministrator.lastName',
            filter: 'agTextColumnFilter',
            index: 3,
          },
          {
            field: 'firstName',
            headerName: 'initialAdministrator.firstName',
            filter: 'agTextColumnFilter',
            index: 4,
          },
          {
            field: 'email',
            headerName: 'initialAdministrator.email',
            filter: 'agTextColumnFilter',
            index: 5,
          },
          {
            field: 'phoneNumber',
            headerName: 'initialAdministrator.telephone',
            filter: 'agTextColumnFilter',
            index: 6,
          },
          {
            field: 'action',
            headerName: 'initialAdministrator.action',
            cellRendererSelector: () => ({
              component: 'ActionMenu',
              params: {
                that: this,
              },
            }),
            index: 7,
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 150,
      },
    };
  },
  components: {
    BaseGrid,
    FactoryField,
    ActionMenu,
  },
  mounted() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    this.setPageHeader(false);
    // this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    ...mapActions('factoryCompany', [
      'getCompany',
    ]),
    ...mapActions('initialAdministrator', [
      'getFactoryList',
    ]),
    refresh() {
      this.init();
    },
    async init() {
      const companyId = await this.getCompany();
      if (companyId) {
        const result = await this.getFactoryList({ companyId });
        if (!result) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'noFactory',
          });
        } else {
          this.options.rowData = this.factoryList;
        }
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'noCompany',
        });
      }
    },
  },
  computed: {
    ...mapState('initialAdministrator', [
      'factoryList',
    ]),
    moduleName() {
      return this.$route.name;
    },
    rules() {
      return this.$getFactoryCompanyRules();
    },
  },
};
</script>
