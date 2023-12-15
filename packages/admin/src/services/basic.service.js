import store from '@/store';
import ApiService from './api.service';

const baseUrl = process.env.VUE_APP_BASE_URL;
const mockUrl = process.env.VUE_APP_MODE === 'development' ? process.env.VUE_APP_MOCK_URL : baseUrl;
class BasicService {
  install(Vue) {
    const funcList = [
      // 'userGetUserInfo',
      'basicPost',
      'basicGet',
      'basicPut',
      'basicDelete',
      'basicExport',
      'basicSwitchStatus',
    ];
    for (let i = 0; i < funcList.length; i += 1) {
      Vue.prototype[`$${funcList[i]}`] = this[funcList[i]];
      store[`$${funcList[i]}`] = this[funcList[i]];
    }
  }

  // async userGetUserInfo(mock) {
  //   const url = mock === 'mock' ? mockUrl : baseUrl;
  //   const { data } = await ApiService.get(`${url}/system/user/getInfo`);
  //   if (!data) {
  //     store.commit(
  //       'helper/setAlert',
  //       {
  //         show: true,
  //         type: 'error',
  //         message: 'SERVERERROR',
  //       },
  //       { root: true },
  //     );
  //     return false;
  //   }
  //   if (data.code === 200) {
  //     const { user, roles, permissions } = data;
  //     store.commit(
  //       'user/setPermissions',
  //       permissions,
  //     );
  //     store.commit(
  //       'user/setRoles',
  //       roles,
  //     );
  //     store.commit(
  //       'user/setMe',
  //       user,
  //     );
  //     return user;
  //   }
  //   store.commit(
  //     'helper/setAlert',
  //     {
  //       show: true,
  //       type: 'error',
  //       message: data.msg,
  //     },
  //     { root: true },
  //   );
  //   return false;
  // }

  async basicPost(elementName, payload, mock) {
    const url = mock === 'mock' ? mockUrl : baseUrl;
    const { data } = await ApiService.post(`${url}/basic/${elementName}`, payload);
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

  // 专为更改启用状态设置，有code1001需要用户再次确认是否变更启用状态
  async basicSwitchStatus(elementName, payload, mock) {
    const url = mock === 'mock' ? mockUrl : baseUrl;
    const { data } = await ApiService.post(`${url}/basic/${elementName}`, payload);
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
    if (data.code === 200 || data.code === 1001) {
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

  async basicGet(elementName, mock) {
    const url = mock === 'mock' ? mockUrl : baseUrl;
    const { data } = await ApiService.get(`${url}/basic/${elementName}`);
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

  async basicPut(elementName, payload, mock) {
    const url = mock === 'mock' ? mockUrl : baseUrl;
    const { data } = await ApiService.put(`${url}/basic/${elementName}`, payload);
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

  async basicDelete(elementName, payload, mock) {
    const url = mock === 'mock' ? mockUrl : baseUrl;
    const { data } = await ApiService.delete(`${url}/basic/${elementName}`, payload);
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

  /**
   * 通用导出下载方法
   * @param {*} elementName 表名字-- 即url
   * @param {*} filename 文件名字
   * @param {*} payload 参数 是一个对象
   * @param {*} mock 是否mock
   */
  async basicExport(elementName, filename, payload, mock) {
    const url = mock === 'mock' ? mockUrl : baseUrl;
    const { data } = await ApiService.post(`${url}/basic/${elementName}`, payload, {
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

export default new BasicService();
