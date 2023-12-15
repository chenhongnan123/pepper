<template>
  <v-container fluid>
    <settings-layout
      :items="items"
      :headerTitle="$t('modules.user')"
      :isBorder="true"
      :moduleName="moduleName"
    >
    </settings-layout>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';
import SettingsLayout from '@/components/layout/SettingsLayout.vue';

export default {
  // eslint-disable-next-line
  name: 'user',
  data() {
    return {
      items: [
        {
          title: 'user.profile.title',
          icon: 'mdi-file-document-outline',
          routerName: 'userProfile',
        },
        {
          title: 'user.preferences.title',
          icon: 'mdi-eye-outline',
          routerName: 'userPreferences',
        },
        {
          title: 'user.password.title',
          icon: 'mdi-lock-outline',
          routerName: 'userPassword',
        },
        { divider: true },
        {
          title: 'user.session.title',
          icon: 'mdi-map-marker-outline',
          routerName: 'userSession',
        },
      ],
    };
  },
  components: {
    SettingsLayout,
  },
  mounted() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    this.setPageHeader(false);
    // this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
    ]),
    init() {
    },
  },
  computed: {
    moduleName() {
      return this.$route.name;
    },
  },
};
</script>
