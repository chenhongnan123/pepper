import { set } from '@/utils/store.helper';

export default ({
  state: {
    loginLogList: [],
    commonStatusList: [], // 操作状态
  },
  mutations: {
    setLoginLogList: set('loginLogList'),
    setCommonStatusList: set('commonStatusList'),
  },
  actions: {
    async getLoginLogList({ commit }) {
      const result = await this.$systemGet('/logininfor/list');
      if (!result) {
        return false;
      }
      const { rows } = result;
      if (rows?.length) {
        const list = rows.map((item) => {
          const obj = {
            ...item,
            id: item.infoId,
          };
          return obj;
        });
        commit('setLoginLogList', list);
      } else {
        commit('setLoginLogList', []);
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
    async delLoginLog(_, ids) {
      const result = await this.$systemDelete(`/logininfor/${ids}`);
      if (!result) {
        return false;
      }
      return true;
    },
    // 清空日志
    async cleanLoginLog() {
      const result = await this.$systemDelete('/logininfor/clean');
      if (!result) {
        return false;
      }
      return true;
    },
    // 导出日志数据
    async excelExport() {
      const filename = `loginLog_${new Date().getTime()}.xlsx`;
      const result = await this.$systemExport('/logininfor/export', filename);
      if (!result) {
        return false;
      }
      return true;
    },
  },
});
