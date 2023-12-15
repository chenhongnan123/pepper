<template>
  <div style="width: 100%;">
    <div
    :style="`height:${topHeight}px;`"
    class="pt-3 pb-4"
    >
      <!-- <v-text-field
        class="mx-3 blueinput rounded-xl"
        dark
        outlined
        label=""
        hide-details
        prepend-inner-icon="mdi-magnify"
        v-model="searchVal"
        :placeholder="'经验名称'"
      ></v-text-field> -->
      <div
        class="knowledge-chart d-flex align-center justify-center fill-height"
      >
        <div class="pie-chart">
          <img
            :src="require('@/assets/icons/img/knowledge-chart-background-1-dark.svg')"
            alt=""
            height='300px'
            class="background-img-1"
          />
          <img
            :src="require('@/assets/icons/img/knowledge-chart-background-2-dark.svg')"
            alt=""
            height='300px'
            class="background-img-1"
          />
          <img
            :src="require('@/assets/icons/img/knowledge-chart-background-3-dark.svg')"
            alt=""
            height='274px'
            class="background-img-2"
          />
          <img
            :src="require('@/assets/icons/img/knowledge-chart-background-4-dark.svg')"
            alt=""
            height='274px'
            class="background-img-2"
          />
          <v-charts-pie :chartsData="chartsData" />
          <div class="circle"></div>
          <div class="info-item d-flex flex-column align-center justify-center">
            <span class="font-weight-black">{{knowledgeList.length}}</span>
            <span class="font-weight-black">{{$t('knowledge.total')}}</span>
          </div>
          <div
            class="
              info-label
              d-flex
              flex-column
              align-center
              overflow-y-auto
              overflow-x-visible
              pl-5
              pr-1
            "
            :style="`width: 130px;right: 0px;`"
          >
            <div class="line-1"></div>
            <template v-for="(item, key) in chartsData.series[0].data">
              <div :key="key" class="d-flex justify-space-between pl-1">
                <span class="text-truncate">
                  <v-icon small :color="item.color">mdi-circle</v-icon>
                  {{item.name}}
                </span>
                <!-- <v-spacer></v-spacer> -->
                <span class="font-weight-black primary--text font-italic">{{item.y}}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="knowledge-repair-record mt-2">
      <div class="d-flex align-center mb-2">
        <div class="title-text primary--text">
          {{tableTitle || $t('knowledge.knowledge')}}
        </div>
        <div
          class="page-text info--text ml-2"
        >{{`${page}/${pageCount}`}}</div>
      </div>
      <div
        class="d-flex align-center"
        :style="`height:${tableHeight}px;width: 100%;`"
      >
        <v-btn
          :height="tableHeight"
          width="10px"
          x-small
          class="high-blue-btn mr-2"
          :disabled="page===1"
          @click="page = page - 1"
        >
          <v-icon size="40px" color="primary">mdi-menu-left</v-icon>
        </v-btn>
        <div style="width: calc(100% - 100px);">
          <v-data-table
            fixed-header
            :headers="headers"
            :items="tableRecordList"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            :height="tableHeight"
            class="repair-record-table flex-grow-1 flex-shrink-0"
            dense
            @page-count="pageCount = $event"
            style="width: 100%;"
            disable-sort
          >
            <template v-slot:item="{ item }">
              <tr
                style="cursor: pointer;height:54px"
                @click="goDetails(item)"
              >
                <td>
                  <div class="text-truncate" style="width: 150px;">
                    {{item.updateTime}}
                  </div>
                </td>
                <td>
                  <div class="text-truncate" style="width: 100px;">
                    {{item.expertiseType}}
                  </div>
                </td>
                <td>
                  <div class="text-truncate" style="width: 100px;">
                    {{item.expertiseNumber}}
                  </div>
                </td>
                <td>
                  <div class="text-truncate">
                    {{item.expertiseName}}
                  </div>
                </td>
                <td>
                  <div class="text-truncate" style="width: 130px;">
                    {{item.alarmCode}}
                  </div>
                </td>
                <td>
                  <div
                    class="text-truncate"
                    style="width: 210px;white-space: inherit!important;"
                    :title="item.partName"
                  >
                    {{item.partName}}
                  </div>
                </td>
                <td>
                  <!-- eslint-disable-next-line -->
                  <div
                    class="primary--text text-decoration-underline"
                    style="cursor: pointer;width: 100px;"
                    @click="goDetails(item)"
                  >{{$t('knowledge.detail')}}</div>
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
        <v-btn
          :height="tableHeight"
          width="10px"
          x-small
          class="high-blue-btn ml-2"
          :disabled="page===pageCount || pageCount===0"
          @click="page = page + 1"
        >
          <v-icon size="40px" color="primary">mdi-menu-right</v-icon>
        </v-btn>
      </div>
    </div>
    <knowledge-detail-dialog
      :knowledgeDetailDialog="knowledgeDetailDialog"
      :expertknowledge="expertknowledge"
      @closeDialog="knowledgeDetailDialog = false;expertknowledge = {};"
    />
  </div>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
} from 'vuex';
import VChartsPie from '../../charts/VChartsPie.vue';
import KnowledgeDetailDialog from './KnowledgeDetail.vue';

let that = null;

