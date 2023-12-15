import store from '@/store';
import ApiService from './api.service';

const baseUrl = process.env.VUE_APP_BASE_URL;
const mockUrl = process.env.VUE_APP_MODE === 'development' ? process.env.VUE_APP_MOCK_URL : baseUrl;
class SystemService {
  install(Vue) {
    const funcList = [
      'userGetUserInfo',
      'systemPost',
      'systemGet',
      'systemQuery',

      'systemPut',
      'systemDelete',
      'systemExport',
    ];
    for (let i = 0; i < funcList.length; i += 1) {
      Vue.prototype[`$${funcList[i]}`] = this[funcList[i]];
      store[`$${funcList[i]}`] = this[funcList[i]];
    }
  }

  async userGetUserInfo(mock) {
    const url = mock === 'mock' ? mockUrl : baseUrl;
    const { data } = await ApiService.get(`${url}/system/user/getInfo`);
    if (!data) {
      store.commit(
        'helper/SET_ALERT',
        {
          show: true,
          type: 'error',
          message: 'SERVERERROR',
        },
        { root: true },
      );
      return false;
    }
    if (data.code === 200) {
      const { user } = data;
      store.commit(
        'setting/setUserInfo',
        data,
      );
      store.commit(
        'setting/setMe',
        user,
      );
      return user;
    }
    if (data.code === 202) {
      store.commit('auth/setIsTokenValid', false);
      store.commit('setting/SET_STTINGDIALOG', true, { root: true });
    } else {
      store.commit(
        'helper/SET_ALERT',
        {
          show: true,
          type: 'error',
          message: data.message,
        },
        { root: true },
      );
    }
    return false;
  }

  async systemPost(elementName, payload, mock) {
    const url = mock === 'mock' ? mockUrl : baseUrl;
    const { data } = await ApiService.post(`${url}/system/${elementName}`, payload);
    if (!data) {
      store.commit(
        'helper/SET_ALERT',
        {
          show: true,
          type: 'error',
          message: 'SERVERERROR',
        },
        { root: true },
      );
      return false;
    }
    if (data.code === 200) {
      return data;
    }
    if (data.code === 202) {
      store.commit('auth/setIsTokenValid', false);
      store.commit('setting/SET_STTINGDIALOG', true, { root: true });
    } else {
      store.commit(
        'helper/SET_ALERT',
        {
          show: true,
          type: 'error',
          message: data.msg || 'SERVERERROR',
        },
        { root: true },
      );
    }
    return false;
  }

  async systemGet(elementName, mock) {
    const url = mock === 'mock' ? mockUrl : baseUrl;
    const { data } = await ApiService.get(`${url}/system/${elementName}`);
    if (!data) {
      store.commit(
        'helper/SET_ALERT',
        {
          show: true,
          type: 'error',
          message: 'SERVERERROR',
        },
        { root: true },
      );
      return false;
    }
    if (data.code === 200) {
      return data;
    }
    if (data.code === 202) {
      store.commit('auth/setIsTokenValid', false);
      store.commit('setting/SET_STTINGDIALOG', true, { root: true });
    } else {
      store.commit(
        'helper/SET_ALERT',
        {
          show: true,
          type: 'error',
          message: data.msg || 'SERVERERROR',
        },
        { root: true },
      );
    }
    return false;
  }
}

export default new SystemService();
