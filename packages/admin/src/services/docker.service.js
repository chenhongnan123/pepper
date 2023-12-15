import store from '@/store';
import ApiService from './api.service';

class DockerService {
  install(Vue) {
    const funcList = [
      'dockerPost',
      'statusCheck',
    ];
    for (let i = 0; i < funcList.length; i += 1) {
      Vue.prototype[`$${funcList[i]}`] = this[funcList[i]];
      store[`$${funcList[i]}`] = this[funcList[i]];
    }
  }

  async dockerPost(apiName, payload, isUpload) {
    try {
      if (isUpload) {
        ApiService.setContentTypeHeader('application/x-tar');
      }
      const { status, data } = await ApiService.post(`/docker/${apiName}`, payload);
      // console.log(result, 'dockerPost');
      ApiService.setContentTypeHeader('application/json');
      if (status === 204 || status === 304) {
        return status;
      }
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
      if (status === 200 || status === 201) {
        return data;
      }
      store.commit(
        'helper/setAlert',
        {
          show: true,
          type: 'error',
          message: data.message || 'SERVERERROR',
        },
        { root: true },
      );
      return false;
    } catch (e) {
      setTimeout(() => {
        store.commit(
          'helper/setPepperLoading',
          false,
          { root: true },
        );
      }, 2000);
      store.commit(
        'helper/setAlert',
        {
          show: true,
          type: 'error',
          message: e.message,
        },
        { root: true },
      );
      ApiService.setContentTypeHeader('application/json');
      return false;
    }
  }

  async statusCheck(port, apiName) {
    try {
      const url = process.env.VUE_APP_MODE === 'development' ? '/statusCheck' : `http://${window.location.host}:${port}${apiName}`;
      const { data, status } = await ApiService.get(url);
      console.log(data, 'dockerGet');
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
      if (status === 200) {
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
    } catch (e) {
      setTimeout(() => {
        store.commit(
          'helper/setPepperLoading',
          false,
          { root: true },
        );
      }, 2000);
      store.commit(
        'helper/setAlert',
        {
          show: true,
          type: 'error',
          message: e.message,
        },
        { root: true },
      );
      return false;
    }
  }
}

export default new DockerService();
