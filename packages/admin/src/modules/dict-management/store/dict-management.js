import { set } from '@/utils/store.helper';

export default ({
  state: {
    dictTypeList: [], // 字典类型
    dictDataList: [], // 字典数据
  },
  mutations: {
    setDictTypeList: set('dictTypeList'),
    setDictDataList: set('dictDataList'),
  },
  actions: {
    // 字典类型
    async getDictTypeList({ commit }) {
      const result = await this.$systemGet('dict/type/list');
      if (!result) {
        return;
      }
      commit('setDictTypeList', result.rows || []);
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
    async updateDictType({ commit }, payload) {
      const result = await this.$systemPut('dict/type', payload);
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
    async addDictType({ commit }, payload) {
      const result = await this.$systemPost('dict/type', payload);
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
    async deleteDictType({ commit }, parameterIds) {
      const result = await this.$systemDelete(`dict/type/${parameterIds}`);
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
    // 字典数据
    async getDictDataList({ commit }, dictType) {
      const result = await this.$systemGet(`dict/data/list?dictType=${dictType}`);
      if (!result) {
        return;
      }
      commit('setDictDataList', result.rows || []);
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
    async addDictData({ commit }, payload) {
      const result = await this.$systemPost('dict/data', payload);
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
    async updateDictData({ commit }, payload) {
      const result = await this.$systemPut('dict/data', payload);
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
    async deleteDictData({ commit }, parameterIds) {
      const result = await this.$systemDelete(`dict/data/${parameterIds}`);
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
