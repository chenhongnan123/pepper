<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.spotCheckResultDetail">
      <v-btn
        icon
        small
        class="mr-2 mb-1"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ $t(`modules.${moduleName}`)  }}
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
          :height="tableHeight"
          class=""
          elevation="0"
          color="bg"
        >
          <v-row no-gutters class="pa-4">
            <v-col>
              <base-grid
                ref="spotCheckResultDetailGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="options"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import StatusBtn from '../components/StatusBtn.vue';

export default {
  name: 'spotCheckResultDetail',
  components: {
    BaseGrid,
    StatusBtn,
  },
  data() {
    return {
      elementName: 'spotCheckResultDetail',
      tableHeight: document.body.clientHeight - 133,
      checkDetailHeaders: [
        'no',
        'checkDetailName',
        'parameterTag',
        'upperLimit',
        'lowerLimit',
        'currentValue',
        'detailCheckResult',
      ],
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        rowDataId: 'checkDetailId', // 传递对象的唯一标识符
        height: document.body.clientHeight - 163,
        rowHeight: 35,
        pagination: true,
      },
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('spotCheckResult', [
      'checkResultDetailList',
    ]),
    moduleName() {
      return this.$route.name;
    },
    checkResultId() {
      return +this.$route.query.checkResultId;
    },
    beginTime() {
      return this.$route.query.beginTime;
    },
  },
  created() {
    this.getTableList();
    this.initTableHeaders();
  },
  methods: {
    ...mapActions('spotCheckResult', [
      'getSpotCheckDetailList',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh() {
      this.getTableList();
    },
    goBack() {
      this.$router.push({
        name: 'spotCheckResult',
        params: {
          beginTime: this.beginTime,
        },
      });
    },
    async getTableList() {
      await this.getSpotCheckDetailList(this.checkResultId);
      this.options.rowData = this.checkResultDetailList;
    },
    initTableHeaders() {
      let headers = [];
      headers = this.checkDetailHeaders.map((item, index) => {
        const obj = {
          field: item,
          headerName: this.$t(`spotCheckResult.table.${item}`),
          index,
          filter: 'agTextColumnFilter',
          // checkboxSelection: index === 0,
          // headerCheckboxSelection: index === 0,
        };
        if (item === 'no') {
          obj.valueGetter = 'node.rowIndex + 1';
          obj.filterParams = { readOnly: true };
        }
        if (item === 'detailCheckResult') {
          obj.cellRendererSelector = () => ({
            component: 'StatusBtn',
            params: {
              that: this,
              field: 'detailCheckResult',
            },
          });
        }
        return obj;
      });
      this.options.headers = headers;
    },
  },
};
</script>
