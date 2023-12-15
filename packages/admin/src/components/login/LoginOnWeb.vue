<template>
  <v-row
    justify="center"
    align="center"
    class="overflow-hidden login-on-web"
  >
    <v-col md="7" lg="7" xl="5" >
      <div class="login-web-img">
        <!-- <div
          class="ring-1 ring"
          style="--circle-width:253px;
                --ring-width:30px;
                --circle-color:var(--v-primary-base)"
        ></div>
        <div class="circle-1">
          <div class="figure-group">
            <div
              class="circle"
              style="--circle-width:221px;
                    --circle-color:var(--v-primary-base)"
            >
            </div>
            磨砂
            <div
              class="rectangle-blur rectangle"
              :style="`--rectangle-width:360px;
                    --rectangle-height:180px;
                    --rectangle-color:${isDark?'rgba(18 ,18, 18, 0.3)':'rgba(255 ,255, 255, 0.3)'}`"
            ></div>
          </div>
        </div>
        <div
          class="ring-2 ring"
          style="--circle-width:253px;
                --ring-width:30px;
                --circle-color:var(--v-primary-base)"
        ></div>
        <div
          class="circle-2 circle"
          style="--circle-width:48px;
                --circle-color:var(--v-secondary-base)"
        ></div> -->
      </div>
    </v-col>
    <v-col cols="12" md="5" lg="4" xl="3" class="text-justify">
      <v-card flat class="login-card py-6 px-4">
        <v-card-title class="text-h5 font-weight-black pl-12">{{$t('login.title')}}</v-card-title>
        <v-card-subtitle class="pl-12 pb-4">
          <span>
            {{ `${version}.${developmentVersion}` }}
          </span>
        </v-card-subtitle>
        <v-card-text class="pb-0">
          <v-form
            ref="loginForm"
            lazy-validation
          >
            <v-text-field
              :class="`${mode?'my-16 py-8':'my-6 py-4'} account-input`"
              clearable
              :label="`${$t('login.account')}`"
              v-model="account"
              :rules="rules.account"
              @keyup.enter.native="handleLogin"
            >
              <template #prepend>
                <img
                  :src="require('@/assets/icons/account.svg')"
                  alt=""
                />
              </template>
            </v-text-field>
            <v-text-field
              class="mt-6 pt-4"
              clearable
              :append-icon="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
              :type="showPassword ? 'text' : 'password'"
              :label="`${$t('login.password')}`"
              v-model="password"
              v-if="!mode"
              :rules="rules.password"
              @click:append="showPassword = !showPassword"
              @keyup.enter.native="handleLogin"
            >
              <template #prepend>
                <img
                  :src="require('@/assets/icons/password.svg')"
                  alt=""
                />
              </template>
            </v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions v-if="!mode && false" class="pt-0" >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="info"
            small
            height="26"
            @click="handleForgot"
          >
          {{$t('login.forgotPassword')}}
          </v-btn>
        </v-card-actions>
         <v-card-actions class="px-8 mt-2">
          <v-checkbox
            v-model="loginType"
            :label="$t('login.domainLogin')"
            hide-details
            dense
            class="mt-0 pt-0"
          />
          <v-spacer></v-spacer>
          <switch-with-text
            :value="isDark"
            :textList="[$t('login.light'), $t('login.dark')]"
            :width="60"
            :color="'#000'"
            @setValue="setValue"
          ></switch-with-text>
        </v-card-actions>
         <v-card-actions class="px-8 mt-2">
          <v-btn
            color="primary"
            block
            x-large
            elevation="0"
            @click="handleLogin"
          >
          {{$t('login.login')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {
  mapState,
  mapMutations,
} from 'vuex';
import SwitchWithText from '@/components/commonUI/SwitchWithText.vue';

export default {
  name: 'LoginOnWeb',
  data: () => ({
    mode: 0,
    otherModeList: ['superAdminLgoin', 'userLogin'],
    showPassword: false,
    account: null,
    password: null,
    loginType: false,
  }),
  components: {
    SwitchWithText,
  },
  created() {
  },
  computed: {
    ...mapState('helper', ['locales', 'currentLocale', 'isDark', 'version', 'developmentVersion']),
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
    rules() {
      return this.$getLoginRules();
    },
  },
  mounted() {
    document.addEventListener('keydown', (event) => {
      if (event.keyCode === 13) {
        this.handleLogin();
      }
    });
  },
  methods: {
    ...mapMutations('helper', ['setCurrentLocale', 'setIsDark', 'setAlert']),
    setValue(val) {
      this.setIsDark(val);
    },
    setLoginType(val) {
      this.loginType = val;
    },
    handleLogin() {
      if (!this.$refs.loginForm?.validate()) {
        return;
      }
      const { account, password, loginType } = this;
      this.$emit('login', { username: account, password, loginType: loginType ? '2' : '1' });
      // if (mode) {
      //   this.$emit('login', { username: account, password: '', userType: '1' });
      // } else {
      //   this.$emit('login', { username: account, password, userType: '2' });
      // }
    },
    handleForgot() {
      this.setAlert({
        show: true,
        type: 'info',
        message: this.$t('error.CONTACT_ADMIN'),
      });
    },
    handleChangeMode() {
      this.mode = 1 - this.mode;
      this.$refs.loginForm.reset();
      this.$nextTick(() => {
        document.querySelector('.account-input input').focus();
      });
    },
  },
};
</script>
