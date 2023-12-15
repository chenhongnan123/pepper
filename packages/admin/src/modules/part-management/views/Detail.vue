<template>
  <v-container fluid>
    <div>
      <portal
        to="app-header"
        v-if="pagePortalMode.partManagementDetail"
      >
        <v-btn
          icon
          small
          class="mr-2 mb-1"
          @click="goBack"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        {{ $t(`modules.${moduleName}`) }}
        <v-btn
          icon
          small
          class="ml-2 mb-1"
          @click="refresh"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </portal>
    </div>
    <detail-component ref="detailComponent" />
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import DetailComponent from '../components/detail/DetailComponent.vue';

export default {
  name: 'partManagementDetail',
  data() {
    return {
      elementName: 'partManagementDetail',
    };
  },
  components: {
    DetailComponent,
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {
    this.setPageHeader(true);
    this.setAppHeaderHeight(120);
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
    refresh() {
      if (this.$refs.detailComponent) {
        this.$refs.detailComponent.init();
      }
    },
    goBack() {
      this.$router.push({ name: 'partManagement' });
    },
  },
};
</script>
