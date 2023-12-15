<template>
  <v-container
    fluid
    class="darkNoBgColor"
  >
    <portal
      to="app-header"
      v-if="pagePortalMode.planBomPartDetail"
    >
      <v-btn
        class="mb-1"
        icon
        small
        @click="goBack">
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
    <detail-component
      ref="detailComponent"
    />
  </v-container>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
} from 'vuex';
import DetailComponent from '@/modules/part-management/components/detail/DetailComponent.vue';

export default {
  name: 'planBomPartDetail',
  data() {
    return {
      clientheight: document.body.clientHeight,
      clientWidth: document.body.clientWidth,
    };
  },
  components: {
    DetailComponent,
  },
  activated() {
    this.setPageHeader(true);
    this.setAppHeaderHeight(120);
  },
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  mounted() {
    this.refresh();
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    ...mapActions('machineBom', []),
    refresh() {
      if (this.$refs.detailComponent) {
        this.$refs.detailComponent.init();
      }
    },
    goBack() {
      this.$router.push({ name: 'maintenancePlan' });
    },
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('machineBom', []),
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    moduleName() {
      return this.$route.name;
    },
  },
};
</script>
