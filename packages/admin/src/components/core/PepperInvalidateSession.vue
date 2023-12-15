<template>
  <v-dialog
    persistent
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-text>
        <v-row no-gutters class="pt-4">
          <v-col class="text-center title error--text">
            <v-icon color="error" size="60">mdi-alert-circle-outline</v-icon>
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-4">
          <v-col class="text-center title error--text">
            {{ $t('dialog.tokenExpired') }}
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-btn
          block
          rounded
          color="primary"
          class="text-none"
          @click="logout"
        >
          <v-icon left>mdi-logout</v-icon>
          {{ $t('btn.loginAgain') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'PepperInvalidateSession',
  data() {
    return {
    };
  },
  computed: {
    ...mapState('auth', ['isTokenValid']),
    dialog: {
      get() {
        return !this.isTokenValid;
      },
      set(val) {
        this.setIsTokenValid(!val);
      },
    },
  },
  methods: {
    ...mapMutations('auth', ['setIsTokenValid']),
    ...mapActions('auth', ['logoutUser']),
    async logout() {
      this.logoutUser();
      this.$router.replace({
        name: 'login',
        query: { redirect: this.$route.fullPath },
      });
      this.setIsTokenValid(true);
    },
  },
};
</script>
