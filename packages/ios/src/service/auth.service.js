import store from '@/store';
import ApiService from './api.service';
import TokenService from './token.service';

const baseUrl = process.env.VUE_APP_BASE_URL;
const mockUrl = process.env.VUE_APP_MODE === 'development' ? process.env.VUE_APP_MOCK_URL : baseUrl;
class AuthService {
  install(Vue) {
    const funcList = [
      'userLogin',
      'userLogOut',
    ];
    for (let i = 0; i < funcList.length; i += 1) {
      Vue.prototype[`$${funcList[i]}`] = this[funcList[i]];
      store[`$${funcList[i]}`] = this[funcList[i]];
    }
  }

  async userLogin(payload, mock) {
    const url = mock === 'mock' ? mockUrl : baseUrl;
    const { data } = await ApiService.post(`${url}/auth/login`, payload);
    // console.log(data, 'data');
    if (!data) {
      store.commit(
        'helper/setAlert',
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
      const { access_token: token } = data.data;
      ApiService.setTokenHeader(token);
      TokenService.setToken(token);
      store.commit(
        'auth/setToken',
        token,
      );
      const result = {
        ...data.data,
      };
      return result;
    }
    store.commit(
      'helper/setAlert',
      {
        show: true,
        type: 'error',
        message: data.msg,
      },
      { root: true },
    );
    return false;
  }

  async userLogOut(mock) {
    const url = mock === 'mock' ? mockUrl : baseUrl;
    const { data } = await ApiService.delete(`${url}/auth/logout`);
    if (!data) {
      store.commit(
        'helper/setAlert',
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
      store.dispatch('auth/logoutUser');
      return true;
    }
    store.commit(
      'helper/setAlert',
      {
        show: true,
        type: 'error',
        message: data.msg,
      },
      { root: true },
    );
    return false;
  }
}

export default new AuthService();
