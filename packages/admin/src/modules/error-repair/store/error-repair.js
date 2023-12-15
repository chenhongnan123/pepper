import { set } from '@/utils/store.helper';
// import PepperConfig from '@/configs/pepper.config';

export default ({
  state: {
    errorRepairList: [],
    statusList: [],
    bomTreeList: [],
    errorCodeList: [],
  },
  mutations: {
    setErrorRepairList: set('errorRepairList'),
    setStatusList: set('statusList'),
    setBomTreeList: set('bomTreeList'),
    setErrorCodeList: set('errorCodeList'),
  },
  actions: {
    // 获取故障报修列表
    async getErrorRepairList({ commit }, { dateFilter, statusFilter, needAlert }) {
      // 时间格式要进行转义处理
      const startTime = dateFilter ? encodeURIComponent(dateFilter[0]) : null;
      const endTime = dateFilter ? encodeURIComponent(dateFilter[1]) : null;
      const status = statusFilter;
      let query = `?startCreateTime=${startTime}&endCreateTime=${endTime}`;
      if (status !== '-1') {
        query += `&status=${status}`;
      }
      const result = await this.$basicGet(`fault_repair/list${query}`);
      if (!result) {
        return;
      }
      const { rows } = result;
      if (rows?.length) {
        const list = rows.map((item, index) => {
          const obj = {
            ...item,
            no: index + 1,
          };
          return obj;
        });
        commit('setErrorRepairList', list);
      } else {
        commit('setErrorRepairList', []);
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
    // 获取报修状态字典表
    async getStatusList({ commit }) {
      const result = await this.$systemGet('/dict/data/list?dictType=sys_repair_status');
      if (!result) {
        return;
      }
      const { rows } = result;
      if (rows?.length) {
        const list = rows.filter((it) => it.status === '0');
        commit('setStatusList', list);
      } else {
        commit('setStatusList', []);
      }
    },
    // 查询报警代码列表
    async getErrorCodeList({ commit }) {
      const result = await this.$basicGet('code/listAlarm');
      if (!result) {
        return;
      }
      commit('setErrorCodeList', result.rows || []);
    },
    // 获取设备bom树
    async getBomTree({ commit }) {
      const result = await this.$basicGet('bom/selectBomTree');
      if (!result) {
        return;
      }
      const { rows } = result;
      if (rows?.length) {
        commit('setBomTreeList', rows);
      } else {
        commit('setBomTreeList', []);
      }
    },
    // 新增故障报修
    async addErrorRepair({ commit }, payload) {
      const result = await this.$basicPost('fault_repair', payload);
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
    // 编辑处理故障报修
    async editErrorRepair({ commit }, payload) {
      const result = await this.$basicPut('fault_repair', payload);
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
    formatBomList: (_, getters) => (bomTreeList) => {
      if (bomTreeList.length === 0) {
        return [];
      }
      const list = bomTreeList;
      for (let i = 0; i < list.length; i += 1) {
        list[i].isKeyDisabled = !list[i].keyPart;
        list[i].isMatainDisabled = !list[i].sparePart;
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
});
