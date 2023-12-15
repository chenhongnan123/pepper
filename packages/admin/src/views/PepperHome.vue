<template>
  <div>
    <pepper-header @toggle-drawer="toggleDrawer" />
    <pepper-drawer
      :showDrawer="drawer"
      :items="items"
      @set-drawer="setDrawer"
    />
    <operation-log-drawer />
    <!-- <router-view class="px-3" v-if="!isKeepAlive" /> -->
    <keep-alive :include="multiPages">
      <router-view class="px-3" />
    </keep-alive>
    <v-footer
      padless
      color="transparent"
      absolute
    >
      <!-- <div class="alignRight">
        <img
          v-if="$vuetify.theme.dark"
          class="logo-bottom"
          :src="require('@/assets/logo/logo-bottom-dark.png')"
          alt=""
        />
        <img
          v-else
          class="logo-bottom"
          :src="require('@/assets/logo/logo-bottom.png')"
          alt=""
        />
      </div> -->
    </v-footer>
  </div>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
} from 'vuex';
import PepperHeader from '@/components/core/PepperHeader';
import PepperDrawer from '@/components/core/PepperDrawer';
import OperationLogDrawer from '@/components/drawer/OperationLogDrawer';

let interval = null;
export default {
  name: 'PepperHome', // 注意组件名称必须与路由注册name保持一致，否则无法缓存页面
  data() {
    return {
      drawer: null,
      adminItems: [],
    };
  },
  components: {
    PepperHeader,
    PepperDrawer,
    OperationLogDrawer,
  },
  async created() {
    if (!this.me) {
      // 异步获取用户信息
      await this.$userGetUserInfo('mock1');
    }
    await this.getMenuList();
    await this.getSystemConfigList();
    this.redirect(this.$route.fullPath);
    interval = setInterval(() => {
      if (this.token) {
        this.geterrorInfo();
      } else {
        clearInterval(interval);
      }
    }, 10000);
  },
  deactivated() {
    if (interval) {
      clearInterval(interval);
    }
  },
  computed: {
    ...mapState('helper', ['currentLocale', 'pagePortalMode']),
    ...mapState('user', ['me', 'menuList']),
    ...mapState('common', ['multiPageList', 'excludePagesList']),
    ...mapState('message', ['errorlist']),
    ...mapState('auth', ['token']),

    items() {
      // const { currentLocale, menuList } = this;
      // const itemsByLanguage = menuList.filter((m) => m.type === currentLocale);
      // if (itemsByLanguage.length) {
      //   const { menuVoList } = itemsByLanguage[0];
      //   return menuVoList || [];
      // }
      return this.menuList;
    },
    multiPages() {
      return this.multiPageList.map((item) => item.routename);
    },
    excludePages() {
      return this.excludePagesList.map((item) => item.routename);
    },
    isKeepAlive() {
      return this.$route.meta.keepAlive;
    },
  },
  methods: {
    ...mapMutations('helper', ['setPagePortalMode']),
    ...mapActions('helper', ['getMainProduct', 'getSystemConfigList']),
    ...mapActions('user', ['getMenuList']),
    ...mapActions('message', ['geterrorMsgList']),
    redirect(path) {
      if (path === '/') {
        const index = this.items
          .findIndex((elem) => elem.children && elem.children[0].children);
        const findFirstMenu = this.items.find((item, i) => index === i);
        if (findFirstMenu) {
          const { children } = findFirstMenu;
          const { component } = children[0].children[0];
          this.$router.push({ name: component });
        }
      }
    },
    async geterrorInfo() {
      // await this.geterrorMsgList();
    },
    setDrawer(val) {
      this.drawer = val;
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
};
</script>

<style scoped>
  .alignRight {
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .logo-bottom {
    width: 312px;
    height: 37px;
  }
</style>
