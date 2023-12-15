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
    number() {
      const { params } = this;
      // console.log(params, 'parmas');
      return params ? params.value : '';
    },
    moduleName() {
      return this.$route.name;
    },
  },
  methods: {
    goDetail() {
      const { params } = this;
      // console.log('params', params);
      this.$router.push({ name: 'expertKnowledgeDetail', params: { id: params.data.expertiseId, page: this.moduleName } });
    },
  },
};
</script>
