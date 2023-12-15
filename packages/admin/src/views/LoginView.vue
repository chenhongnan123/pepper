<template>
  <v-main style="height:100%">
    <!-- <v-system-bar
      v-if="$vuetify.breakpoint.mdAndUp"
      color="primary"
      height="42"
    /> -->
    <img
      :src="require(`@/assets/imgs/logo-${isDark?'dark':'light'}.png`)"
      alt=""
      class="logo-img"
      :width="$vuetify.breakpoint.mdAndUp?'10%':'40%'"
    >
    <img
      :src="require(`@/assets/imgs/background-img-${isDark?'dark':'light'}.png`)"
      alt=""
      class="background-img"
      :width="$vuetify.breakpoint.lgAndUp?'100%':'150%'"
      height="100%"
      v-if="$vuetify.breakpoint.mdAndUp"
    >
    <v-container fill-height>
      <login-on-web
        v-if="$vuetify.breakpoint.mdAndUp"
        @login="handleLogin"
      />
      <login-on-mobile
        v-else
        @login="handleLogin"
      />
    </v-container>
    <new-password-dialog
      :addDialog="newPasswordDialog"
      :oldPassword="oldPassword"
      @closeDialog="newPasswordDialog = false"
    />
  </v-main>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
} from 'vuex';
import LoginOnWeb from '../components/login/LoginOnWeb.vue';
import LoginOnMobile from '../components/login/LoginOnMobile.vue';
import NewPasswordDialog from '../components/login/NewPasswordDialog.vue';

export default {
  name: 'LoginView',
  data() {
    return {
      oldPassword: '',
      newPasswordDialog: false,
    };
  },
  components: {
    LoginOnWeb,
    LoginOnMobile,
    NewPasswordDialog,
  },
  computed: {
    ...mapState('user', ['me']),
    ...mapState('auth', ['token']),
    ...mapState('helper', ['isDark']),
  },
  methods: {
    ...mapMutations('user', ['setMe']),
    ...mapMutations('auth', ['setToken']),
    ...mapActions('auth', ['logoutUser']),
    ...mapActions('systemSetting', ['getPasswordSetting']),
    async handleLogin(payload) {
      const result = await this.$userLogin(payload, 'mock1');
      console.log(result, 'result');
      if (result) {
        const { first_login: isFirstLogin } = result;
        if (isFirstLogin === 1) {
          const { password } = payload;
          this.oldPassword = password;
          await this.getPasswordSetting();
          this.newPasswordDialog = true;
          this.logoutUser();
        } else {
          await this.$userGetUserInfo('mock1');
          this.$router.replace(this.$route.query.redirect || { path: '/' }, () => {});
        }
      }
    },
  },
};
</script>
