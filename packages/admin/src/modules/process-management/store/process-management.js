import { set } from '@/utils/store.helper';

export default ({
  state: {
    processList: [],
  },
  mutations: {
    setProcessList: set('processList'),
  },
  actions: {
    async getProcessList({ commit }) {
      const result = await this.$basicGet('process/list?delFlag=0');
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setProcessList', result.rows);
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
    },
    async addProcess({ commit }, payload) {
      const result = await this.$basicPost('process', payload);
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
    async editProcess({ commit }, payload) {
      const result = await this.$basicPut('process', payload);
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
    async deleteProcess({ commit }, ids) {
      const result = await this.$basicDelete(`process/${ids}`);
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
      const filename = `工序_${new Date().getTime()}.xlsx`;
      const result = await this.$basicExport('process/importTemplate', filename);
      if (!result) {
        return false;
      }
      return true;
    },
    async excelImport(_, payload) {
      const result = await this.$basicPost('/process/importData', payload);
      if (!result) {
        return false;
      }
      return true;
    },
  },
  getters: {
  },
});
