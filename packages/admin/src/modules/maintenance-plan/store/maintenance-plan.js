import { set } from '@/utils/store.helper';
// import PepperConfig from '@/configs/pepper.config';

export default ({
  state: {
    tbmPlanList: [],
    cbmPlanList: [],
    maintenanceSchemaList: [],
    planTypeList: [],
    bomTreeList: [],
    countParamList: [],
  },
  mutations: {
    setTbmPlanList: set('tbmPlanList'),
    setCbmPlanList: set('cbmPlanList'),
    setMaintenanceSchemaList: set('maintenanceSchemaList'),
    setPlanTypeList: set('planTypeList'),
    setBomTreeList: set('bomTreeList'),
    setCountParamList: set('countParamList'),
  },
  actions: {
    // 获取基于时间的维保计划列表
    async getTbmPlanList({ commit }, needAlert) {
      const url = 'maintenance_plan/list?planType=0';
      const result = await this.$basicGet(url);
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
        commit('setTbmPlanList', list);
      } else {
        commit('setTbmPlanList', []);
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
    // 获取基于状态的维保计划列表
    async getCbmPlanList({ commit }, needAlert) {
      const url = 'maintenance_plan/list?planType=1';
      const result = await this.$basicGet(url);
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
        commit('setCbmPlanList', list);
      } else {
        commit('setCbmPlanList', []);
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
    // 查询维保方案列表
    async getMaintenanceSchemaList({ commit }) {
      const result = await this.$basicGet('maintenance_schema/list');
      if (!result) {
        return;
      }
      const { rows } = result;
      commit('setMaintenanceSchemaList', rows || []);
    },
    // 删除维保计划
    deleteMaintenancePlan({ commit }, ids) {
      const result = this.$basicDelete(`maintenance_plan/${ids}`);
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
    // 查询维保计划类型字典表
    async getMaintenancePlanTypeList({ commit }) {
      const result = await this.$systemGet('dict/data/list?dictType=sys_plan_type');
      if (!result) {
        return;
      }
      const { rows } = result;
      commit('setPlanTypeList', rows || []);
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
    // 新增维保计划
    async addMaintenancePlan({ commit }, payload) {
      const result = await this.$basicPost('maintenance_plan', payload);
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
    // 更新维保计划状态
    async updateMaintenancePlanStatus({ commit }, payload) {
      const result = await this.$basicPut('maintenance_plan', payload);
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
    // 获取计时/计次参数列表
    async getCountParamList({ commit }) {
      const result = await this.$basicGet('parameter/getAllParameterList?pageSize=10000&pageNum=1&parameterDataType=12');
      if (!result) {
        return;
      }
      const { rows } = result;
      commit('setCountParamList', rows || []);
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
