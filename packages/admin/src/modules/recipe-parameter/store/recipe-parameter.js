import { set } from '@/utils/store.helper';
import ApiService from '@/services/api.service';

export default ({
  state: {
    recipeTableList: [], // 通讯参数格列表
  },
  mutations: {
    setRecipeTableList: set('recipeTableList'),
  },
  actions: {
    // 获取配方列表 recipeType=0坠头 1烧结配方
    async getParameterList(_, recipeType) {
      const result = await this.$basicGet(`parameter/list?recipeType=${recipeType}&delFlag=0`);
      if (!result) {
        return [];
      }
      return result.rows;
    },
    // 通讯参数格列表
    async getRecipeTableList({ commit }) {
      const result = await this.$basicGet('table/list?delFlag=0');
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setRecipeTableList', result.rows);
      }
    },
    async getFileJson({ commit }, fileName) {
      const { data } = await ApiService.get(`/${fileName}`);
      if (!data) {
        commit(
          'helper/setAlert',
          {
            show: true,
            type: 'error',
            message: 'SERVERERROR',
          },
          { root: true },
        );
        return false;
      }
      return data.data;
    },
    async addParameter({ commit }, payload) {
      const result = await this.$basicPost('parameter', payload);
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
    async editParameter({ commit }, payload) {
      const result = await this.$basicPut('parameter', payload);
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
    async deleteParameter({ commit }, ids) {
      const result = await this.$basicDelete(`parameter/${ids}`);
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
