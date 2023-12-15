<template>
  <v-container
    fluid
    class="darkNoBgColor"
  >
    <portal
      to="app-header"
      v-if="pagePortalMode.planMaintenanceDetail"
    >
      <v-btn
        icon
        small
        class="mr-2 mb-1"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ curMaintenanceName }}
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
  mapActions,
  mapGetters,
} from 'vuex';
import DetailComponent from '@/modules/maintenance/components/detail/DetailComponent.vue';

export default {
  name: 'planMaintenanceDetail',
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
    this.init();
    this.refresh();
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    ...mapActions('maintenance', ['getCurMaintenance', 'getMaintenanceTypeList']),
    refresh() {
      if (this.$refs.detailComponent) {
        this.$refs.detailComponent.refresh();
      }
    },
    async init() {
      if (this.curMaintenanceId) {
        await this.getCurMaintenance(this.curMaintenanceId);
      }
      this.getMaintenanceTypeList('sys_item_type');
    },
    goBack() {
      this.$router.push({ name: 'maintenancePlan' });
    },
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('maintenance', ['curMaintenance']),
    moduleName() {
      return this.$route.name;
    },
    curMaintenanceId() {
      return String(this.$route.params.id) || null;
    },
    curMaintenanceName() {
      return this.$route.params.name || '';
    },
  },
};
</script>
