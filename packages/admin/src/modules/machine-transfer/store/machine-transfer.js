import { set } from '@/utils/store.helper';

export default ({
  state: {
    productList: [],
    machineTypeList: [], // 设备类型
    machineTransferList: [], // 设备流转关系列表
  },
  mutations: {
    setProductList: set('productList'),
    setMachineTypeList: set('machineTypeList'),
    setMachineTransferList: set('machineTransferList'),
  },
  actions: {
    async getMachineTransferList({ commit }) {
      const result = await this.$basicGet('transfer/list?delFlag=0');
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setMachineTransferList', result.rows);
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
    async getMachineTypeList({ commit }) {
      const result = await this.$basicGet('type/list?delFlag=0');
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setMachineTypeList', result.rows);
      }
    },
    async getMachineList(_, typeId) {
      const result = await this.$basicGet(`device/list?typeId=${typeId}&delFlag=0`);
      if (!result) {
        return [];
      }
      return result.rows;
    },
    async addMachineTransfer({ commit }, payload) {
      const result = await this.$basicPost('transfer', payload);
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
    async deleteTransfer({ commit }, ids) {
      const result = await this.$basicDelete(`transfer/${ids}`);
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
      const filename = `设备流转关系_${new Date().getTime()}.xlsx`;
      const result = await this.$basicExport('transfer/importTemplate', filename);
      if (!result) {
        return false;
      }
      return true;
    },
    async excelImport(_, payload) {
      const result = await this.$basicPost('/transfer/importData', payload);
      if (!result) {
        return false;
      }
      return true;
    },
  },
  getters: {
  },
});
