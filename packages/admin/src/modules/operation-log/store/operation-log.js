import { set } from '@/utils/store.helper';

export default ({
  state: {
    operationLogList: [], // 日志列表
    operTypeList: [], // 操作类型
    commonStatusList: [], // 操作状态
  },
  mutations: {
    setOperationLogList: set('operationLogList'),
    setOperTypeList: set('operTypeList'),
    setCommonStatusList: set('commonStatusList'),
  },
  actions: {
    async getOperationLogList({ commit }) {
      const url = '/operlog/list?orderByColumn=operTime&isAsc=descending';
      const result = await this.$systemGet(url);
      if (!result) {
        return false;
      }
      const { rows } = result;
      if (rows?.length) {
        const list = rows.map((item) => {
          const obj = {
            ...item,
            id: item.operId,
          };
          return obj;
        });
        commit('setOperationLogList', list);
      } else {
        commit('setOperationLogList', []);
      }
      return true;
    },
    async getOperTypeDictList({ commit }) {
      const result = await this.$systemGet('/dict/data/list?dictType=sys_oper_type');
      if (!result) {
        return false;
      }
      const { rows } = result;
      if (rows?.length) {
        commit('setOperTypeList', rows);
      } else {
        commit('setOperTypeList', []);
      }
      return true;
    },
    async getCommonStatusList({ commit }) {
      const result = await this.$systemGet('/dict/data/type/sys_common_status');
      if (!result) {
        return false;
      }
      const { data } = result;
      if (data?.length) {
        commit('setCommonStatusList', data);
      } else {
        commit('setCommonStatusList', []);
      }
      return true;
    },
    // 删除日志
    async delOperationLog(_, ids) {
      const result = await this.$systemDelete(`/operlog/${ids}`);
      if (!result) {
        return false;
      }
      return true;
    },
    // 清空日志
    async cleanOperationLog() {
      const result = await this.$systemDelete('/operlog/clean');
      if (!result) {
        return false;
      }
      return true;
    },
    // 导出日志数据
    async excelExport() {
      const filename = `operationLog_${new Date().getTime()}.xlsx`;
      const result = await this.$systemExport('/operlog/export', filename);
      if (!result) {
        return false;
      }
      return true;
    },
  },
});
