import store from '@/store';
import ApiService from './api.service';

const baseUrl = process.env.VUE_APP_BASE_URL;
const mockUrl = process.env.VUE_APP_MODE === 'development' ? process.env.VUE_APP_MOCK_URL : baseUrl;
class ElementService {
  install(Vue) {
    const funcList = [
      'postBulkRecords',
      'getRecords',
      'postRecord',
      'postSocket',
    ];
    for (let i = 0; i < funcList.length; i += 1) {
      Vue.prototype[`$${funcList[i]}`] = this[funcList[i]];
      store[`$${funcList[i]}`] = this[funcList[i]];
    }
  }

  async postBulkRecords(elementName, payload, mock) {
    const url = mock ? mockUrl : baseUrl;
    const { data } = await ApiService.post(`${url}/${elementName}/createbulkrecords`, payload);
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
    if (data.returnCode === 200) {
      return data.result;
    }
    store.commit(
      'helper/setAlert',
      {
        show: true,
        type: 'error',
        message: data.content,
      },
      { root: true },
    );
    return false;
  }

  async postRecord(elementName, payload, mock) {
    const url = mock ? mockUrl : baseUrl;
    const { data } = await ApiService.post(`${url}/${elementName}/records`, payload);
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
    if (data.returnCode === 200) {
      return data.result;
    }
    store.commit(
      'helper/setAlert',
      {
        show: true,
        type: 'error',
        message: data.content,
      },
      { root: true },
    );
    return false;
  }

  async postbasicConfiguration(elementName, payload, mock) {
    const url = mock ? mockUrl : baseUrl;
    const { data } = await ApiService.post(`${url}/${elementName}/records`, payload);
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
    if (data.returnCode === 200) {
      return data.result;
    }
    store.commit(
      'helper/setAlert',
      {
        show: true,
        type: 'error',
        message: data.content,
      },
      { root: true },
    );
    return false;
  }

  async getRecords(elementName, queryParam, mock) {
    const url = mock ? mockUrl : baseUrl;
    const { data } = await ApiService.get(`${url}/${elementName}/records${queryParam}`);
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
    if (data.returnCode === 200) {
      return data.result;
    }
    store.commit(
      'helper/setAlert',
      {
        show: true,
        type: 'error',
        message: data.content,
      },
      { root: true },
    );
    return false;
  }

  getRecordById(elementName, id) {
    return ApiService.get(`/server/elements/${elementName}/records/${id}`);
  }

  deleteRecordById(elementName, id) {
    return ApiService.delete(`/server/elements/${elementName}/records/${id}`);
  }

  deleteRecordByQuery(elementName, queryParam) {
    return ApiService.delete(`/server/elements/${elementName}/records${queryParam}`);
  }

  updateRecordById(elementName, id, payload) {
    return ApiService.put(`/server/elements/${elementName}/records/${id}`, payload);
  }

  updateRecordByQuery(elementName, queryParam, payload) {
    return ApiService.put(`/server/elements/${elementName}/records${queryParam}`, payload);
  }

  postSocket(functionName, payload) {
    return ApiService.post(`/linemes/${functionName}`, payload);
  }
}

export default new ElementService();
