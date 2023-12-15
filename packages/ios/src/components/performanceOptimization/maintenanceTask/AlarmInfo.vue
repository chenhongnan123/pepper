<template>
  <div>
    <div
      class="primary--text font-weight-bold bluetitlepart"
    >
      <div class="title">{{ $t('maintenanceTask.alarm') }}</div>
      <div class="bgImg">
        <img
          :src="require('@/assets/icons/img/darkbluesquare.svg')"
          alt=""
        />
      </div>
      <div class="cardtop">
        <div class="darkbluerectangle"></div>
        <div class="lightbluerectangle"></div>
      </div>
    </div>
    <v-card
      class="bluecard rounded-xl overflow-y-auto "
      :style="`height: ${height}px`"
      rounded
    >
      <v-card-text class="pb-0">
        <v-carousel
          hide-delimiter-background
          hide-delimiters
          height="100%"
          show-arrows-on-hover
          :cycle="carouselcycle"
          v-model="model"
        >
          <!-- eslint-disable-next-line -->
          <v-carousel-item
            v-for="j in carouselitemnum"
            :key="j"
            @mouseover="carouselcycle=false"
            @mouseleave="carouselcycle=true"
          >
            <v-row class="py-3">
              <v-col
                cols="3"
                v-for="(alarm, key) in alarmList.slice((j -1) * 4, 4 * j )"
                :key="key"
              >
                <v-card
                  class="mx-4 mb-6 rounded-lg py-1"
                  :class="alarm.isDelay?'alarm-item-delay':'alarm-item-advance'"
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
                        v-if="alarm.isDelay"
                      >mdi-close-circle</v-icon>
                      <v-icon
                        large
                        color="primary"
                        v-else
                      >mdi-chat-processing-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-subtitle class="mb-2">
                        {{alarm.planStartTime}}
                      </v-list-item-subtitle>
                      <v-list-item-title
                        class="text-h6 error--text"
                        v-if="alarm.isDelay"
                      >
                        {{`${alarm.taskName}${$t('maintenanceTask.taskoverdue')}`}}
                      </v-list-item-title>
                      <v-list-item-title
                        class="text-h6 primary--text"
                        v-else
                      >
                        {{`${alarm.taskName}${$t('maintenanceTask.taskiscomming')}`}}
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
            :color="(i-1)==model?'rgba(255,255,255,0.7)':'rgba(0, 0, 0, 0.5)'"
            v-for="i in carouselitemnum" :key="i"
            class="mx-1"
          >mdi-circle</v-icon>
        </div>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'AlarmInfo',
  data() {
    return {
      clientheight: document.body.clientHeight,
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
  },
  computed: {
    ...mapState('maintenanceTask', ['alarmList']),
    carouselitemnum() {
      if (this.alarmList.length > 0) {
        return Math.ceil(this.alarmList.length / 4);
      }
      return 0;
    },
  },
  watch: {
  },
  methods: {
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapMutations('maintenanceTask', ['setMaintenanceTaskDialog', 'setRepairTaskDialog', 'setTaskInfo']),
    init() {
      // this.getBomTreeBean();
    },
    async goDetails(task) {
      this.setTaskInfo(task);
      if (task.taskGroup === '0') {
        this.setMaintenanceTaskDialog(true);
      } else {
        this.setRepairTaskDialog(true);
      }
    },
  },
};
</script>
