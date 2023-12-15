<template>
  <v-container
    fluid
    class="darkNoBgColor"
  >
    <portal
      to="app-header"
      v-if="pagePortalMode.partTaskDetail"
    >
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
    <!-- <detail-component
      ref="detailComponent"
    /> -->
  </v-container>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
// eslint-disable-next-line max-len
// import DetailComponent from '@/modules/maintenance-task/components/maintenanceTaskDetail/DetailComponent.vue';

export default {
  name: 'PartTaskDetail',
  data() {
    return {
      clientheight: document.body.clientHeight,
      clientWidth: document.body.clientWidth,
    };
  },
  components: {
    // DetailComponent,
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
        this.$refs.detailComponent.refresh();
      }
    },
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    moduleName() {
      return this.$route.name;
    },
  },
};
</script>
