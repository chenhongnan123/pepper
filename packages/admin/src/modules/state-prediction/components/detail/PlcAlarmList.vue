<template>
  <div class="d-flex flex-column">
    <div class="ma-2" :style="`height: ${height-100}px`" style="overflow: auto;">
      <v-card elevation="2" v-for="(item,index) in algorithmPlcList" :key="index"
      color="red" class="mt-2">
        <div class="warn-card-list" style="color:#fff;">
          <div style="margin:0;">
            <div class="d-flex align-center">
              <v-icon style="color: #fff;">mdi mdi-bell-outline</v-icon>
              <span class="text-hidden-overflow mx-3" :title="item.alarmCode"
                style="color:#fff; font-size: 14px;max-width: 27%;">
                {{ item.alarmCode }}
              </span>
            </div>
          </div>
          <v-card-text style="font-size: 12px; margin: 0;padding:7px 36px;line-height:16px;">
            {{ item?.alarmName || '-' }}
          </v-card-text>
          <span style="font-size: 12px;padding-left:36px;">{{ item.createTime }}</span>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';

export default {
  name: 'DataAlarmList',
  components: {},
  data() {
    return {
      clientHeight: document.body.clientHeight,
      statusHeight: 38,
      lists: [
        {
          eventName: this.$t('statePrediction.label.frequencyMonitoring'),
          type: 0,
          algorithmType: 2,
          algorithm: 'IMR',
          createTime: '2023-11-03 23:27:24',
          color: '#F79C23',
          warnContent: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.Facilis, ullam eveniet molestiae nostrum,provident repellat tenetur facere itaque eligendi ex magnamfugit et? Accusamus aliquid sed est temporibus eaque voluptatem.',
        },
        {
          eventName: this.$t('statePrediction.label.temperatureMonitoring'),
          type: 1,
          algorithmType: 1,
          algorithm: 'IMR',
          color: '#363899',
          createTime: '2023-12-03 00:57:24',
          warnContent: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.Facilis, ullam eveniet molestiae nostrum,provident repellat tenetur facere itaque eligendi ex magnamfugit et? Accusamus aliquid sed est temporibus eaque voluptatem.',
        },
      ],
    };
  },
  props: {
    height: {
      type: Number,
      required: true,
    },
    status: {
      type: [Number, String],
      required: false,
    },
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('statePrediction', ['algorithmPlcList', 'algorithmTypeList', 'algorithmIconList']),
    barHeight() {
      return this.height - this.statusHeight;
    },
  },
  created() {
  },
  methods: {
    ...mapActions('statePrediction', []),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    showChart() {
      this.$emit('showChart');
    },
    getAlgorithmType(type) {
      switch (type) {
        case '1':
          return this.$t('statePrediction.algorithm.singleValue');
        case '2':
          return this.$t('statePrediction.algorithm.subgroup');
        default:
          return this.$t('statePrediction.algorithm.capabilityAnalysis');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.text-hidden-overflow{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.warn-card-list{
  padding: 20px 15px;
}
</style>
