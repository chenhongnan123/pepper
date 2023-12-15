import { set } from '@/utils/helper';

export default {
  state: {
    partTypeList: [],
  },
  mutations: {
    setPartTypeList: set('partTypeList'),
  },
  actions: {
    // 获取设备BOM信息
    async getDeviceBomInfo() {
      const result = await this.$basicGet('common/getRedisByName?keyName=bomHealth');
      if (!result) {
        return [];
      }
      return result.data;
    },
    // 获取设备健康指数
    async getDeviceHealthInfo() {
      const result = await this.$basicGet('common/getRedisByName?keyName=partHealth');
      if (!result) {
        return [];
      }
      return result.data;
    },
    async getFirstBomList() {
      const result = await this.$basicGet('bom/firstFloorlist');
      if (!result) {
        return [];
      }
      return result.rows;
    },
    async getNextBomList(_, bomId) {
      const result = await this.$basicGet(`bom/selectNextLevelListByBomId?bomId=${bomId}`);
      if (!result) {
        return [];
      }
      return result.rows;
    },
    // 获取零件的类型
    async getPartTypeList({ commit }, dictType) {
      const result = await this.$systemGet(`dict/data/list?dictType=${dictType}`);
      if (!result) {
        return;
      }
      commit('setPartTypeList', result.rows || []);
    },
    // 获取邻家更换列表
    async getReplacePartList(_, bomId) {
      const result = await this.$basicGet(`replacement_parts/list?bomId=${bomId}`);
      if (!result) {
        return [];
      }
      return result.rows;
    },
    async addReplacePart(_, payload) {
      const result = await this.$basicPost('replacement_parts/batch_add', payload);
      if (!result) {
        return false;
      }
      return true;
    },
  },
};
