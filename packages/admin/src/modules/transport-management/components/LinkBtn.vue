<template>
  <div
    @click.enter="handleClick"
    @keyup.enter="handleClick"
    role="button"
    tabindex="0"
    style="color: var(--v-primary-base); cursor: pointer"
  >
    <span :class="'text-decoration-underline '">
      {{ rowData.transportNumber }}
    </span>
  </div>
</template>

<script>
export default {
  computed: {
    rowData() {
      return this.params.data;
    },
  },
  methods: {
    handleClick() {
      const { transportId } = this.rowData;
      this.$router.push({
        name: 'transportDetail',
        query: {
          transportId,
        },
      });
    },
  },
};
</script>
