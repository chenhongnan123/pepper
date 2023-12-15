import { set } from '@/utils/store.helper';

export default ({
  state: {
    parameterList: [],
  },
  mutations: {
    setParameterList: set('parameterList'),
  },
  actions: {
    async getParameterList({ commit }) {
      const result = await this.$systemGet('config/list');
      if (!result) {
        return;
      }
      commit('setParameterList', result.rows || []);
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
    async addParameter({ commit }, payload) {
      const result = await this.$systemPost('config', payload);
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
    async editParameter({ commit }, payload) {
      const result = await this.$systemPut('config', payload);
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
    async deleteParameter({ commit }, parameterIds) {
      const result = await this.$systemDelete(`config/${parameterIds}`, {});
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
