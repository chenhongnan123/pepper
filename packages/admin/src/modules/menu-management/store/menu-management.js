import { set } from '@/utils/store.helper';

export default ({
  state: {
    menuList: [],
    iconList: [],
    visibleList: [],
    menuTypeList: [
      {
        text: 'module',
        value: 'B',
      },
      {
        text: 'directory',
        value: 'M',
      },
      {
        text: 'menu',
        value: 'C',
      },
      {
        text: 'button',
        value: 'F',
      },
    ],
  },
  mutations: {
    setMenuList: set('menuList'),
    setIconList: set('iconList'),
    setVisibleList: set('visibleList'),
  },
  actions: {
    async getMenuList({ commit, getters }, needAlert) {
      const result = await this.$systemGet('menu/list');
      if (!result) {
        return;
      }
      commit('setMenuList', result.data || []);
      if (result.data && result.data.length) {
        const list = result.data.map((item) => {
          const menuIdInTree = getters.menuIdInTree(item);
          const obj = {
            ...item,
            menuIdInTree,
            id: item.menuId,
          };
          return obj;
        });
        commit('setMenuList', list);
      }
      if (needAlert) {
        commit(
          'helper/setAlert',
          {
            show: true,
            type: 'success',
            message: 'successAction',
          },
          { root: true },
        );
      }
    },
    async getParentMenuList(_, payload) {
      // eslint-disable-next-line prefer-const
      let url = 'menu/list?';
      // eslint-disable-next-line
      for (const key in payload) {
        if (payload[key] != null) {
          url += `${key}=${payload[key]}&`;
        }
      }
      url = url.slice(0, -1);
      const result = await this.$systemGet(url);
      return result.data;
    },
    async getMenuById(_, menuId) {
      const result = await this.$systemGet(`menu/${menuId}`);
      if (!result) {
        return null;
      }
      return result.data;
    },
    async getIconList({ commit }) {
      const result = await this.$systemGet('dict/data/list?dictType=sys_icon');
      if (!result) {
        return;
      }
      commit('setIconList', result.rows);
    },
    async getVisibleList({ commit }) {
      const result = await this.$systemGet('dict/data/type/sys_show_hide');
      if (!result) {
        return;
      }
      commit('setVisibleList', result.data || []);
    },
    async addMenu({ commit }, payload) {
      const result = await this.$systemPost('menu', payload);
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
    async editMenu({ commit }, payload) {
      const result = await this.$systemPut('menu', payload);
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
    async deleteMenu({ commit }, menuId) {
      const result = await this.$systemDelete(`menu/${menuId}`, {});
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
  },
  getters: {
    menuIdInTree: ({ menuList }, getters) => (curMenu) => {
      const menuPath = [];
      const parentMenu = menuList.find((menu) => menu.menuId === curMenu.parentId);
      if (parentMenu) {
        menuPath.push(...[...getters.menuIdInTree(parentMenu), curMenu.menuId]);
      } else {
        menuPath.push(curMenu.menuId);
      }
      // console.log(menuPath, curMenu);
      return menuPath;
    },
  },
});
