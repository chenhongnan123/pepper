import axios from 'axios';

class ApiService {
  constructor() {
    this.instance = axios.create({
      baseURL: '',
      // timeout: 50000,
    });
  }

  setSessionHeader(session) {
    this.instance.defaults.headers.common.sessionId = session;
  }

  setTokenHeader(token) {
    this.instance.defaults.headers.common.Authorization = token;
  }

  setRouteHeader(routeName) {
    this.instance.defaults.headers.common.route = routeName;
  }

  setLanguageTypeHeader(Language) {
    this.instance.defaults.headers.common.Authorization = Language;
  }

  setContentTypeHeader(ContentType) {
    this.instance.defaults.headers['Content-Type'] = ContentType;
  }

  setLoginTypeHeader(loginType) {
    this.instance.defaults.headers.common.loginType = loginType;
  }

  setLanguageHeader(languageType) {
    this.instance.defaults.headers.common.languageType = languageType;
  }

  removeHeader() {
    this.instance.defaults.headers.common = {};
  }

  request(method, url, data = {}, config = {}) {
    return this.instance({
      method,
      url,
      data,
      config,
      responseType: config.responseType || 'json',
    });
  }

  getAxiosInstance() {
    return this.instance;
  }

  get(url, config = {}) {
    return this.request('GET', url, {}, config);
  }

  post(url, data, config = {}) {
    return this.request('POST', url, data, config);
  }

  put(url, data, config = {}) {
    return this.request('PUT', url, data, config);
  }

  patch(url, data, config = {}) {
    return this.request('PATCH', url, data, config);
  }

  delete(url, data, config = {}) {
    return this.request('DELETE', url, data, config);
  }
}

export default new ApiService();
