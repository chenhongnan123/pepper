<template>
  <div class="d-flex flex-column">
    <health-status
      :height="statusHeight"
      :status="status"
    />
    <health-status-bar-trend
      :height="barHeight"
      @showChart="showChart"
    />
  </div>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import HealthStatus from './healthStatus.vue';
import HealthStatusBarTrend from './healthStatusBarTrend.vue';

export default {
  name: 'healthScoreTrend',
  components: {
    HealthStatus,
    HealthStatusBarTrend,
  },
  data() {
    return {
      clientHeight: document.body.clientHeight,
      statusHeight: 38,
    };
  },
  props: {
    height: {
      type: Number,
      required: true,
    },
    status: {
      type: [Number, String],
      required: true,
    },
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('statePrediction', []),
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
</style>
