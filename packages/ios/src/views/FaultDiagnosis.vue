<template>
  <div class="pa-4">
    <div class="d-flex">
      <div :style="`width: ${100}%;`">
        <status-monitor />
      </div>
    </div>
  </div>
</template>

<script>
// import { mapActions, mapState } from 'vuex';
import StatusMonitor from '../components/performanceOptimization/faultDiagnosis/FaultDiagnosis.vue';

export default {
  data() {
    return {
    };
  },
  components: {
    StatusMonitor,
  },
  computed: {
  },
  created() {
  },
  methods: {
  },
};
</script>
