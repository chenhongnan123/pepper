import { set } from '@/utils/store.helper';

export default ({
  state: {
    workshopList: [],
  },
  mutations: {
    setWorkshopList: set('workshopList'),
  },
  actions: {
    async getWorkshopList({ commit }) {
      const result = await this.$basicGet('workshop/list?delFlag=0');
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setWorkshopList', result.rows);
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
    async addWorkshop({ commit }, payload) {
      const result = await this.$basicPost('workshop', payload);
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
    async editWorkshop({ commit }, payload) {
      const result = await this.$basicPut('workshop', payload);
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
    async deleteWorkshop({ commit }, ids) {
      const result = await this.$basicDelete(`workshop/${ids}`);
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
      const filename = `车间_${new Date().getTime()}.xlsx`;
      const result = await this.$basicExport('workshop/importTemplate', filename);
      if (!result) {
        return false;
      }
      return true;
    },
    async excelImport(_, payload) {
      const result = await this.$basicPost('/workshop/importData', payload);
      if (!result) {
        return false;
      }
      return true;
    },
  },
  getters: {
  },
});
