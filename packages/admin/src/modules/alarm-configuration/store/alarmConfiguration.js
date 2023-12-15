import { set } from '@/utils/store.helper';

export default ({
  state: {
    deviceAlarmList: [], // 设备报警列表
    paramMonitorAlarmList: [], // 参数监控报警列表
    mainDevice: {}, // 主设备
    componentList: [], // 部件列表
    alarmTypeList: [], // 报警类型列表
    parameterList: [], // 参数列表
  },
  mutations: {
    setDeviceAlarmList: set('deviceAlarmList'),
    setParamMonitorAlarmList: set('paramMonitorAlarmList'),
    setMainDevice: set('mainDevice'),
    setComponentList: set('componentList'),
    setAlarmTypeList: set('alarmTypeList'),
    setParameterList: set('parameterList'),
  },
  actions: {
    // 获取设备报警列表
    async getDeviceAlarmList({ commit }) {
      const payload = {
        API_ROUTE_PATH: 'GET_MES_STATION_SCADA_COMMUNICATE_SET',
      };
      const result = await this.$systemQuery(payload);
      if (!result) {
        return false;
      }
      const { data } = result;
      if (data?.length) {
        const list = data.map((item) => {
          const obj = {
            ...item,
          };
          return obj;
        });
        commit('setDeviceAlarmList', list);
      } else {
        commit('setDeviceAlarmList', []);
      }
      return true;
    },
    // 获取参数监控报警列表
    async getParamMonitorAlarmList({ commit }) {
      const payload = {
        API_ROUTE_PATH: 'GET_MES_STATION_SCADA_COMMUNICATE_SET',
      };
      const result = await this.$systemQuery(payload);
      if (!result) {
        return false;
      }
      const { data } = result;
      if (data?.length) {
        const list = data.map((item) => {
          const obj = {
            ...item,
          };
          return obj;
        });
        commit('setParamMonitorAlarmList', list);
      } else {
        commit('setParamMonitorAlarmList', []);
      }
      return true;
    },
    // 获取主设备编码
    async getDeviceMainItem({ commit }) {
      const payload = {
        API_ROUTE_PATH: 'XXCUS_RST_GETDEVICE_MAIN',
        AdvCondition: [{
          param_name: 'lookupType',
          condition: 'XXCUS_RLMT_MAIN_ITEM',
        }],
      };
      const result = await this.$systemQuery(payload);
      if (!result) {
        return false;
      }
      const { data } = result;
      if (data.length) {
        commit('setMainDevice', data[0]);
        return true;
      }
      commit('setMainDevice', {});
      return true;
    },
    // 获取全部部件列表
    async getComponentList({ commit }, payload) {
      const result = await this.$systemPost('/product/CreateIbomTree', payload);
      if (!result) {
        commit('setComponentList', []);
        return false;
      }
      const { data } = result;
      if (data?.length) {
        const list = data.map((item, index) => {
          const obj = {
            ...item,
            no: index + 1,
          };
          return obj;
        });
        commit('setComponentList', list);
      } else {
        commit('setComponentList', []);
      }
      return true;
    },
    // 获取报警类型列表
    async getAlarmTypeList({ commit }) {
      const payload = {
        API_ROUTE_PATH: 'XXCUS_RST_ALARM_TYPE',
      };
      const result = await this.$systemQuery(payload);
      if (!result) {
        return false;
      }
      const { data } = result;
      if (data?.length) {
        const list = data.map((item) => {
          const obj = {
            ...item,
          };
          return obj;
        });
        commit('setAlarmTypeList', list);
      } else {
        commit('setAlarmTypeList', []);
      }
      return true;
    },
    // 获取参数列表
    async getParameterList({ commit }) {
      const payload = {
        API_ROUTE_PATH: 'XXCUS_RST_PARAM_LIST',
      };
      const result = await this.$systemQuery(payload);
      if (!result) {
        return false;
      }
      const { data } = result;
      if (data?.length) {
        const list = data.map((item) => {
          const obj = {
            ...item,
          };
          return obj;
        });
        commit('setParameterList', list);
      } else {
        commit('setParameterList', []);
      }
      return true;
    },
    // 更新设备报警
    async updateDeviceAlarm({ commit }, payload) {
      const result = await this.$systemPost('/alarm/updateDeviceAlarm', payload);
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
    // 更新参数监控报警
    async updateParamMonitorAlarm({ commit }, payload) {
      const result = await this.$systemPost('/alarm/updateParamMonitorAlarm', payload);
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
    // 更新spc报警
    async updateSpcAlarm({ commit }, payload) {
      const result = await this.$systemPost('/alarm/updateSpcAlarm', payload);
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
    // 新增设备报警
    async addDeviceAlarm({ commit }, payload) {
      const result = await this.$systemPost('/alarm/addDeviceAlarm', payload);
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
    // 新增参数监控报警
    async addParamMonitorAlarm({ commit }, payload) {
      const result = await this.$systemPost('/alarm/addParamMonitorAlarm', payload);
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
    // 新增SPC报警
    async addSpcAlarm({ commit }, payload) {
      const result = await this.$systemPost('/alarm/addSpcAlarm', payload);
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
    // 删除设备报警
    async delDeviceAlarm(_, payload) {
      const result = await this.$systemPost('/alarm/deleteDeviceAlarm', payload);
      if (!result) {
        return false;
      }
      return true;
    },
    // 删除参数监控报警
    async delParamMonitorAlarm(_, payload) {
      const result = await this.$systemPost('/alarm/deleteParamMonitorAlarm', payload);
      if (!result) {
        return false;
      }
      return true;
    },
    // 删除SPC报警
    async delSpcAlarm(_, payload) {
      const result = await this.$systemPost('/alarm/deleteSpcAlarm', payload);
      if (!result) {
        return false;
      }
      return true;
    },
    // 导入参数表格文件
    async excelImport(_, payload) {
      const result = await this.$systemPost('/product/ImportCommunicateDetail', payload);
      if (!result) {
        return false;
      }
      return true;
    },
    // 导出参数表格文件
    async excelExport(_, payload) {
      const result = await this.$systemPost('/product/exportCommunicateDetail', payload);
      if (!result) {
        return false;
      }
      const { data } = result;
      return data;
    },
    // 导出参数模板文件
    async eportSampleExcel(_, payload) {
      const result = await this.$systemQuery(payload);
      if (!result) {
        return false;
      }
      const { data } = result;
      if (data.length) {
        return data[0];
      }
      return false;
    },
  },
});
