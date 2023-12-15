import { set } from '@/utils/store.helper';

export default {
  state: {
    eventContentTypeList: [],
  },
  mutations: {
    setEventContentTypeList: set('eventContentTypeList'),
  },
  actions: {
    async getEventContentTypeList({ commit }, dictType) {
      const result = await this.$systemGet(`dict/data/list?dictType=${dictType}`);
      if (!result) {
        return;
      }
      commit('setEventContentTypeList', result.rows || []);
    },
  },
};
