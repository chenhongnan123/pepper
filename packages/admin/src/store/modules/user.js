import { set } from '@/utils/store.helper';
// import PepperConfig from '@/configs/pepper.config';

export default ({
  state: {
    permissions: [], // 默认值为空数组
    roles: [], // 默认值为空数组
    me: null,
    userTypeList: [
      {
        number: '1',
        type: 'superAdmin',
      },
      {
        number: '2',
        type: 'initialAdimin',
      },
      {
        number: '3',
        type: 'admin',
      },
      {
        number: '4',
        type: 'user',
      },
    ],
    avatarList: [
      'boy-1',
      'boy-2',
      'boy-3',
      'boy-4',
      'boy-5',
      'boy-6',
      'girl-1',
      'girl-2',
      'girl-3',
      'girl-4',
    ],
    curLoginInfo: {},
    loginInfoList: [],
    sexDict: [], // 性别选项列表
    userProfile: {},
    menuList: [],
  },
  mutations: {
    setPermissions: set('permissions'),
    setRoles: set('roles'),
    setMe: set('me'),
    setCurLoginInfo: set('curLoginInfo'),
    setLoginInfoList: set('loginInfoList'),
    setSexDict: set('sexDict'),
    setUserProfile: set('userProfile'),
    setMenuList: set('menuList'),
  },
  actions: {
    async getCurLoginInfo({ commit }) {
      const result = await this.$systemGet('user/getCurrentLoginInfo', '');
      if (!result) {
        return;
      }
      const { data } = result;
      commit('setCurLoginInfo', data);
    },
    async getLoginInfoList({ commit }) {
      const result = await this.$systemPost('user/getAllLoginInfo', {}, '');
      if (!result) {
        return;
      }
      const { data } = result;
      commit('setLoginInfoList', data);
    },
    // 获取性别字典表
    async getSexDict({ commit }) {
      const result = await this.$systemGet('/dict/data/type/sys_user_sex');
      if (!result) {
        commit('setSexDict', []);
        return false;
      }
      const { data } = result;
      if (data) {
        commit('setSexDict', data);
      } else {
        commit('setSexDict', []);
      }
      return true;
    },
    async getUserProfile({ commit }) {
      const result = await this.$systemGet('user/profile');
      if (!result) {
        return;
      }
      commit('setUserProfile', result);
    },
    async updatePassword({ commit }, { newPassword, oldPassword }) {
      const result = await this.$systemPut(`user/profile/updatePwd?oldPassword=${oldPassword}&newPassword=${newPassword}`, {}, '');
      if (!result) {
        return false;
      }
      commit(
        'helper/setAlert',
        {
          show: true,
          type: 'success',
          message: 'successAction',
        },
        { root: true },
      );
      return true;
    },
    async updateUser({ commit }, payload) {
      const result = await this.$systemPut('/user/profile', payload);
      if (!result) {
        return false;
      }
      commit(
        'helper/setAlert',
        {
          show: true,
          type: 'success',
          message: 'successAction',
        },
        { root: true },
      );
      return true;
    },
    async getMenuList({ commit, getters }) {
      const result = await this.$systemGet('menu/getRouters', '');
      if (!result) {
        return;
      }
      // console.log(result, 'getMenuList');
      const { data } = result;
      const menulist = getters.filterHiddenMenu(data);
      commit('setMenuList', menulist);
    },
    async getUserInfo({ commit }) {
      const result = await this.$systemGet('user/getInfo', '');
      if (!result) {
        return;
      }
      // console.log(result, 'getUserInfo');
      const { user, roles, permissions } = result;
      if (user) {
        commit('setMe', user);
      } else {
        commit('setMe', {});
      }
      if (permissions) {
        commit('setPermissions', permissions);
      } else {
        commit('setPermissions', []);
      }
      if (roles) {
        commit('setRoles', roles);
      } else {
        commit('setRoles', []);
      }
    },
  },
  getters: {
    userType: ({ me }) => {
      if (me && me.roles && me.roles.length) {
        return me.roles[0].roleName;
      }
      return '';
    },
    fullName: ({ me }) => {
      if (me) {
        const { nickName } = me;
        return nickName || '-';
      }
      return '-';
    },
    account: ({ me }) => {
      if (me) {
        const { userName } = me;
        return userName || '-';
      }
      return '-';
    },
    avatar: ({ me, avatarList }) => {
      if (me) {
        const { avatar } = me;
        if (avatarList.some((a) => a === avatar)) {
          return avatar;
        }
      }
      return '';
    },
    avatarText: ({ me }) => {
      if (me) {
        const { nickName } = me;
        return nickName ? nickName.slice(0, 1) : '-';
      }
      return '-';
    },
    organization: ({ me }) => {
      if (me && me.dept) {
        const { deptName } = me.dept;
        return `${deptName || '-'}`;
      }
      return '-';
    },
    getPermissions: ({ permissions }) => {
      if (permissions) {
        return permissions;
      }
      return [];
    },
    isBtnAccess: ({ permissions }) => (btnCode) => {
      if (permissions) {
        return permissions.some((c) => c === btnCode || c === '*:*:*');
      }
      return false;
    },
    getProvisionedModules: ({ menuList }) => {
      if (menuList.length) {
        const mods = menuList.reduce((modules, menu) => {
          const { children } = menu;
          if (children) {
            children.forEach((c) => {
              if (c.children) {
                const m = c.children.map((item) => item.component);
                modules = [
                  ...modules,
                  ...m,
                ];
              }
            });
          }
          return modules;
        }, []);
        return mods;
      }
      return [];
    },
    isAppProvisioned: (_, { getProvisionedModules }) => (appName) => {
      let isProvisioned = false;
      if (getProvisionedModules) {
        isProvisioned = getProvisionedModules.includes(appName);
      }
      return isProvisioned;
    },
    filterHiddenMenu: (_, getters) => (menus) => {
      const menuList = menus.map((node) => ({ ...node })).filter((node) => {
        node.children = node.children && getters.filterHiddenMenu(node.children);
        return !node.hidden;
      });
      // console.log(menuList, 'menuList');
      return menuList;
    },
  },
});
