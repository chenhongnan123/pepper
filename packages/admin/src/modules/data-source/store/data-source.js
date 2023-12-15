import { set } from '@/utils/store.helper';
import moment from 'moment';

export default ({
  state: {
    dataSourceList: [], // 数据源列表
    curDataSource: {}, // 当前数据源
    dataParamList: [], // 数据源参数列表
    parameterList: [], // 通讯参数列表
    dataList: [], // 数据列表
    statusList: [
      {
        // text: '在线',
        value: '1',
        color: 'success',
      },
      {
        // text: '停止',
        value: '0',
        color: 'error',
      },
    ], // 储存类型列表
    storageModeList: [
      {
        // text: '记录PLC参数',
        value: '1',
      },
      {
        // text: '记录触发间隔时间',
        value: '2',
      },
      {
        // text: '参数特征提取',
        value: '3',
      },
      {
        // text: '记录更新数据',
        value: '4',
      },
    ], // 储存类型列表
    storageDurationList: [
      {
        // text: '1天',
        value: '1',
      },
      {
        // text: '7天',
        value: '2',
      },
      {
        // text: '30天',
        value: '3',
      },
      {
        // text: '90天',
        value: '4',
      },
      {
        // text: '180天',
        value: '5',
      },
      {
        // text: '365天',
        value: '6',
      },
    ], // 储存时长列表
    storageFrequencyList: [
      {
        text: '50ms',
        value: '0',
        storageDurationList: [
          {
            text: '1天',
            value: '1',
          },
          {
            text: '7天',
            value: '2',
          },
          {
            text: '30天',
            value: '3',
          },
        ],
      },
      {
        text: '100ms',
        value: '1',
        storageDurationList: [
          {
            text: '1天',
            value: '1',
          },
          {
            text: '7天',
            value: '2',
          },
          {
            text: '30天',
            value: '3',
          },
        ],
      },
      {
        text: '500ms',
        value: '2',
        storageDurationList: [
          {
            text: '1天',
            value: '1',
          },
          {
            text: '7天',
            value: '2',
          },
          {
            text: '30天',
            value: '3',
          },
        ],
      },
      {
        text: '1s',
        value: '3',
        storageDurationList: [
          {
            text: '1天',
            value: '1',
          },
          {
            text: '7天',
            value: '2',
          },
          {
            text: '30天',
            value: '3',
          },
        ],
      },
      {
        text: '5s',
        value: '4',
        storageDurationList: [
          {
            text: '1天',
            value: '1',
          },
          {
            text: '7天',
            value: '2',
          },
          {
            text: '30天',
            value: '3',
          },
          {
            text: '90天',
            value: '4',
          },
        ],
      },
      {
        text: '30s',
        value: '5',
        storageDurationList: [
          {
            text: '1天',
            value: '1',
          },
          {
            text: '7天',
            value: '2',
          },
          {
            text: '30天',
            value: '3',
          },
          {
            text: '90天',
            value: '4',
          },
        ],
      },
      {
        text: '1min',
        value: '6',
        storageDurationList: [
          {
            text: '1天',
            value: '1',
          },
          {
            text: '7天',
            value: '2',
          },
          {
            text: '30天',
            value: '3',
          },
          {
            text: '90天',
            value: '4',
          },
        ],
      },
      {
        text: '5min',
        value: '7',
        storageDurationList: [
          {
            text: '1天',
            value: '1',
          },
          {
            text: '7天',
            value: '2',
          },
          {
            text: '30天',
            value: '3',
          },
          {
            text: '90天',
            value: '4',
          },
          {
            text: '180天',
            value: '5',
          },
          {
            text: '365天',
            value: '6',
          },
        ],
      },
      {
        text: '30min',
        value: '8',
        storageDurationList: [
          {
            text: '1天',
            value: '1',
          },
          {
            text: '7天',
            value: '2',
          },
          {
            text: '30天',
            value: '3',
          },
          {
            text: '90天',
            value: '4',
          },
          {
            text: '180天',
            value: '5',
          },
          {
            text: '365天',
            value: '6',
          },
        ],
      },
    ], // 储存频率列表
  },
  mutations: {
    setDataSourceList: set('dataSourceList'),
    setCurDataSource: set('curDataSource'),
    setDataParamList: set('dataParamList'),
    setDataList: set('dataList'),
    setParameterList: set('parameterList'),
  },
  actions: {
    async getDataSourceList({ commit }, needAlert) {
      const result = await this.$basicGet('source/list');
      if (!result) {
        return;
      }
      if (result.rows) {
        const list = result.rows.map((item) => {
          const obj = {
            ...item,
            id: item.dataSourceId,
          };
          return obj;
        });
        commit('setDataSourceList', list);
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
    async updateSource({ commit }, payload) {
      const result = await this.$basicPut('source', payload);
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
    async addSource({ commit }, payload) {
      const result = await this.$basicPost('source/addDataSourceAndParam', payload);
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
    async getDataSourceById({ commit }, dataSourceId) {
      const result = await this.$basicGet(`source/${dataSourceId}`);
      if (!result) {
        return false;
      }
      commit('setCurDataSource', result.data || {});
      return result.data;
    },
    async getDataParametersById({ commit }, dataSourceId) {
      const result = await this.$basicGet(`param/list?dataSourceId=${dataSourceId}`);
      if (!result) {
        return [];
      }
      if (result.rows) {
        const list = result.rows.map((item) => {
          const obj = {
            ...item,
            id: item.paramId,
          };
          return obj;
        });
        commit('setDataParamList', list);
        return list;
      }
      return [];
    },
    async addParameter({ commit }, payload) {
      const result = await this.$basicPost('param/batchAddBasicDataSourceParamAndCheck', payload);
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
    async updateParameter({ commit }, payload) {
      const result = await this.$basicPut('param/updateBasicDataSourceList', payload);
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
    async addDataParam({ commit }, payload) {
      const result = await this.$basicPost('param/batchAddBasicDataSourceParamAndCheck', payload);
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
    async deleteData({ commit }, payload) {
      const result = await this.$basicPost('source/deleteBatchMongo', payload);
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
    async cleanData({ commit }, payload) {
      const result = await this.$basicPost('source/deleteAllMongo', payload);
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
    // 导入数据源详情数据mongo
    async excelImport(_, payload) {
      const result = await this.$basicPost('param/importDataSourceParamMongo', payload);
      if (!result) {
        return false;
      }
      return true;
    },
    // 导出模版
    async excelExport(_, payload) {
      const filename = `模版_${moment().format('YYYY-MM-DD HH:mm:ss')}.csv`;
      const result = await this.$basicExport('param/importTemplateDataSourceParam', filename, payload);
      if (!result) {
        return false;
      }
      return true;
    },
    // 导出表
    async eportSampleExcel(_, payload) {
      let { exportType } = payload;
      if (exportType === 'excel') {
        exportType = 'xlsx';
      }
      const result = await this.$basicExport('param/exportBasicDataSourceParamList', `数据_${moment().format('YYYY-MM-DD HH:mm:ss')}.${exportType}`, payload);
      if (!result) {
        return false;
      }
      return true;
    },
  },
});
