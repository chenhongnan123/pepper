/* eslint-disable no-useless-escape */
import { set } from '@/utils/store.helper';

export default {
  state: {
    machineList: [],
    recipeVersionList: [],
    recipeLogInfo: [],
  },
  mutations: {
    setMachineList: set('machineList'),
    setRecipeVersionList: set('recipeVersionList'),
    setRecipeLogInfo: set('recipeLogInfo'),
  },
  actions: {
    async getRecipeLogInfo({ commit }, recipeLogId) {
      const result = await this.$basicGet(`recipelogdetail/list?recipeLogId=${recipeLogId}&delFlag=0`);
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setRecipeLogInfo', result.rows[0]);
      }
    },
    async getMachineList({ commit }) {
      const result = await this.$basicGet('device/simple/list?delFlag=0');
      if (!result) {
        return;
      }
      commit('setMachineList', result.rows);
    },
    async getRecipeVersionList({ commit }, deviceId) {
      const result = await this.$basicGet(`recipe/list?deviceId=${deviceId}&recipeType=1`);
      if (!result) {
        return;
      }
      commit('setRecipeVersionList', result.rows);
    },
  },
  getters: {},
};
