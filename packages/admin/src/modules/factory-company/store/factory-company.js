import { set } from '@/utils/store.helper';

export default ({
  state: {
    company: {},
    factoryList: [],
    industryCodeList: [],
    countryCodeList: [
      'cn',
      'de',
      'us',
      'jp',
      'kr',
      'au',
      'ca',
      'es',
      'fr',
      'it',
      'mx',
      'pt',
      'be',
      'br',
      'in',
      'sg',
      'th',
      'ua',
      'ru',
      'is',
      'gb',
      'nl',
    ],
  },
  mutations: {
    setCompany: set('company'),
    setFactoryList: set('factoryList'),
    setIndustryCodeList: set('industryCodeList'),
  },
  actions: {
    async getCompany({ commit }) {
      const result = await this.$systemPost('company/getCompanyList', {}, 'moc1k');
      if (!result) {
        return false;
      }
      const { data } = result;
      if (data.length) {
        const { id } = data[0];
        commit('setCompany', data[0]);
        return id;
      }
      commit('setCompany', {});
      return false;
    },
    async saveOrUpdateCompany({ commit }, payload) {
      const result = await this.$systemPost('company/saveOrUpdateCompany', payload, 'mock1');
      if (!result) {
        return false;
      }
      commit(
        'helper/setAlert',
        {
          show: true,
          type: 'success',
          message: 'successAction',
        },
        { root: true },
      );
      return true;
    },
    async getFactoryList({ commit }, { companyId }) {
      const result = await this.$systemPost('company/getFactoryList', { data: { id: companyId } }, 'mock1');
      if (!result) {
        return;
      }
      const { data } = result;
      commit('setFactoryList', data);
    },
    async createFactory({ commit }, payload) {
      const result = await this.$systemPost('company/saveFactory', payload, 'mock1');
      if (!result) {
        return false;
      }
      commit(
        'helper/setAlert',
        {
          show: true,
          type: 'success',
          message: 'successAction',
        },
        { root: true },
      );
      return true;
    },
    async updateFactory({ commit }, payload) {
      const result = await this.$systemPut('company/updateFactory', payload, 'mock1');
      if (!result) {
        return false;
      }
      commit(
        'helper/setAlert',
        {
          show: true,
          type: 'success',
          message: 'successAction',
        },
        { root: true },
      );
      return true;
    },
    async getIndustryList({ commit }) {
      const result = await this.$systemGet('dict/getDictList/profession', {}, 'mock1');
      if (!result) {
        return;
      }
      const { data } = result;
      commit('setIndustryCodeList', data);
    },
  },
});
