import { set } from '@/utils/helper';

export default {
  state: {
    machineBomList: [], // 设备BOM列表
    bomDetailList: [], // BOM列表
    dataSourceList: [], // 数据源列表
    dataParamList: [], // 数据源参数列表
    monitorList: [], // PLC报警监控列表
    recordList: [], // 监测记录列表
    timeRange: [], // 时间轴范围
    xrangeChartDataList: [], // 甘特图表数据
    lineChartDataList: [], // 折线图表数据
    selectedVideo: {}, // 选中的视频
    selectedAlarm: {}, // 选中的报警
    storageFrequencyList: [
      {
        text: '50ms',
        value: '0',
      },
      {
        text: '100ms',
        value: '1',
      },
      {
        text: '500ms',
        value: '2',
      },
      {
        text: '1s',
        value: '3',
      },
      {
        text: '5s',
        value: '4',
      },
      {
        text: '30s',
        value: '5',
      },
      {
        text: '1min',
        value: '6',
      },
      {
        text: '5min',
        value: '7',
      },
      {
        text: '30min',
        value: '8',
      },
    ], // 储存频率列表
  },
  mutations: {
    setMachineBomList: set('machineBomList'),
    setBomDetailList: set('bomDetailList'),
    setDataSourceList: set('dataSourceList'),
    setDataParamList: set('dataParamList'),
    setMonitorList: set('monitorList'),
    setRecordList: set('recordList'),
    setTimeRange: set('timeRange'),
    setXrangeChartDataList: set('xrangeChartDataList'),
    setLineChartDataList: set('lineChartDataList'),
    setSelectedVideo: set('selectedVideo'),
    setSelectedAlarm: set('selectedAlarm'),
  },
  actions: {
    async getMachineBomList({ commit }) {
      const result = await this.$basicGet('bom/firstFloorlist');
      if (!result) {
        return false;
      }
      const { rows } = result;
      if (rows) {
        commit('setMachineBomList', rows);
      } else {
        commit('setMachineBomList', []);
      }
      return true;
    },
    async getBomTableList({ commit }, bomParentId) {
      const result = await this.$basicGet(`bom/selectNextLevelListByBomId?bomId=${bomParentId}`);
      if (!result) {
        commit('setBomDetailList', []);
        return false;
      }
      const { rows } = result;
      if (rows?.length) {
        commit('setBomDetailList', rows);
      } else {
        commit('setBomDetailList', []);
      }
      return true;
    },
    async getDataSourceList({ commit }) {
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
        return;
      }
      commit('setDataSourceList', []);
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
    async getMonitorList({ commit }, query) {
      const result = await this.$basicGet(`monitor/list?${query}`);
      if (!result) {
        return [];
      }
      if (result.rows) {
        const list = result.rows.map((item) => {
          const obj = {
            ...item,
            id: item.sid,
            chartDataType: 'monitor',
          };
          return obj;
        });
        commit('setMonitorList', list);
        return list;
      }
      return [];
    },
    async getRecordList({ commit }, query) {
      const result = await this.$basicGet(`record/listSimple?${query}`);
      if (!result) {
        return [];
      }
      if (result.rows) {
        const list = result.rows.map((item) => {
          const obj = {
            ...item,
            chartDataType: 'record',
          };
          return obj;
        });
        commit('setRecordList', list);
        return list;
      }
      return [];
    },
    async getTableDataList(_, query) {
      const result = await this.$basicGet(`source/detailsList?${query}`);
      if (!result) {
        return [];
      }
      if (result.rows) {
        const list = result.rows.map((item) => {
          const obj = {
            ...item,
          };
          return obj;
        });
        return list;
      }
      return [];
    },
  },
  getters: {
  },
};
