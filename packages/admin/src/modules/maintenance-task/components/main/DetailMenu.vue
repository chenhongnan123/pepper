<template>
  <div >
    <!-- eslint-disable-next-line -->
    <span
      class="primary--text text-decoration-underline"
      style="cursor: pointer;"
      @click="goDetail"
    >{{number}}</span>
  </div>
</template>

<script>

export default {
  data() {
    return {
    };
  },
  mounted() {
    // console.log(this.params);
  },
  components: {
  },
  computed: {
    moduleName() {
      return this.$route.name;
    },
    number() {
      const { params } = this;
      // console.log(params, 'parmas');
      return params ? params.value : '';
    },
  },
  methods: {
    goDetail() {
      const { params } = this;
      if (!params.data.id) { return; }
      const { id, taskGroup, taskName } = params.data;
      if (taskGroup === '0') {
        this.$router.push({ name: 'maintenanceTaskDetail', params: { id, page: this.moduleName, name: taskName } });
      }
      if (taskGroup === '1') {
        this.$router.push({ name: 'repairTaskDetail', params: { id, page: this.moduleName, name: taskName } });
      }
    },
  },
};
</script>
