import { set } from '@/utils/store.helper';

export default {
  state: {
    transportList: [],
    transportParamList: [],
    workshopList: [], // 车间列表
    transportInfo: null, // 当前的行车信息
  },
  mutations: {
    setTransportList: set('transportList'),
    setTransportParamList: set('transportParamList'),
    setWorkshopList: set('workshopList'),
    setTransportInfo: set('transportInfo'),
  },
  actions: {
    async getTansportList({ commit }) {
      const result = await this.$basicGet('transport/list?delFlag=0');
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setTransportList', result.rows);
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
    },
    async getTansportParamList({ commit }, { workshopId, transportName, transportNumber }) {
      const result = await this.$basicGet(
        `transport/listParam/?workshopId=${workshopId}&transportName=${transportName}&transportNumber=${transportNumber}`,
      );
      // const result = {};
      // result.rows = [
      //   {
      //     onlineStatus: '0',
      //     parameterName: '参数名称001',
      //     parameterNumber: '标签',
      //     categoryName: '参数类型',
      //     parameterValue: '参数值',
      //   },
      //   {
      //     onlineStatus: '1',
      //     parameterName: '参数名称002',
      //     parameterNumber: '标签',
      //     categoryName: '参数类型',
      //     parameterValue: '参数值',
      //   },
      // ];
      if (!result) {
        return [];
      }
      if (result.rows) {
        commit('setTransportParamList', result.rows);
      }
      return result.rows;
    },
    // 获取车间
    async getWorkshopList({ commit }) {
      const result = await this.$basicGet('workshop/list?delFlag=0');
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setWorkshopList', result.rows);
      }
    },
    // 获取行车
    async getTransportInfo({ commit }, transportId) {
      const result = await this.$basicGet(`transport/${transportId}`);
      if (!result) {
        return;
      }
      console.log(result, 'result');
      if (result.data) {
        commit('setTransportInfo', result.data);
      }
    },
    async addTransport({ commit }, payload) {
      const result = await this.$basicPost('transport', payload);
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
    async editTransport({ commit }, payload) {
      const result = await this.$basicPut('transport', payload);
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
    async deleteTransport({ commit }, ids) {
      const result = await this.$basicDelete(`transport/${ids}`);
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
      const filename = `行车_${new Date().getTime()}.xlsx`;
      const result = await this.$basicExport('transport/importTemplate', filename);
      if (!result) {
        return false;
      }
      return true;
    },
    async excelImport(_, payload) {
      const result = await this.$basicPost('/transport/importData', payload);
      if (!result) {
        return false;
      }
      return true;
    },
  },
  getters: {},
};
