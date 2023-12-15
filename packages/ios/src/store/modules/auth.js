import { set } from '@/utils/helper';
import tokenService from '@/service/token.service';
import apiService from '@/service/api.service';

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
      if (token) {
        commit('setToken', token);
        apiService.setTokenHeader(token);
      } else {
        commit('setIsTokenValid', false);
      }
    },
    logoutUser: async ({ commit }) => {
      tokenService.removeToken();
      commit('setToken', null);
      commit('setting/setMe', null, { root: true });
      commit('setting/setUserInfo', [], { root: true });
    },
  },
  getters: {
    token: ({ token }) => token,
  },
});
