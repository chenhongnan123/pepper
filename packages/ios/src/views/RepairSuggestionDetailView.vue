<template>
  <div class="pa-4">
    <div class="d-flex">
      <div :style="`width: ${100}%;`">
        <repair-suggestion-detail />
      </div>
    </div>
  </div>
</template>

<script>
// import { mapActions, mapState } from 'vuex';
import RepairSuggestionDetail from '../components/performanceOptimization/repairSuggestion/RepairSuggestionDetail.vue';

export default {
  data() {
    return {
    };
  },
  components: {
    RepairSuggestionDetail,
  },
  computed: {
  },
  created() {
  },
  methods: {
  },
};
</script>
