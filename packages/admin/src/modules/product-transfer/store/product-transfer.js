import { set } from '@/utils/store.helper';

export default ({
  state: {
    productList: [],
    machineTypeList: [], // 设备类型
    productTransferList: [], // 设备产品流转关系列表
  },
  mutations: {
    setProductList: set('productList'),
    setMachineTypeList: set('machineTypeList'),
    setProductTransferList: set('productTransferList'),
  },
  actions: {
    // 获取设备产品关系
    async getProductTransferList({ commit }) {
      const result = await this.$basicGet('relation/list?delFlag=0');
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setProductTransferList', result.rows);
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
    // 获取设备类型
    async getMachineTypeList({ commit }) {
      const result = await this.$basicGet('type/list?delFlag=0');
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setMachineTypeList', result.rows);
      }
    },
    // 获取设备
    async getMachineList(_, typeId) {
      const result = await this.$basicGet(`device/list?typeId=${typeId}&delFlag=0`);
      if (!result) {
        return [];
      }
      return result.rows;
    },
    // 获取产品列表
    async getProductList({ commit }) {
      const result = await this.$basicGet('product/list?delFlag=0');
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setProductList', result.rows);
      }
    },
    async addProductTransfer({ commit }, payload) {
      const result = await this.$basicPost('relation/batchAdd', payload);
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
      const result = await this.$basicDelete(`relation/${ids}`);
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
      const filename = `设备产品关系_${new Date().getTime()}.xlsx`;
      const result = await this.$basicExport('relation/importTemplate', filename);
      if (!result) {
        return false;
      }
      return true;
    },
    async excelImport(_, payload) {
      const result = await this.$basicPost('relation/importData', payload);
      if (!result) {
        return false;
      }
      return true;
    },
  },
  getters: {
  },
});
