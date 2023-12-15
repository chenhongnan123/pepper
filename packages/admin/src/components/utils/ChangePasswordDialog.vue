<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="400px"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            $t('account.passwordChange')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
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
      <v-card-actions class="mt-4">
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          small
          text
          class="mr-2"
          @click="reset"
        >
          {{ $t('btn.eliminate') }}
        </v-btn>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="handleSave"
        >
          {{$t('btn.save')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  name: 'changePasswordDialog',
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      showOldPassword: false,
      showNewPassword: false,
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState('helper', ['currentLocale']),
    dialog: {
      get() {
        return this.addDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    rules() {
      return this.$getInitialAdministratorRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('user', ['updatePassword']),
    ...mapActions('auth', ['logoutUser']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        oldPassword,
        newPassword,
      } = this;
      const payload = {
        oldPassword,
        newPassword,
      };
      const result = await this.updatePassword(payload);
      if (result) {
        this.logoutUser();
        this.dialog = false;
        this.$router.replace({
          name: 'login',
          query: { redirect: '/' },
        });
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.oldPassword = '';
          this.newPassword = '';
          this.showOldPassword = false;
          this.showNewPassword = false;
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      this.reset();
    },
  },
};
</script>
