import { set, toggle } from '@/utils/store.helper';

export default {
  state: {
    drawer: false,
    eventContentTypeList: [],
  },
  mutations: {
    setDrawer: set('drawer'),
    toggleDrawer: toggle('drawer'),
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
