import { set } from '@/utils/store.helper';

export default ({
  state: {
    roleList: [],
    deptTree: [],
    menuTree: [],
    assginUserList: [],
    unAssginUserList: [],
    statusList: [],
    dataScopeList: [
      {
        text: '1',
        value: '1',
      },
      {
        text: '2',
        value: '2',
      },
      {
        text: '3',
        value: '3',
      },
      {
        text: '4',
        value: '4',
      },
      {
        text: '5',
        value: '5',
      },
    ],
  },
  mutations: {
    setRoleList: set('roleList'),
    setDeptTree: set('deptTree'),
    setMenuTree: set('menuTree'),
    setAssginUserList: set('assginUserList'),
    setUnAssginUserList: set('unAssginUserList'),
    setStatusList: set('statusList'),
  },
  actions: {
    async getRoleList({ commit }, needAlert) {
      const result = await this.$systemGet('role/list');
      if (!result) {
        return;
      }
      if (result.rows) {
        const list = result.rows.map((item, index) => {
          const obj = {
            ...item,
            id: item.roleId,
            no: index + 1,
          };
          return obj;
        });
        commit('setRoleList', list);
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
    async getAssginUserList({ commit }, roleId) {
      const result = await this.$systemGet(`role/authUser/allocatedList?roleId=${roleId}`);
      if (!result) {
        return;
      }
      if (result.rows) {
        const list = result.rows.map((item, index) => {
          const obj = {
            ...item,
            id: item.userId,
            no: index + 1,
          };
          return obj;
        });
        commit('setAssginUserList', list);
      }
    },
    async getUnAssginUserList({ commit }, roleId) {
      const result = await this.$systemGet(`role/authUser/unallocatedList?roleId=${roleId}`);
      if (!result) {
        return;
      }
      if (result.rows) {
        const list = result.rows.map((item, index) => {
          const obj = {
            ...item,
            id: item.userId,
            no: index + 1,
          };
          return obj;
        });
        commit('setUnAssginUserList', list);
      }
    },
    async getStatusList({ commit }) {
      const result = await this.$systemGet('dict/data/type/sys_normal_disable');
      if (!result) {
        return;
      }
      commit('setStatusList', result.data || []);
    },
    async getRoleById(_, roleId) {
      const result = await this.$systemGet(`role/${roleId}`);
      if (!result) {
        return null;
      }
      return result.data;
    },
    async getDeptTree({ commit }, roleId) {
      const result = await this.$systemGet(`role/deptTree/${roleId}`);
      if (!result) {
        return null;
      }
      const { checkedKeys, depts } = result;
      commit('setDeptTree', depts);
      return checkedKeys || [];
    },
    async getMenuTree({ commit }, roleId) {
      let result = null;
      if (roleId) {
        result = await this.$systemGet(`menu/roleMenuTreeselect/${roleId}`);
      } else {
        result = await this.$systemGet('menu/treeselect');
      }
      if (!result) {
        return null;
      }
      if (roleId) {
        const { checkedKeys, menus } = result;
        commit('setMenuTree', menus);
        return checkedKeys;
      }
      commit('setMenuTree', result.data);
      return [];
    },
    async addRole({ commit }, payload) {
      const result = await this.$systemPost('role', payload);
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
    async editRole({ commit }, payload) {
      const result = await this.$systemPut('role', payload);
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
    async editDataScope({ commit }, payload) {
      const result = await this.$systemPut('role/dataScope', payload);
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
    async changeStatus({ commit }, payload) {
      const result = await this.$systemPut('role/changeStatus', payload);
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
    async deleteRole({ commit }, roleId) {
      const result = await this.$systemDelete(`role/${roleId}`, {});
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
    // 导出文件
    async excelExport() {
      const filename = `role_${new Date().getTime()}.xlsx`;
      const result = await this.$systemExport('role/export', filename);
      if (!result) {
        return false;
      }
      return true;
    },
    async cancelAuthUser({ commit }, { roleId, userIds }) {
      const result = await this.$systemPut(`role/authUser/cancelAll?roleId=${roleId}&userIds=${userIds}`, {});
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
    async selectAuthUser({ commit }, { roleId, userIds }) {
      const result = await this.$systemPut(`role/authUser/selectAll?roleId=${roleId}&userIds=${userIds}`, {});
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
  },
});
