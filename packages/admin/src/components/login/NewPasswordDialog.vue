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
            $t('dialog.newLoginChangePassword')
          }}
        </span>
        <v-spacer></v-spacer>
        <!-- <v-btn icon small @click="dialog = false" color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn> -->
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-text-field
            class="mx-3 mt-3"
            clearable
            :append-icon="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
            :type="showPassword ? 'text' : 'password'"
            :rules="rules.password"
            :label="`${$t('user.password.newPassword')}*`"
            v-model="tabledataobj.password"
            @click:append="showPassword = !showPassword"
            :error-messages="passwordCheckMsg"
          ></v-text-field>
          <v-text-field
            class="mx-3 mt-3"
            clearable
            :append-icon="showRepassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
            :type="showRepassword ? 'text' : 'password'"
            :rules="rules.password"
            :label="`${$t('userRole.table.repassword')}*`"
            v-model="tabledataobj.repassword"
            @click:append="showRepassword = !showRepassword"
            :error-messages="passwordCheckMsg"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions class="mt-4">
        <v-spacer></v-spacer>
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
  name: 'NewPasswordDialog',
  data() {
    return {
      tabledataobj: {
      },
      showPassword: false,
      showRepassword: false,
      passwordCheckMsg: null,
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    oldPassword: {
      type: String,
    },
  },
  computed: {
    ...mapState('helper', ['currentLocale']),
    ...mapState('systemSetting', ['passwordSetting']),
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
        tabledataobj,
      } = this;
      const {
        password,
        repassword,
      } = tabledataobj;
      if (password !== repassword) {
        this.passwordCheckMsg = this.$t('userRole.dialog.passwordInconsistent');
        return;
      }
      const { passwordLength, complexity } = this.passwordSetting;
      if (password.length < passwordLength) {
        this.passwordCheckMsg = this.$t('verification.lengthmorethan', { num: passwordLength });
        return;
      }
      console.log(complexity, 'complexity');
      // 复杂度（0数字1数字字母2数字字母特殊字符）
      if (complexity === '0' && !/\d/.test(password)) {
        this.passwordCheckMsg = this.$t('verification.passwordLowComplexity');
        return;
      }
      if (complexity === '1' && (!/\d/.test(password) || !/[a-z,A-Z]/.test(password))) {
        this.passwordCheckMsg = this.$t('verification.passwordMiddleComplexity');
        return;
      }
      if (complexity === '2' && (!/\d/.test(password) || !/[a-z,A-Z]/.test(password) || !/[^a-zA-Z0-9]/.test(password))) {
        this.passwordCheckMsg = this.$t('verification.passwordHighComplexity');
        return;
      }
      const payload = {
        oldPassword,
        newPassword: password,
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
          this.tabledataobj = {};
          this.passwordCheckMsg = null;
          this.showPassword = false;
          this.showRepassword = false;
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
