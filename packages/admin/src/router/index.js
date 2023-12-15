import Vue from 'vue';
import VueRouter from 'vue-router';

import NProgress from 'nprogress';
import tokenService from '@/services/token.service';

import routes from './routes';
// import store from '../store';

import store from '../store/index';

import 'nprogress/nprogress.css';

NProgress.configure({
  showSpinner: false,
  easing: 'ease',
  speed: 400,
});

const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;
// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch((err) => err);
};
// replace
VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject);
  }
  return originalReplace.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes,
});

export const setMultiPageList = (route) => {
  // 排除非多开页的路由，例如登录页、404页等
  if (!route.meta.nomultipage) {
    const routename = route.name;
    const rootname = route.meta.rootRouterName;
    const list = store.state.common.multiPageList;
    const namelist = list.map((item) => item.routename);
    const pagelist = list.concat();
    // 属于子路由且第一次进入路由，按照父路由名称新增页签
    if (rootname) {
      if (!namelist.includes(rootname)) {
        const obj = {
          path: route.fullPath,
          routename: rootname,
          // icon: route.icon,
          icon: 'mdi-account', // mock icon
        };
        pagelist.push(obj);
      } else { // 若已打开页签，则更新该页签path
        const index = pagelist.findIndex((item) => item.routename === rootname);
        if (index >= 0) {
          pagelist[index].path = route.fullPath;
        }
      }
    } else if (!namelist.includes(routename)) {
      // 不属于子路由第一次进入页面，按照当前路由名称新增页签
      const obj = {
        path: route.fullPath,
        routename,
        // icon: route.icon,
        icon: 'mdi-account', // mock icon
      };
      pagelist.push(obj);
    } else {
      const index = pagelist.findIndex((item) => item.routename === routename);
      if (index >= 0) {
        pagelist[index].path = route.fullPath;
      }
    }
    store.state.common.multiPageList = pagelist;
  }
};

const isAppProvisioned = async (appName) => {
  let permit = false;
  const checkAccess = () => store.getters['user/isAppProvisioned'](appName);
  const { token } = store.state.auth;
  const { permissions, menuList } = store.state.user;
  if (!token) {
    await store.dispatch('auth/initAuth');
  }
  if (!menuList.length) {
    await store.dispatch('user/getMenuList');
  }
  if (!permissions.length) {
    await store.dispatch('user/getUserInfo');
  }
  permit = checkAccess();
  return permit;
};

router.beforeEach(async (to, from, next) => {
  // console.log(to, 'to');
  const { refreshRouteName } = store.state.helper;
  // console.log(refreshRouteName, 'refreshRouteName');
  if (!refreshRouteName) {
    store.commit('helper/setRefreshRouteName', to.name);
  }
  if (to.matched.length === 0) {
    // 路由未匹配则跳转首页
    next({ path: '/' });
  } else {
    NProgress.start();
    // 更新页签
    setMultiPageList(to);
    const rootname = to.meta.rootRouterName;
    const namelist = store.state.common.multiPageList.map((item) => item.routename);
    // 根据活跃列表判断是否进行缓存
    if (!namelist.includes(to.name) && !namelist.includes(rootname)) {
      to.meta.keepAlive = false;
    } else {
      to.meta.keepAlive = true;
    }
    const loggedIn = !!tokenService.getToken();
    const isPublic = to.matched.some((record) => record.meta.public);
    const onlyWhenLoggedOut = to.matched.some((record) => record.meta.onlyWhenLoggedOut);
    const appPermissionRequired = to.matched.some((record) => record.meta.permissionRequired);
    if (!isPublic && !loggedIn) {
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      });
    } else if (loggedIn && onlyWhenLoggedOut) {
      next({ path: '/' });
    } else if (loggedIn && appPermissionRequired) {
      // console.log(to, 'to');
      const appName = to.meta.rootRouterName || to.name;
      // console.log(appName, 'appName');
      if (await isAppProvisioned(appName)) {
        next();
      } else {
        next({ name: '401' });
      }
    } else {
      next();
    }
  }
});

router.afterEach(() => NProgress.done());

export default router;
