<template>
  <div class="d-flex flex-column pt-0 mx-3">
      <v-card elevation="2" style="background: transparent; box-shadow: none;" class="">
        <div class="warn-card-list" style="color:#fff;">
          <div style="margin:0;">
            <div class="d-flex align-center">
              <span class="text-hidden-overflow mr-3" :title="alarmData.alarmCode"
                style="color:#fff; font-size: 16px; font-weight: bold;">
                {{ alarmData.alarmCode || '-' }}
              </span>
            </div>
          </div>
          <v-card-text
          style="font-size: 14px; margin: 0; padding: 10px 0;overflow: auto;"
          :style="`height: ${200}px`">
            {{ alarmData?.alarmName || '-' }}
          </v-card-text>
          <span style="font-size: 12px">{{ alarmData.createTime }}</span>
        </div>
      </v-card>
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
  name: 'PLCAlarmList',
  components: {},
  data() {
    return {
      clientHeight: document.body.clientHeight,
      statusHeight: 38,
      lists: [],
    };
  },
  props: {
    alarmData: {
      type: Object,
      default: () => ({}),
    },
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
  padding: 10px;
}
::v-deep .v-card {
  box-shadow: none;
}
</style>
