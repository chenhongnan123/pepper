import Service from '../plugins/axios';

const reqConfig = { timeout: 45000 };

export default {
  getFile(elementName) {
    try {
      const url = `${elementName}`;
      return Service.get(url, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
  getService(elementName, queryParams) {
    try {
      const query = queryParams || '';
      const url = `/server/${elementName}${query}`;
      return Service.get(url, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
  getMdo(elementName, queryParams) {
    try {
      const query = queryParams || '';
      const url = `/mdo/${elementName}${query}`;
      return Service.get(url, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
  postMdo(elementName, queryParams, postData) {
    try {
      const query = queryParams || '';
      const url = `/mdo/${elementName}${query}`;
      return Service.post(url, postData, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
  postService(elementName, queryParams, postData) {
    try {
      const query = queryParams || '';
      const url = `/server/${elementName}${query}`;
      return Service.post(url, postData, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
  downloadFile(elementName) {
    try {
      return Service.get(`/mdo/elements/downloadfile/${elementName}/records`, {
        responseType: 'blob',
      });
    } catch (e) {
      throw new Error(e);
    }
  },
  downloadFileCommon(filepath) {
    try {
      return Service.get(`/mdo/elements/downloadfile/common/records?filepath=${filepath}`, {
        responseType: 'bolb',
      });
    } catch (e) {
      throw new Error(e);
    }
  },
  uploadFile(payload) {
    try {
      return Service.post('/mdo/uploadfile', payload);
    } catch (e) {
      throw new Error(e);
    }
  },
  getSessionid() {
    try {
      const url = '/commonlogin/getsessionid';
      return Service.get(url, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
  sendMessage(payload) {
    try {
      const url = '/websocket/sendMessage';
      return Service.post(url, payload, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
};
