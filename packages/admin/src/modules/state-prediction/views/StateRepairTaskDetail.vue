<template>
  <v-container
    fluid
    class="darkNoBgColor"
  >
    <portal
      to="app-header"
      v-if="pagePortalMode.StateRepairTaskDetail"
    >
      <v-btn
        icon
        small
        class="mb-1"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ taskName }}
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
import DetailComponent from '@/modules/maintenance-task/components/repairTaskDetail/DetailComponent.vue';

export default {
  name: 'repairTaskDetail',
  data() {
    return {
      clientheight: document.body.clientHeight,
      clientWidth: document.body.clientWidth,
    };
  },
  components: {
    DetailComponent,
  },
  mounted() {
    this.refresh();
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
    ...mapActions('machineBom', []),
    refresh() {
      if (this.$refs.detailComponent) {
        this.$refs.detailComponent.refresh();
      }
    },
    goBack() {
      // if (this.$refs.detailComponent) {
      //   this.$refs.detailComponent.goBack();
      // }
      // this.$router.go(-1);
      const routeData = JSON.parse(sessionStorage.getItem('statePredictionDetailData'));
      this.$router.push({
        name: 'statePredictionDetail',
        params: routeData?.params,
        query: routeData?.query,
      });
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
    taskName() {
      return this.$route.params.name;
    },
  },
};
</script>
