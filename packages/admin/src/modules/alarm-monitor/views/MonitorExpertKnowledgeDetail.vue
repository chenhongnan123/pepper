<template>
  <v-container
    fluid
    class="darkNoBgColor"
  >
    <portal
      to="app-header"
      v-if="pagePortalMode.MonitorExpertKnowledgeDetail"
    >
      <v-btn
        icon
        small
        class="mb-1"
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
import DetailComponent from '@/modules/expert-knowledge/components/detail/DetailComponent.vue';

export default {
  name: 'MonitorExpertKnowledgeDetail',
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
  },
  deactivated() {
  },
  methods: {
    ...mapMutations('helper', [
      'setAlert',
    ]),
    ...mapActions('machineBom', []),
    refresh() {
      if (this.$refs.detailComponent) {
        this.$refs.detailComponent.refresh();
      }
    },
    goBack() {
      this.$router.push({ name: 'alarmMonitor' });
      // if (this.$refs.detailComponent) {
      //   this.$refs.detailComponent.goBack();
      // }
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
