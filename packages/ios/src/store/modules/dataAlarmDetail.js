import { set } from '@/utils/helper';

export default {
  state: {
    modelDetail: {}, // 算法模型详情，即事件详情
    monitorRecordList: [], // 监测记录列表
  },
  mutations: {
    setModelDetail: set('modelDetail'),
    setMonitorRecordList: set('monitorRecordList'),
  },
  actions: {
    // 获取设备详情
    async getModelDetail({ commit }, modelId) {
      const result = await this.$basicGet(`model/alarm/${modelId}`);
      if (!result) {
        return;
      }
      const { data } = result;
      commit('setModelDetail', data || {});
    },
    // 获取监测记录列表
    async getMonitorRecordList({ commit }, eventId) {
      const result = await this.$basicGet(`record/list?dealFlag=0&eventId=${eventId}`);
      if (!result) {
        return;
      }
      const { rows } = result;
      commit('setMonitorRecordList', rows || []);
    },
    // 消除数据告警
    async dealAlarm(_, id) {
      const payload = {
        id,
        dealFlag: '1', // 1-已处理，0-未处理
      };
      const result = await this.$basicPut('record', payload);
      if (!result) {
        return false;
      }
      return true;
    },
    // 定制算法试运行
    async runModel(_, payload) {
      const { data } = await this.$spcPost('spc/custom/running', payload);
      return data;
    },
  },
};
