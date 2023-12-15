<template>
  <!-- PLC报警 -->
  <div>
    <alarm-title
      :current-model="model"
      :total-model="carouselitemnum"
    />
    <v-card
      class="bluecard rounded-xl overflow-y-auto"
      rounded
    >
      <v-card-text class="pb-0">
        <v-carousel
          hide-delimiter-background
          hide-delimiters
          show-arrows-on-hover
          :cycle="carouselcycle"
          v-model="model"
          :height="height"
        >
          <!-- eslint-disable-next-line -->
          <v-carousel-item
            v-for="j in carouselitemnum"
            :key="j"
            @mouseover="carouselcycle = false"
            @mouseleave="carouselcycle = true"
          >
            <v-row
              class="py-3 overflow-y-auto"
              :style="`height: ${height}px`"
            >
              <v-col
                cols="3"
                v-for="(alarm, key) in plcAlarmList.slice((j - 1) * 8, 8 * j)"
                :key="key"
              >
                <v-card
                  class="mx-4 rounded-lg py-1"
                  :class="alarm.alarmState === 0 ? 'alarm-item-delay' : 'alarm-item-advance'"
                  @click="goDetails(alarm)"
                >
                  <div
                    v-for="i in 3"
                    :key="i"
                    :class="`rectangle-${i}`"
                  ></div>
                  <v-list-item two-line>
                    <v-list-item-icon class="pt-1 my-4 mr-4">
                      <v-icon
                        large
                        color="error"
                        rounded
                        v-if="alarm.alarmState === 0"
                        >mdi-alert</v-icon
                      >
                      <v-icon
                        large
                        color="primary"
                        v-else
                        >mdi-chat-processing-outline</v-icon
                      >
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-subtitle class="mb-2">
                        {{ $getFormatDate(alarm.alarmStartTimestamp, 'yyyy-MM-DD HH:mm:ss') }}
                      </v-list-item-subtitle>
                      <v-list-item-title
                        class="text-h6 error--text"
                        v-if="alarm.alarmState === 0"
                      >
                        {{ `${alarm.alarmName || '-'}` }}
                      </v-list-item-title>
                      <v-list-item-title
                        class="text-h6 primary--text"
                        v-else
                      >
                        {{ `${alarm.taskName}${$t('maintenanceTask.taskiscomming')}` }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-col>
            </v-row>
          </v-carousel-item>
        </v-carousel>
      </v-card-text>
      <v-card-actions class="pt-0 mt-n7">
        <v-spacer></v-spacer>
        <div>
          <v-icon
            x-small
            :color="i - 1 == model ? 'rgba(255,255,255,0.7)' : 'rgba(0, 0, 0, 0.5)'"
            v-for="i in carouselitemnum"
            :key="i"
            class="mx-1"
            >mdi-circle</v-icon
          >
        </div>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import AlarmTitle from './AlarmTitle.vue';

export default {
  name: 'AlarmInfo',
  data() {
    return {
      model: 0,
      carouselcycle: true,
    };
  },
  props: {
    height: {
      type: Number,
    },
  },
  components: {
    AlarmTitle,
  },
  computed: {
    ...mapState('faultDiagnosis', ['plcAlarmList']),
    routename() {
      return this.$route.name;
    },
    carouselitemnum() {
      if (this.plcAlarmList.length > 0) {
        return Math.ceil(this.plcAlarmList.length / 8);
      }
      return 0;
    },
    isPageChaged() {
      return this.routename === 'faultDiagnosis';
    },
  },
  watch: {},
  created() {
    this.init();
  },
  methods: {
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapActions('faultDiagnosis', ['getPlcAlarmList']),
    async init() {
      await this.getPlcAlarmList();
      if (this.isPageChaged) {
        await this.$getTimeout(5000);
        this.init();
      }
    },
    async goDetails(task) {
      const { bomId, alarmCodeId, alarmMonitorId } = task;
      const url = `/fault-diagnosis-detail?bomId=${bomId}&alarmCodeId=${alarmCodeId}&alarmMonitorId=${alarmMonitorId}`;
      this.$router.push(url);
    },
  },
};
</script>
