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
  },
  methods: {
    handleClick() {
      // console.log(this.rowData);
      // 区分零件管理和设备BOM页面，前往零件详情页面
      if (this.moduleName === 'partManagement') {
        this.$router.push({ path: `/part-management/detail/${this.rowData.partId}/${this.moduleName}` });
      } else {
        this.$router.push({ path: `/machine-bom/detail/${this.rowData.id}/${this.moduleName}` });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
