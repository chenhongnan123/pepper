<template>
  <div class="d-flex flex-column">
    <div class="mt-2" :style="`height: ${height-100}px`" style="overflow: auto;">
      <v-card elevation="2" v-for="(item,index) in recordList" :key="index"
        :style="`background: ${getColor(item.type, item.algorithmType)}`" class="mt-2">
        <div class="warn-card-list" style="color:#fff;">
          <div style="margin:0;">
            <div class="d-flex align-center">
              <v-icon style="color: #fff;">{{ getIcon(item.type, item.algorithmType) }}</v-icon>
              <span class="text-hidden-overflow mx-3" :title="item.eventName"
                style="color:#fff; font-size: 14px;max-width: 27%;">
                {{item.eventName}}
              </span>
              <v-chip pill small style="color: #474747;">
                <span>
                  {{ getArithmetic(item.type) }}
                </span>
                <span v-show="item.type==0"> | </span>
                <span v-show="item.type==0">{{ getAlgorithmType(item.algorithmType) }}</span>
                <span v-show="item.type==0"> | </span>
                <span v-show="item.type==0">{{ item.algorithm }}</span>
              </v-chip>
            </div>
          </div>
          <v-card-text style="font-size: 12px; margin: 0;padding:7px 36px;line-height:16px;">
            {{ item.warnContent }}
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
      required: false,
    },
    status: {
      type: [Number, String],
      required: false,
    },
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('statePrediction', ['recordList', 'algorithmTypeList', 'algorithmIconList']),
    barHeight() {
      return this.height - this.statusHeight;
    },
  },
  created() {},
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
    getColor(type, chilType) {
      let obj = {};
      if (type !== '0') {
        obj = this.algorithmTypeList.find((item) => item.dictValue === '0');
      } else {
        obj = this.algorithmTypeList.find((item) => item.dictValue === chilType);
      }
      return `#${obj.dictLabel}`;
    },
    getIcon(type, chilType) {
      let obj = {};
      if (type !== '0') {
        obj = this.algorithmIconList.find((item) => item.dictValue === '0');
      } else {
        obj = this.algorithmIconList.find((item) => item.dictValue === chilType);
      }
      return `${obj.dictLabel}`;
    },
    getArithmetic(type) {
      const text = type === '0' ? 'canonical' : 'orientation';
      return this.$t(`statePrediction.title.${text}`);
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
