/* eslint-disable indent */
import { set } from '@/utils/store.helper';

export default {
  state: {
    alarmList: [], // 报警列表
    bomList: [], // 设备bom列表
    parameterList: [], // 通讯参数列表
  },
  mutations: {
    setAlarmList: set('alarmList'),
    setBomList: set('bomList'),
    setParameterList: set('parameterList'),
  },
  actions: {
    // 获取报警代码列表
    async getAlarmList({ commit }) {
      const result = await this.$basicGet('code/listAlarm');
      if (!result) {
        return;
      }
      commit('setAlarmList', result.rows || []);
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
    // 获取bom列表
    async getBomList({ commit }) {
      const result = await this.$basicGet('bom/selectBomTree');
      if (!result) {
        return;
      }
      commit('setBomList', result.rows);
    },
    // 获取参数列表
    async getParameterList({ commit, rootState }, parameterDataType) {
      const { protocalList } = rootState.connectionConfiguration;
      const result = await this.$basicGet(`parameter/getAllParameterList?parameterDataType=${parameterDataType}&pageSize=10000&pageNum=1`);
      if (!result) {
        return;
      }
      const list = result.rows.map((item) => {
        const obj = {
          ...item,
          id: item.parameterId,
        };
        const protocal = protocalList.find((p) => p.value === item.connectionType);
        obj.connectionTypeName = protocal ? protocal.text : item.connectionType;
        return obj;
      });
      commit('setParameterList', list || []);
    },
    // 添加报警代码
    async addAlarm({ commit }, payload) {
      const result = await this.$basicPost('code/addBatch', payload);
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
    async editAlarm({ commit }, payload) {
      console.log(payload);
      const result = await this.$basicPut('code', payload);
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
    async deleteAlarm({ commit }, alarmCodeId) {
      const result = await this.$basicDelete(`code/${alarmCodeId}`);
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
    formatBomList: (_, getters) => (bomList) => {
      if (bomList.length === 0) {
        return [];
      }
      const list = bomList;
      for (let i = 0; i < list.length; i += 1) {
        list[i].isKeyDisabled = list[i].bomLevel === '1';
        // 处理bomName为空的情况，不然会报错
        list[i].bomName = list[i].bomName || '-';
        if (list[i].childrenBomList && list[i].childrenBomList.length > 0) {
          getters.formatBomList(list[i].childrenBomList);
        }
      }
      return list;
    },
  },
};
