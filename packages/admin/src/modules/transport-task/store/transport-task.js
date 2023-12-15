import { set } from '@/utils/store.helper';

export default ({
  state: {
    taskList: [],
    transportList: [],
    statusList: [],
  },
  mutations: {
    setTaskList: set('taskList'),
    setTransportList: set('transportList'),
    setStatusList: set('statusList'),
  },
  actions: {
    async getTaskList({ commit }, needAlert) {
      const result = await this.$basicGet('task/list');
      if (!result) {
        return;
      }
      if (result.rows) {
        const list = result.rows.map((item, index) => {
          const obj = {
            ...item,
            id: index,
          };
          return obj;
        });
        commit('setTaskList', list);
      }
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
    async getTransportList({ commit }) {
      const result = await this.$basicGet('transport/list?delFlag=0');
      if (!result) {
        return;
      }
      commit('setTransportList', result.rows || []);
    },
    async getStatusList({ commit }) {
      const result = await this.$systemGet('dict/data/type/basic_task_status');
      if (!result) {
        return;
      }
      commit('setStatusList', result.data || []);
    },
  },
  getters: {
  },
});
