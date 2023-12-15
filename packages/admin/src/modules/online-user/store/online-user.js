import { set } from '@/utils/store.helper';

export default {
  state: {
    onlineList: [],
  },
  mutations: {
    setOnlineList: set('onlineList'),
  },
  actions: {
    async getOnlineList({ commit }) {
      const result = await this.$systemGet('online/list');
      if (!result) {
        return;
      }
      commit('setOnlineList', result.rows || []);
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
    // 强退用户
    async refundUser({ commit }, tokenIds) {
      const result = await this.$systemDelete('online/batchForceLogout', tokenIds);
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
  getters: {},
};
