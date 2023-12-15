import { set } from '@/utils/store.helper';

export default ({
  state: {
    roadmapList: [],
    roadmapDetailList: [],
    processList: [],
    productList: [],
  },
  mutations: {
    setRoadmapList: set('roadmapList'),
    setRoadmapDetailList: set('roadmapDetailList'),
    setProcessList: set('processList'),
    setProductList: set('productList'),
  },
  actions: {
    async getRoadmapList({ commit }, needAlert) {
      const result = await this.$basicGet('roadmap/list');
      if (!result) {
        return;
      }
      if (result.rows) {
        const list = result.rows.map((item, index) => {
          const obj = {
            ...item,
            id: item.roadmapId,
            no: index + 1,
          };
          return obj;
        });
        commit('setRoadmapList', list);
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
    async getRoadmapDetailList({ commit }, roadmapId) {
      const result = await this.$basicGet(`roadmapdetail/list?roadmapId=${roadmapId}`);
      if (!result) {
        return [];
      }
      if (result.rows) {
        const list = result.rows.map((item) => {
          const obj = {
            ...item,
            id: item.roadmapDetailId,
          };
          return obj;
        });
        commit('setRoadmapDetailList', list);
        return list;
      }
      return [];
    },
    async getProcessList({ commit }) {
      const result = await this.$basicGet('process/list?delFlag=0');
      if (!result) {
        return;
      }
      commit('setProcessList', result.rows || []);
    },
    async getProductList({ commit }) {
      const result = await this.$basicGet('product/list?delFlag=0');
      if (!result) {
        return;
      }
      commit('setProductList', result.rows || []);
    },
    async getRoadmapById(_, roadmapId) {
      const result = await this.$basicGet(`roadmap/${roadmapId}`);
      if (!result) {
        return null;
      }
      return result.data || {};
    },
    async addRoadmap({ commit }, payload) {
      const result = await this.$basicPost('roadmap', payload);
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
    async editRoadmap({ commit }, payload) {
      const result = await this.$basicPut('roadmap', payload);
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
    async activeRoadmap({ commit }, payload) {
      const result = await this.$basicSwitchStatus('roadmap/activeRoadmap', payload);
      if (!result) {
        return false;
      }
      if (result.code === 1001) {
        return result.code;
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
    async deleteRoadmap({ commit }, roadmapIds) {
      const result = await this.$basicDelete(`roadmap/${roadmapIds}`, {});
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
    async updateRoadmapDetail({ commit }, { roadmapId, payload }) {
      const result = await this.$basicPost(`roadmapdetail/batchUpdate/${roadmapId}`, payload);
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
