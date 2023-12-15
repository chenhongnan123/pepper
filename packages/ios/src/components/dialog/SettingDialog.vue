<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="50%"
    transition="dialog-transition"
  >
    <div class="app-dialog pa-1">
      <v-card class="rounded-lg" style="min-height: 600px;">
        <div
          v-for="i in 5"
          :key="i"
          :class="`rectangle-${i}`"
        ></div>
        <v-card-title
          primary-title
          class="mt-2 pb-0"
        >
          <span class="text-h5">
            {{ $t('setting.systemsetting') }}
          </span>
          <v-spacer></v-spacer>
          <v-btn
            v-if="this.token&&isTokenValid"
            icon
            @click="dialog = false"
          >
            <v-icon class="text-h4">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <!-- 标题分割线 -->
        <div class="d-flex align-center px-5">
          <img
            :src="require('@/assets/icons/img/dialog-circle-big-dark.svg')"
            alt=""
            class="mr-2"
          />
          <img
            :src="require('@/assets/icons/img/dialog-circle-small-dark.svg')"
            alt=""
          />
          <v-divider></v-divider>
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
        </div>
        <v-card-text>
          <div class="d-flex px-3 pb-3 align-center">
            <template
              v-if="!operator"
            >
              <img
                :src="require('@/assets/icons/img/account-dark.svg')"
                alt=""
              />
              <span class="text-h5 mx-4">
                {{ $t('setting.logintext') }}
              </span>
            </template>
            <div
              v-if="operator"
            >
              <v-list-item three-line>
                <v-avatar>
                  <img
                    :src="`${operator.avatar}`"
                    alt=""
                    style="width: 48px; height: 48px;"
                  >
                </v-avatar>
                <v-list-item-content class="ml-2">
                  <v-list-item-subtitle>
                    {{operatorCode}}
                  </v-list-item-subtitle>
                  <v-list-item-title>
                    <span class="text-h6 mr-4"> {{ operator.nickName }}</span>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{loginTime}}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              v-if="!operator"
              rounded
              color="primary2"
              min-width="100"
              @click="HANDLE_AUTHACTION({
                authAction: 'login',
              })"
            >
              {{ $t('setting.login') }}
            </v-btn>
            <v-btn
              v-if="operator"
              rounded
              color="primary2"
              min-width="100"
              class="mr-2"
              @click="HANDLE_AUTHACTION({
                authAction: 'changelogin',
              })"
            >
              {{ $t('setting.switchaccount') }}
            </v-btn>
            <v-btn
              v-if="operator"
              rounded
              color="error"
              min-width="100"
              @click="handleLogout"
            >
              {{ $t('setting.logout') }}
            </v-btn>
          </div>
          <div class="px-6">
            <v-divider></v-divider>
          </div>
          <div class="px-6 py-4">
            <span class="text-subtitle-1">{{ $t('setting.language') }}</span>
            <v-autocomplete
              v-model="locale"
              :items="locales"
              outlined
              dense
              item-text="text"
              item-value="value"
              hide-details
              class="my-3 blueinput"
              prepend-icon="mdi-web"
            >
            </v-autocomplete>
          </div>
          <div class="px-6 py-4">
            <span class="text-subtitle-1">{{ $t('setting.connection') }}</span>
            <div class="d-flex">
              <v-text-field
                class="my-3 blueinput mx-4"
                :value="ip"
                outlined
                dense
                hide-details
                :label="$t('setting.ip')"
                disabled
              ></v-text-field>
              <v-text-field
                class="my-3 blueinput mx-4"
                :value="deviceName"
                outlined
                dense
                hide-details
                :label="$t('setting.machine')"
                disabled
              ></v-text-field>
              <v-text-field
                class="my-3 blueinput mx-4"
                :value="`${version}.${developmentVersion}`"
                outlined
                dense
                hide-details
                :label="$t('setting.version')"
                disabled
              ></v-text-field>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-dialog>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { setLocale } from '@/utils/cookies';

export default {
  name: 'SettingDialog',
  data() {
    return {
      host: window.location.host,
    };
  },
  computed: {
    ...mapState('setting', ['settingDialog', 'mainProduct', 'userInfo', 'me', 'curLoginInfo']),
    ...mapState('helper', ['version', 'developmentVersion', 'locales', 'currentLocale']),
    ...mapState('auth', ['isTokenValid', 'token']),
    dialog: {
      get() {
        return this.settingDialog;
      },
      set() {
        this.SET_STTINGDIALOG(false);
      },
    },
    loginTime() {
      if (this.curLoginInfo?.accessTime) {
        return this.curLoginInfo.accessTime;
      }
      return '-';
    },
    operator() {
      return this.me;
    },
    operatorCode() {
      if (this.operator) {
        return this.getOperatorCode(this.operator.userName) || '';
      }
      return '';
    },
    ip() {
      if (this.operator) {
        return this.host || '-';
      }
      return '-';
    },
    deviceName() {
      if (this.operator && this.mainProduct?.deviceName) {
        return this.mainProduct.deviceName || '-';
      }
      return '-';
    },
    locale: {
      get() {
        this.SET_CURRENTLOCALE(this.$i18n.locale);
        return this.currentLocale;
      },
      set(val) {
        this.$i18n.locale = val;
        setLocale(val);
        this.SET_CURRENTLOCALE(val);
      },
    },
  },
  methods: {
    ...mapMutations('setting', ['SET_STTINGDIALOG', 'SET_SCANDIALOG']),
    ...mapMutations('helper', ['SET_CURRENTLOCALE']),
    ...mapActions('setting', ['HANDLE_AUTHACTION']),
    ...mapActions('helper', ['GET_SESSION', 'SET_ALERT']),
    async handleLogout() {
      console.log(this.$root.$confirm, 'this.$root.$confirm');
      if (await this.$root.$confirm.open(
        this.$t('alert.confirminfo'),
        this.$t('alert.confirmlogout'),
      )) {
        const result = await this.$userLogOut('mock1');
        if (result) {
          this.SET_ALERT({
            type: 'success',
            message: this.$t('success.successAction'),
          });
          this.SET_STTINGDIALOG(true);
          if (this.$router.name !== 'home') {
            this.$router.push({ name: 'home' });
          }
        }
      }
    },
    getOperatorCode(str) {
      const index = str.indexOf('_');
      if (index === -1) {
        return str;
      }
      const result = str.substr(index + 1, str.length);
      return result;
    },
  },
};
</script>
