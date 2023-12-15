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
        {{ rowData.partNumber }}
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
    moduleName() {
      return this.$route.name;
    },
    rowData() {
      return this.params.data;
    },
    deviceCode() {
      return this.$route.params.id;
    },
    deviceName() {
      return this.$route.params.name;
    },
  },
  methods: {
    handleClick() {
      // 前往零件详情页面
      this.$router.push({ path: `/machine-bom/partDetail/${this.rowData.partId}/${this.moduleName}/${this.deviceCode}/${this.deviceName}` });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
