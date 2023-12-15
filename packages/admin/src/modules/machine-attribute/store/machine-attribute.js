import { set } from '@/utils/store.helper';

export default ({
  state: {
    machineAttributeList: [], // 设备属性
    transportList: [], // 行车信息
    processList: [], // 工序信息
    machineTypeList: [], // 设备属性
  },
  mutations: {
    setMachineAttributeList: set('machineAttributeList'),
    setProcessList: set('processList'),
    setTransportList: set('transportList'),
    setMachineTypeList: set('machineTypeList'),
  },
  actions: {
    async getMachineAttributeList({ commit }) {
      const result = await this.$basicGet('attribute/list?delFlag=0');
      if (!result) {
        return;
      }
      if (result) {
        commit('setMachineAttributeList', result.rows || []);
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
    async getTansportList({ commit }) {
      const result = await this.$basicGet('transport/list?delFlag=0');
      if (!result) {
        return false;
      }
      if (result.rows) {
        commit('setTransportList', result.rows);
      }
      return true;
    },
    async getProcessList({ commit }) {
      const result = await this.$basicGet('process/list?delFlag=0');
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setProcessList', result.rows);
      }
    },
    async getMachineTypeList({ commit }) {
      const result = await this.$basicGet('type/list?delFlag=0');
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setMachineTypeList', result.rows);
      }
    },
    async addMachineAttribute({ commit }, payload) {
      const result = await this.$basicPost('attribute', payload);
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
    async editMachineAttribute({ commit }, payload) {
      const result = await this.$basicPut('attribute', payload);
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
    async deleteMachineAttribute({ commit }, ids) {
      const result = await this.$basicDelete(`attribute/${ids}`);
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
      const filename = `设备属性_${new Date().getTime()}.xlsx`;
      const result = await this.$basicExport('attribute/importTemplate', filename);
      if (!result) {
        return false;
      }
      return true;
    },
    async excelImport(_, payload) {
      const result = await this.$basicPost('/attribute/importData', payload);
      if (!result) {
        return false;
      }
      return true;
    },
  },
  getters: {
  },
});
