import { set } from '@/utils/store.helper';

export default ({
  state: {
    machineTypeList: [],
    paramList: [], // 通讯参数
    machineList: [], // 设备清单
    machine: {}, // 设备
  },
  mutations: {
    setMachineTypeList: set('machineTypeList'),
    setParamList: set('paramList'),
    setMachineList: set('machineList'),
    setMachine: set('machine'),
  },
  actions: {
    // 查询设备清单
    async getMachineList({ commit }, params) {
      // 构建 URL 字符串 有时用typeId 有时用workshopId
      let url = 'device/list?delFlag=0';
      // eslint-disable-next-line
      for (const key in params) {
        if (params[key] != null) {
          url += `&${key}=${params[key]}`;
        }
      }
      const result = await this.$basicGet(url);
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setMachineList', result.rows);
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
    // 获取单个设备
    async getMachineById({ commit }, deviceId) {
      const result = await this.$basicGet(`device/${deviceId}`);
      if (!result) {
        return;
      }
      if (result.data) {
        commit('setMachine', result.data);
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
    // eslint-disable-next-line no-unused-vars
    async getParamList({ commit }, { typeId, deviceName, deviceNumber }) {
      const result = await this.$basicGet(
        `device/listParam/?typeId=${typeId}&deviceName=${deviceName}&deviceNumber=${deviceNumber}&delFlag=0`,
      );
      // const result = {};
      // result.rows = [
      //   {
      //     onlineStatus: '0',
      //     parameterName: '参数名称001',
      //     parameterNumber: '标签',
      //     categoryName: '参数类型',
      //     parameterValue: '参数值',
      //   },
      //   {
      //     onlineStatus: '1',
      //     parameterName: '参数名称002',
      //     parameterNumber: '标签',
      //     categoryName: '参数类型',
      //     parameterValue: '参数值',
      //   },
      // ];
      if (!result) {
        return [];
      }
      if (result.rows) {
        commit('setParamList', result.rows);
      }
      return result.rows;
    },
    async getMachineTypeList({ commit }) {
      const result = await this.$basicGet('type/list?delFlag=0');
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setMachineTypeList', result.rows);
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
    async updateMachine({ commit }, payload) {
      const result = await this.$basicPut('device', payload);
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
    async addMachine({ commit }, payload) {
      const result = await this.$basicPost('device', payload);
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
    async deleteMachine({ commit }, ids) {
      const result = await this.$basicDelete(`device/${ids}`);
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
    async excelExport() {
      const filename = `设备清单_${new Date().getTime()}.xlsx`;
      const result = await this.$basicExport('device/importTemplate', filename);
      if (!result) {
        return false;
      }
      return true;
    },
    async excelImport(_, { typeId, payload }) {
      const result = await this.$basicPost(`device/importData/?typeId=${typeId}`, payload);
      if (!result) {
        return false;
      }
      return true;
    },
  },
  getters: {
    formatMachineType: () => (typelist) => {
      if (typelist.length === 0) {
        return [];
      }
      const list = typelist;
      const obj = {};
      list.forEach((item) => {
        const { workshopId } = item;
        if (!obj[workshopId]) {
          obj[workshopId] = {
            id: `workshopId_${item.workshopId}`,
            workshopId: item.workshopId,
            label: item.workshopName,
            children: [
              {
                id: `typeId_${item.typeId}`,
                typeId: item.typeId,
                label: item.typeName,
              },
            ],
          };
        } else {
          obj[workshopId].children.push({
            id: `typeId_${item.typeId}`,
            typeId: item.typeId,
            label: item.typeName,
          });
        }
      });
      const machineTypeList = Object.values(obj);
      return machineTypeList;
    },
  },
});
