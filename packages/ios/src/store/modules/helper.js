import Service from '@/plugins/axios';
import moment from 'moment';
// import Cookies from 'js-cookie';
import { set, getLocale } from '@/utils/helper';
import ServiceFactory from '@/service/ServiceFactory';

const { CommonService } = ServiceFactory;
let timeout = null;
export default {
  state: {
    version: process.env.VUE_APP_VERSION || '1.0.0.0',
    developmentVersion: process.env.VUE_APP_DEVELOPMENTVERSION || '0',
    config: null,
    serverTime: '',
    session: {},
    alert: {
      show: false,
      type: null,
      message: null,
    },
    locales: [
      {
        text: 'English',
        value: 'en',
      },
      {
        text: '中文',
        value: 'zhHans',
      },
    ],
    currentLocale: getLocale() || 'zhHans',
    timeoutWithFc: null,
    routerPushNum: 0,
  },
  mutations: {
    SET_CONFIG: set('config'),
    SET_SERVERTIME: set('serverTime'),
    SET_ALERT: set('alert'),
    setAlert: set('alert'),
    SET_CURRENTLOCALE: set('currentLocale'),
    SET_SESSION: set('session'),
    SET_TIMEOUTFC: set('timeoutWithFc'),
    SET_ROUTERPUSHNUM: set('routerPushNum'),
  },
  actions: {
    GET_CONFIG: async ({ commit }) => {
      const { data } = await CommonService.getFile(
        './config.json',
      );
      commit('SET_CONFIG', data);
      return data;
    },
    GET_SESSIONID: async ({ dispatch }) => {
      await dispatch('GET_CONFIG');
      const { data } = await CommonService.getSessionid();
      const { result: sessionId } = data;
      Service.defaults.headers.common.sessionId = sessionId;
      // Service.defaults.headers.common.languageType = language;
      await dispatch('GET_SERVERTIME');
      // await dispatch('GET_SESSION');
    },
    async GET_SERVERTIME({ dispatch }) {
      const { data, status } = await CommonService.getService('servertime');
      if (status === 200 && !data.Error) {
        const { results } = data;
        const timedifference = moment().valueOf() - results;
        dispatch('TIMER', timedifference);
      }
    },
    TIMER({ commit, dispatch }, timedifference) {
      const servertime = moment().valueOf() - timedifference;
      commit('SET_SERVERTIME', servertime);
      clearTimeout(timeout);
      timeout = null;
      timeout = setTimeout(() => {
        dispatch('TIMER', timedifference);
      }, 1000);
    },
    GET_SESSION: async ({ commit }) => {
      const query = '?machinenumber=ios';
      const { data } = await CommonService.getMdo('session/getSession', query);
      if (!data) {
        return;
      }
      if (data.returnCode === 200) {
        commit('SET_SESSION', data.result);
      } else {
        commit(
          'helper/SET_ALERT',
          {
            show: true,
            type: 'error',
            message: data.content,
          },
          { root: true },
        );
      }
    },
    // 设置带方法的延时器
    getTimeoutWithFunc: async ({ commit, state, dispatch }, { time, func, pushNum }) => {
      const { timeoutWithFc, routerPushNum } = state;
      if (timeoutWithFc) {
        clearTimeout(timeoutWithFc);
        commit('SET_TIMEOUTFC', null);
      }
      console.log(pushNum, 'pushNum');
      console.log(routerPushNum, 'routerPushNum');
      // routerPushNum当前路由跳转次数 pushNum开启延时器时的跳转次数
      if (routerPushNum > pushNum) {
        return;
      }
      const timeoutfc = setTimeout(async () => {
        console.log(func, 'func2');
        await func();
        dispatch('getTimeoutWithFunc', { time, func, pushNum });
      }, time);
      commit('SET_TIMEOUTFC', timeoutfc);
    },
  },
};
