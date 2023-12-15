import { set } from '@/utils/store.helper';
// import PepperConfig from '@/configs/pepper.config';

export default {
  state: {
    curMaintenance: {},
    maintenanceList: [], // 维保方案
    maintenanceDetailList: [],
    maintenanceTypeList: [],
    checkItemList: [],
    attachmentList: [],
    bomList: [],
  },
  mutations: {
    setCurMaintenance: set('curMaintenance'),
    setMaintenanceList: set('maintenanceList'),
    setMaintenanceDetailList: set('maintenanceDetailList'),
    setMaintenanceTypeList: set('maintenanceTypeList'),
    setAttachmentList: set('attachmentList'),
    setBomList: set('bomList'),
    setCheckItemList: set('checkItemList'),
  },
  actions: {
    // 获取维保方案
    async getMaintenanceList({ commit }) {
      const result = await this.$basicGet('maintenance_schema/list');
      if (!result) {
        return;
      }
      commit('setMaintenanceList', result.rows);
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
    async getCheckItemList({ commit }, schemaId) {
      const result = await this.$basicGet(`maintenance_item/list?schemaId=${schemaId}`);
      if (!result) {
        return;
      }
      commit('setCheckItemList', result.rows);
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

    async getCurMaintenance({ commit }, id) {
      const result = await this.$basicGet(`maintenance_schema/${id}`);
      if (!result) {
        return false;
      }
      if (result.data) {
        commit('setCurMaintenance', result.data);
      } else {
        commit('setCurMaintenance', {});
      }
      return true;
    },
    // 获取维保方案的类型
    async getMaintenanceTypeList({ commit }, dictType) {
      const result = await this.$systemGet(`dict/data/list?dictType=${dictType}`);
      if (!result) {
        return;
      }
      commit('setMaintenanceTypeList', result.rows || []);
    },
    async getBomList({ commit }) {
      const result = await this.$basicGet('bom/selectBomTree');
      if (!result) {
        return;
      }
      commit('setBomList', result.rows);
    },
    // 添加维保方案检查项
    async addMaintenance({ commit }, payload) {
      const result = await this.$basicPost('maintenance_schema', payload);
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
    async updateMaintenance({ commit }, payload) {
      const result = await this.$basicPut('maintenance_schema', payload);
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
    async deleteMaintenance({ commit }, id) {
      const result = await this.$basicDelete(`maintenance_schema/${id}`);
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
    async getAttachmentList({ commit }, { module, outsideId }) {
      const result = await this.$systemGet(`relationship/list?module=${module}&outsideId=${outsideId}`);
      if (!result) {
        return;
      }
      commit('setAttachmentList', result.rows || []);
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
    async addCheckItem({ commit }, payload) {
      const result = await this.$basicPost('maintenance_item', payload);
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
    async updateCheckItem({ commit }, payload) {
      const result = await this.$basicPut('maintenance_item', payload);
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
    async deleteCheckItem({ commit }, ids) {
      const result = await this.$basicDelete(`maintenance_item/${ids}`);
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
        list[i].isKeyDisabled = !list[i].isKey;
        list[i].isMatainDisabled = !list[i].isMatainPart;
        if (list[i].childNodes && list[i].childNodes.length > 0) {
          getters.formatBomList(list[i].childNodes);
        }
      }
      return list;
    },
  },
};
