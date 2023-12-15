<template>
  <div>
    <check-point
      :height="topHeight"
      style="position: relative; z-index: 2"
    />
    <v-row dense>
      <v-col cols="12">
        <alarm-info :height="alarmHeight" />
      </v-col>
      <v-col cols="12">
        <data-alarm :height="dataHeight" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import CheckPoint from './CheckPoint.vue';
import AlarmInfo from './AlarmInfo.vue';
import DataAlarm from './DataAlarm.vue';

export default {
  name: 'StatusMonitor',
  data() {
    return {
      clientheight: document.body.clientHeight,
    };
  },
  components: {
    CheckPoint,
    DataAlarm,
    AlarmInfo,
  },
  computed: {
    topHeight() {
      return (this.clientheight - 210) * 0.16;
    },
    iszh() {
      return this.$i18n.locale === 'zhHans';
    },
    routename() {
      return this.$route.name;
    },
    alarmHeight() {
      // return 300;
      return (this.clientheight - 426) * 0.42;
    },
    dataHeight() {
      // return 300;
      return (this.clientheight - 426) * 0.48;
    },
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {
      // this.init();
    });
  },
  methods: {
    ...mapMutations('helper', [
      'SET_ALERT',
      'SET_THREEJSSHOW',
      'SET_UNITYSHOW',
      'SET_MODELHEIGHT',
      'SET_MODELTOP',
      'SET_MODELLEFT',
    ]),
    ...mapActions('home', ['getMainPoint']),
    async init() {
      this.SET_MODELTOP(250);
      this.SET_MODELLEFT(480);
      this.SET_MODELHEIGHT(680);
      this.SET_THREEJSSHOW(true);
      this.SET_UNITYSHOW(false);
      this.modelShowType = 0;
      // this.modelShowType = 2;
      this.$root.$digitalModel.refresh();
      this.showMainPoint();
    },
    async showMainPoint() {
      await this.getMainPoint();
      // this.$root.$digitalModel.showMainPoint(this.mainPoint); // debug
      if (this.$root.$digitalModel.showMainPointNew) {
        this.$root.$digitalModel.showMainPointNew(this.mainPointList);
      } // 改用新的显示测点方法
    },
  },
};
</script>
