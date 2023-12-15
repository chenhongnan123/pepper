// import { set } from '@/utils/store.helper';

export default ({
  state: {
  },
  mutations: {
  },
  actions: {
    async uploadFile(_, payload) {
      const result = await this.$fileUpload(payload);
      if (!result) {
        return false;
      }
      return result.data;
    },
    async createFile({ commit }, payload) {
      // const result = await this.$systemPost('file/createFile', payload, 'mock1');
      const result = await this.$systemPost('relationship/addbatch', payload);
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
    async deleteFile({ commit }, relationshipIds) {
      const result = await this.$systemDelete(`relationship/${relationshipIds}`, {});
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
