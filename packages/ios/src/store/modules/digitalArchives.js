import { set } from '@/utils/helper';

export default {
  state: {
    deviceDetail: {}, // 设备详情信息
    machineBomList: [], // 设备bom树形列表
    itemTypeList: [], // 零件类型列表
    bomDetail: {}, // bom详情
    fileList: [], // 文件列表
    taskList: [], // 维保任务列表
    expertKnowledgeList: [], // 专家知识列表
    expertiseTypeList: [], // 专家类型列表
  },
  mutations: {
    setDeviceDetail: set('deviceDetail'),
    setMachineBomList: set('machineBomList'),
    setItemTypeList: set('itemTypeList'),
    setBomDetail: set('bomDetail'),
    setFileList: set('fileList'),
    setTaskList: set('taskList'),
    setExpertKnowledgeList: set('expertKnowledgeList'),
    setExpertiseTypeList: set('expertiseTypeList'),
  },
  actions: {
    // 获取设备详情
    async getDeviceDetail({ commit }) {
      const result = await this.$basicGet('device/list');
      if (!result) {
        return;
      }
      const { rows } = result;
      if (rows.length) {
        commit('setDeviceDetail', rows[0]);
      } else {
        commit('setDeviceDetail', {});
      }
    },
    // 查询设备bom树
    async getMachineBomList({ commit }) {
      const result = await this.$basicGet('bom/selectBomTree');
      if (!result) {
        return false;
      }
      const { rows } = result;
      if (rows?.length) {
        commit('setMachineBomList', rows);
      } else {
        commit('setMachineBomList', []);
      }
      return true;
    },
    // 获取零件类型列表
    async getItemTypes({ commit }) {
      const result = await this.$systemGet('dict/data/list?dictType=part_type');
      if (!result) {
        return;
      }
      commit('setItemTypeList', result?.rows || []);
    },
    // 获取设备bom详情
    async getBomDetail({ commit }, bomId) {
      const result = await this.$basicGet(`bom/${bomId}`);
      if (!result) {
        return false;
      }
      commit('setBomDetail', result?.data || {});
      return true;
    },
    // 获取关联文件列表
    async getFileList({ commit }, { module, bomId }) {
      const result = await this.$systemGet(`relationship/boardSelectFiles?module=${module}&outsideId=${bomId}`);
      if (!result) {
        return false;
      }
      commit('setFileList', result?.rows || []);
      return true;
    },
    // 获取维保任务列表
    async getTaskList({ commit }, { module, bomId }) {
      const url = `maintenance_task/boardSelectMaintenanceTasks?module=${module}&outsideId=${bomId}`;
      const result = await this.$basicGet(url);
      if (!result) {
        commit('setTaskList', []);
        return;
      }
      const { rows } = result;
      if (rows?.length) {
        commit('setTaskList', rows);
      } else {
        commit('setTaskList', []);
      }
    },
    // 获取专家知识列表
    async getExpertKnowledgeList({ commit }, { module, bomId }) {
      const url = `expertise/boardSelectExpertises?module=${module}&outsideId=${bomId}`;
      const result = await this.$basicGet(url);
      if (!result) {
        commit('setExpertKnowledgeList', []);
        return;
      }
      const { data } = result;
      commit('setExpertKnowledgeList', data?.basicExpertiseDtoList || []);
    },
    // 获取专家类型
    async getExpertiseTypeList({ commit }) {
      const result = await this.$systemGet('dict/data/list?dictType=expertise_type');
      if (!result) {
        return;
      }
      const { rows } = result;
      commit('setExpertiseTypeList', rows || []);
    },
  },
  getters: {
    formatBomList: (_, getters) => (machineBomList) => {
      if (machineBomList.length === 0) {
        return [];
      }
      const list = machineBomList;
      for (let i = 0; i < list.length; i += 1) {
        list[i].isDisabled = list[i].bomLevel === '1';
        // 处理bomName为空的情况，不然会报错
        list[i].bomName = list[i].bomName || '-';
        if (list[i].childrenBomList && list[i].childrenBomList.length > 0) {
          getters.formatBomList(list[i].childrenBomList);
        }
      }
      return list;
    },
  },
};
