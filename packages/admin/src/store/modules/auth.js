import { set } from '@/utils/store.helper';
import tokenService from '@/services/token.service';
import apiService from '@/services/api.service';

export default ({
  state: {
    token: null,
    isTokenValid: true,
  },
  mutations: {
    setToken: set('token'),
    setIsTokenValid: set('isTokenValid'),
  },
  actions: {
    initAuth: async ({ commit }) => {
      const token = tokenService.getToken();
      commit('setToken', token);
      apiService.setTokenHeader(token);
    },
    logoutUser: async ({ commit }) => {
      tokenService.removeToken();
      commit('setToken', null);
      commit('user/setMe', null, { root: true });
      commit('user/setUserInfo', [], { root: true });
    },
  },
  getters: {
  },
});
