import Service from '../plugins/axios';

const reqConfig = { timeout: 45000 };
export default {
  getRecords(elementName, queryParams) {
    try {
      const query = queryParams || '';
      const url = `/mdo/elements/${elementName}/records${query}`;
      return Service.get(url, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
  postRecord(elementName, postData) {
    try {
      const url = `/mdo/elements/${elementName}/records`;
      return Service.post(url, postData, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
  updateRecord(elementName, _id, postData, param) {
    try {
      const url = `/mdo/elements/${elementName}/records/${_id}${param || ''}`;
      return Service.put(url, postData, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
  updateRecordsByQuery(elementName, postData, param) {
    try {
      const url = `/mdo/elements/${elementName}/records${param}`;
      return Service.put(url, postData, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
  deleteRecord(elementName, _id, postData) {
    try {
      const url = `/mdo/elements/${elementName}/records/${_id}`;
      return Service.delete(url, postData, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },

  postBulkRecords(elementName, postData) {
    try {
      const url = `/mdo/elements/${elementName}/createbulkrecords`;
      return Service.post(url, postData, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },

  multiElementOperate(payload) {
    try {
      return Service.post('/mdo/elements/multielement/operate/records', payload);
    } catch (e) {
      throw new Error(e);
    }
  },

  putRecords(elementName, payload, _id, queryParam) {
    try {
      return Service.put(`/mdo/elements/${elementName}/records/${_id}${queryParam || ''}`, payload);
    } catch (e) {
      throw new Error(e);
    }
  },
};
