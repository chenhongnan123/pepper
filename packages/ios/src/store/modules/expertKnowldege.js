import { set } from '@/utils/helper';

export default {
  state: {
    errorCodeList: [],
  },
  mutations: {
    setErrorCodeList: set('errorCodeList'),
  },
  actions: {
    // 获取故障代码列表
    async getErrorCodeList({ commit }) {
      const result = await this.$basicGet('code/listAlarm');
      if (!result) {
        return;
      }
      const { rows } = result;
      commit('setErrorCodeList', rows || []);
    },
    // 获取专家经验详情
    async getExpertKnowledgeDetail(_, expertiseId) {
      const result = await this.$basicGet(`expertise/getInfoNew?expertiseId=${expertiseId}`);
      if (!result) {
        return {};
      }
      const { data } = result;
      if (data) {
        return data;
      }
      return {};
    },
    // 获取专家经验附件列表
    async getAttachmentList(_, { module, id }) {
      const url = `relationship/list?outsideId=${id}&module=${module}`;
      const result = await this.$systemGet(url);
      if (!result) {
        return [];
      }
      const { rows } = result;
      if (rows.length) {
        const list = rows.map((item, index) => {
          const obj = {
            ...item,
            no: index + 1,
          };
          return obj;
        });
        return list;
      }
      return [];
    },
    // 获取专家经验零件列表
    async getExpertPartList(_, expertiseId) {
      const result = await this.$basicGet(`parts/listInfo?expertiseId=${expertiseId}`);
      if (!result) {
        return [];
      }
      const { rows } = result;
      if (rows.length) {
        const list = rows.map((item, index) => {
          const obj = {
            ...item,
            no: index + 1,
          };
          return obj;
        });
        return list;
      }
      return [];
    },
  },
};
