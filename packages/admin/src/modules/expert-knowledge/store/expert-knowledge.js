import { set } from '@/utils/store.helper';
// import PepperConfig from '@/configs/pepper.config';

export default ({
  state: {
    expertKnowledgeList: [],
    expertKnowledgeTypeList: [],
    partList: [],
    attachmentList: [],
  },
  mutations: {
    setExpertKnowledgeList: set('expertKnowledgeList'),
    setExpertKnowledgeTypeList: set('expertKnowledgeTypeList'),
    setPartList: set('partList'),
    setAttachmentList: set('attachmentList'),
  },
  actions: {
    async getExpertKnowledgeList({ commit }, needAlert) {
      const result = await this.$basicGet('expertise/selectlist', 'mock1');
      if (!result) {
        return;
      }
      const list = result.rows.map((item, index) => {
        const obj = {
          ...item,
          no: index + 1,
          id: item.expertiseId,
        };
        return obj;
      });
      commit('setExpertKnowledgeList', list);
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
    async addExpertKnowledge({ commit }, payload) {
      const result = await this.$basicPost('expertise', payload, 'mock1');
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
    async updateExpertKnowledge({ commit }, payload) {
      const result = await this.$basicPut('expertise', payload, 'mock1');
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
    async deleteExpertKnowledge({ commit }, ids) {
      const result = await this.$basicDelete(`expertise/${ids}`, {}, 'mock1');
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
    async getExpertKnowledgeTypeList({ commit }, needAlert) {
      const result = await this.$systemGet('dict/data/list?dictType=expertise_type');
      if (!result) {
        return;
      }
      const list = result.rows.map((item, index) => {
        const obj = {
          ...item,
          no: index + 1,
        };
        return obj;
      });
      commit('setExpertKnowledgeTypeList', list);
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
    async addExpertKnowledgeType({ commit }, payload) {
      const result = await this.$systemPost('dict/data', payload, 'mock1');
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
    async updateExpertKnowledgeType({ commit }, payload) {
      const result = await this.$systemPut('dict/data', payload, 'mock1');
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
    async deleteExpertKnowledgeType({ commit }, ids) {
      const result = await this.$systemDelete(`dict/data/${ids}`, {}, 'mock1');
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
    async getCurExpertKnowledge(_, expertiseId) {
      const result = await this.$basicGet(`expertise/getInfoNew?expertiseId=${expertiseId}`, 'mock1');
      if (!result) {
        return {};
      }
      return result.data || {};
    },
    async getPartList({ commit }, expertiseId) {
      const result = await this.$basicGet(`parts/listInfo?expertiseId=${expertiseId}`);
      if (!result) {
        return;
      }
      const list = result.rows.map((item, index) => {
        const obj = {
          ...item,
          no: index + 1,
        };
        return obj;
      });
      commit('setPartList', list);
    },
    async getAttachmentList({ commit }, { id, docType }) {
      const result = await this.$systemGet(`relationship/list?outsideId=${id}&module=${docType}`);
      if (!result) {
        return;
      }
      const list = result.rows.map((item, index) => {
        const obj = {
          ...item,
          no: index + 1,
        };
        return obj;
      });
      commit('setAttachmentList', list);
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
    async addPart({ commit }, payload) {
      const result = await this.$basicPost('parts/addBatch', payload, 'mock1');
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
    async updatePart({ commit }, payload) {
      const result = await this.$basicPut('parts', payload, 'mock1');
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
    async deletePart({ commit }, ids) {
      const result = await this.$basicDelete(`parts/${ids}`, {}, 'mock1');
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
