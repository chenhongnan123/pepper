<template>
  <div >
    <!-- eslint-disable-next-line -->
    <span
      class="primary--text text-decoration-underline"
      style="cursor: pointer;"
      @click="goDetail"
    >{{roleName}}</span>
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
    roleName() {
      const { params } = this;
      // console.log(params, 'parmas');
      return params ? params.value : '';
    },
  },
  methods: {
    goDetail() {
      const { params } = this;
      // console.log('params', params);
      this.$router.push({ name: 'roleDetail', params: { id: params.data.roleId } });
    },
  },
};
</script>
