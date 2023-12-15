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
      const id = params.data.partId;
      if (!id) { return; }
      this.$router.push({ name: 'errorRepairPartDetail', params: { id, page: this.moduleName } });
    },
  },
};
</script>
