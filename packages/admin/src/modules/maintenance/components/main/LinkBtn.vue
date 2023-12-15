<template>
  <div>
    <!-- eslint-disable-next-line -->
    <span
      class="primary--text text-decoration-underline"
      style="cursor: pointer"
      @click="goDetail"
      >{{ number }}</span
    >
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    // console.log(this.params);
  },
  components: {},
  computed: {
    number() {
      const {
        params: {
          data: { schemaCode },
        },
      } = this;
      // console.log(params, 'parmas');
      // eslint-disable-next-line no-unneeded-ternary
      return schemaCode ? schemaCode : '';
    },
    moduleName() {
      return this.$route.name;
    },
  },
  methods: {
    goDetail() {
      const { params } = this;
      // console.log('params', params);
      this.$router.push({
        name: 'maintenanceDetail',
        params: { id: params.data.id, page: this.moduleName },
      });
    },
  },
};
</script>
