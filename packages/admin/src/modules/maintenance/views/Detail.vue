<template>
  <v-container fluid>
    <portal
      to="app-header"
      v-if="pagePortalMode.maintenanceDetail"
    >
      <v-btn
        icon
        small
        class="mr-2 mb-1"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ curMaintenance?.schemaName }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="refresh"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <detail-component ref="detailComponent" />
  </v-container>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
import DetailComponent from '../components/detail/DetailComponent.vue';

export default {
  name: 'maintenanceDetail',
  components: {
    DetailComponent,
  },
  data() {
    return {
      elementName: 'maintenanceDetail',
    };
  },
  computed: {
    ...mapState('helper', ['pagePortalMode']),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('maintenance', ['curMaintenance']),
    moduleName() {
      return this.$route.name;
    },
    curMaintenanceId() {
      return String(this.$route.params.id) || null;
    },
  },
  async activated() {
    this.setPageHeader(true);
    this.setAppHeaderHeight(120);
    this.init();
  },
  created() {},
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapMutations('helper', ['setPageHeader', 'setAppHeaderHeight', 'setAlert']),
    ...mapMutations('maintenance', ['setAttachmentList']),
    ...mapActions('maintenance', ['getCurMaintenance', 'getMaintenanceTypeList']),
    refresh() {
      if (this.$refs.detailComponent) {
        this.$refs.detailComponent.refresh();
      }
    },
    init() {
      this.getCurMaintenance(this.curMaintenanceId);
      this.getMaintenanceTypeList('sys_item_type');
    },
    goBack() {
      this.setAttachmentList([]);
      this.$router.push({ name: 'maintenanceMain' });
    },
  },
  watch: {},
};
</script>
