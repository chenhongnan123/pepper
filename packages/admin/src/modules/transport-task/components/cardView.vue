<template>
  <div style="position: relative; height: 100%">
    <div
      :style="`height: ${height - paginationHeight}px;`"
      class="overflow-y-auto"
    >
      <v-row
        align="center"
        no-gutters
        v-for="i in Math.ceil(pageItem.length / lineItemNum)"
        :key="`row-${i}`"
        class="mt-2 mb-5"
      >
        <v-col
          :cols="Math.ceil(12 / lineItemNum)"
          v-for="(item , key) in pageItem.slice((i - 1) * lineItemNum, i * lineItemNum)"
          :key="`col-${i}-${key}`"
          class="px-6"
        >
          <v-card
            height="207px"
            elevation="0"
            class="transport-task-card"
            :style="`--card-border-color:var(--v-${item.statusColor}-base)`"
          >
            <v-card-title class="py-3">
              <span>
                {{ $t('transportTask.label.status') }}
              </span>
              <v-spacer></v-spacer>
              <v-chip
                :color="item.statusColor"
                label
                outlined
                small
              >
                {{ item.statusText }}
              </v-chip>
            </v-card-title>
            <div class="card-info mt-3 mb-5 mx-4 rounded-lg info--text py-2 px-2">
              <ul>
                <li class="mb-1">
                  <span>{{ $t('transportTask.label.transport') }}</span>
                  <span class="ml-4 bodytext--text">{{ item.transportName }}</span>
                </li>
                <li class="my-1">
                  <span>{{ $t('transportTask.table.startPointName') }}</span>
                  <span class="ml-4 bodytext--text">{{ item.startPointName }}</span>
                </li>
                <li class="my-1">
                  <span>{{ $t('transportTask.table.lightRodNumber') }}</span>
                  <span class="ml-4 bodytext--text">{{ item.lightRodNumber }}</span>
                </li>
                <li class="mt-1">
                  <span>{{ $t('transportTask.table.endPointName') }}</span>
                  <span class="ml-4 bodytext--text">{{ item.endPointName }}</span>
                </li>
              </ul>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div
      class="paginationPosition"
    >
      <div
        class="ag-pagination d-flex align-center"
        :style="`height: ${paginationHeight}px;`"
      >
        <v-spacer></v-spacer>
        <v-pagination
          v-model="curPage"
          :length="totalPages"
          :total-visible="7"
          color="primary"
          navigation-color="pagenav"
        ></v-pagination>
        <div class="agText ag-rightWidth ml-6 d-flex align-center">
          <span class="mr-1">{{$t('aggrid.stepTo')}}</span>
          <v-text-field
            outlined
            class="ag-input"
            dense
            hide-details
            v-model="curPageText"
          ></v-text-field>
          <span class="ml-1">{{$t('aggrid.page')}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

export default {
  name: 'taskCardView',
  data() {
    return {
      paginationHeight: 32, // 密集主题下分页高度为32
      curPage: 1,
    };
  },
  props: {
    taskList: {
      type: Array,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  components: {
  },
  computed: {
    ...mapState('transportTask', [
      'statusList',
    ]),
    cardList() {
      const { taskList, statusList } = this;
      return taskList.map((task) => {
        const obj = {
          ...task,
        };
        const status = statusList.find((item) => item.dictValue === task.scheduleTaskStatus);
        if (status) {
          obj.statusText = status.dictLabel;
          obj.statusColor = status.listClass;
        } else {
          obj.statusText = '-';
          obj.statusColor = 'subtitle';
        }
        return obj;
      });
    },
    totalRecords() {
      return this.taskList.length;
    },
    curPageText: {
      get() {
        return this.curPage;
      },
      set(val) {
        if (!Number(val)) {
          this.curPage = 1;
        } else if (Number(val) > this.totalPages) {
          this.curPage = this.totalPages;
        } else {
          this.curPage = Number(val);
        }
      },
    },
    lineItemNum() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 1;
        case 'sm': return 2;
        case 'md': return 2;
        case 'lg': return 3;
        case 'xl': return 4;
        default: return 4;
      }
    },
    pageItem() {
      const { cardList, curPage } = this;
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return cardList.slice((curPage - 1) * 1 * 3, 1 * 3 * curPage);
        case 'sm': return cardList.slice((curPage - 1) * 2 * 3, 2 * 3 * curPage);
        case 'md': return cardList.slice((curPage - 1) * 2 * 3, 2 * 3 * curPage);
        case 'lg': return cardList.slice((curPage - 1) * 3 * 3, 3 * 3 * curPage);
        case 'xl': return cardList.slice((curPage - 1) * 4 * 3, 4 * 3 * curPage);
        default: return cardList.slice((curPage - 1) * 3 * 3, 3 * 3 * curPage);
      }
    },
    totalPages() {
      return Math.ceil(this.taskList.length / (this.lineItemNum * 3));
    },
  },
  methods: {
    onPaginationPageSizeChanged() {
    },
  },
  watch: {
  },
};
</script>
