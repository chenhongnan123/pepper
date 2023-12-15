import { set } from '@/utils/store.helper';

export default ({
  state: {
    dataSourceList: [], // 数据源列表
    dataColumnList: [], // 数据列列表
    spcViewList: [], // spc视图列表
    viewDetail: {}, // 视图详情
    dataTableData: [], // 数据表数据
    modelDetailParam: {}, // 算法模型详情
    elements: [],
    // spc页面选项配置
    selectedItems: {},
    // 选项卡清空
    clearTabs: false,
    // 变量选项卡
    variates: {},
    // 参数选项卡
    parameters: {},
    // 估计标准差选项卡
    estimated: {},
    // 选项选项卡
    options: {},
    // 权重/重置选项卡
    weights: {},
    // 检验选项卡
    tests: {},
    // 计划/类型选项卡
    planortype: {},
    // boxcox选项卡
    boxcox: {},
  },
  mutations: {
    setDataSourceList: set('dataSourceList'),
    setDataColumnList: set('dataColumnList'),
    setSpcViewList: set('spcViewList'),
    setViewDetail: set('viewDetail'),
    setDataTableData: set('dataTableData'),
    setElements: set('elements'),
    setModelDetailParam: set('modelDetailParam'),
    // 页面配置存储
    setSelectedItems: set('selectedItems'),
    // 选项卡清空
    setClearTabs: set('clearTabs'),
    // 算法配置存储
    setVariates: set('variates'),
    setParameters: set('parameters'),
    setEstimated: set('estimated'),
    setOptions: set('options'),
    setWeights: set('weights'),
    setTests: set('tests'),
    setPlanOrType: set('planortype'),
    setBoxcox: set('boxcox'),
  },
  actions: {
    // 获取数据源列表
    async getDataSourceList({ commit }) {
      const result = await this.$basicGet('source/list');
      if (!result) {
        commit('setDataSourceList', []);
        return;
      }
      if (result.rows?.length) {
        const list = result.rows.map((item) => {
          const obj = {
            ...item,
            id: item.dataSourceId,
          };
          return obj;
        });
        commit('setDataSourceList', list);
      } else {
        commit('setDataSourceList', []);
      }
    },
    // 获取数据列列表
    async getDataColumnList({ commit }, dataSourceId) {
      const query = `?dataSourceId=${dataSourceId}`;
      const result = await this.$basicGet(`param/list${query}`);
      if (!result) {
        commit('setDataColumnList', []);
        return;
      }
      const { rows } = result;
      if (rows?.length) {
        const list = rows.map((item) => {
          const obj = {
            ...item,
          };
          return obj;
        });
        commit('setDataColumnList', list);
      } else {
        commit('setDataColumnList', []);
      }
    },
    // 获取视图列表
    async getViewList({ commit }) {
      const result = await this.$basicGet('view/list');
      if (!result) {
        commit('setSpcViewList', []);
        return;
      }
      const { rows } = result;
      if (rows?.length) {
        const list = rows.map((item) => {
          const obj = {
            ...item,
          };
          return obj;
        });
        commit('setSpcViewList', list);
      } else {
        commit('setSpcViewList', []);
      }
    },
    // 获取视图详情
    async getViewDetailById({ commit }, id) {
      const result = await this.$basicGet(`ViewDetail/list?viewId=${id}`);
      if (!result) {
        commit('setViewDetail', {});
        return;
      }
      const { rows } = result;
      if (rows?.length) {
        commit('setViewDetail', rows[0]);
      } else {
        commit('setViewDetail', []);
      }
    },
    // 查询数据源表的数据
    async getTableData({ commit }, payload) {
      const {
        collectionName,
        dateFrom,
        dateTo,
        pageNum,
        pageSize,
      } = payload;
      let query = `?collectionName=${collectionName}`;
      if (dateFrom && dateTo) {
        query += `&dateFrom=${dateFrom}&dateTo=${dateTo}`;
      }
      if (pageNum && pageSize) {
        query += `&pageNum=${pageNum}&pageSize=${pageSize}`;
      }
      const url = `source/detailsList${query}`;
      const result = await this.$basicGet(url);
      if (!result) {
        commit('setDataTableData', []);
        return;
      }
      const { rows } = result;
      if (rows?.length) {
        const list = rows.map((item) => {
          const obj = {
            ...item,
          };
          return obj;
        });
        commit('setDataTableData', list);
      } else {
        commit('setDataTableData', []);
      }
    },
    // 获取算法模型详情
    async getModelDetailParam({ commit }, id) {
      const url = `detail/list?modelId=${id}`;
      const result = await this.$basicGet(url);
      if (!result) {
        commit('setModelDetailParam', {});
        return;
      }
      const { rows } = result;
      if (rows?.length) {
        const list = rows.map((item) => {
          const obj = {
            ...item,
          };
          return obj;
        });
        commit('setModelDetailParam', list[0]);
      } else {
        commit('setModelDetailParam', {});
      }
    },
    // 新增算法模型详情
    async addModelDetail({ commit }, payload) {
      const result = await this.$basicPost('detail', payload);
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
    // 编辑算法模型详情
    async editModelDetail({ commit }, payload) {
      const result = await this.$basicPut('detail', payload);
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
    // 新增视图（包含详情内容）
    async addView({ commit }, payload) {
      const result = await this.$basicPost('view/addAndDetail', payload);
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
    // 更新视图
    async updateView({ commit }, payload) {
      const result = await this.$basicPut('view/', payload);
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
    // 删除视图
    async deleteViewById({ commit }, ids) {
      const result = await this.$basicDelete(`view/${ids}`);
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
    // 更新视图详情
    async updateViewDetail({ commit }, payload) {
      const result = await this.$basicPut('ViewDetail', payload);
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
    // 标准算法试运行
    async runAlgorithm(_, payload) {
      const result = await this.$spcPost('spc/standard/running', payload);
      if (!result) {
        return false;
      }
      return result;
    },
  },
});
