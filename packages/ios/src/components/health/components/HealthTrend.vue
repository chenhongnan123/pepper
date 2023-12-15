<template>
  <div class="warp mt-12">
    <GeneralTitle :title="`${$t('repairSuggestionDetail.label.deviceHealthTrend')}`"></GeneralTitle>
    <div class="">
      <HealthStatusBarTrend></HealthStatusBarTrend>
      <div class="pt-3 pb-2 mt-4 mb-3" style="font-size: 16px;">
        {{ `${$t('repairSuggestionDetail.label.historyTrend')}：` }}
      </div>
      <HealthTrendChart class="ml-n2" :healthTrendHeight="healthTrendHeight - 120">
      </HealthTrendChart>
    </div>
  </div>
</template>

<script>
import GeneralTitle from './GeneralTitle.vue';
import HealthStatusBarTrend from './HealthStatusBarTrend.vue';
import HealthTrendChart from './HealthTrendChart.vue';

export default {
  name: 'HealthTrend',
  props: {
    healthTrendHeight: {
      type: Number,
      require: true,
      default: 100,
    },
  },
  data() {
    return {

    };
  },
  components: {
    GeneralTitle,
    HealthStatusBarTrend,
    HealthTrendChart,
  },
  computed: {
  },
  created() {
  },
  methods: {
  },
};
</script>
<style lang="scss" scoped>
.warp {
  width: 100%;
}
</style>
