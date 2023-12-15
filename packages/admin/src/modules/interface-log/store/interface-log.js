import { set } from '@/utils/store.helper';

export default ({
  state: {
    interfaceLogList: [],
    interfaceLogInfo: null,
  },
  mutations: {
    setInterfaceLogList: set('interfaceLogList'),
    setInterfaceLogInfo: set('interfaceLogInfo'),
  },
  actions: {
    // 获取接口日志
    async getInterfaceLogList({ commit }, dateArr) {
      const [beginTime, endTime] = dateArr;
      console.log(beginTime, endTime);
      const result = await this.$basicGet(
        `interfacelog/list?beginTime=${beginTime}&endTime=${endTime}&delFlag=0`,
      );
      // const result = {
      //   rows: [
      //     {
      //       interfaceId: 1,
      //       upperSystem: '上层系统',
      //       status: 0,
      //     },
      //     {
      //       interfaceId: 2,
      //       upperSystem: '上层系统',
      //       status: 1,
      //     },
      //   ],
      // };
      if (!result) {
        return;
      }
      commit('setInterfaceLogList', result.rows || []);
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
    async getInterfaceLogInfo({ commit }, interfaceId) {
      console.log(interfaceId);
      const result = await this.$basicGet(
        `interfacedetail/list?interfaceId=${interfaceId}`,
      );
      // const result = {
      //   rows: [
      //     {
      //       detailId: 1,
      //       url: 'http://10.6.105.25:8180/mes/dcs/jk-param.html',
      //       interfaceDesc: '接口描述',
      //       interfaceParam: {
      //         closeOther: 0,
      //         params: {},
      //         productId: 1063,
      //       },
      //       jsonResult: {
      //         code: 200,
      //         msg: '操作成功',
      //       },
      //     },
      //   ],
      // };
      if (!result) {
        return;
      }
      commit('setInterfaceLogInfo', result.rows[0] || {});
    },
  },
  getters: {},
});
