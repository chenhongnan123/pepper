import { set } from '@/utils/helper';

export default {
  state: {
    folderList: [],
    fileList: [],
    previewType: 0,
    previewData: null,
  },
  mutations: {
    setFolderList: set('folderList'),
    setFileList: set('fileList'),
    setPreviewType: set('previewType'),
    setPreviewData: set('previewData'),
  },
  actions: {
    async GET_FOLDERLIST({ commit }) {
      const result = await this.$basicGet('folder/list');
      if (!result) {
        return false;
      }
      const { rows } = result;
      commit('setFolderList', rows || []);
      return true;
    },
    async getFilesByFolderId({ commit }, id) {
      const result = await this.$systemGet(`relationship/list?module=folder&outsideId=${id}`);

      if (!result) {
        return false;
      }
      const { rows } = result;
      let list = rows || [];
      list = list.map((item, index) => ({
        ...item,
        no: index + 1,
      }));
      commit('setFileList', list);
      return true;
    },
  },
};
