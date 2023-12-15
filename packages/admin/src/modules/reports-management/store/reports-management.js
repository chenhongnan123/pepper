import { set } from '@/utils/store.helper';

export default ({
  namespaced: true,
  state: {
    sourceList: [],
    reportList: [],
    reportViews: [],
    reportView: null,
    reportDetail: {},
    newReportTitle: '',
    reportMappings: [],
    reportMapping: null,
    chartType: null,
    showChart: false,
    dateRange: [new Date().toISOString().substr(0, 10),
      new Date().toISOString().substr(0, 10)],
    report: null,
    gridState: '',
    loading: false,
    isPDFVisible: true,
    reportsTableList: [],
    reportsTableHeaderList: [],
    agChartId: null,
    reportsTableTotal: 0,
  },
  mutations: {
    setSourceList: set('sourceList'),
    setReportDetail: set('reportDetail'),
    setReportViews: set('reportViews'),
    setReportList: set('reportList'),
    setReportView: set('reportView'),
    setNewReportTitle: set('newReportTitle'),
    setReportMappings: set('reportMappings'),
    setReportMapping: set('reportMapping'),
    setChartType: set('chartType'),
    setShowChart: set('showChart'),
    setDateRange: set('dateRange'),
    setReport: set('report'),
    setGridState: set('gridState'),
    setLoading: set('loading'),
    setIsPDFVisible: set('isPDFVisible'),
    setReportsTableList: set('reportsTableList'),
    setReportsTableTotal: set('reportsTableTotal'),
    setReportsTableHeaderList: set('reportsTableHeaderList'),
    setAgChartId: set('agChartId'),
  },
  actions: {
    async getSourceList({ commit }, needAlert) {
      const result = await this.$basicGet('source/list');
      if (!result) {
        return;
      }
      if (result.rows) {
        const list = result.rows.map((item, index) => {
          const obj = {
            ...item,
            id: item.roleId,
            no: index + 1,
          };
          return obj;
        });
        commit('setSourceList', list);
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
    async getReportsTableHeaderList({ commit }, payload, needAlert) {
      const result = await this.$basicGet(`param/list/?dataSourceId=${payload}`);
      if (!result) {
        commit('setReportsTableHeaderList', []);
        return;
      }
      if (result.rows) {
        const list = result.rows.map((item, index) => {
          const obj = {
            ...item,
            id: item.dataSourceId,
            no: index + 1,
          };
          return obj;
        });
        commit('setReportsTableHeaderList', list);
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
    async getReportsTableList({ commit }, payload, needAlert) {
      const result = await this.$basicGet(`source/detailsList/?${payload}`);
      if (!result) {
        commit('setReportsTableList', []);
        commit('setReportsTableTotal', 0);
        return;
      }
      if (result.rows) {
        const list = result.rows.map((item, index) => {
          const obj = {
            ...item,
            // id: item._id,
            no: index + 1,
          };
          return obj;
        });
        commit('setReportsTableList', list);
        commit('setReportsTableTotal', result.total);
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
    async getReportList({ commit }, needAlert) {
      const result = await this.$basicGet('source/detailsList');
      if (!result) {
        return;
      }
      if (result.rows) {
        const list = result.rows.map((item, index) => {
          const obj = {
            ...item,
            // id: item.roleId,
            no: index + 1,
          };
          return obj;
        });
        commit('setReportList', list);
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
    async getReportDetail({ commit }, payload, needAlert) {
      const result = await this.$basicGet(`grid/${payload}`);
      if (!result) {
        return;
      }
      if (result.data) {
        // const list = result.rows.map((item, index) => {
        //   const obj = {
        //     ...item,
        //     id: item.roleId,
        //     no: index + 1,
        //   };
        //   return obj;
        // });
        commit('setReportDetail', result.data);
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
    // 另存为
    async addReportMenu({ commit }, payload) {
      const result = await this.$basicPost('grid/addMenuRole', payload);
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
    // 保存报表
    async putReportMenu({ commit }, payload) {
      const result = await this.$basicPut('grid', payload);
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
    reportCategories: (state, getters, rootState, rootGetters) => {
      const modules = rootGetters['user/modules'];
      if (modules && modules.items && modules.items.length) {
        return modules.items.filter((module) => module.to === 'reports');
      }
      return [];
    },

    activeReportCategory: (_, { reportCategories }) => (title) => {
      if (reportCategories && reportCategories.length) {
        return reportCategories.find((category) => category.title === title);
      }
      return null;
    },

    reportTitle: ({ reportView }) => {
      if (reportView) {
        return reportView.reportViewName;
      }
      return '';
    },

    gridObject: ({ reportView }) => {
      if (reportView) {
        return reportView.gridObject;
      }
      return null;
    },

    isBaseReport: (_, { gridObject }) => !gridObject,

    exportFileName: ({ reportMapping }) => {
      if (reportMapping) {
        return reportMapping.reportName;
      }
      return null;
    },
  },
});
