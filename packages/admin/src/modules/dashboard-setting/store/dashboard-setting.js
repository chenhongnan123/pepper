import { set } from '@/utils/store.helper';

export default ({
  state: {
    dashboardSettingList: [],
    dashboardSettingDetailList: [],
    parameterList: [],
  },
  mutations: {
    setDashboardSettingList: set('dashboardSettingList'),
    setDashboardSettingDetailList: set('dashboardSettingDetailList'),
    setParameterList: set('parameterList'),
  },
  actions: {
    // 获取孪生看板设置列表
    async getDashboardSettingList({ commit }, needAlert) {
      const result = await this.$basicGet('boardsetting/list');
      if (!result) {
        return;
      }
      const { rows } = result;
      const list = rows
        .sort((a, b) => Number(a.boardSort) - Number(b.boardSort))
        .map((item, index) => {
          const obj = {
            ...item,
            no: index + 1,
          };
          return obj;
        });
      commit('setDashboardSettingList', list);
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
    // 修改看板设置
    async editDashboardSetting({ commit }, payload) {
      const result = await this.$basicPut('boardsetting', payload);
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
    // 批量更新顺序
    async updateBoardOrder({ commit }, payload) {
      const result = await this.$basicPost('boardsetting/batchUpdateSort', payload);
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
    // 启用/停用看板设置
    async changeStatus({ commit }, payload) {
      const result = await this.$basicPost('boardsetting/changeActive', payload);
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
    // 获取看板设置详情列表
    async getDashboardSettingDetail({ commit }, id) {
      const result = await this.$basicGet(`boardsettingdetail/detailList/${id}`);
      if (!result) {
        return;
      }
      const { data } = result;
      if (data?.length) {
        const list = data.map((item) => {
          const obj = {
            ...item,
          };
          return obj;
        });
        commit('setDashboardSettingDetailList', list);
      } else {
        commit('setDashboardSettingDetailList', []);
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
    },
    // 获取参数列表
    async getParameterList({ commit, rootState }) {
      const { protocalList } = rootState.connectionConfiguration;
      const result = await this.$basicGet('parameter/getAllParameterList?pageSize=10000&pageNum=1');
      if (!result) {
        return;
      }
      const list = result.rows.map((item) => {
        const obj = {
          ...item,
          id: item.parameterId,
        };
        const protocal = protocalList.find((p) => p.value === item.connectionType);
        obj.connectionTypeName = protocal ? protocal.text : item.connectionType;
        return obj;
      });
      commit('setParameterList', list || []);
    },
    // 批量新增/编辑/删除详情列表
    async batchUpdateDetail({ commit }, { payload, boardId }) {
      const result = await this.$basicPost(`boardsettingdetail/batchUpdate/${boardId}`, payload);
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
});
