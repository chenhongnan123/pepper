<template>
  <v-app>
    <v-main :class="isDark ? 'main-dark' : ''">
      <pepper-snackbar />
      <pepper-invalidate-session />
      <pepper-comfirm ref="confirm" />
      <pepper-data-save-confirm ref="dataConfirm" />
      <pepper-loading />
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import ApiService from '@/services/api.service';
import PepperSnackbar from '@/components/core/PepperSnackbar.vue';
import PepperLoading from '@/components/utils/PepperLoading';
import PepperComfirm from '@/components/core/PepperConfirm.vue';
import PepperInvalidateSession from '@/components/core/PepperInvalidateSession.vue';
import PepperDataSaveConfirm from '@/components/core/PepperDataSaveConfirm.vue';
import '@/assets/css/style.scss';

let timer = null;
export default {
  name: 'App',
  data() {
    return {
      request: {},
    };
  },
  components: {
    PepperSnackbar,
    PepperLoading,
    PepperComfirm,
    PepperDataSaveConfirm,
    PepperInvalidateSession,
  },
  computed: {
    ...mapState('helper', ['isDark', 'isPepperLoading']),
    ...mapState('user', ['token']),
  },
  watch: {
    isDark() {
      this.$vuetify.theme.dark = this.isDark;
      localStorage.setItem('dark', this.isDark);
    },
  },
  mounted() {
    // console.log('app mounted, ', process.env.VUE_APP_BASE_URL);
    this.$root.$confirm = this.$refs.confirm;
    this.$root.$dataConfirm = this.$refs.dataConfirm;
    const instance = ApiService.getAxiosInstance();
    instance.interceptors.request.use((req) => {
      // 排除获取用户信息接口和获取路由菜单接口
      // if (!req.url.includes('/user/getInfo') && !req.url.includes('/menu/getRouters')) {
      // }
      // console.log(this.request, 'request');
      if (this.request && this.request[req.url] !== undefined) {
        delete this.request[req.url];
      }
      timer = setTimeout(() => {
        if (this.request[req.url] === undefined) {
          this.request[req.url] = 1;
          this.setPepperLoading(true);
        }
      }, 1000);
      return req;
    }, (error) => {
      this.setPepperLoading(false);
      return Promise.reject(error);
    });
    instance.interceptors.response.use((res) => {
      const { url } = res.config;
      // console.log(this.request, 'response');
      this.request[url] = 0;
      const keys = Object.keys(this.request);
      if (keys.every((key) => this.request[key] === 0)) {
        this.setPepperLoading(false);
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      }
      this.setNetErorr(false);
      const { code } = res.data;
      if (code === 401) {
        // 登录状态失效
        this.setIsTokenValid(false);
      }
      return res;
    }, (error) => {
      this.setPepperLoading(false);
      this.setAlert({
        show: true,
        type: 'error',
        message: `${error.message}:${error.request.responseURL}`,
      });
      this.setNetErorr(true);
      return Promise.reject(error);
    });
  },
  created() {
    const dark = localStorage.getItem('dark');
    this.setIsDark(dark ? JSON.parse(dark) : false);
    // this.getLocales();
    if (!this.token) {
      this.initAuth();
    }
  },
  methods: {
    ...mapMutations('helper', [
      'setPepperLoading',
      'setAlert',
      'setIsDark',
      'setNetErorr',
    ]),
    ...mapMutations('auth', [
      'setIsTokenValid',
    ]),
    ...mapActions('helper', [
      'getLocales',
    ]),
    ...mapActions('auth', [
      'initAuth',
    ]),
  },
};
</script>

<style lang="scss">
.main-dark {
  .scoreTitle {
    color: #b2b2b2 !important;
  }
  .bgSquare {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
  .greyBorder {
    border-color: #575757 !important;
  }
  .card-title-content {
    .theme--dark {
      background: #555 !important;
    }
  }
  .bom-health-score > div > div > div > div > b {
    color: #ffffff !important;
  }
  .tipContainer .tipContent {
    color: rgba(255, 255, 255, 0.6) !important;
  }
  .scoreContainer {
    border-color: #575757 !important;
  }
  .health-card-content > div > div {
    border-color: #575757 !important;
  }
  .health-state {
    .mdi-leaf {
      // color: rgb(71, 165, 26) !important;
    }
    .text-hidden-overflow {
      // color: rgb(71, 165, 26) !important;
    }
  }
  .theme--dark.v-chip:not(.v-chip--active) {
    color: #ffffff !important;
    // background-color: #555 !important; 不要这么粗暴地改原组件样式，会影响到其他页面
  }
  .picContainer .title-text {
    color: #ffffff !important;
  }
  .param-title {
    color: #ffffff !important;
  }
  .customDateTimePicker .el-range-input {
    color: #ffffff !important;
    transition: color 0.1s linear;
  }
  .statusSquare {
    .text-center {
      // color: rgb(76, 178, 28);
      i {
        // color: rgb(76, 178, 28) !important;
      }
    }
  }
}
</style>
