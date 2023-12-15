import { set } from '@/utils/helper';

export default {
  state: {
    paramTypeList: [],
    statusMonitorList: [],
    healthList: [],
    performanceList: [],
    performanceScore: 0,
    qualityList: [],
    qualityScore: 0,
    mainPartList: [],
    mainPointList: [],
  },
  mutations: {
    setParamTypeList: set('paramTypeList'),
    setStatusMonitorList: set('statusMonitorList'),
    setHealthList: set('healthList'),
    setPerformanceList: set('performanceList'),
    setPerformanceScore: set('performanceScore'),
    setQualityList: set('qualityList'),
    setQualityScore: set('qualityScore'),
    setMainPartList: set('mainPartList'),
    setMainPointList: set('mainPointList'),
  },
  actions: {
    async getMainPart({ rootState, commit }) {
      const { mainProduct } = rootState.setting;
      if (!mainProduct) { return []; }
      const { productCode } = mainProduct;
      const payload = {
        productCode,
        expend2D: true,
        includeTopLevel: false,
        isKey: true,
      };
      const result = await this.$systemPost('product/CreateIbomTree', payload);
      if (!result) {
        return [];
      }
      const list = result.data.map((item) => item.modelId);
      commit('setMainPartList', list);
      return list;
    },
    async getMainPoint({ commit }) {
      const payload = {
        API_ROUTE_PATH: 'GET_STATION_EARLY_WARNING_LIST',
      };
      const result = await this.$systemQuery(payload, 'mock1');
      if (!result) {
        return [];
      }
      commit('setMainPointList', result.data);
      return result.data;
    },
    async getParameterTypeList({ commit }) {
      const payload = {
        API_ROUTE_PATH: 'XXCUS_RST_PARAMS_TYPE',
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
        commit('setParamTypeList', list);
      } else {
        commit('setParamTypeList', []);
      }
      return true;
    },
    async getMonitorStatusList({ commit }) {
      const payload = {
        API_ROUTE_PATH: 'GET_CONDITION_MONITORING_DATA',
        AdvCondition: [{
          param_name: 'dataType',
          condition: null,
        }],
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
        commit('setStatusMonitorList', list);
      } else {
        commit('setStatusMonitorList', []);
      }
      return true;
    },
    async getHealthList({ commit }) {
      // const payload = {
      //   API_ROUTE_PATH: 'GET_DEVICE_STATE_GRADE',
      //   AdvCondition: [{
      //     param_name: 'stateType',
      //     condition: '设备健康状态',
      //   }],
      // };
      // const result = await this.$systemQuery(payload, 'mock1');
      const payload = {
        // totalSource: 'False',
        productCode: null,
        includeTopLevel: false,
      };
      const result = await this.$systemPost('healthIO/scoreDetail', payload);
      if (!result) {
        return [];
      }
      const { data } = result;
      const list = data.map((item) => {
        const obj = {
          ...item,
          grade: item?.prodductTaskSource?.AllAvgSource || '',
        };
        return obj;
      });
      commit('setHealthList', list);
      return data;
    },
    async getPerformanceList({ commit }) {
      // const payload = {
      //   API_ROUTE_PATH: 'GET_DEVICE_STATE_GRADE',
      //   AdvCondition: [{
      //     param_name: 'stateType',
      //     condition: '设备绩效得分',
      //   }],
      // };
      // const result = await this.$systemQuery(payload, 'mock1');
      const payload = {
        totalSource: 'False',
      };
      const result = await this.$systemPost('performanceIO/scoreDetail/', payload);
      if (!result) {
        return [];
      }
      if (result.data?.Details) {
        commit('setPerformanceList', result.data.Details);
      } else {
        commit('setPerformanceList', []);
      }
      if (result.data?.Score) {
        commit('setPerformanceScore', result.data.Score);
      } else {
        commit('setPerformanceScore', 0);
      }
      return result.data.Details;
    },
    async getQualityList({ commit }) {
      // const payload = {
      //   API_ROUTE_PATH: 'GET_DEVICE_STATE_GRADE',
      //   AdvCondition: [{
      //     param_name: 'stateType',
      //     condition: '实时质量得分',
      //   }],
      // };
      // const result = await this.$systemQuery(payload, 'mock1');
      const payload = {
        totalSource: 'False',
      };
      const result = await this.$systemPost('qualityIO/scoreDetail', payload);
      if (!result) {
        return [];
      }
      if (result.data?.QualityItem) {
        commit('setQualityList', result.data.QualityItem);
      } else {
        commit('setQualityList', []);
      }
      if (result.data?.Source) {
        commit('setQualityScore', result.data.Source);
      } else {
        commit('setQualityScore', 0);
      }
      return result.data.QualityItem;
    },
  },
};
