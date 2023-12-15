<template>
  <div class="pa-4">
    <div class="d-flex">
      <div :style="`width: ${100}%;`">
        <repair-suggestion />
      </div>
    </div>
  </div>
</template>

<script>
// import { mapActions, mapState } from 'vuex';
import RepairSuggestion from '../components/performanceOptimization/repairSuggestion/RepairSuggestion.vue';

export default {
  data() {
    return {
    };
  },
  components: {
    RepairSuggestion,
  },
  computed: {
  },
  created() {
  },
  methods: {
  },
};
</script>
