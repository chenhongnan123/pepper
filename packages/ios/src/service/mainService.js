import Service from '../plugins/axios';

const reqConfig = { timeout: 45000 };
export default {
  getRecords(elementName, queryParams) {
    try {
      const query = queryParams || '';
      const url = `/mdo/main/${elementName}${query}`;
      return Service.get(url, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
};
