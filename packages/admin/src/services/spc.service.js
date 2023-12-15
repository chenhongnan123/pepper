import store from '@/store';
import ApiService from './api.service';

const baseUrl = process.env.VUE_APP_BASE_URL;
const mockUrl = process.env.VUE_APP_MODE === 'development' ? process.env.VUE_APP_MOCK_URL : baseUrl;
class SpcService {
  install(Vue) {
    const funcList = [
      'spcPost',
      'spcGet',
    ];
    for (let i = 0; i < funcList.length; i += 1) {
      Vue.prototype[`$${funcList[i]}`] = this[funcList[i]];
      store[`$${funcList[i]}`] = this[funcList[i]];
    }
  }

  async spcPost(elementName, payload, mock) {
    const url = mock === 'mock' ? mockUrl : baseUrl;
    const { data } = await ApiService.post(`${url}/spc/${elementName}`, payload);
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
      return data;
    }
    store.commit(
      'helper/setAlert',
      {
        show: true,
        type: 'error',
        message: data.msg || 'SERVERERROR',
      },
      { root: true },
    );
    return false;
  }

  async spcGet(elementName, mock) {
    const url = mock === 'mock' ? mockUrl : baseUrl;
    const { data } = await ApiService.get(`${url}/spc/${elementName}`);
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
      return data;
    }
    store.commit(
      'helper/setAlert',
      {
        show: true,
        type: 'error',
        message: data.msg || 'SERVERERROR',
      },
      { root: true },
    );
    return false;
  }
}

export default new SpcService();
