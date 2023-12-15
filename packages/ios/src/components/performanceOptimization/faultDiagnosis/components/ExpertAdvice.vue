<template>
  <div class="expert-advice pr-2">
    <div
      class="primary--text font-weight-bold bluetitlepart_new"
      style="z-index: 199;"
    >
      <div class="title">
        <span>{{ $t('faultDiagnosisPLCDetail.knowledge') }}</span>
      </div>
      <div class="cardtop">
        <div class="darkbluerectangle"></div>
        <div class="lightbluerectangle"></div>
      </div>
    </div>
    <v-card
      class="bluecard bluecard-decoration-5 rounded-xl"
      rounded
    >
    <v-card-actions class="mt-3 mx-4">
        <v-spacer></v-spacer>
        <v-btn
          outlined
          color="primary"
          small
          class="text-none"
          @click="queryExpertise"
          v-if="isFilterPart"
        >
          <v-icon left small>mdi-school-outline</v-icon>
          {{$t('maintenanceTask.showAllExpertise')}}
        </v-btn>
        <v-btn
          outlined
          color="primary"
          small
          class="text-none"
          @click="queryExpertise"
          v-else
        >
          <v-icon left small>mdi-school-outline</v-icon>
          {{$t('maintenanceTask.showFilterExpertise')}}
        </v-btn>
      </v-card-actions>
      <v-card-text class="card-text-content">
        <div class="knowledge-repair-record mt-1 mb-2">
          <div
            class="d-flex align-center"
            :style="`height:${tableheight}px;width: 100%;`"
          >
            <v-btn
              :height="tableheight"
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
                :items="exItems"
                :page.sync="page"
                :items-per-page="itemsPerPage"
                hide-default-footer
                :height="tableheight"
                class="repair-record-table flex-grow-1 flex-shrink-0"
                dense
                @page-count="pageCount = $event"
                style="width: 100%;"
                disable-sort
              >
                <template v-slot:item="{ item }">
                  <tr
                    style="cursor: pointer;height:49px"
                    @click="showDetailDialog(item)"
                  >
                    <td>
                      <div class="text-truncate" style="width: 150px;">
                        {{item.updateTime}}
                      </div>
                    </td>
                    <td>
                      <div class="text-truncate" style="width: 160px;">
                        {{item.expertiseType}}
                      </div>
                    </td>
                    <td>
                      <div class="text-truncate" style="width: 160px;">
                        {{item.expertiseNumber}}
                      </div>
                    </td>
                    <td>
                      <div>
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
                        @click="goDetails(item)"
                        style="width: 100px;"
                      >{{$t('knowledge.detail')}}</div>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </div>
            <v-btn
              :height="tableheight"
              width="10px"
              x-small
              class="high-blue-btn ml-2"
              :disabled="page===pageCount || pageCount===0"
              @click="page = page + 1"
            >
              <v-icon size="40px" color="primary">mdi-menu-right</v-icon>
            </v-btn>
          </div>
          <div class="d-flex align-center justify-center mt-2">
            <div
              :style="{ visibility: pageCount ? 'visible' : 'hidden' }"
              class="page-text info--text ml-2"
            >{{`${page}/${pageCount}`}}</div>
          </div>
        </div>
      </v-card-text>
    </v-card>
    <knowledge-detail-dialog
      :knowledgeDetailDialog="knowledgeDetailDialog"
      :expertknowledge="expertknowledge"
      @closeDialog="knowledgeDetailDialog = false;expertknowledge = {};"
    />
  </div>
</template>

<script>
import KnowledgeDetailDialog from '../../../lifecycle/expertKnowledge/KnowledgeDetail.vue';

export default {
  name: 'ExpertAdvice',
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      expertknowledge: {},
      // 内容
      exItems: [],
      // 搜索框
      search: '',
      // 所有经验
      isFilterPart: true,
      knowledgeDetailDialog: false,
      clientHeight: document.body.clientHeight,
      tableheight: 0,
    };
  },
  props: {
    alarmCodeId: {
      type: [Number, String],
      default: undefined,
    },
    bomId: {
      type: [Number, String],
      default: undefined,
    },
  },
  components: {
    KnowledgeDetailDialog,
  },
  mounted() {
    this.search = '';
    this.getBasicExpertiseList();
    this.tableheight = this.clientHeight - 794;
  },
  computed: {
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
          width: 196,
          sortable: true,
        },
        {
          text: this.$t('knowledge.experienceCode'),
          value: 'expertiseNumber',
          width: 196,
          sortable: true,
        },
        {
          text: this.$t('knowledge.experienceName'),
          value: 'expertiseName',
          sortable: true,
          width: 206,
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
          width: 150,
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
  methods: {
    queryExpertise() {
      this.isFilterPart = !this.isFilterPart;
      this.getBasicExpertiseList();
    },
    // 查询专家经验列表
    async getBasicExpertiseList() {
      const params = {
        alarmCodeId: this.isFilterPart ? this.alarmCodeId : '',
        bomId: this.isFilterPart ? this.bomId : '',
      };
      const result = await this.$basicGet(`expertise/selectRelatedlist?alarmCodeId=${params.alarmCodeId}&bomId=${params.bomId}`);
      if (result && result.rows) {
        this.exItems = result.rows;
      }
    },
    showDetailDialog(item) {
      this.knowledgeDetailDialog = true;
      this.expertknowledge = item;
    },
  },
};
</script>

<style lang="scss" scoped>
.card-text-content {
  padding: 0 20px 0 28px;
  border-radius: 16px;
  &-where {
    display: flex;
    line-height: 40px;
    padding-top: 28px;
  }
  &-opts {
    flex: 1;
    text-align: right;
  }
}
.expert-advice {
  height: 100%;
}
.expert-advice .bluecard {
  height: 100%;
}
.theme--dark.v-data-table {
  background-color: transparent !important;
}

/* .v-data-table-header {
  background-color: #555c61 !important;
  background: transparent !important;
  background-color: transparent !important;
}

.v-data-table.v-data-table--fixed-header {
  background: transparent !important;
  background-color: transparent !important;
} */
.v-data-table >>> .v-data-table-header {
  background-color: #555c61 !important;
}
.v-data-table >>> .v-data-table--fixed-header {
  background-color: #555c61 !important;
}
.v-data-table >>> th {
  background-color: #555c61 !important;
}
</style>
