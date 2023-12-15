import { set } from '@/utils/store.helper';
import moment from 'moment';

export default ({
  state: {
    partList: [],
    partAnnexInfo: {}, // 零件+附件详细信息
    // partDetail: {},
    itemTypeList: [],
    partFileList: [],
    taskList: [],
  },
  mutations: {
    setPartList: set('partList'),
    setPartAnnexInfo: set('partAnnexInfo'),
    // setPartDetail: set('partDetail'),
    setItemTypeList: set('itemTypeList'),
    setPartFileList: set('partFileList'),
    setTaskList: set('taskList'),
  },
  actions: {
    async getPartList({ commit }, payload) {
      const result = await this.$basicGet('part/list', payload);
      if (!result) {
        return false;
      }
      const { rows } = result;
      if (rows.length) {
        commit('setPartList', rows);
        return true;
      }
      commit('setPartList', []);
      return false;
    },
    // 获取零件+附件详细信息
    async getPartAnnexInfo({ commit }, partId) {
      const result = await this.$basicGet(`part/annex/${partId}?module=partManagementDetail`);
      if (!result) {
        return;
      }
      commit('setPartAnnexInfo', result.data || {});
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
    // 新增零件+附件
    async addPartOrAnnex({ commit }, payload) {
      const result = await this.$basicPost('part/annexInsert', payload);
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
    // async getPartDetailById({ commit }, payload) {
    //   const result = await this.$systemQuery(payload);
    //   if (!result) {
    //     return false;
    //   }
    //   const { data } = result;
    //   if (data.length) {
    //     const detail = data[0];
    //     commit('setPartDetail', detail);
    //     return true;
    //   }
    //   commit('setPartDetail', {});
    //   return false;
    // },
    async getItemTypes({ commit }) {
      const result = await this.$systemGet('dict/data/list?dictType=part_type&status=0');
      if (!result) {
        return;
      }
      commit('setItemTypeList', result.rows);
    },
    async addPart(_, payload) {
      const result = await this.$basicPost('/part', payload);
      if (!result) {
        return false;
      }
      return true;
    },
    async editPart(_, payload) {
      const result = await this.$basicPut('part', payload);
      if (!result) {
        return false;
      }
      return true;
    },
    async deletePart(_, partIds) {
      const result = await this.$basicDelete(`part/partBatch/${partIds}`);
      if (!result) {
        return false;
      }
      return result.data;
    },
    async getFileList({ commit }, payload) {
      const result = await this.$systemQuery(payload);
      if (!result) {
        return;
      }
      const { data } = result;
      if (data.length) {
        const list = data.map((item) => {
          const obj = {
            ...item,
          };
          return obj;
        });
        commit('setPartFileList', list);
      } else {
        commit('setPartFileList', []);
      }
    },
    async getTaskList({ commit }, payload) {
      const result = await this.$systemQuery(payload);
      if (!result) {
        return;
      }
      const { data } = result;
      if (data.length) {
        const list = data.map((item) => {
          const obj = {
            ...item,
          };
          return obj;
        });
        commit('setTaskList', list);
      } else {
        commit('setTaskList', []);
      }
    },
    // 导出模版
    async excelExport() {
      const filename = `模版_${moment().format('YYYY-MM-DD HH:mm:ss')}.xlsx`;
      const result = await this.$basicExport('part/importTemplate', filename);
      if (!result) {
        return false;
      }
      return true;
    },
    // 导入模版
    async excelImport(_, payload) {
      const result = await this.$basicPost('part/import', payload);
      if (!result) {
        return false;
      }
      return true;
    },
    async eportSampleExcel(_, payload) {
      const result = await this.$basicExport('part/export', `模版_${moment().format('YYYY-MM-DD HH:mm:ss')}.xlsx`, payload);
      if (!result) {
        return false;
      }
      return true;
    },
  },
});
