<template>
  <div
    @click.enter="goDetail"
    @keyup.enter="goDetail"
    role="button"
    tabindex="0"
    class="primary--text text-decoration-underline cursor: pointer"
  >
    <span>
      {{ rowData.expertiseNumber }}
    </span>
  </div>
</template>

<script>
export default {
  computed: {
    rowData() {
      return this.params.data;
    },
    moduleName() {
      return this.$route.name;
    },
  },
  methods: {
    goDetail() {
      const { params } = this;
      const id = params.data.expertiseId;
      if (!id) { return; }
      this.$router.push({
        name: 'MonitorExpertKnowledgeDetail',
        params: { id, page: this.moduleName },
      });
    },
  },
};
</script>
