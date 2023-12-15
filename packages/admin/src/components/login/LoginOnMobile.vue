<template>
  <v-row
    justify="center"
    align="center"
    class="overflow-hidden login-on-mobile"
  >
    <div class="login-mobile-img">
      <!-- <div class="figure-group">
        <div
          class="ring-1 ring"
          style="--circle-width:75px;
                --ring-width:15px;
                --circle-color:var(--v-primary-base)"
        ></div>
        <div
          class="ring-2 ring"
          style="--circle-width:400px;
                --ring-width:50px;
                --circle-color:var(--v-primary-base)"
        ></div>
      </div> -->
    </div>
    <v-col cols="12" class="text-justify">
      <v-card flat class="transparent pt-16">
        <v-card-title class="text-h5 font-weight-black pl-12 pt-16">
          {{$t('login.title')}}</v-card-title>
        <v-card-subtitle class="pl-12 pb-8">
          <span>
            {{ `${version}.${developmentVersion}` }}
          </span>
        </v-card-subtitle>
        <v-card-text class="pb-0 px-8">
          <v-form
            ref="loginForm"
            lazy-validation
          >
            <v-text-field
              :class="mode?'my-16 pt-8 pb-6':'my-6 py-4'"
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
        <v-card-actions v-if="!mode && false" class="pt-0 px-8">
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
        <v-card-actions class="px-5">
          <v-row no-gutters>
            <v-col cols="4" sm="2">
              <v-select
                flat
                solo
                dense
                hide-details
                :items="locales"
                menu-props="top"
                item-text="languageValue"
                item-value="languageKey"
                autocomplete="language"
                v-model="locale"
                append-icon="mdi-chevron-down"
                v-if="false"
              >
                <template #selection="{item}">
                  <span style="color:#8D8C8C">
                    {{item.languageValue}}
                  </span>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-card-actions>
        <v-card-actions class="px-8 pt-0">
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
        <v-card-actions class="px-8 mt-12">
          <v-btn
            color="primary"
            block
            x-large
            elevation="10"
            @click="handleLogin"
          >
          {{$t('login.login')}}
          </v-btn>
        </v-card-actions>
        <v-card-actions class="px-8 mt-16" v-if="false">
          <v-btn
            text
            color="info"
            @click="mode = 1 - mode"
          >
            {{$t(`login.${otherModeList[mode]}`)}}
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
  name: 'LoginOnMobile',
  data: () => ({
    clientheight: document.body.clientHeight,
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
  methods: {
    ...mapMutations('helper', ['setCurrentLocale', 'setIsDark', 'setAlert']),
    setValue(val) {
      this.setIsDark(val);
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
  },
};
</script>
