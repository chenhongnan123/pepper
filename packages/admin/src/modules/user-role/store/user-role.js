import { set } from '@/utils/store.helper';
// import PepperConfig from '@/configs/pepper.config';

export default ({
  state: {
    curRole: {},
    roleList: [],
    userList: [],
    roleMenuList: [],
    roleTypeList: [],
  },
  mutations: {
    setCurRole: set('curRole'),
    setRoleList: set('roleList'),
    setUserList: set('userList'),
    setRoleMenuList: set('roleMenuList'),
    setRoleTypeList: set('roleTypeList'),
  },
  actions: {
    async getRoleDetail({ commit, dispatch }, roleId) {
      await dispatch('getRoleTypeList');
      const result = await this.$systemGet(`role/roleDetail/${roleId}`);
      if (!result) {
        return;
      }
      const { data } = result;

      if (data && data.length) {
        commit('setCurRole', data[0]);
      } else {
        commit('setCurRole', {});
      }
    },
    async getRoleList({ commit, dispatch }, needAlert) {
      await dispatch('getRoleTypeList');
      const result = await this.$systemPost('role/getRoleList', {}, 'mock1');
      if (!result) {
        return;
      }
      const list = result.data.map((item, index) => {
        const obj = {
          ...item,
          no: index + 1,
        };
        return obj;
      });
      commit('setRoleList', list);
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
    async getUserList({ commit }) {
      const result = await this.$systemPost('user/getUserList', {}, 'mock1');
      if (!result) {
        return;
      }
      const list = result.data.map((item, index) => {
        const obj = {
          ...item,
          no: index + 1,
        };
        return obj;
      });
      commit('setUserList', list);
      commit(
        'helper/setAlert',
        {
          show: true,
          type: 'success',
          message: 'successAction',
        },
        { root: true },
      );
    },
    async getRoleMenuList({ commit }, roleId) {
      const result = await this.$systemPost('menu/getRoleMenuTree', { id: roleId }, 'mock1');
      if (!result) {
        return;
      }
      const { data } = result;
      // console.log('roleId', roleId);
      // const data = PepperConfig.getMenuByType();
      commit('setRoleMenuList', data);
      commit(
        'helper/setAlert',
        {
          show: true,
          type: 'success',
          message: 'successAction',
        },
        { root: true },
      );
    },
    async handleRole({ commit }, { action, payload }) {
      const result = await this.$systemPost(`role/${action}Role`, payload, 'mock1');
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
    async saveUser({ commit }, payload) {
      const result = await this.$systemPost('user/saveUser', payload, 'mock1');
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
      const result = await this.$systemPost('user/updateUser', payload, 'mock1');
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
    async deleteUser({ commit }, payload) {
      const result = await this.$systemPost('user/removeUserByIds', payload, 'mock1');
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
    async updateUserStatus({ commit }, { payload }) {
      const result = await this.$systemPost('user/updateStatus', payload, 'mock1');
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
    async resetPassword({ commit }, payload) {
      const result = await this.$systemPost('user/resetPassword', payload, 'mock1');
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
    async updateRoleMenu({ commit }, payload) {
      const result = await this.$systemPost('menu/updateRoleMenu', payload, 'mock1');
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
    async getRoleTypeList({ commit }) {
      const result = await this.$systemGet('dict/getDictList/roleType', '');
      if (!result) {
        return;
      }
      const { data } = result;
      commit('setRoleTypeList', data);
    },
  },
});
