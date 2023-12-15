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
      const { user, roles, permissions } = data;
      store.commit(
        'user/setPermissions',
        permissions,
      );
      store.commit(
        'user/setRoles',
        roles,
      );
      store.commit(
        'user/setMe',
        user,
      );
      return user;
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

  async systemPost(elementName, payload, mock) {
    const url = mock === 'mock' ? mockUrl : baseUrl;
    const { data } = await ApiService.post(`${url}/system/${elementName}`, payload);
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

  async systemGet(elementName, mock) {
    const url = mock === 'mock' ? mockUrl : baseUrl;
    const { data } = await ApiService.get(`${url}/system/${elementName}`);
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

  async systemPut(elementName, payload, mock) {
    const url = mock === 'mock' ? mockUrl : baseUrl;
    const { data } = await ApiService.put(`${url}/system/${elementName}`, payload);
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

  async systemDelete(elementName, payload, mock) {
    const url = mock === 'mock' ? mockUrl : baseUrl;
    const { data } = await ApiService.delete(`${url}/system/${elementName}`, payload);
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

  // 通用导出下载方法
  async systemExport(elementName, filename, mock) {
    const url = mock === 'mock' ? mockUrl : baseUrl;
    const { data } = await ApiService.post(`${url}/system/${elementName}`, {}, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }, // 返回类型设为blob，请求头设为x-www-form-urlencoded
    });
    // if (!data) {
    //   store.commit(
    //     'helper/setAlert',
    //     {
    //       show: true,
    //       type: 'error',
    //       message: 'SERVERERROR',
    //     },
    //     { root: true },
    //   );
    //   return false;
    // }
    if (data) {
      // 校验是否为blob格式
      const isBlob = (data.type !== 'application/json');
      if (isBlob) {
        const blob = new Blob([data]);
        // console.log(blob, filename);
        if ('download' in document.createElement('a')) {
          const elink = document.createElement('a');
          elink.download = filename;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href);
          document.body.removeChild(elink);
        } else {
          navigator.msSaveBlob(blob, filename);
        }
      } else {
        store.commit(
          'helper/setAlert',
          {
            show: true,
            type: 'error',
            message: 'downloadError',
          },
          { root: true },
        );
        return false;
      }
    }
    return true;
  }
}

export default new SystemService();
