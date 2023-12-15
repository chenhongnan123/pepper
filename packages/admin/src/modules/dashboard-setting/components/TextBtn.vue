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
        {{ rowData.boardNumber }}
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
      const { id, boardNumber, boardName } = this.rowData;
      this.$router.push({
        name: 'dashboardSettingDetail',
        params: {
          id,
          code: boardNumber,
          name: boardName,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
