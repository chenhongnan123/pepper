// faultDiagnosis 故障诊断
/* eslint-disable */
import { set } from '@/utils/helper';

export default {
  state: {
    // 报警详情 + 测点信息 数组
    alarmDetail: [],
    alarmObj: {}, // 报警对象
    bomList: [], // bom列表
    errorCodeList: [], // 故障代码列表
    newTaskNo: '', // 新建任务编号
    bomObj: {}, // bom对象
    newTaskObj: {}, // 新建任务对象
    isShowRepairDialog: false,
    curveData: {},
    // fileList: [],
    pointCount: [], // [ { "key": "DEFULT", "value": 9 }, { "key": "ERROR", "value": 2 }, { "key": "NORMAL", "value": 2 }, { "key": "WARRNING", "value": 1 } ]
    plcAlarmList: [],
    dataAlarmList: [],
    itemTypeList: [], // 零件类型列表
    bomDetail: {}, // bom详情
    fileList: [], // 文件列表
    alarmTotalCount: {}, // 报警总数（这个对象包含了维保任务数）
  },
  mutations: {
    setAlarmDetail: set('alarmDetail'),
    setAlarmObj: set('alarmObj'),
    setBomList: set('bomList'),
    setErrorCodeList: set('errorCodeList'),
    setNewTaskNo: set('newTaskNo'),
    setBomObj: set('bomObj'),
    setNewTaskObj: set('newTaskObj'),
    SET_ISSHOWREPAIRDIALOG: set('isShowRepairDialog'),
    setCurveData: set('curveData'),
    // setFileList: set('fileList'),
    setPointCount: set('pointCount'),
    setPlcAlarmList: set('plcAlarmList'),
    setDataAlarmList: set('dataAlarmList'),
    setItemTypeList: set('itemTypeList'),
    setBomDetail: set('bomDetail'),
    setFileList: set('fileList'),
    setAlarmTotalCount: set('alarmTotalCount'),
  },
  actions: {
    // 获取PLC报警记录
    async getPlcAlarmList({ commit }) {
      const result = await this.$basicGet('monitor/list?alarmState=0');
      if (!result) {
        return false;
      }
      const { rows } = result;
      commit('setPlcAlarmList', rows || []);
      return true;
    },
    // 获取数据报警记录
    async getDataAlarmList({ commit }) {
      const result = await this.$basicGet('alarm/dataRecord');
      if (!result) {
        return false;
      }
      commit('setDataAlarmList', result.data || []);
      return true;
    },
    async getDictDataList({ commit }, dictType) {
      const result = await this.$systemGet(`dict/data/list?dictType=${dictType}`);
      if (!result) {
        return;
      }
      return result.rows;
    },
    // 获取测点
    async getCountInfo() {
      const result = await this.$basicGet('bom/bomMonitor');
      if (!result) {
        return;
      }
      return result.data;
    },
    // 获取报警记录
    async getAlarmRecordList() {
      const result = await this.$basicGet('alarm/record');
      if (!result) {
        return;
      }
      return result.data;
    },
    // 获取零件类型列表
    async getItemTypes({ commit }) {
      const result = await this.$systemGet('dict/data/list?dictType=part_type');
      if (!result) {
        return;
      }
      commit('setItemTypeList', result?.rows || []);
    },
    //获取报警总记录数
    async getAlarmTotalCount({ commit }) {
      const result = await this.$basicGet('alarm/count');
      if (!result) {
        return [];
      }
      commit('setAlarmTotalCount', result.data);
      // return result.data;
    },
    // 获取设备bom详情
    async getBomDetail({ commit }, bomId) {
      const result = await this.$basicGet(`bom/${bomId}`);
      if (!result) {
        return false;
      }
      commit('setBomDetail', result?.data || {});
      return true;
    },
    // 获取关联文件列表
    async getFileList({ commit }, { module, bomId }) {
      const result = await this.$systemGet(`relationship/boardSelectFiles?module=${module}&outsideId=${bomId}`);
      if (!result) {
        return false;
      }
      commit('setFileList', result?.rows || []);
      return true;
    },
    async getPointCount({ commit }) {
      const payload = { API_ROUTE_PATH: 'GET_POINT_STATUS_TOTAL' };
      const result = await this.$systemQuery(payload);
      if (!result) {
        return false;
      }
      const { data } = result;
      if (data) {
        // console.log('data', data);
        commit('setPointCount', data);
        return true;
      }
      commit('setPointCount', [ { "key": "DEFULT", "value": 0 }, { "key": "ERROR", "value": 0 }, { "key": "NORMAL", "value": 0 }, { "key": "WARRNING", "value": 0 } ]);
      return true;
    },
    async getAlarmDetail({ commit }) {
      const payload = { API_ROUTE_PATH: 'GET_ALARM_INFO_LIST' };
      const result = await this.$systemQuery(payload);
      if (!result) {
        return false;
      }
      const { data } = result;
      if (data.length) {
        commit('setAlarmDetail', data);
        return true;
      }
      commit('setAlarmDetail', []);
      return true;
    },
    // 已处理按钮；取消报警
    async cancelAlarm(_store, payload) {
      const result = await this.$systemPost('/alarm/changeAlarmStatus/', payload);
      if (!result) {
        return false;
      }
      return true;
    },
    // 生成维修任务 defectReport/updateDefectReport
    async createRepairTask(_store, payload) {
      const result = await this.$systemPost(payload);
      return result;
    },
    async getBomList({ commit }) {
      const result = await this.$basicGet('bom/selectBomTree');
      if (!result) {
        return false;
      }
      const { rows } = result;
      if (rows?.length) {
        commit('setBomList', rows);
      } else {
        commit('setBomList', []);
      }
      return true;
    },
    formatBomList: ({ dispatch }, bomlist) => {
      if (bomlist.length === 0) {
        return [];
      }
      const list = bomlist;
      for (let i = 0; i < list.length; i += 1) {
        if (list[i]) {
          list[i] = {
            ...list[i],
            isMatainDisabled: !list[i].isMatainPart,
            isParent: list[i].bomLevel === '1',
          };
        }
        if (
          list[i].childrenBomList
          && list[i].childrenBomList.length > 0
        ) {
          dispatch('formatBomList', list[i].childrenBomList);
        }
      }
      return list;
    },
    getFormatBomList: async ({ dispatch, state }) => {
      await dispatch('getBomList');
      const { bomList } = state;
      return dispatch('formatBomList', bomList);
    },
    // 获取故障代码 列表
    async getErrorCodeList({ commit }) {
      const result = await this.$basicGet('code/listAlarm');
      if (!result) {
        return false;
      }
      commit('setErrorCodeList', result.rows || []);
      return true;
    },
    // 新增一个维修任务
    async addRepairTask(_, payload) {
      const result = await this.$basicPost('fault_repair', payload);
      if (!result) {
        return false;
      }
      console.log(result , 'addRepairTask')
      return result.data || {};
    },
    // 查询一个维修任务对象
    async getRepairTask(_, faultRepairId) {
      const result = await this.$basicGet(`maintenance_task/list?faultRepairId=${faultRepairId}`);
      // console.log('getRepairTask', result);
      if (!result) {
        return {};
      }
      const { rows } = result;
      if (rows?.length > 0) {
        return rows[0];
      }
      return {};
    },
    // 取消一个维修任务
    async cancelRepairTask({ state }, taskNo) {
      const payload = {
        taskNo: String(taskNo) || state.newTaskNo,
        taskStatus: 5,
      };
      const result = await this.$systemPost('/operationTask/updateTaskStatus', payload);
      if (!result) {
        return false;
      }
      return true;
    },
    // 开始一个维修任务
    async startRepairTask({ state }, taskNo) {
      const payload = {
        taskNo: String(taskNo) || state.newTaskNo,
        taskStatus: 2,
      };
      const result = await this.$systemPost('/operationTask/updateTaskStatus', payload);
      if (!result) {
        return false;
      }
      return true;
    },
    // 获取曲线数据
    async getCurveData({ commit }, payload) {
      const result = await this.$systemPost('/alarm/getAlarmPLCHistory', payload);
      if (!result) {
        return false;
      }
      // console.log('曲线数据', result.data || '');
      commit('setCurveData', result.data || {});
      return true;
    },
    // 获取文件列表
    // async getFileList({ commit }) {
    //   const payload = {
    //     API_ROUTE_PATH: 'GET_ATT_DETAILS',
    //     AdvCondition: [{
    //       param_name: 'id',
    //       condition: '',
    //     }, {
    //       param_name: 'docType',
    //       condition: 'DeviceDoc',
    //     }],
    //   };
    //   const result = await this.$systemQuery(payload);
    //   if (!result) {
    //     return false;
    //   }
    //   // console.log('文件列表', result.data || '');
    //   commit('setFileList', result.data || []);
    //   return true;
    // },
    // bom 列表  页码字段是 positionNum
    async getBomArray({ rootState }) {
      const { productCode } = rootState.setting.mainProduct;
      if (!productCode) return [];
      const payload = {
        productCode,
        expend2D: true, // false -返回树形结构，true-返回列表结构
        includeTopLevel: true, // false-不包含顶层， true-包含顶层
      };
      const result = await this.$systemPost('product/CreateIbomTree', payload);
      if (!result) {
        return [];
      }
      const { data } = result;
      if (data) {
        return data;
      }
      return [];
    },
    async getPageNumBySymbol(_, payload) {
      const result = await this.$systemPost('/alarm/getPDFPage', payload);
      if (!result) {
        return null;
      }
      const { data } = result;
      return data || null;
    },
  },
};
