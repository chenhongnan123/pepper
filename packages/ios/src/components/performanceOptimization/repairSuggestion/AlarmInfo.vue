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
      class="bluecard rounded-xl overflow-y-auto"
      :style="`height: ${height}px`"
      rounded
    >
      <v-card-text>
        <div class="d-flex my-4">
          <v-card
            v-for="(alarm, key) in alarmList"
            :key="key"
            class="mx-2 rounded-lg py-1 alarm-item-delay"
            @click="goDetails(alarm.equipmentid)"
          >
            <div class="rectangle-1"></div>
            <div class="rectangle-2"></div>
            <div class="rectangle-3"></div>
            <v-list-item two-line>
              <v-list-item-icon class="pt-1 my-4 mr-4">
                <v-icon
                  large
                  color="error"
                >mdi-close-circle</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-subtitle class="mb-2">{{alarm.createdtimestamp}}</v-list-item-subtitle>
                <v-list-item-title
                  class="text-h6 error--text"
                >
                  {{`${alarm.equipmentname}${$t('repairSuggestion.isabnormal')}`}}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'AlarmInfo',
  data() {
    return {
      clientheight: document.body.clientHeight,
      // alarmList: [
      //   {
      //     equipmentname: '三号子系统',
      //     createdtimestamp: '2022-09-22 12:51:30',
      //     equipmentid: 123,
      //   },
      // ],
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
    ...mapState('helper', ['serverTime']),
    ...mapState('repairSuggestion', ['machineList', 'bomList']),
  },
  watch: {
  },
  methods: {
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapActions('digitalArchives', ['alarmList']),
    init() {
      // this.getBomTreeBean();
    },
    goDetails(id) {
      this.$router.push(`/repair-suggestion-detail/${id}`);
    },
  },
};
</script>
