<template>
  <div
    @click.enter="handleClick"
    @keyup.enter="handleClick"
    role="button"
    tabindex="0"
    style="color: var(--v-primary-base); cursor: pointer;"
  >
    <span
        :class="'text-decoration-underline primary--text'"
    >
        {{ rowData.dataSourceNumber }}
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  components: {
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    rowData() {
      return this.params.data;
    },
  },
  methods: {
    // 跳转到详情页
    handleClick() {
      const { dataSourceId } = this.rowData;
      this.$router.push({ path: `/data-source/detail/${dataSourceId}` });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
