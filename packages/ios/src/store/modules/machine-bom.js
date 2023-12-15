import moment from 'moment';
import { set } from '@/utils/helper';

export default ({
  state: {
    mainDevice: {}, // 主设备编码及id
    deviceFileList: [], // 设备文件列表
    machineBomList: [], // 设备BOM列表
    bomDetailList: [], // BOM列表
    partList: [], // 零件列表
    parameterList: [], // 参数列表
    partTypeList: [], // 零件类型列表
  },
  mutations: {
    setMainDevice: set('mainDevice'),
    setDeviceFileList: set('deviceFileList'),
    setMachineBomList: set('machineBomList'),
    setBomDetailList: set('bomDetailList'),
    setPartList: set('partList'),
    setParameterList: set('parameterList'),
    setPartTypeList: set('partTypeList'),
  },
  actions: {
    async getDeviceMainItem({ commit }) {
      const result = await this.$basicGet('device/list');
      if (!result) {
        return false;
      }
      const { rows } = result;
      if (rows.length) {
        commit('setMainDevice', rows[0]);
        return true;
      }
      commit('setMainDevice', {});
      return true;
    },
    async updateDevice({ commit }, payload) {
      const result = await this.$basicPut('device', payload);
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
    async getFileList({ commit }, outsideId) {
      const result = await this.$systemGet(`relationship/list?outsideId=${outsideId}&module=DeviceDoc`);
      if (!result) {
        return;
      }
      const { rows } = result;
      if (rows.length) {
        const list = rows.map((item) => {
          const obj = {
            ...item,
          };
          return obj;
        });
        commit('setDeviceFileList', list);
      } else {
        commit('setDeviceFileList', []);
      }
    },
    async getMachineBomList({ commit }) {
      const result = await this.$basicGet('bom/firstFloorlist');
      if (!result) {
        return false;
      }
      const { rows } = result;
      if (rows) {
        commit('setMachineBomList', rows);
      } else {
        commit('setMachineBomList', []);
      }
      return true;
    },
    async getBomTableList({ commit }, bomParentId) {
      const result = await this.$basicGet(`bom/selectNextLevelListByBomId?bomId=${bomParentId}`);
      if (!result) {
        commit('setBomDetailList', []);
        return false;
      }
      const { rows } = result;
      if (rows?.length) {
        commit('setBomDetailList', rows);
      } else {
        commit('setBomDetailList', []);
      }
      return true;
    },
    async addBom({ commit }, payload) {
      const result = await this.$basicPost('bom', payload);
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
    async editBom({ commit }, payload) {
      const result = await this.$basicPut('bom', payload);
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
    async deleteBom({ commit }, bomIds) {
      const result = await this.$basicDelete(`bom/removeAndCheck/${bomIds}`, {});
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
      return result;
    },
    async getPartList({ commit }) {
      const result = await this.$basicGet('part/list');
      if (!result) {
        return;
      }
      commit('setPartList', result.rows || []);
    },
    async getParameterList({ commit }) {
      const result = await this.$basicGet('parameter/getAllParameterList?pageSize=10000&pageNum=1&parameterDataType=12');
      if (!result) {
        return;
      }
      commit('setParameterList', result.rows || []);
    },
    async getPartTypeList({ commit }) {
      const result = await this.$systemGet('dict/data/list?dictType=part_type');
      if (!result) {
        return;
      }
      commit('setPartTypeList', result.rows || []);
    },
    // 导出模版
    async excelExport() {
      const filename = `模版_${moment().format('YYYY-MM-DD HH:mm:ss')}.xlsx`;
      const result = await this.$basicExport('bom/importTemplate', filename);
      if (!result) {
        return false;
      }
      return true;
    },
    async excelImport({ commit }, payload) {
      const result = await this.$basicPost('bom/import', payload);
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
    async eportSampleExcel(_, payload) {
      const result = await this.$basicExport('bom/export', `数据导出_${moment().format('YYYY-MM-DD HH:mm:ss')}.xlsx`, payload);
      if (!result) {
        return false;
      }
      return true;
    },
  },
});
