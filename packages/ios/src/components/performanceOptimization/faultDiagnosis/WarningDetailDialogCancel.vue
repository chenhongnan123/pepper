<template>
  <div class="pr-2">
    <div
      class=" primary--text font-weight-bold bluetitlepart mt-8"
    >
      <div class="title" style="width: 102px">
        报警详情
      </div>
      <!-- alarmDetail: {{ alarmDetail }} -->
      <!-- alarmObj: {{ alarmObj }} -->
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
        class="overflow-y-auto px-6 pt-8 pb-0"
      >
        <v-row no-gutters style="height: 25%;">
          <v-col>
            <div>
              <span class="text-subtitle-1 primary--text">报警等级</span>
            </div>
            <div class="d-flex align-center">
              <img v-if="this.alarmObj?.alarmDge === 'error'"
                src="@/assets/icons/img/fault-diagnosis-error.svg"
                alt="" height="45px">
              <img v-else-if="this.alarmObj?.alarmDge === 'warning'"
                src="@/assets/icons/img/fault-diagnosis-warning.svg"
                alt="" height="45px">
              <img v-else src=""
                alt="" height="45px">
              <span v-if="this.alarmObj?.alarmDge === 'error'"
                class="error--text font-weight-black" style="font-size: 20px;">报警</span>
              <span v-else-if="this.alarmObj?.alarmDge === 'warning'"
                class="warning--text font-weight-black" style="font-size: 20px;">预警</span>
              <span v-else
                class="font-weight-black" style="font-size: 20px;"></span>
            </div>
          </v-col>
          <v-col>
            <div>
              <span class="text-subtitle-1 primary--text">报警时间</span>
            </div>
            <div>
              <span style="font-size: 20px;line-height: 45px;">{{ alarmObj?.alarmTime }}</span>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters style="height: 25%;">
          <v-col>
            <div>
              <span class="text-subtitle-1 primary--text">故障代码</span>
            </div>
            <div>
              <span style="font-size: 20px;line-height: 45px;">{{ alarmObj?.alarmCode }}</span>
            </div>
          </v-col>
          <v-col>
            <div>
              <span class="text-subtitle-1 primary--text">故障内容</span>
            </div>
            <div>
              <span style="font-size: 20px;line-height: 45px;">{{ alarmObj?.alarmContent }}</span>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters style="height: 25%;">
          <v-col>
            <div>
              <span class="text-subtitle-1 primary--text">故障描述</span>
            </div>
            <div>
              <span style="font-size: 20px;line-height: 45px;">{{ alarmObj?.alarmTxt }}</span>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters style="height: 25%;">
          <v-col>
            <div class="d-flex align-end ">
              <v-spacer></v-spacer>
              <v-btn class="mx-1" outlined color="primary" rounded>已处理</v-btn>
              <v-btn class="mx-1" outlined color="primary" rounded>提交维修任务</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'WarningDetailCard',
  data() {
    return {
    };
  },
  props: {
    height: {
    },
  },
  components: {
  },
  computed: {
    ...mapState('faultDiagnosis', [
      'alarmDetail',
    ]),
    alarmObj() {
      const alarmId = Number(this.$route.query.alarmId);
      const obj = this.alarmDetail.find((item) => item.alarmId === alarmId) || {};
      return obj;
    },
  },
  methods: {
  },
};
</script>
