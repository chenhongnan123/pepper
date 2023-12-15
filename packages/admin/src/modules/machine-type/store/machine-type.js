import { set } from '@/utils/store.helper';

export default ({
  state: {
    machineTypeList: [],
    dictDataList: [],
    workshopList: [],
  },
  mutations: {
    setMachineTypeList: set('machineTypeList'),
    setDictDataList: set('dictDataList'),
    setWorkshopList: set('workshopList'),
  },
  actions: {
    async getMachineTypeList({ commit }) {
      const result = await this.$basicGet('type/list?delFlag=0');
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setMachineTypeList', result.rows);
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
    async getWorkshopList({ commit }) {
      const result = await this.$basicGet('workshop/list?delFlag=0');
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setWorkshopList', result.rows);
      }
    },
    async getDictDataList({ commit }, dictType) {
      const result = await this.$systemGet(`dict/data/list?dictType=${dictType}`);
      if (!result) {
        return;
      }
      commit('setDictDataList', result.rows || []);
    },
    async addMachineType({ commit }, payload) {
      const result = await this.$basicPost('type', payload);
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
    async editMachineType({ commit }, payload) {
      const result = await this.$basicPut('type', payload);
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
    async deleteMachineType({ commit }, ids) {
      const result = await this.$basicDelete(`type/${ids}`);
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
      const filename = `设备类型_${new Date().getTime()}.xlsx`;
      const result = await this.$basicExport('type/importTemplate', filename);
      if (!result) {
        return false;
      }
      return true;
    },
    async excelImport(_, payload) {
      const result = await this.$basicPost('/type/importData', payload);
      if (!result) {
        return false;
      }
      return true;
    },
  },
  getters: {
  },
});
