import { set } from '@/utils/store.helper';

export default {
  state: {
    errorlist: [],
    errorTotalList: [],
    netErrorList: [],
  },
  mutations: {
    setErrorList: set('errorlist'),
    setErrorTotalList: set('errorTotalList'),
    setNetErrorList: set('netErrorList'),
  },
  actions: {
    async geterrorMsgList({ commit }) {
      const result = await this.$basicConfigurationPost('errorMessage/errorMsg');
      if (!result) {
        return;
      }
      const { data } = result;
      const { parameterCheckErrorList, postList, connectionErrorVoList } = data;
      if (parameterCheckErrorList || postList || connectionErrorVoList) {
        commit('setErrorList', data);
        commit(
          'setErrorTotalList',
          parameterCheckErrorList.length || postList.length
            ? parameterCheckErrorList.concat(postList).concat(connectionErrorVoList)
            : [],
        );
      }
    },
  },
  getters: {},
};
