import { set } from '@/utils/store.helper';

export default ({
  state: {
    checkResultList: [], // 点检结果列表
    checkResultDetailList: [], // 点检结果详情
  },
  mutations: {
    setCheckResultList: set('checkResultList'),
    setCheckResultDetailList: set('checkResultDetailList'),
  },
  actions: {
    // 获取点检结果
    async getCheckResultList({ commit }, dateArr) {
      const [beginTime, endTime] = dateArr;
      const result = await this.$basicGet(
        `spotcheckresult/list?beginTime=${beginTime}&endTime=${endTime}&delFlag=0`,
      );
      if (!result) {
        return;
      }
      commit('setCheckResultList', result.rows || []);
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
    // 获取点检结果详情
    async getSpotCheckDetailList({ commit }, checkResultId) {
      const result = await this.$basicGet(`result/list?checkResultId=${checkResultId}&delFlag=0`);
      if (!result) {
        return;
      }
      commit('setCheckResultDetailList', result.rows || []);
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
  },
  getters: {},
});
