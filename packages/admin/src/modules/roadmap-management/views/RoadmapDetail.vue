<template>
  <v-container fluid class="pa-0">
    <portal to="app-header" v-if="pagePortalMode.roadmapDetail">
      <v-btn
        icon
        small
        class="ml-2"
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
    <detail-component ref="detailComponent" />
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import DetailComponent from '../components/detail/DetailComponent.vue';

export default {
  name: 'roadmapDetail',
  components: {
    DetailComponent,
  },
  data() {
    return {
    };
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
  },
  created() {
  },
  deactivated() {
  },
  methods: {
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh() {
      if (this.$refs.detailComponent) {
        this.$refs.detailComponent.refresh();
      }
    },
    goBack() {
      if (this.$refs.detailComponent) {
        this.$refs.detailComponent.goBack();
      }
    },
  },
  watch: {
  },
};
</script>
