<template>
  <v-app :class="iszh?'':'en-mode'">
    <app-header></app-header>
    <v-main class="main-body">
      <img
        src='@/assets/imgs/body-background.jpg'
        alt=""
        class="body-img"
      >
      <div :style="`height:${clientheight-170}px`">
        <router-view />
      </div>
      <setting-dialog />
      <scan-dialog @getMainInfoLoop="getMainInfoLoop"/>
    </v-main>
    <app-menu class="app-menu"/>
    <confirm-dialog ref="confirm" />
    <repair-task-dialog />
    <app-snackbar style="margin-bottom: 70px;"/>
  </v-app>
</template>

<script>
/* eslint-disable */
import { mapState, mapActions, mapMutations } from 'vuex';
import ApiService from '@/service/api.service';
import ServiceFactory from '@/service/ServiceFactory';
import AppHeader from '@/components/webapp/AppHeader.vue';
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue';
import AppSnackbar from '@/components/dialog/AppSnackbar.vue';
import SettingDialog from '@/components/dialog/SettingDialog.vue';
import ScanDialog from '@/components/dialog/ScanDialog.vue';
import AppMenu from '@/components/webapp/AppMenu.vue';
import RepairTaskDialog from '@/components/performanceOptimization/maintenanceTask/repairTaskDialog.vue';
import '@/assets/css/common.css';
import '@/assets/css/style.scss';

const { CommonService } = ServiceFactory;
export default {
  name: 'App',
  components: {
    AppHeader,
    ConfirmDialog,
    AppSnackbar,
    SettingDialog,
    ScanDialog,
    AppMenu,
    RepairTaskDialog,
  },
  data: () => ({
    clientheight: document.body.clientHeight,
  }),
  computed: {
    ...mapState('setting', ['mainProduct', 'userInfo', 'me']),
    ...mapState('auth', ['isTokenValid', 'token']),
    iszh() {
      return this.$i18n.locale === 'zhHans';
    },
  },
  watch: {
  },
  async created() {
    // if(this.$router.path !== '/'){
    //   this.$router.push('/');
    // }
    if(this.$router.name !== 'home'){
      this.$router.push({ name: 'home' });
    }
    if (!this.token) {
      this.initAuth();
    } // 读取token
    if (!this.isTokenValid) {
      this.SET_STTINGDIALOG(true); // token失效弹出登录框
      this.setIsTokenValid(true);
    } else {
      if (!this.me) {
        await this.$userGetUserInfo('mock1');  // 读取用户信息
      }
      if (!this.curLoginInfo) {
        await this.getCurLoginInfo(this.me?.userName); // 读取当前登录信息
      } 
    }
    this.$vuetify.theme.dark = true;
    // 开启定时器，每10秒查询一次设备信息和报警数量
    await this.getMainInfoLoop();
  },
  mounted() {
    this.$root.$confirm = this.$refs.confirm;
    const instance = ApiService.getAxiosInstance();
    instance.interceptors.request.use((req) => {
      if (this.request && this.request[req.url] !== undefined) {
        delete this.request[req.url];
      }
      return req;
    }, (error) => {
      return Promise.reject(error);
    });
    instance.interceptors.response.use((res) => {
      const { code } = res.data;
      if (code === 401) {
        // 登录状态失效
        this.setIsTokenValid(false);
        // 跳回首页
        if(this.$router.name !== 'home'){
          this.$router.push({ name: 'home' });
        }
      }
      return res;
    }, (error) => {
      return Promise.reject(error);
    });
  },
  beforeDestroy() {
  },
  methods: {
    ...mapMutations('setting', ['SET_STTINGDIALOG', 'SET_SCANDIALOG']),
    ...mapMutations('auth', ['setIsTokenValid']),
    ...mapActions('setting', ['getMainProduct', 'getCurLoginInfo']),
    ...mapActions('maintenanceTask', ['getTaskList']),
    ...mapActions('auth', ['initAuth']),
    ...mapActions('faultDiagnosis', ['getAlarmTotalCount']),
    async getMainInfoLoop() {
      // console.log('getMainInfoLoop', this.isTokenValid);
      if (!this.isTokenValid) {
        return;
      }
      // 设备信息
      await this.getMainProduct();
      // 维保任务报警数量 故障诊断报警数量
      await this.getAlarmTotalCount();
      await this.$getTimeout(10000);
      this.getMainInfoLoop();
    },
  },
};
</script>

<style lang="scss" scoped>
  .main-body {
    z-index: 0;
    position: relative;
    overflow: hidden;
    .body-img {
      position: absolute;
      z-index: -1;
      opacity: 0.12;
      width: 1920px;
      height: 1083px;
      top: calc(0% - 83px);
    }
  }
</style>
