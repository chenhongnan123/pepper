<template>
  <div class="pr-2">
    <div
      class="primary--text font-weight-bold bluetitlepart mt-8"
    >
      <div class="title" style="width: 102px">
        报警信息
      </div>
      <div class="bgImg">
        <img
          :src="require('@/assets/icons/img/darkbluesquare-short.svg')"
          alt=""
        />
      </div>
      <div class="cardtop" style="left: 115px">
        <div class="darkbluerectangle"></div>
        <div class="lightbluerectangle"></div>
      </div>
    </div>
    <v-card
      class="bluecard bluecard-decoration-5 rounded-xl"
      rounded
    >
      <!-- <div
        v-for="i in 5"
        :key="i"
        :class="`rectangle-${i}`"
      ></div> -->
      <v-card-text
        :style="`height: ${height - 27}px`"
        class="overflow-y-auto pa-1 pt-4"
      >
        <div
          style="height: calc(100%);width: calc(100%);"
          class=""
          >
          <div
            v-for="(item, index) in alarmList"
            :class="'mt-2 mx-1 rounded '+
            ` ${item.alarmDge}-decoration-3`"
            :key="index"
            style="
              width: calc(47%) !important;
              display: inline-block;
              height: 60px;
              overflow: hidden;
              position: relative;
            "
            :style="`border: ${item.alarmDge.toLowerCase() ==='error'
              ? '1px solid var(--v-error-base)' : '1px solid var(--v-warning-base)'};`"
          >
            <div
              v-for="i in 3"
              :key="i"
              :class="`rectangle-${i}`"
            ></div>
            <!-- @@{{ item }}@@ -->
            <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
            <div
              @click="handleClickMessage(item)"
              class="d-flex align-center"
              style="cursor: pointer;position: absolute;top: 50%;
              transform: translateY(-50%);"
            >
              <img v-if="item.alarmDge.toLowerCase() ==='error'"
                src="@/assets/icons/img/fault-diagnosis-error.svg" alt="" style="width:35px ;">
              <img v-else
                src="@/assets/icons/img/fault-diagnosis-warning.svg" alt="" style="width:35px ;">
              <div>
                <div class="" style="font-size: xx-small;white-space: nowrap;">
                  {{ item.alarmTime }}
                </div>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      class="font-weight-bold text-subtitle-1 text-truncate"
                      :class="`text-${item.alarmDge}`"
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ item.alarmContent }}
                    </div>
                  </template>
                  <span>{{ item.alarmContent }}</span>
                </v-tooltip>
                <!-- <div class="font-weight-bold font-size-12 text-subtitle-1 text-truncate"
                  :class="`text-${item.alarmDge}`"
                  style=""
                  >
                  {{ item.alarmContent }}
                </div> -->
              </div>
            </div>
        </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';

export default {
  name: 'FeedStockChart',
  data() {
    return {
      moment,
    };
  },
  props: {
    height: {
      type: Number,
    },
  },
  components: {
  },
  computed: {
    ...mapState('faultDiagnosis', [
      'alarmDetail',
    ]),
    // 筛选报警信息（错误或警告）
    alarmList() {
      if (this.alarmDetail?.length) {
        const filterlist = this.alarmDetail.filter((item) => item.alarmDge.toLowerCase() === 'error'
          || item.alarmDge.toLowerCase() === 'warrning');
        if (filterlist.length) {
          return filterlist.map((it) => {
            const obj = {
              ...it,
              alarmTime: moment(it.alarmTime).format('YYYY-MM-DD HH:mm:ss'),
            };
            return obj;
          });
        }
        return [];
      }
      return [];
    },
  },
  methods: {
    handleClickMessage(item) {
      // console.log(item, 'handleClickMessage');
      // 路由到报警详情
      this.$router.push({
        name: 'faultDiagnosisDetail',
        query: {
          alarmId: item.alarmId,
          relevanceParma: item.relevanceParma,
          pointId: item.pointId,
        },
      });
    },
  },
};
</script>
