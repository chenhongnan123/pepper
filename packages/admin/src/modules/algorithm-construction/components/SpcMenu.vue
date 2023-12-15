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
      // console.log('params', params);
      if (!params.data.id) { return; }
      const {
        id,
        type,
        eventName,
        active,
      } = params.data;
      this.$router.push({
        name: 'algorithmConstructionDetail',
        params: {
          id,
          type,
          name: eventName,
          active,
        },
      });
    },
  },
};
</script>
