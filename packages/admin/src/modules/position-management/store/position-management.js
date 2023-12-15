import { set } from '@/utils/store.helper';

export default ({
  state: {
    positionList: [], // 岗位列表
  },
  mutations: {
    setPositionList: set('positionList'),
  },
  actions: {
    async getPositionList({ commit }) {
      const result = await this.$systemGet('/post/list');
      if (!result) {
        return false;
      }
      const { rows } = result;
      if (rows?.length) {
        const list = rows.sort((a, b) => Number(a.postSort) - Number(b.postSort))
          .map((item) => {
            const obj = {
              ...item,
              id: item.postId,
            };
            return obj;
          });
        commit('setPositionList', list);
      } else {
        commit('setPositionList', []);
      }
      return true;
    },
    async updatePosition({ commit }, payload) {
      const result = await this.$systemPut('/post', payload);
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
    async addPosition({ commit }, payload) {
      const result = await this.$systemPost('/post', payload);
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
    async delPosition(_, ids) {
      const result = await this.$systemDelete(`/post/${ids}`);
      if (!result) {
        return false;
      }
      return true;
    },
    async excelExport() {
      const filename = `position_${new Date().getTime()}.xlsx`;
      const result = await this.$systemExport('/post/export', filename);
      if (!result) {
        return false;
      }
      return true;
    },
  },
});
