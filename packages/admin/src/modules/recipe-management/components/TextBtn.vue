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
        {{ rowData.recipeVersion }}
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    rowData() {
      return this.params.data;
    },
  },
  methods: {
    handleClick() {
      const { recipeId } = this.rowData;
      this.$router.push({ path: `/recipe-management/detail/${recipeId}?recipeType=${this.params.data.recipeType}` });
    },
  },
};
</script>
