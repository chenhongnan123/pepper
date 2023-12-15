import { set } from '@/utils/store.helper';

export default ({
  state: {
    factoryList: [],
    adminList: [],
  },
  mutations: {
    setAdminList: set('adminList'),
    setFactoryList: set('factoryList'),
  },
  actions: {
    async getAdminList({ commit }, companyId) {
      const result = await this.$systemPost('user/getAdminByCompanyId', { data: { id: companyId } }, 'mock1');
      if (!result) {
        return;
      }
      const { data } = result;
      commit('setAdminList', data);
    },
    async getFactoryList({ commit, dispatch, state }, { companyId }) {
      await dispatch('getAdminList', companyId);
      const result = await this.$systemPost('company/getFactoryList', { data: { id: companyId } }, 'mock1');
      if (!result) {
        return false;
      }
      const { data } = result;
      if (data.length) {
        const { adminList } = state;
        const list = data.map((item) => {
          const admin = adminList.find((a) => a.factoryId === item.id);
          let obj = { ...item };
          if (admin) {
            const {
              id,
              userName,
              password,
              firstName,
              lastName,
              email,
              phoneNumber,
            } = admin;
            obj = {
              ...obj,
              adminId: id,
              userName,
              password,
              firstName,
              lastName,
              email,
              phoneNumber,
            };
          }
          return obj;
        });
        commit('setFactoryList', list);
        return true;
      }
      return false;
    },
    async createFactoryAdmin({ commit }, payload) {
      const result = await this.$systemPost('user/createFactoryAdmin', payload, 'mock1');
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
    async updateFactoryAdmin({ commit }, payload) {
      const result = await this.$systemPost('user/updateAdminById', payload, 'mock1');
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
  },
});
