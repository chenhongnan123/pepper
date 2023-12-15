import { set } from '@/utils/store.helper';

export default {
  state: {
    folderList: [], // 文件夹列表
    relationShipList: [],
  },
  mutations: {
    setFolderList: set('folderList'),
    setRelationShipList: set('relationShipList'),
  },
  actions: {
    // 获取文档管理 文件夹
    async getFolderList({ commit }) {
      const result = await this.$basicGet('folder/list');
      if (!result) {
        return;
      }
      commit('setFolderList', result.rows || []);
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
    // 获取文档关系列表
    async getRelationShipList({ commit }, { module, outsideId }) {
      const result = await this.$systemGet(`relationship/list?module=${module}&outsideId=${outsideId}`);
      if (!result) {
        return;
      }
      commit('setRelationShipList', result.rows || []);
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
    async addFolder({ commit }, payload) {
      const result = await this.$basicPost('folder', payload);
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
    async editFolder({ commit }, payload) {
      const result = await this.$basicPut('folder', payload);
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
    async deleteFolder({ commit }, folderIds) {
      const result = await this.$basicDelete(`folder/${folderIds}`);
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
  getters: {},
};
