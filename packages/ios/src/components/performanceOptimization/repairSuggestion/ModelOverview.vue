<template>
  <div class="d-flex align-center justify-center model-overview">
    <!-- <div class="failure-time py-1">
      <v-row no-gutters class="pl-4">
        <v-col cols="4" class="d-flex flex-column  px-4 py-2">
          <span class="num">{{mttf.toLocaleString()}}</span>
          <div class="d-flex align-center">
            <img
              :src="require('@/assets/icons/img/failure-time-icon-green-dark.png')"
              height='24px'
              alt=""
            />
            <div class="d-flex flex-column ml-1">
              <span class="text-subtitle-2 label-title">
                {{$t('repairSuggestion.mttf')}}
              </span>
              <span class="text-subtitle-2 label-title">
                {{'MTTF'}}
              </span>
            </div>
          </div>
        </v-col>
        <v-divider vertical dark inset></v-divider>
        <v-col cols="4" class="d-flex flex-column  px-4 py-2">
          <span class="num">{{mtbf.toLocaleString()}}</span>
          <div class="d-flex align-center">
            <img
              :src="require('@/assets/icons/img/failure-time-icon-white-dark.png')"
              height='24px'
              alt=""
            />
            <div class="d-flex flex-column ml-1">
              <span class="text-subtitle-2 label-title">
                {{$t('repairSuggestion.mtbf')}}
              </span>
              <span class="text-subtitle-2 label-title">
                {{'MTBF'}}
              </span>
            </div>
          </div>
        </v-col>
        <v-divider vertical dark inset></v-divider>
        <v-col cols="4" class="d-flex flex-column  px-4 py-2">
          <span class="num">{{mttr.toLocaleString()}}</span>
          <div class="d-flex align-center">
            <img
              :src="require('@/assets/icons/img/failure-time-icon-white-dark.png')"
              height='24px'
              alt=""
            />
            <div class="d-flex flex-column ml-1">
              <span class="text-subtitle-2 label-title">
                {{$t('repairSuggestion.mttr')}}
              </span>
              <span class="text-subtitle-2 label-title">
                {{'MTTR'}}
              </span>
            </div>
          </div>
        </v-col>
      </v-row>
    </div> -->
    <div
      class="repair-model d-flex justify-end"
      :style="`--top:-${topHeight - 30}px;`"
    >
      <!-- <div
        :style="`height: ${topHeight + middleHeight + bottomHeight-20}px;
          width: ${(topHeight + middleHeight + bottomHeight-20)/9*16}px;
          background-color: white`"
      ></div> -->
      <digital-model
        :height="topHeight + middleHeight + bottomHeight - 20"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import DigitalModel from '../../model/DigitalModelWithThreeJs.vue';

export default {
  name: 'ModelOverview',
  data() {
    return {
    };
  },
  props: {
    topHeight: {
      type: Number,
    },
    middleHeight: {
      type: Number,
    },
    bottomHeight: {
      type: Number,
    },
  },
  components: {
    DigitalModel,
  },
  computed: {
    ...mapState('helper', ['serverTime']),
    ...mapState('repairSuggestion', ['machineStatistic']),
    mttf() {
      return this.machineStatistic.MTTF || 0;
    },
    mtbf() {
      return this.machineStatistic.MTBF || 0;
    },
    mttr() {
      return this.machineStatistic.MTTR || 0;
    },
  },
  created() {
    this.init();
  },
  watch: {
    serverTime(val) {
      if ((Math.floor(val / 1000) / 60) % 1 === 0) {
        this.init();
      }
    },
  },
  methods: {
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapActions('repairSuggestion', ['getMachineStatistic']),
    init() {
      // this.getMachineStatistic();
    },
  },
};
</script>
