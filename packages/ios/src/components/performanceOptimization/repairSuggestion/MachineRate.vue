<template>
  <div>
    <v-card
      class="rounded-xl overflow-y-auto"
      :style="`height: ${height}px;width: 100%`"
      rounded
      color="transparent"
    >
      <v-card-text class="px-1">
        <v-row
          no-gutters
          v-for="(item, key) in machineRateList"
          :key="key"
          class="my-2"
        >
          <v-col cols="8" class="pr-1">
            <v-list
              dense
              class="rounded-lg machine-rate-unactive"
              :class="`machine-rate-${selectedPart === item.productName?'active':'unactive'}`"
            >
              <!-- eslint-disable-next-line  -->
              <v-list-item two-line link :to="{ path: `/repair-suggestion-detail/${item.productId}/${item.modelId || 0}/${item.productCode || 0}` }"
              >
                <v-list-item-icon class="mt-5">
                  <v-icon
                    large
                    :color="iconList[item.status || 0].color"
                  >{{iconList[item.status || 0].icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    class="text-h6 font-weight-black"
                    style="line-height: 1.2;"
                    :class="`${iconList[item.status || 0].color}--text`"
                  >
                    <span>{{item.productName || '-'}}</span>
                  </v-list-item-title>
                  <v-list-item-subtitle class="pb-1">
                    <span v-if="item.status === 1">
                      {{'存在报警测点'}}
                    </span>
                    <span v-else-if="item.status === 2">
                      {{'存在预警测点'}}
                    </span>
                    <span v-else-if="item.status === 3">
                      {{'存在未完成的维修任务'}}
                    </span>
                    <span v-else-if="item.status === 4">
                      {{'存在未完成的维保任务'}}
                    </span>
                    <span v-else-if="item.status === 0">
                      {{'正常'}}
                    </span>
                    <span v-else>
                      {{'-'}}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="2" class="pr-1">
            <div
              class="d-flex flex-column justify-center align-center rounded-lg"
              style="height: 100%;"
              :class="`machine-rate-${selectedPart === item.productName?'active':'unactive'}`"
            >
              <span class="primary--text font-weight-bold">{{'评分'}}</span>
              <span class="primary--text text-h4 font-weight-black">
                {{item?.prodductTaskSource?.AllAvgSource || ''}}
              </span>
            </div>
          </v-col>
          <v-col cols="2" class="pr-1">
            <!-- eslint-disable-next-line -->
            <div
              class="d-flex flex-column justify-center align-center rounded-lg"
              style="height: 100%;cursor: pointer;"
              :class="`machine-rate-${selectedPart === item.productName?'active':'unactive'}`"
              @click="showMainPart(item)"
            >
              <span class="primary--text font-weight-bold">{{'查看模型'}}</span>
              <v-icon color="primary" large class="mt-1">mdi-map-marker-outline</v-icon>
              <!-- <span class="primary--text text-h5 font-weight-black">{{item.rate}}</span> -->
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

let rateTimer = null;
export default {
  name: 'MachineRate',
  data() {
    return {
      selectedPart: null,
      iconList: [
        {
          color: 'primary',
          icon: 'mdi-check-circle',
        }, // 0-正常
        {
          color: 'error',
          icon: 'mdi-close-circle',
        }, // 1-存在报警测点
        {
          color: 'warning',
          icon: 'mdi-alert-circle',
        }, // 2-存在预警测点
        {
          color: 'warning',
          icon: 'mdi-alert-circle',
        }, // 3-存在未完成的维修任务
        {
          color: 'warning',
          icon: 'mdi-alert-circle',
        }, // 4-存在未完成的维保任务
      ],
    };
  },
  props: {
    height: {
      type: Number,
    },
  },
  components: {
  },
  created() {
    this.getMachineRateList();
    rateTimer = setInterval(() => {
      this.getMachineRateList();
    }, 10 * 1000);
  },
  beforeDestroy() {
    clearInterval(rateTimer);
  },
  computed: {
    ...mapState('repairSuggestion', ['machineRateList']),
  },
  watch: {
  },
  methods: {
    ...mapActions('repairSuggestion', ['getMachineRateList']),
    showMainPart(rate) {
      if (rate.productName === this.selectedPart) {
        this.$root.$digitalModel.refresh();
        this.selectedPart = null;
        return;
      }
      this.selectedPart = rate.productName;
      this.$root.$digitalModel.showMainMesh([rate.modelId]);
    },
  },
};
</script>