export default {
  name: 'ExpertKnowledge',
  data() {
    return {
      clientheight: document.body.clientHeight,
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      tableTitle: '',
      searchVal: '',
      chartColor: [
        'rgb(102, 206, 249)',
        'rgb(47, 96, 246)',
        'rgb(104, 222, 214)',
        'rgb(131, 210, 89)',
        'rgb(99, 111, 244)',
        'rgb(247, 203, 163)',
        'rgb(182, 159, 221)',
      ],
      chartsData: {
        chart: {
          type: 'pie',
          backgroundColor: 'transparent',
          height: 300,
        },
        plotOptions: {
          series: {
            events: {
              click(event) {
                const { options } = event.point;
                if (!options.selected) {
                  that.tableTitle = options.name;
                } else {
                  that.tableTitle = '';
                }
              },
            },
          },
        },
        series: [{
          name: 'count',
          colorByPoint: true,
          innerSize: 70,
          borderWidth: 0,
          data: [
            {
              color: 'rgb(102, 206, 249)',
              name: '机械',
              y: 345,
            },
            {
              color: 'rgb(47, 96, 246)',
              name: '电气',
              y: 345,
            },
            {
              color: 'rgb(104, 222, 214)',
              name: '类别1',
              y: 345,
            },
            {
              color: 'rgb(131, 210, 89)',
              name: '类别1',
              y: 22,
            },
            {
              color: 'rgb(99, 111, 244)',
              name: '类别1',
              y: 55,
            },
            {
              color: 'rgb(247, 203, 163)',
              name: '类别1',
              y: 145,
            },
            {
              color: 'rgb(182, 159, 221)',
              name: '类别1',
              y: 67,
            },
          ],
        }],
      },
      tableRecordList: [],
      knowledgeDetailDialog: false,
      expertknowledge: {},
    };
  },
  created() {
    that = this;
  },
  components: {
    VChartsPie,
    KnowledgeDetailDialog,
  },
  props: {
    height: {
      type: Number,
      required: true,
    },
    details: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('digitalArchives', ['deviceDetail', 'expertKnowledgeList']),
    topHeight() {
      return 328;
    },
    bottomHeight() {
      return this.height - 8 - this.topHeight;
    },
    tableHeight() {
      return this.bottomHeight - 8 - 30;
    },
    // 模块，区分设备层二级bom层
    module() {
      if (this.details?.bomLevel === '0') {
        return 'DeviceDoc';
      }
      if (this.details?.bomLevel === '2') {
        return 'partManagementDetail';
      }
      return '';
    },
    // bomId或设备id
    bomId() {
      if (this.module === 'DeviceDoc') {
        return Number(this.deviceDetail.deviceId);
      }
      if (this.module === 'partManagementDetail') {
        if (this.details?.bomId) {
          return Number(this.details.bomId);
        }
      }
      return '';
    },
    knowledgeList() {
      return this.expertKnowledgeList;
    },
    chartDataList() {
      let sourceCount = 0;
      const colorNum = this.chartColor.length;
      const chartData = this.knowledgeList.reduce((datalist, item) => {
        if (datalist.some((i) => i.name === item.expertiseType)) {
          datalist = datalist.map((i) => {
            const n = {
              ...i,
            };
            if (i.name === item.expertiseType) {
              n.y += 1;
            }
            return n;
          });
        } else {
          sourceCount += 1;
          const colorKey = sourceCount - colorNum <= 0
            ? sourceCount - 1
            : sourceCount - colorNum - 1;
          datalist.push({
            color: this.chartColor[colorKey],
            name: item.expertiseType,
            y: 1,
          });
        }
        return datalist;
      }, []);
      return chartData;
    },
    headers() {
      return [
        {
          text: this.$t('knowledge.recordtime'),
          value: 'updateTime',
          width: 160,
          sortable: true,
        },
        {
          text: this.$t('knowledge.experienceType'),
          value: 'expertiseType',
          width: 130,
          sortable: true,
        },
        {
          text: this.$t('knowledge.experienceCode'),
          value: 'expertiseNumber',
          width: 130,
          sortable: true,
        },
        {
          text: this.$t('knowledge.experienceName'),
          value: 'expertiseName',
          sortable: true,
          width: 200,
          filter: (value) => {
            if (!this.searchVal) {
              return true;
            }
            if (typeof value === 'undefined') {
              return false;
            }
            return value.toString().toLocaleUpperCase()
              .indexOf(this.searchVal.toString().toLocaleUpperCase()) !== -1;
          },
        },
        {
          text: this.$t('knowledge.faultCode'),
          value: 'alarmCode',
          width: 130,
          sortable: true,
        },
        {
          text: this.$t('knowledge.faultPosition'),
          value: 'partName',
          width: 130,
          sortable: true,
        },
        {
          text: this.$t('knowledge.action'),
          value: 'action',
          width: 100,
          sortable: false,
        },
      ];
    },
  },
  watch: {
    bomId: {
      handler(val) {
        if (val) {
          this.init();
        } else {
          this.setExpertKnowledgeList([]);
        }
      },
      deep: true,
      immediate: true,
    },
    knowledgeList: {
      handler(val) {
        this.tableRecordList = val;
        this.tableTitle = '';
      },
      deep: true,
      immediate: true,
    },
    tableTitle: {
      handler(val) {
        if (val) {
          this.tableRecordList = this.knowledgeList
            .filter((item) => item.expertiseType === val);
        } else {
          this.tableRecordList = this.knowledgeList;
        }
      },
      deep: true,
      immediate: false,
    },
    chartDataList: {
      handler(val) {
        this.chartsData.series[0].data = val;
        this.chartsData.series[0].name = this.$t('knowledge.count');
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapMutations('digitalArchives', ['setExpertKnowledgeList']),
    ...mapActions('digitalArchives', ['getExpertKnowledgeList']),
    async init() {
      await this.getExpertKnowledgeList(
        {
          module: this.module,
          bomId: this.bomId,
        },
      );
    },
    goDetails(item) {
      this.expertknowledge = item;
      this.knowledgeDetailDialog = true;
    },
  },
};
</script>
