import { set } from '@/utils/helper';

export default {
  state: {
    maintenanceDetailDialog: false,
    maintenanceTaskDialog: false,
    repairTaskDialog: false,
    taskInfo: {},
    maintenanceList: [],
    selectedMaintenance: null,
    filterMaintenanceId: null,
    taskList: [],
    unfinishedTaskList: [], // 健康评估详情中未完成任务列表
    alarmList: [],
    maintenanceTaskDetailList: [],
    repairPartList: [],
    attachmentList: [],
    maintenanceDetailList: [],
    maintenanceTypeList: [],
    errorCodeList: [],
    bomList: [],
    expertKnowledgeList: [],
    expertKnowledgeTypeList: [],
  },
  mutations: {
    setMaintenanceDetailDialog: set('maintenanceDetailDialog'),
    setMaintenanceTaskDialog: set('maintenanceTaskDialog'),
    setRepairTaskDialog: set('repairTaskDialog'),
    setTaskInfo: set('taskInfo'),
    setMaintenanceList: set('maintenanceList'),
    setSelectedMaintenance: set('selectedMaintenance'),
    setFilterMaintenanceId: set('filterMaintenanceId'),
    setTaskList: set('taskList'),
    setUnfinishedTaskList: set('unfinishedTaskList'),
    setAlarmList: set('alarmList'),
    setMaintenanceTaskDetailList: set('maintenanceTaskDetailList'),
    setRepairPartList: set('repairPartList'),
    setAttachmentList: set('attachmentList'),
    setMaintenanceDetailList: set('maintenanceDetailList'),
    setMaintenanceTypeList: set('maintenanceTypeList'),
    setErrorCodeList: set('errorCodeList'),
    setBomList: set('bomList'),
    setExpertKnowledgeList: set('expertKnowledgeList'),
    setExpertKnowledgeTypeList: set('expertKnowledgeTypeList'),
  },
  actions: {
    async getTaskList({ commit }) {
      const result = await this.$basicGet('maintenance_task/list?statusList=0,2');
      if (!result) {
        return [];
      }
      const list = result.rows.map((item, index) => {
        const obj = {
          ...item,
          no: index + 1,
          isDelay: item.planEndTime && (item.status === '0' || item.status === '2')
            ? result.systemTime > new Date(item.planEndTime).getTime()
            : false,
          isAlarm: item.planStartTime && result.systemTime > new Date(item.planStartTime).getTime(),
        };
        return obj;
      });
      commit('setTaskList', list);
      commit('setAlarmList', list.filter((item) => item.isAlarm));
      return result.data;
    },
    async getMaintenanceList({ commit }) {
      const result = await this.$basicGet('maintenance_schema/list');
      if (!result) {
        return;
      }
      const list = result.rows.map((item, index) => {
        const obj = {
          ...item,
          no: index + 1,
        };
        return obj;
      });
      commit('setMaintenanceList', list);
    },
    async getTaskDetailById(_, taskId) {
      const result = await this.$basicGet(`maintenance_task/${taskId}`);
      if (!result) {
        return {};
      }
      const detail = result.data || {};
      return detail;
    },
    async getTaskDetailList({ commit }, taskId) {
      const result = await this.$basicGet(`maintenance_task_item/list?taskId=${taskId}`);
      if (!result) {
        return;
      }
      const list = result.rows.map((item, index) => {
        const obj = {
          ...item,
          no: index + 1,
        };
        return obj;
      });
      commit('setMaintenanceTaskDetailList', list);
    },
    async getRepairPartList({ commit }, taskId) {
      const result = await this.$basicGet(`replacement_parts/list?taskId=${taskId}`);
      if (!result) {
        return;
      }
      const list = result.rows.map((item, index) => {
        const obj = {
          ...item,
          no: index + 1,
        };
        return obj;
      });
      commit('setRepairPartList', list);
    },
    async getAttachmentList({ commit }, { id, docType }) {
      const result = await this.$systemGet(`relationship/list?outsideId=${id}&module=${docType}`);
      if (!result) {
        return [];
      }
      const list = result.rows.map((item, index) => {
        const obj = {
          ...item,
          no: index + 1,
        };
        return obj;
      });
      commit('setAttachmentList', list);
      return list;
    },
    async updateTask({ commit }, payload) {
      const result = await this.$basicPut('maintenance_task', payload, 'mock1');
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
    async updateTaskDetail({ commit }, payload) {
      const result = await this.$basicPut('maintenance_task_item', payload, 'mock1');
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
    async addRepairPart({ commit }, payload) {
      const result = await this.$basicPost('replacement_parts/batch_add', payload, 'mock1');
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
    async updateRepairPart({ commit }, payload) {
      const result = await this.$basicPut('replacement_parts', payload, 'mock1');
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
    async deleteRepairPart({ commit }, ids) {
      const result = await this.$basicDelete(`replacement_parts/${ids}`, {}, 'mock1');
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
    async getMaintenanceTypeList({ commit }) {
      const result = await this.$systemGet('dict/data/list?dictType=sys_schema_type');
      if (!result) {
        return;
      }
      const { rows } = result;
      commit('setMaintenanceTypeList', rows || []);
    },
    async getMaintenanceDetailList({ commit }, schemaId) {
      // console.log(maintenanceId, 'id');
      const result = await this.$basicGet(`maintenance_item/list?schemaId=${schemaId}`);
      if (!result) {
        return;
      }
      const list = result.rows.map((item, index) => {
        const obj = {
          ...item,
          no: index + 1,
          upperLimitText: item.itemType === '1' ? item.theoreticalUpperLimit : '-',
          lowerLimitText: item.itemType === '1' ? item.theoreticalLowerBound : '-',
        };
        return obj;
      });
      commit('setMaintenanceDetailList', list);
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
    async getErrorCodeList({ commit }) {
      const payload = {
        API_ROUTE_PATH: 'XXCUS_RST_GETDEFECT_CODE',
      };
      const result = await this.$systemQuery(payload, 'mock1');
      if (!result) {
        return;
      }
      const list = result.data.filter((item) => item.enabledFlag === '0');
      commit('setErrorCodeList', list);
    },
    async getBomList({ commit }) {
      const result = await this.$basicGet('bom/selectBomTree');
      if (!result) {
        return;
      }
      const { rows } = result;
      if (rows?.length) {
        commit('setBomList', rows);
      } else {
        commit('setBomList', []);
      }
    },
    async getExpertKnowledgeList({ commit }) {
      const result = await this.$basicGet('expertise/selectlist', 'mock1');
      if (!result) {
        return;
      }
      const list = result.rows.map((item, index) => {
        const obj = {
          ...item,
          no: index + 1,
          id: item.expertiseId,
        };
        return obj;
      });
      commit('setExpertKnowledgeList', list);
    },
    async getExpertKnowledgeTypeList({ commit }) {
      const result = await this.$systemGet('dict/data/list?dictType=expertise_type');
      if (!result) {
        return;
      }
      const list = result.rows.map((item, index) => {
        const obj = {
          ...item,
          no: index + 1,
        };
        return obj;
      });
      commit('setExpertKnowledgeTypeList', list);
    },
    async getCurExpertKnowledge(_, expertiseId) {
      const result = await this.$basicGet(`expertise/getInfoNew?expertiseId=${expertiseId}`, 'mock1');
      if (!result) {
        return {};
      }
      return result.data || {};
    },
    async getPartList(_, expertiseId) {
      const result = await this.$basicGet(`parts/listInfo?expertiseId=${expertiseId}`);
      if (!result) {
        return [];
      }
      const list = result.rows.map((item, index) => {
        const obj = {
          ...item,
          no: index + 1,
        };
        return obj;
      });
      return list;
    },
    async getTableRecords({ commit }, payload) {
      const { data } = await this.$systemQuery(payload);
      // console.log(data, 'getTableRecords, payload:', payload);
      if (!data) {
        return [];
      }
      if (data) {
        const list = data.map((item) => {
          const obj = {
            ...item,
          };
          return obj;
        });
        return list;
      }
      commit(
        'helper/SET_ALERT',
        {
          show: true,
          type: 'error',
          message: data.content,
        },
        { root: true },
      );
      return [];
    },
  },
  getters: {
    formatBomList: (_, getters) => (bomList) => {
      if (bomList.length === 0) {
        return [];
      }
      const list = bomList;
      for (let i = 0; i < list.length; i += 1) {
        list[i].isParent = list[i].bomLevel === '1';
        if (
          list[i].childrenBomList
          && list[i].childrenBomList.length > 0
        ) {
          getters.formatBomList(list[i].childrenBomList);
        }
      }
      return list;
    },
  },
};
