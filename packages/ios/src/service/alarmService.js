import Service from '../plugins/axios';

const reqConfig = { timeout: 45000 };
export default {
  getRecords(elementName, queryParams) {
    try {
      const query = queryParams || '';
      const url = `/mdo/alarm/${elementName}${query}`;
      return Service.get(url, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
  postRecord(elementName, postData) {
    try {
      const url = `/mdo/alarm/${elementName}`;
      return Service.post(url, postData, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
  updateRecord(elementName, _id, postData) {
    try {
      const url = `/mdo/alarm/${elementName}/${_id}`;
      return Service.put(url, postData, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
  putRecords(elementName, payload, _id, queryParam) {
    try {
      return Service.put(`/mdo/alarm/${elementName}/${_id}${queryParam || ''}`, payload);
    } catch (e) {
      throw new Error(e);
    }
  },
};
