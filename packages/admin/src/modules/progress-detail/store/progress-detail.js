import { set } from '@/utils/store.helper';

export default ({
  state: {
    progressList: [],
  },
  mutations: {
    setProgressList: set('progressList'),
  },
  actions: {
    async getProgressList({ commit }, needAlert) {
      const result = await this.$basicGet('progress/list?workInProgressStatus="1"');
      if (!result) {
        return;
      }
      if (result.rows) {
        const list = result.rows.map((item) => {
          const obj = {
            ...item,
            id: item.workInProgressId,
          };
          return obj;
        });
        commit('setProgressList', list);
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
    async updateProgress({ commit }, payload) {
      const result = await this.$basicPut('progress', payload);
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
