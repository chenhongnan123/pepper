import ApiService from './api.service';

const url = process.env.VUE_APP_BASE_URL;
class SPCService {
  constructor() {
    this.request = ApiService;
  }

  postSpcData(payload) {
    // 接口传递系统语言，默认中文
    ApiService.setLanguageHeader('zhHans');
    return this.request.post(`${url}/spc`, payload);
  }

  postCapabData(payload) {
    // 接口传递系统语言，默认中文
    ApiService.setLanguageHeader('zhHans');
    return this.request.post(`${url}/capab`, payload);
  }

  postGageStudyData(payload) {
    // 接口传递系统语言，默认中文
    ApiService.setLanguageHeader('zhHans');
    return this.request.post(`${url}/gage_study`, payload);
  }
}

export default new SPCService();
