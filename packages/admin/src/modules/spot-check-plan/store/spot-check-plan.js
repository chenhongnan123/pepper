import { set } from '@/utils/store.helper';

export default ({
  state: {
    spotCheckPlanList: [], // 点检列表
    machineList: [], // 设备清单
    spotCheckDetailList: [], // 点检详情
  },
  mutations: {
    setSpotCheckPlanList: set('spotCheckPlanList'),
    setMachineList: set('machineList'),
    setSpotCheckDetailList: set('spotCheckDetailList'),
  },
  actions: {
    // 获取点检方案
    async getSpotCheckPlanList({ commit }) {
      const result = await this.$basicGet('check/list?delFlag=0');
      if (!result) {
        return;
      }
      commit('setSpotCheckPlanList', result.rows || []);
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
    async getMachineList({ commit }) {
      const result = await this.$basicGet('device/simple/list?delFlag=0');
      if (!result) {
        return;
      }
      commit('setMachineList', result.rows || []);
    },
    async updateSpotCheckPlan({ commit }, payload) {
      const result = await this.$basicPut('check', payload);
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
    async addSpotCheckPlan({ commit }, payload) {
      const result = await this.$basicPost('check', payload);
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
    async deleteSpotCheckPlan({ commit }, ids) {
      const result = await this.$basicDelete(`check/${ids}`);
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
    // 获取点检详情
    async getSpotCheckDetailList({ commit }, checkId) {
      const result = await this.$basicGet(`spotcheckdetail/list?checkId=${checkId}&delFlag=0`);
      if (!result) {
        return;
      }
      commit('setSpotCheckDetailList', result.rows || []);
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
    async updateSpotCheckDetail({ commit }, payload) {
      const result = await this.$basicPut('spotcheckdetail', payload);
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
    async addSpotCheckDetail({ commit }, payload) {
      const result = await this.$basicPost('spotcheckdetail', payload);
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
    async deleteSpotCheckDetail({ commit }, ids) {
      const result = await this.$basicDelete(`spotcheckdetail/${ids}`);
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

    // 导出文件
    async excelExport() {
      const filename = `点检方案_${new Date().getTime()}.xlsx`;
      const result = await this.$basicExport('check/importTemplate', filename);
      if (!result) {
        return false;
      }
      return true;
    },
    async excelImport(_, { append, payload }) {
      const result = await this.$basicPost(`check/importData?append=${append}`, payload);
      if (!result) {
        return false;
      }
      return true;
    },
  },
  getters: {
  },
});
