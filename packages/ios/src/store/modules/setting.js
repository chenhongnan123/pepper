import { set } from '@/utils/helper';
import ServiceFactory from '@/service/ServiceFactory';

const { CommonService } = ServiceFactory;
export default {
  state: {
    userInfo: null,
    me: null,
    curLoginInfo: {},
    settingDialog: false, // TODO debug 默认是 true
    machineList: [],
    machine: {},
    scanDialog: false,
    authAction: '',
    mainProduct: null,
  },
  mutations: {
    setUserInfo: set('userInfo'),
    setMe: set('me'),
    setCurLoginInfo: set('curLoginInfo'),
    SET_STTINGDIALOG: set('settingDialog'),
    SET_MACHINE: set('machine'),
    SET_MACHINELIST: set('machineList'),
    SET_SCANDIALOG: set('scanDialog'),
    SET_AUTHACTION: set('authAction'),
    setMainProduct: set('mainProduct'),
  },
  actions: {
    async LOGOUT({ commit }, payload) {
      const { id } = payload;
      const { data } = await CommonService.postMdo(
        'login/changeLogin',
        '',
        { id },
      );
      if (!data) {
        return false;
      }
      const { returnCode, msg } = data;
      if (returnCode === 200) {
        return true;
      }
      commit('helper/SET_ALERT', {
        show: true,
        type: 'error',
        message: msg,
      }, { root: true });
      return false;
    },
    async CHANGELOGIN({ commit }, payload) {
      const { data } = await CommonService.postMdo(
        'login/changeLogin',
        '',
        payload,
      );
      if (!data) {
        return false;
      }
      const { returnCode, content } = data;
      if (returnCode === 200 || returnCode === 549 || returnCode === 534) {
        return returnCode;
      }
      commit('helper/SET_ALERT', {
        show: true,
        type: 'error',
        message: content,
      }, { root: true });
      return false;
    },
    // CHECK_AUTH: async ({ commit }, query) => {
    //   const { data } = await CommonService.getMdo('login/checkAuth', query);
    //   if (!data) {
    //     return false;
    //   }
    //   if (data.returnCode === 200) {
    //     return data.result;
    //   }
    //   commit(
    //     'helper/SET_ALERT',
    //     {
    //       show: true,
    //       type: 'error',
    //       message: data.msg,
    //     },
    //     { root: true },
    //   );
    //   return false;
    // },
    async CHECK_AUTH(_, payload) {
      const result = await this.$systemQuery(payload);
      if (!result) {
        return false;
      }
      const { data } = result;
      if (data?.length) {
        return true;
      }
      return false;
    },
    HANDLE_AUTHACTION({ commit }, payload) {
      const { authAction, callback } = payload;
      commit('SET_AUTHACTION', authAction);
      commit('SET_SCANDIALOG', true);
      this.authCallback = callback;
    },
    AUTHCALLBACK(hold, cardNo) {
      this.authCallback(cardNo);
    },
    async getCurLoginInfo({ commit }, userName) {
      const result = await this.$systemGet(`logininfor/list?userName=${userName}&pageNum=1&pageSize=1`, '');
      if (!result) {
        return;
      }
      const { rows } = result;
      if (rows.length) {
        commit('setCurLoginInfo', rows[0]);
      } else {
        commit('setCurLoginInfo', {});
      }
    },
    async getMainProduct({ commit }) {
      const result = await this.$basicGet('device/list');
      if (!result) {
        return;
      }
      const { rows } = result;
      if (rows.length) {
        commit('setMainProduct', rows[0]);
      } else {
        commit('setMainProduct', null);
      }
    },
  },
};
