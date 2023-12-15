/* eslint-disable no-useless-escape */
import { set } from '@/utils/store.helper';

export default {
  state: {
    eaLogList: [],
    machineList: [],
    eaLogInfo: {},
    eventList: [],
  },
  mutations: {
    setEaLogList: set('eaLogList'),
    setMachineList: set('machineList'),
    setEaLogInfo: set('eaLogInfo'),
    setEventList: set('eventList'),
  },
  actions: {
    async getEaLogInfo({ commit }, logId) {
      const result = await this.$basicGet(`ealogdetail/list?logId=${logId}&delFlag=0`);
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setEaLogInfo', result.rows[0]);
      }
    },
    async getMachineList({ commit }) {
      const result = await this.$basicGet('device/simple/list?delFlag=0');
      if (!result) {
        return;
      }
      commit('setMachineList', result.rows);
    },
    async getEventList({ commit }) {
      const result = await this.$basicGet('ealog/eventList');
      if (!result) {
        return;
      }
      commit('setEventList', result.data);
    },
  },
  getters: {},
};
