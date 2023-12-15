<template>
  <v-container
    fluid
    class="darkNoBgColor"
  >
    <portal
      to="app-header"
      v-if="pagePortalMode.dataAnalysis"
    >
      {{ $t(`modules.${moduleName}`) }}
      <!-- <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="goSettings"
      >
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn> -->
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="refresh"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <portal
      to="page-header"
    ></portal>
    <main-component ref="mainComponent" />
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import MainComponent from '../components/mainComponent.vue';

export default {
  name: 'dataAnalysis',
  components: {
    MainComponent,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    moduleName() {
      return this.$route.name;
    },
    id() {
      return this.$route.params.id;
    },
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    // 刷新按钮
    refresh() {
      if (this.$refs.mainComponent) {
        this.$refs.mainComponent.init();
      }
    },
    // 前往设置页面
    goSettings() {
      this.$router.push({ name: 'dataTableSetting' });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
