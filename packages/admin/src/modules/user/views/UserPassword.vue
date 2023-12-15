<template>
  <v-card class="transparent" flat>
    <portal to="app-header" v-if="pagePortalMode.userPassword">
      <!-- <v-btn
        icon
        small
        class="mr-2 mb-1"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn> -->
      {{ $t('modules.user') }}
    </portal>
    <user-avatar />
    <v-card-text>
      <v-form ref="userPassword">
        <v-text-field
          :append-icon="showOldPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
          :type="showOldPassword ? 'text' : 'password'"
          id="oldPassword"
          v-model="oldPassword"
          :label="$t('user.password.oldPassword')"
          @click:append="showOldPassword = !showOldPassword"
          :rules="rules.password"
        ></v-text-field>
        <v-text-field
          :append-icon="showNewPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
          :type="showNewPassword ? 'text' : 'password'"
          id="newPassword"
          v-model="newPassword"
          :label="$t('user.password.newPassword')"
          @click:append="showNewPassword = !showNewPassword"
          :rules="rules.password"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        small
        color="primary"
        @click="handleUpdatePassword"
      >
        <span>{{$t('user.password.updatePassword')}}</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import UserAvatar from '../components/UserAvatar.vue';

export default {
  name: 'userPassword',
  components: {
    UserAvatar,
  },
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      showOldPassword: false,
      showNewPassword: false,
    };
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  deactivated() {
    this.setPageHeader(false);
    // this.setAppHeaderHeight(100);
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    rules() {
      return this.$getInitialAdministratorRules();
    },
  },
  methods: {
    ...mapActions('user', ['updatePassword']),
    ...mapActions('auth', ['logoutUser']),
    ...mapMutations('helper', ['setAlert']),
    async handleUpdatePassword() {
      if (!this.$refs.userPassword.validate()) {
        return;
      }
      const { oldPassword, newPassword } = this;
      const payload = {
        oldPassword,
        newPassword,
      };
      const updated = await this.updatePassword(payload);
      if (updated) {
        // this.oldPassword = '';
        // this.newPassword = '';
        // this.$refs.userPassword.reset();
        this.logoutUser();
        this.$router.replace({
          name: 'login',
          query: { redirect: '/' },
        });
      }
    },
  },
};
</script>
