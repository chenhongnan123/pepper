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
      return params ? params.value : '';
    },
  },
  methods: {
    goDetail() {
      const { params } = this;
      const { partId } = params.data;
      if (!partId) { return; }
      this.$router.push({ name: 'planBomPartDetail', params: { id: partId, page: this.moduleName } });
    },
  },
};
</script>
