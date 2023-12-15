<template>
  <div >
    <!-- eslint-disable-next-line -->
    <span
      class="primary--text text-decoration-underline"
      style="cursor: pointer;"
      @click="goDetail"
    >{{roadmapName}}</span>
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
    roadmapName() {
      const { params } = this;
      // console.log(params, 'parmas');
      return params ? params.value : '';
    },
  },
  methods: {
    goDetail() {
      const { params } = this;
      // console.log('params', params);
      const { roadmapId } = params.data;
      this.$router.push({ name: 'roadmapDetail', params: { id: roadmapId, page: this.moduleName } });
    },
  },
};
</script>
