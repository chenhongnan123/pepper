import { set } from '@/utils/helper';

export default ({
  state: {
    mainDeviceInfo: {}, // 设备信息
    suggestionList: [], // 建议列表
    bomFirstList: [], // 设备BOM一级列表
    deviceBomInfo: {}, // 设备BOM信息
    deviceHealthInfo: {}, // 设备健康指数信息
    deviceScore: [], // 设备得分
    healthAverage: 0,
    monthScoreList: [],
    partsList: [],
    deviceBomDetail: {},
    recordList: [],
    algorithmModelList: [], // 数据监测列表
    maintenanceTaskList: [], // 维保任务列表
    taskStatusList: [], // 维保任务状态字典列表
    partTypeList: [], // 零件类型列表
    algorithmTypeList: [], // 报警颜色列表
    algorithmIconList: [], // 报警ICON列表
    mainDevice: [],
    partList: [],
    bomList: [],
    partAnnexInfo: {},
    algorithmPlcList: [],
    partHealthDetailInfo: {},
  },
  mutations: {
    setMainDeviceInfo: set('mainDeviceInfo'),
    setSuggestionList: set('suggestionList'),
    setDeviceBomInfo: set('deviceBomInfo'),
    setBomFirstList: set('bomFirstList'),
    setDeviceHealthInfo: set('deviceHealthInfo'),
    setDeviceScore: set('deviceScore'),
    setHealthAverage: set('healthAverage'),
    setMonthScoreList: set('monthScoreList'),
    setPartsList: set('partsList'),
    setDeviceBomDetail: set('deviceBomDetail'),
    setPartTypeList: set('partTypeList'),
    setAlgorithmModelList: set('algorithmModelList'),
    setAlgorithmPlcList: set('algorithmPlcList'),
    setMaintenanceTaskList: set('maintenanceTaskList'),
    setTaskStatusList: set('taskStatusList'),
    setRecordList: set('recordList'),
    setAlgorithmTypeList: set('algorithmTypeList'),
    setAlgorithmIconList: set('algorithmIconList'),
    setMainDevice: set('mainDevice'),
    setPartList: set('partList'),
    setBomList: set('bomList'),
    setPartAnnexInfo: set('partAnnexInfo'),
    setPartHealthDetailInfo: set('partHealthDetailInfo'),
    setDeviceBomDetailInfo: set('deviceBomDetailInfo'),
  },
  actions: {
    // 获取设备信息
    async getMainDeviceInfo({ commit }) {
      const result = await this.$systemGet('monitor/deviceInfo');
      if (!result) {
        commit('setMainDeviceInfo', {});
        return;
      }
      commit('setMainDeviceInfo', result.data || {});
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
    // 获取建议列表
    async getSuggestionList({ commit }) {
      const result = await this.$systemGet('monitor/suggestionList');
      if (!result) {
        commit('setSuggestionList', []);
        return;
      }
      commit('setSuggestionList', result.data || []);
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
    // 获取设备BOM信息
    async getDeviceBomInfo({ commit }) {
      const result = await this.$basicGet('common/getRedisByName?keyName=bomHealth');
      if (!result) {
        commit('setDeviceBomInfo', []);
        return;
      }
      commit('setDeviceBomInfo', result.data || []);
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
    // 获取设备BOM一级列表
    async getBomFirstList({ commit }) {
      const result = await this.$basicGet('bom/firstFloorlist');
      if (!result) {
        commit('setBomFirstList', []);
        return;
      }
      commit('setBomFirstList', result.rows || []);
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
    // 获取设备健康指数
    async getDeviceHealthInfo({ commit }) {
      const result = await this.$basicGet('common/getRedisByName?keyName=partHealth');
      if (!result) {
        commit('setDeviceHealthInfo', []);
        return;
      }
      commit('setDeviceHealthInfo', result.data || []);
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
    // 获取零件状态信息
    async getPartHealthDetailInfo({ commit }, payload) {
      const result = await this.$basicGet(`common/getBomHealthInfo/${payload}`);
      if (!result) {
        commit('setPartHealthDetailInfo', []);
        return;
      }
      commit('setPartHealthDetailInfo', result.data || []);
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
    // 查询BOM健康分数最高和最低
    async getDeviceScore({ commit }) {
      const result = await this.$basicGet('bom/getHealthScoreHighestAndMinimum');
      if (!result) {
        commit('setDeviceScore', []);
        return;
      }
      commit('setDeviceScore', result.rows || []);
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
    // 查询30天内评分情况
    async getMonthScoreList({ commit }) {
      const result = await this.$basicGet('scoreTrend/list?pageSize=30&pageNum=1');
      if (!result) {
        commit('setMonthScoreList', []);
        return;
      }
      commit('setMonthScoreList', result.rows || []);
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
    // 查询30天内评分情况
    async getMonthScoreDetailList({ commit }, payload) {
      const result = await this.$basicGet(`trend/list?bomId=${payload}&pageSize=30&pageNum=1`);
      if (!result) {
        commit('setMonthScoreList', []);
        return;
      }
      commit('setMonthScoreList', result.rows || []);
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
    // 查询零件表
    async getPartsList({ commit }, payload) {
      const result = await this.$basicGet(`bom/selectNextLevelListByBomId?${payload}`);
      if (!result) {
        commit('setPartsList', []);
        return;
      }
      commit('setPartsList', result.rows || []);
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
    // 查询零件表
    async getDeviceBomDetail({ commit }, payload) {
      const result = await this.$basicGet(`part/${payload}`);
      if (!result) {
        commit('setDeviceBomDetail', []);
        return;
      }
      commit('setDeviceBomDetail', result.rows || []);
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
    // 查询监测记录数据告警列表
    async getRecordList({ commit }, payload) {
      const result = await this.$basicGet(`record/list/?${payload}`);
      if (!result) {
        commit('setRecordList', []);
        return;
      }
      const alarmData = result.rows.map((ele) => ({
        ...ele,
        alarmType: 'data',
      }));
      commit('setRecordList', alarmData || []);
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
    // 获取PLC报警列表
    async getAlgorithmPlcList({ commit }, bomId) {
      const result = await this.$basicGet(`monitor/list/?bomId=${bomId}&alarmState=0`);
      if (!result) {
        return;
      }
      const { rows } = result;
      const alarmData = rows.map((ele) => ({
        ...ele,
        alarmType: 'plc',
      }));

      commit('setAlgorithmPlcList', alarmData || []);
    },
    // 获取数据监测列表
    async getAlgorithmModelList({ commit }, bomId) {
      const result = await this.$basicGet(`model/dataMonitor/${bomId}`);
      if (!result) {
        return;
      }
      const { data } = result;
      if (data?.length) {
        commit('setAlgorithmModelList', data);
      } else {
        commit('setAlgorithmModelList', []);
      }
    },
    // 获取维保任务列表
    async getMaintenanceTaskList({ commit }, bomId) {
      const result = await this.$basicGet(`maintenance_task/list?maintenanceLocation=${bomId}`);
      if (!result) {
        commit('setMaintenanceTaskList', []);
        return;
      }
      const { rows, systemTime } = result;
      if (rows?.length) {
        const list = rows.map((item) => {
          const obj = {
            ...item,
            isDelay: item.planEndTime
              ? systemTime > new Date(item.planEndTime).getTime()
              : false, // 判断任务是否逾期
          };
          return obj;
        });
        commit('setMaintenanceTaskList', list);
      } else {
        commit('setMaintenanceTaskList', []);
      }
    },
    // 获取设备bom详细信息
    async getDeviceBomDetailInfo({ commit }, bomId) {
      const result = await this.$basicGet(`bom/${bomId}`);
      if (!result) {
        return false;
      }
      commit('setDeviceBomDetailInfo', result?.data || {});
      return true;
    },
    // 获取任务状态字典表
    async getTaskStatusList({ commit }) {
      const result = await this.$systemGet('dict/data/list?dictType=sys_task_status');
      if (!result) {
        commit('setTaskStatusList', []);
        return;
      }
      commit('setTaskStatusList', result.rows || []);
    },
    // 零件类型表
    async getPartTypeList({ commit }) {
      const result = await this.$systemGet('dict/data/list?dictType=part_type');
      if (!result) {
        return;
      }
      commit('setPartTypeList', result.rows || []);
    },
    // 报警算法字典表
    async getAlgorithmTypeList({ commit }) {
      const result = await this.$systemGet('dict/data/list?dictType=sys_algorithm');
      if (!result) {
        return;
      }
      commit('setAlgorithmTypeList', result.rows || []);
    },
    // 报警icon字典表
    async getAlgorithmIconList({ commit }) {
      const result = await this.$systemGet('dict/data/list?dictType=sys_algorithm_icon');
      if (!result) {
        return;
      }
      commit('setAlgorithmIconList', result.rows || []);
    },
    async getDeviceMainItem({ commit }) {
      const result = await this.$basicGet('device/list');
      if (!result) {
        return false;
      }
      const { rows } = result;
      if (rows.length) {
        commit('setMainDevice', rows[0]);
        return true;
      }
      commit('setMainDevice', {});
      return true;
    },
    async getPartList({ commit }) {
      const result = await this.$basicGet('part/list');
      if (!result) {
        return;
      }
      commit('setPartList', result.rows || []);
    },
    async getBOMList({ commit }) {
      const result = await this.$basicGet('bom/list');
      if (!result) {
        return;
      }
      commit('setBomList', result.rows || []);
    },
    // 获取零件+附件详细信息
    async getPartAnnexInfo({ commit }, partId) {
      const result = await this.$basicGet(`part/annex/${partId}?module=partManagementDetail`);
      if (!result) {
        return;
      }
      commit('setPartAnnexInfo', result.data || {});
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
  },
});
