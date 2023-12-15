import store from '@/store';
import ApiService from './api.service';

const baseUrl = process.env.VUE_APP_BASE_URL;
const mockUrl = process.env.VUE_APP_MOCK_URL;

class MainService {
  install(Vue) {
    const funcList = [
      'mainGet',
    ];
    for (let i = 0; i < funcList.length; i += 1) {
      Vue.prototype[`$${funcList[i]}`] = this[funcList[i]];
      store[`$${funcList[i]}`] = this[funcList[i]];
    }
  }

  async mainGet(elementName, queryParams, mock) {
    const url = mock === 'mock' ? mockUrl : baseUrl;
    const query = queryParams || '';
    const { data } = await ApiService.get(`${url}/mdo/main/${elementName}${query}`);
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
      return {
        data: data.result,
        page: data.page,
      };
    }
    store.commit(
      'helper/setAlert',
      {
        show: true,
        type: 'error',
        message: data.content || 'SERVERERROR',
      },
      { root: true },
    );
    return false;
  }
}

export default new MainService();
