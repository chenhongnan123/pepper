<template>
  <v-container fluid>
    <portal
      to="app-header"
      v-if="pagePortalMode.monitorRecord"
    >
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
          <div
            class="d-flex align-center px-4"
            style="height: 100%"
          >
            <DateTimeRangePicker
              @input="dateChange"
              v-model="dateFilter"
            />
            <v-spacer></v-spacer>
          </div>
        </v-card>
        <v-card
          :height="tableHeight"
          class=""
          elevation="0"
          color="bg"
        >
          <v-row
            no-gutters
            class="pa-4"
          >
            <v-col>
              <base-grid
                ref="monitorRecordGrid"
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
// eslint-disable-next-line object-curly-newline
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import DateTimeRangePicker from '@/components/commonUI/DateTimeRangePicker.vue';

export default {
  name: 'monitorRecord',
  components: {
    BaseGrid,
    DateTimeRangePicker,
  },
  data() {
    return {
      elementName: 'monitorRecord',
      tableHeight: document.body.clientHeight - 210,
      monitorRecordHeaders: [
        'no',
        'createTime',
        'bomParentName',
        'bomName',
        'eventName',
        // 'algorithmType',
        'type',
        'algorithm',
        'warnCode',
        'warnContent',
      ],
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        rowDataId: 'checkId', // 传递对象的唯一标识符
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        pagination: true,
      },
      request: {
        url: 'record/list',
        params: {},
      },
      dateFilter: [],
    };
  },
  activated() {
    this.monitorRecordGrid = this.$refs.monitorRecordGrid.gridApi;
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('monitorRecord', ['monitorRecordList', 'monitorRecordListTotal']),
    moduleName() {
      return this.$route.name;
    },
  },
  mounted() {
    this.initTableHeaders();
  },
  methods: {
    ...mapActions('monitorRecord', ['getmonitorRecordList']),
    ...mapMutations('helper', ['setAlert']),
    refresh() {
      this.initDate();
    },
    async getTableList(payload) {
      await this.getmonitorRecordList(`beginTime=${payload.beginTime}&endTime=${payload.endTime}`);
      if (this.monitorRecordListTotal > 10000) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'limitThan10000',
        });
        return;
      }
      this.options.rowData = this.monitorRecordList;
    },
    async dateChange([beginTime, endTime]) {
      beginTime = this.$getFormatDate(beginTime, 'YYYY-MM-DD HH:mm:ss');
      endTime = this.$getFormatDate(endTime, 'YYYY-MM-DD HH:mm:ss');
      const payload = {
        beginTime,
        endTime,
      };
      await this.getTableList(payload);
      // this.request.params = {
      //   beginTime,
      //   endTime,
      // };
      // this.setAlert({
      //   show: true,
      //   type: 'success',
      //   message: 'successAction',
      // });
    },
    async initDate() {
      let beginTime = new Date().setHours(0, 0, 0, 0);
      let endTime = new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000;
      beginTime = this.$getFormatDate(beginTime, 'YYYY-MM-DD HH:mm:ss');
      endTime = this.$getFormatDate(endTime, 'YYYY-MM-DD HH:mm:ss');
      const initDateRange = [beginTime, endTime];
      this.dateFilter = initDateRange;

      const payload = {
        beginTime,
        endTime,
      };
      await this.getTableList(payload);
      // this.request.params = {
      //   beginTime,
      //   endTime,
      // };
      // this.setAlert({
      //   show: true,
      //   type: 'success',
      //   message: 'successAction',
      // });
    },
    initTableHeaders() {
      let headers = [];
      headers = this.monitorRecordHeaders.map((item, index) => {
        const obj = {
          field: item,
          headerName: `monitorRecord.table.${item}`,
          index,
          // filter: false,
          // floatingFilter: false,
          filter: 'agTextColumnFilter',
          // checkboxSelection: index === 0,
          // headerCheckboxSelection: index === 0,
        };
        if (item === 'type') {
          obj.valueGetter = (params) => {
            const {
              data: { type },
            } = params;
            if (type === '0') return this.$t('monitorRecord.label.standardalgorithm');
            if (type === '1') return this.$t('monitorRecord.label.customalgorithms');
            return '---';
          };
        }
        return obj;
      });
      this.options.headers = headers;
    },
  },
};
</script>
