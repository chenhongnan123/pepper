import { set } from '@/utils/store.helper';

export default ({
  state: {
    productList: [],
  },
  mutations: {
    setProductList: set('productList'),
  },
  actions: {
    async getProductList({ commit }) {
      const result = await this.$basicGet('product/list?delFlag=0');
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setProductList', result.rows);
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
    async addProduct({ commit }, payload) {
      const result = await this.$basicPost('product', payload);
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
    async editProduct({ commit }, payload) {
      const result = await this.$basicPut('product', payload);
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
    async deleteProduct({ commit }, ids) {
      const result = await this.$basicDelete(`product/${ids}`);
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
      const filename = `产品_${new Date().getTime()}.xlsx`;
      const result = await this.$basicExport('product/importTemplate', filename);
      if (!result) {
        return false;
      }
      return true;
    },
    async excelImport(_, payload) {
      const result = await this.$basicPost('/product/importData', payload);
      if (!result) {
        return false;
      }
      return true;
    },
  },
  getters: {
  },
});
