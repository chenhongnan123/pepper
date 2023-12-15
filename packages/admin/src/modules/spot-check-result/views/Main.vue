<template>
  <v-container fluid>
    <portal
      to="app-header"
      v-if="pagePortalMode.spotCheckResult"
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
          <!-- 日期单选组件 -->
            <DateSinglePicker
              :beginTime="beginTime"
              dense
              @input="getTableList"
            />
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
                ref="spotCheckResultGrid"
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
import moment from 'moment';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import DateSinglePicker from '@/components/commonUI/DateSinglePicker';
import LinkBtn from '../components/LinkBtn.vue';
import StatusBtn from '../components/StatusBtn.vue';

export default {
  name: 'spotCheckResult',
  components: {
    BaseGrid,
    LinkBtn,
    StatusBtn,
    DateSinglePicker,
  },
  data() {
    return {
      elementName: 'spotCheckResult',
      tableHeight: document.body.clientHeight - 210,
      spotCheckResultHeaders: [
        'no',
        'checkResult',
        'checkName',
        'deviceNumber',
        'deviceName',
        'typeName',
        'createBy',
        'createTime',
      ],
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        rowDataId: 'checkResultId', // 传递对象的唯一标识符
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        pagination: true,
      },
      beginTime: new Date(),
    };
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('spotCheckResult', ['checkResultList']),
    moduleName() {
      return this.$route.name;
    },
  },
  created() {
    this.initTableHeaders();
    const { beginTime } = this.$route.params;
    if (beginTime) {
      this.getTableList(beginTime);
    } else {
      this.getTableList(this.beginTime);
    }
  },
  methods: {
    ...mapActions('spotCheckResult', ['getCheckResultList']),
    ...mapMutations('helper', ['setAlert']),
    refresh() {
      this.getTableList(this.beginTime);
    },
    async getTableList(time) {
      // 时间格式是 yyyy-MM-DD HH:mm:ss 格式的
      const beginTime = moment(new Date(time)).format('YYYY-MM-DD 00:00:00');
      const endTime = moment(new Date(beginTime)).add(1, 'days').format('YYYY-MM-DD 00:00:00');
      const payload = [
        beginTime,
        endTime,
      ];
      await this.getCheckResultList(payload);
      this.options.rowData = this.checkResultList;
      this.beginTime = time;
    },
    initTableHeaders() {
      let headers = [];
      headers = this.spotCheckResultHeaders.map((item, index) => {
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
        if (item === 'checkName') {
          obj.cellRendererSelector = () => ({
            component: 'LinkBtn',
            params: {
              that: this,
              beginTime: this.beginTime,
            },
          });
        }
        if (item === 'checkResult') {
          obj.cellRendererSelector = () => ({
            component: 'StatusBtn',
            params: {
              that: this,
              field: 'checkResult',
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
