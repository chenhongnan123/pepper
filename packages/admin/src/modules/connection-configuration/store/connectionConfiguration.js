import { set } from '@/utils/store.helper';

export default ({
  state: {
    paramTypeList: [], // 参数类型列表
    dataTypeList: [], // 数据类型列表
    connectionList: [], // 通讯列表
    connectionDetail: {}, // 通讯详情
    protocalList: [
      {
        text: 'SNAP7',
        value: '1',
      },
      {
        text: 'OPCUA',
        value: '2',
      },
      {
        text: 'Ethernetip',
        value: '3',
      },
      {
        text: 'Modbus',
        value: '5',
      },
      {
        text: 'Melsec',
        value: '4',
      },
    ], // 通讯方式列表
    timeoutList: [
      {
        text: '50ms',
        value: 50,
      },
      {
        text: '100ms',
        value: 100,
      },
      {
        text: '500ms',
        value: 500,
      },
      {
        text: '1s',
        value: 1000,
      },
      {
        text: '5s',
        value: 5000,
      },
      {
        text: '30s',
        value: 30000,
      },
      {
        text: '1min',
        value: 60000,
      },
      {
        text: '5min',
        value: 300000,
      },
      {
        text: '30min',
        value: 1800000,
      },
    ], // 采集频率列表
    parameterList: [], // 通讯参数列表
    syncParamList: [], // 同步参数列表
  },
  mutations: {
    setParamTypeList: set('paramTypeList'),
    setDataTypeList: set('dataTypeList'),
    setConnectionList: set('connectionList'),
    setConnectionDetail: set('connectionDetail'),
    setProtocalList: set('protocalList'),
    setParameterList: set('parameterList'),
    setSyncParamList: set('syncParamList'),
  },
  actions: {
    async getParamTypeList({ commit }, payload) {
      const result = await this.$systemQuery(payload);
      if (!result) {
        return false;
      }
      const { data } = result;
      if (data?.length) {
        const list = data.map((item, index) => {
          const obj = {
            ...item,
            no: index + 1,
            id: index + 1,
          };
          return obj;
        });
        commit('setParamTypeList', list);
      } else {
        commit('setParamTypeList', []);
      }
      return true;
    },
    async getDataTypeList({ commit }) {
      const result = await this.$systemGet('dict/data/list?dictType=sys_parameter_data');
      if (!result) {
        return false;
      }
      commit('setDataTypeList', result.rows);
      return true;
    },
    async getConnectionList({ commit }, needAlert) {
      const result = await this.$basicGet('connection/list');
      if (!result) {
        return;
      }
      if (result.rows) {
        const list = result.rows.map((item) => {
          const obj = {
            ...item,
            id: item.connectionId,
          };
          return obj;
        });
        commit('setConnectionList', list);
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
    async getConnectionDetailById({ commit }, connectionId) {
      const result = await this.$basicGet(`connection/${connectionId}`);
      if (!result) {
        return false;
      }
      commit('setConnectionDetail', result.data || {});
      return result.data;
    },
    async getConnectionDetailByIdAndType(_, { connectionId, connectionType }) {
      const result = await this.$basicGet(`connection/getInfoByIdAndType?connectionId=${connectionId}&connectionType=${connectionType}`);
      if (!result) {
        return false;
      }
      return result.data;
    },
    async updateConnection({ commit }, payload) {
      const result = await this.$basicPut('connection', payload);
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
    async addConnection({ commit }, payload) {
      const result = await this.$basicPost('connection', payload);
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
    async delConnection({ commit }, connectionIds) {
      const result = await this.$basicDelete(`connection/${connectionIds}`, {});
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
    async getParametersById({ commit }, connection) {
      const { connectionId, connectionType } = connection;
      const result = await this.$basicGet(`parameter/list?connectionId=${connectionId}&connectionType=${connectionType}`);
      if (!result) {
        return [];
      }
      if (result.rows) {
        const list = result.rows.map((item) => {
          const obj = {
            ...item,
            id: item.parameterId,
          };
          return obj;
        });
        commit('setParameterList', list);
        return list;
      }
      return [];
    },
    async updateParameter({ commit }, payload) {
      const result = await this.$basicPut('parameter', payload);
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
    async addParameter({ commit }, payload) {
      const result = await this.$basicPost('parameter', payload);
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
    async addBatchParameter({ commit }, payload) {
      const result = await this.$basicPost('parameter/insertList', payload);
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
    async delParameter({ commit }, payload) {
      const result = await this.$basicPost('parameter/removeBatch', payload);
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
    // 导入模版
    // eslint-disable-next-line no-unused-vars
    async excelImport({ commit }, payload) {
      const { excelUrl, payload: file } = payload;
      // console.log(excelUrl, file);
      const result = await this.$basicPost(excelUrl, file);
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
    // 导出模版
    async eportSampleExcel(_, payload) {
      const result = await this.$basicExport(
        'parameter/importConnectionTypeTemplate',
        `模版_${new Date().getTime()}.xlsx`,
        payload,
      );
      if (!result) {
        return false;
      }
      return true;
    },
    // 导出列表
    async excelExport(_, payload) {
      const filename = `数据_${new Date().getTime()}.xlsx`;
      const result = await this.$basicExport(
        'parameter/exportConnectionType',
        filename,
        payload,
      );
      if (!result) {
        return false;
      }
      return true;
    },
    async getMonitorValue(_, keyName) {
      const result = await this.$basicGet(`common/getRedisByName?keyName=${keyName}`);
      if (!result) {
        return false;
      }
      return result.data;
    },
    async getSyncParamList({ commit }) {
      const result = await this.$basicGet('static/list');
      if (!result) {
        return false;
      }
      commit('setSyncParamList', result.rows);
      return true;
    },
  },
});
