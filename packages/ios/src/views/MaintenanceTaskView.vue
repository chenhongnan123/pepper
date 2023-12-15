<template>
  <div class="pl-4 pr-4 pt-10">
    <div class="d-flex">
      <!-- <div :style="`width: ${leftWidth}%;`">
        <machine-bom
          @getBomDetail="bomChange"
        />
      </div> -->
      <div :style="`width: 100%;`">
        <maintenance-task :machineBomDetail="machinebomdetail" />
      </div>
    </div>
  </div>
</template>

<script>
import MaintenanceTask from '../components/performanceOptimization/maintenanceTask/MaintenanceTask.vue';

export default {
  data() {
    return {
      leftWidth: 20,
      machinebomdetail: {},
    };
  },
  components: {
    // MachineBom,
    MaintenanceTask,
  },
  computed: {
  },
  created() {
    this.init();
  },
  methods: {
    init() {
    },
  },
};
</script>
