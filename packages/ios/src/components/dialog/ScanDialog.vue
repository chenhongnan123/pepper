<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="25%"
  >
    <div class="confirm-dialog pa-1">
      <v-card style="rounded-lg">
        <div
          v-for="i in 5"
          :key="i"
          :class="`rectangle-${i}`"
        ></div>
        <v-card-title class="mt-2 pb-0">
          <span
            v-if="authAction === 'login' || authAction === 'changelogin'"
            class="text-h5"
          >
            {{$t('login.login')}}
          </span>
          <span v-else>
            {{$t('login.scan')}}
          </span>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon class="text-h4">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <!-- 标题分割线 -->
        <div class="d-flex align-center px-5">
          <img
            :src="require('@/assets/icons/img/dialog-circle-big-dark.svg')"
            alt=""
            class="mr-1"
          />
          <img
            :src="require('@/assets/icons/img/dialog-circle-small-dark.svg')"
            alt=""
          />
          <v-divider></v-divider>
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-0"
          />
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-0"
          />
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-0"
          />
        </div>
        <v-card-text>
          <v-text-field
            v-if="authAction === 'login' || authAction === 'changelogin'"
            class="blueinput"
            :label="$t('login.operatorcode')"
            outlined
            v-model="operatornumber"
            solo
            :readonly="operatornumberReadonly"
            @focus="operatornumberReadonly = false"
          ></v-text-field>
          <v-text-field
            v-if="authAction === 'login' || authAction === 'changelogin'"
            class="blueinput"
            :label="$t('login.password')"
            outlined
            v-model="password"
            type="password"
            solo
            clearable
            :readonly="operatornumberReadonly"
            @focus="operatornumberReadonly = false"
          ></v-text-field>
          <div
            v-if="authAction === 'login' || authAction === 'changelogin'"
            class="d-flex"
          >
            <v-spacer></v-spacer>
            <v-btn
              class="rounded-lg"
              color="primary2"
              min-width="100"
              @click="handleLogin"
            >{{$t('login.login')}}</v-btn>
            <v-spacer></v-spacer>
          </div>
          <div
            v-if="false"
            class="d-flex py-4 align-center"
          >
            <v-divider style="opacity:0.3"></v-divider>
            <span class="primary2--text">{{$t('login.or')}}</span>
            <v-divider style="opacity:0.3"></v-divider>
          </div>
          <v-text-field
            v-if="authAction !== 'login' && authAction !== 'changelogin'"
            class="scan-field blueinput"
            :label="$t('login.scan')"
            outlined
            v-model="badgenumber"
            solo
            autofocus
            clearable
            @keyup.enter="handleChange"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </div>
  </v-dialog>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'ScanDialog',
  data() {
    return {
      operatornumber: '',
      password: '',
      badgenumber: '',
      operatornumberReadonly: true,
    };
  },
  computed: {
    ...mapState('setting', ['scanDialog', 'authAction']),
    ...mapState('helper', ['session']),
    dialog: {
      set() {
        this.badgenumber = '';
        this.operatornumber = '';
        this.password = '';
        this.SET_SCANDIALOG(false);
      },
      get() {
        return this.scanDialog;
      },
    },
  },
  methods: {
    ...mapMutations({
      SET_SCANDIALOG: 'setting/SET_SCANDIALOG',
      SET_STTINGDIALOG: 'setting/SET_STTINGDIALOG',
    }),
    ...mapMutations('auth', ['setIsTokenValid']),
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapActions({
      CHANGELOGIN: 'setting/CHANGELOGIN',
      CHECK_AUTH: 'setting/CHECK_AUTH',
      AUTHCALLBACK: 'setting/AUTHCALLBACK',
      GET_SESSION: 'helper/GET_SESSION',
    }),
    ...mapActions('setting', ['getCurLoginInfo']),
    // 账号密码登录
    async userpwdLogin() {
      const {
        operatornumber,
        password,
      } = this;
      const payload = {
        username: operatornumber,
        password,
      };
      const result = await this.$userLogin(payload, 'mock1');
      if (result) {
        this.reset();
        this.SET_SCANDIALOG(false);
        this.SET_STTINGDIALOG(false);
        await this.$userGetUserInfo('mock1');
        await this.getCurLoginInfo(operatornumber);
        this.setIsTokenValid(true);
        this.$emit('getMainInfoLoop');
        return true;
      }
      return false;
    },
    // 刷卡登录
    async badgeNumLogin() {
      const { badgenumber } = this;
      const payload = {
        account: badgenumber,
      };
      const result = await this.$userLogin(payload, 'mock1');
      if (result) {
        this.reset();
        this.SET_SCANDIALOG(false);
        this.SET_STTINGDIALOG(false);
        await this.$userGetUserInfo('mock1');
        await this.getCurLoginInfo(badgenumber);
        return true;
      }
      return false;
    },
    async scan($event) {
      if ($event.keyCode === 13) {
        const {
          badgenumber,
          authAction,
        } = this;
        if (authAction === 'login') {
          await this.userpwdLogin();
        } else if (authAction === 'changelogin') {
          const result = await this.$userLogOut('mock1');
          if (result) {
            this.SET_SCANDIALOG(true);
          }
        } else {
          // 校验操作权限
          const checkauth = await this.checkActionAuth();
          if (checkauth) {
            this.reset();
            this.SET_SCANDIALOG(false);
            this.AUTHCALLBACK(badgenumber);
          } else {
            this.SET_ALERT({
              show: true,
              type: 'error',
              message: this.$t('login.nopermission'),
            });
          }
        }
      } else {
        // this.badgenumber += String.fromCharCode($event.keyCode);
      }
    },
    async handleChange() {
      const {
        badgenumber,
        authAction,
      } = this;
      if (authAction === 'login') {
        // 刷卡登录
        await this.badgeNumLogin();
      } else if (authAction === 'changelogin') {
        // 切换账号登录
        const result = await this.$userLogOut('mock1');
        if (result) {
          await this.badgeNumLogin();
        }
      } else {
        // 校验操作权限
        const checkauth = await this.checkActionAuth();
        this.reset();
        if (checkauth) {
          this.SET_SCANDIALOG(false);
          this.AUTHCALLBACK(badgenumber);
        } else {
          this.SET_ALERT({
            show: true,
            type: 'error',
            message: this.$t('login.nopermission'),
          });
        }
      }
    },
    async checkActionAuth() {
      const { badgenumber, authAction } = this;
      const payload = {
        API_ROUTE_PATH: 'GET_CARDNO_DEVICE_POWER',
        AdvCondition: [
          {
            param_name: 'cardno',
            condition: badgenumber,
          },
          {
            param_name: 'menuCode',
            condition: authAction,
          },
        ],
      };
      const result = await this.CHECK_AUTH(payload);
      return result;
    },
    async handleLogin() {
      const { authAction } = this;
      if (authAction === 'login') {
        await this.userpwdLogin();
      } else if (authAction === 'changelogin') {
        const result = await this.$userLogOut('mock1');
        if (result) { // 登出后重新登录
          await this.userpwdLogin();
        }
      }
    },
    reset() {
      this.badgenumber = '';
      this.operatornumber = '';
      this.password = '';
    },
  },
};
</script>
