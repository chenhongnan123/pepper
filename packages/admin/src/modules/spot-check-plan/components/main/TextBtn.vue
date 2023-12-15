<template>
  <div
    @click.enter="handleClick"
    @keyup.enter="handleClick"
    role="button"
    tabindex="0"
    style="color: #0055c2; cursor: pointer;"
  >
    <span
        :class="'text-decoration-underline '"
    >
        {{ rowData.checkName }}
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
      const { checkId } = this.rowData;
      this.$router.push(`/spot-check-plan/${checkId}`);
    },
  },
};
</script>
