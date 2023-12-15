import { set } from '@/utils/store.helper';

export default {
  state: {
    spotCheckPlanList: [], // 点检列表
    machineList: [], // 设备清单
    monitorRecordList: [], // 监控记录
    monitorRecordListTotal: 0, // 监控记录总条数
  },
  mutations: {
    setSpotCheckPlanList: set('spotCheckPlanList'),
    setMachineList: set('machineList'),
    setMonitorRecordList: set('monitorRecordList'),
    setMonitorRecordListTotal: set('monitorRecordListTotal'),
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
    async getmonitorRecordList({ commit }, payload) {
      const result = await this.$basicGet(`record/list/?${payload}`);
      if (!result) {
        commit('setMonitorRecordList', []);
        commit('setMonitorRecordListTotal', 0);
        return;
      }
      commit('setMonitorRecordList', result.rows || []);
      commit('setMonitorRecordListTotal', result.total);
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
};
