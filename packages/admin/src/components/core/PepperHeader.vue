<template>
  <div>
    <v-system-bar
      color="error"
      dark
      fixed
      v-if="isSystemBar"
    >
      <v-spacer></v-spacer>
      <span>{{$t('error.CANNOT_CONNECT_SERVER')}}</span>
      <v-spacer></v-spacer>
    </v-system-bar>
    <v-app-bar
      app
      short
      clipped-right
      elevate-on-scroll
      color="bg"
      :height="42"
    >
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.mdAndDown"
        @click="$emit('toggle-drawer')"
      ></v-app-bar-nav-icon>
      <pepper-multi-page class="mt-2" />
    </v-app-bar>
    <div class="d-flex app-header px-6 pt-4">
      <v-toolbar-title
        :class="$vuetify.breakpoint.mdAndUp
          ? 'headline-new font-weight-medium'
          : 'title pl-0'"
      >
        <div>
          <portal-target name="app-header"></portal-target>
        </div>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <img :src="require(`@shopworx/assets/logo/${customerLogo}.png`)" height="70%"> -->
      <div class="d-flex align-center align-self-start">
        <div class="d-flex align-center">
          <v-icon
            class="mr-2"
            size="32px"
            color="error"
            v-if="false"
          >mdi-alert-circle</v-icon>

          <pepper-account />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import SwitchWithText from '@/components/commonUI/SwitchWithText.vue';
import PepperMultiPage from '@/components/core/PepperMultiPage.vue';
import PepperAccount from '@/components/utils/PepperAccount.vue';

export default {
  name: 'PepperHeader',
  components: {
    PepperAccount,
    SwitchWithText,
    PepperMultiPage,
  },
  computed: {
    ...mapState('user', ['me']),
    ...mapState('helper', ['pageHeader', 'appHeaderHeight', 'locales', 'currentLocale', 'isDark', 'isSystemBar']),
    ...mapState('common', ['multiPageList']),
    customerLogo() {
      return this.$vuetify.theme.dark
        ? 'customer-dark'
        : 'customer-light';
    },
    locale: {
      get() {
        this.setCurrentLocale(this.$i18n.locale);
        return this.currentLocale;
      },
      set(val) {
        this.$i18n.locale = val;
        localStorage.setItem('language', val);
        this.setCurrentLocale(val);
      },
    },
  },
  mounted() {
    this.setPagePortalMode({
      [this.$route.name]: true,
    });
  },
  methods: {
    ...mapMutations('user', ['setMe']),
    ...mapMutations('auth', ['setToken']),
    ...mapMutations('helper', ['setCurrentLocale', 'setIsDark', 'setAlert', 'setPagePortalMode']),
    ...mapMutations('common', ['setMultiPageList']),
    setValue(val) {
      this.setIsDark(val);
    },
    async handleLogOut() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.logOutConfirm'),
        ' ',
        true,
      )) {
        const result = await this.$systemTokenLogOut('mock1');
        if (result) {
          // 清空多开页活跃列表
          this.setMultiPageList([]);
          this.$router.replace({ name: 'login' }, () => {});
        }
      }
    },
  },
  watch: {
    '$route.name': {
      handler(name) {
        this.setPagePortalMode({
          [name]: true,
        });
      },
    },
  },
};
</script>

<style>
.v-toolbar .v-toolbar__extension {
  z-index: -1;
}
</style>
