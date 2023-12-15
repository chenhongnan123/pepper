import { set } from '@/utils/store.helper';

export default ({
  state: {
    departmentList: [],
    statusList: [],
    deptTypeList: [
      {
        text: 'group',
        value: '0',
      },
      {
        text: 'company',
        value: '1',
      },
      {
        text: 'dept',
        value: '2',
      },
    ],
  },
  mutations: {
    setDepartmentList: set('departmentList'),
    setStatusList: set('statusList'),
  },
  actions: {
    async getDepartmentList({ commit, getters }, needAlert) {
      const result = await this.$systemGet('/dept/list');
      if (!result) {
        return;
      }
      commit('setDepartmentList', result.data || []);
      if (result.data && result.data.length) {
        const list = result.data.map((item) => {
          const deptIdInTree = getters.deptIdInTree(item);
          const obj = {
            ...item,
            deptIdInTree,
            id: item.deptId,
          };
          return obj;
        });
        commit('setDepartmentList', list);
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
    async getStatusList({ commit }) {
      const result = await this.$systemGet('dict/data/type/sys_normal_disable');
      if (!result) {
        return;
      }
      commit('setStatusList', result.data || []);
    },
    async getDeptById(_, deptId) {
      const result = await this.$systemGet(`dept/${deptId}`);
      if (!result) {
        return null;
      }
      return result.data;
    },
    async addDept({ commit }, payload) {
      const result = await this.$systemPost('dept', payload);
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
    async editDept({ commit }, payload) {
      const result = await this.$systemPut('dept', payload);
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
    async deleteDept({ commit }, deptId) {
      const result = await this.$systemDelete(`dept/${deptId}`, {});
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
    deptIdInTree: ({ departmentList }, getters) => (curDept) => {
      const dataPath = [];
      const parentMenu = departmentList.find((dept) => dept.deptId === curDept.parentId);
      if (parentMenu) {
        dataPath.push(...[...getters.deptIdInTree(parentMenu), curDept.deptId]);
      } else {
        dataPath.push(curDept.deptId);
      }
      return dataPath;
    },
  },
});
