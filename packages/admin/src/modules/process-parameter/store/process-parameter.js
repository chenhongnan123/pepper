import { set } from '@/utils/store.helper';

export default ({
  state: {
    parameterList: [],
    productList: [],
    processList: [],
  },
  mutations: {
    setParameterList: set('parameterList'),
    setProductList: set('productList'),
    setProcessList: set('processList'),
  },
  actions: {
    async getParameterList({ commit }, needAlert) {
      const result = await this.$basicGet('param/list');
      if (!result) {
        return;
      }
      if (result.rows) {
        const list = result.rows.map((item) => {
          const obj = {
            ...item,
            id: item.processParamId,
          };
          return obj;
        });
        commit('setParameterList', list);
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
    async getProductList({ commit }) {
      const result = await this.$basicGet('product/list?delFlag=0');
      if (!result) {
        return;
      }
      commit('setProductList', result.rows || []);
    },
    async getProcessList({ commit }) {
      const result = await this.$basicGet('process/list?delFlag=0');
      if (!result) {
        return;
      }
      commit('setProcessList', result.rows || []);
    },
    async addProcessParam({ commit }, payload) {
      const result = await this.$basicPost('param', payload);
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
    async editProcessParam({ commit }, payload) {
      const result = await this.$basicPut('param', payload);
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
    async deleteProcessParam({ commit }, processParamIds) {
      const result = await this.$basicDelete(`param/${processParamIds}`, {});
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
    async excelExport(_, filename) {
      console.log(filename, 'filename');
      const result = await this.$basicExport('param/importTemplate', filename);
      if (!result) {
        return false;
      }
      return true;
    },
    async excelImport(_, payload) {
      const result = await this.$basicPost('param/importData', payload);
      if (!result) {
        return false;
      }
      return true;
    },
  },
  getters: {
  },
});
