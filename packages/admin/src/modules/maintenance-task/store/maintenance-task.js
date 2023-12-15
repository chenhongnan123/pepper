import { set } from '@/utils/store.helper';
// import PepperConfig from '@/configs/pepper.config';

export default ({
  state: {
    maintenanceTaskList: [],
    repairTaskList: [],
    taskDetail: {},
    taskDetailList: [],
    repairPartList: [],
    attachmentList: [],
    maintenanceList: [], // 维保方案
    errorCodeList: [], // 报警代码
    statusList: [
      {
        value: '0',
        text: 'nostart',
        color: 'info',
      },
      {
        value: '1',
        text: 'complete',
        color: 'success',
      },
      {
        value: '2',
        text: 'inprogress',
        color: 'primary',
      },
      {
        value: '3',
        text: 'delay',
        color: 'error',
      },
      {
        value: '4',
        text: 'cancel',
        color: 'warning',
      },
    ],
    typeList: [
      {
        value: '0',
        text: 'time',
      },
      {
        value: '1',
        text: 'status',
      },
      {
        value: '2',
        text: 'temp',
      },
    ],
  },
  mutations: {
    setMaintenanceTaskList: set('maintenanceTaskList'),
    setRepairTaskList: set('repairTaskList'),
    setTaskDetailList: set('taskDetailList'),
    setTaskDetail: set('taskDetail'),
    setRepairPartList: set('repairPartList'),
    setAttachmentList: set('attachmentList'),
    setMaintenanceList: set('maintenanceList'),
    setErrorCodeList: set('errorCodeList'),
  },
  actions: {
    async getTaskList({ commit }, { dateFilter, needAlert }) {
      // console.log(dateFilter);
      const beginPlanStartTime = dateFilter ? dateFilter[0] : null;
      const endPlanStartTime = dateFilter ? dateFilter[1] : null;
      // console.log(new Date(beginPlanStartTime), 'beginPlanStartTime');
      // console.log(new Date(endPlanStartTime), 'endPlanStartTime');
      // eslint-disable-next-line
      const result = await this.$basicGet(`maintenance_task/list?beginPlanStartTime=${beginPlanStartTime}&endPlanStartTime=${endPlanStartTime}`);
      // const result = await this.$basicGet('maintenance_task/list');
      if (!result) {
        return;
      }
      const list = (result.rows || []).map((item) => {
        const obj = {
          ...item,
          isDelay: item.planEndTime && (item.status === '0' || item.status === '2')
            ? result.systemTime > new Date(item.planEndTime).getTime()
            : false,
        };
        return obj;
      });
      commit('setMaintenanceTaskList', list.filter((item) => item.taskGroup === '0'));
      commit('setRepairTaskList', list.filter((item) => item.taskGroup === '1'));
      if (needAlert) {
        commit(
          'helper/setAlert',
          {
            show: true,
            type: 'success',
            message: 'successAction',
          },
          { root: true },
        );
      }
    },
    async getTaskDetailById({ commit }, taskId) {
      const result = await this.$basicGet(`maintenance_task/${taskId}`);
      if (!result) {
        return {};
      }
      const detail = result.data || {};
      commit('setTaskDetail', detail);
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
      commit('setTaskDetailList', list);
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
        return;
      }
      const list = result.rows || [];
      commit('setAttachmentList', list);
    },
    async addTask({ commit }, payload) {
      const result = await this.$basicPost('maintenance_task', payload, 'mock1');
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
    async updateTaskStatus({ commit }, payload) {
      const result = await this.$basicPut('maintenance_task/batch_edit_status', payload, 'mock1');
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
    async createExpertise({ commit }, payload) {
      const result = await this.$basicPost('maintenance_task/generate_expertise', payload, 'mock1');
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
    // 获取维保方案
    async getMaintenanceList({ commit }) {
      const result = await this.$basicGet('maintenance_schema/list');
      if (!result) {
        return;
      }
      commit('setMaintenanceList', result.rows);
    },
    // 获取报警代码
    async getErrorCodeList({ commit }) {
      const result = await this.$basicGet('code/list');
      if (!result) {
        return;
      }
      commit('setErrorCodeList', result.rows);
    },
  },
  getters: {
  },
});
