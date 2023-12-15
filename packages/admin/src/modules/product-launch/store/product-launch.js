import { set } from '@/utils/store.helper';

export default ({
  state: {
    progressList: [],
  },
  mutations: {
    setProgressList: set('progressList'),
  },
  actions: {
    async getProductInfo(_, dispatchNumber) {
      const result = await this.$basicGet(`progress/list?workInProgressStatus="1"&dispatchNumber="${dispatchNumber}"`);
      if (!result) {
        return {};
      }
      if (result.rows && result.rows.length) {
        return result.rows[0];
      }
      return {};
    },
    async productLaunch({ commit }, payload) {
      const result = await this.$basicPost('progress/rack', payload);
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
