import { set } from '@/utils/store.helper';
// import PepperConfig from '@/configs/pepper.config';

export default ({
  state: {
    passwordSetting: {},
    passwordStrengthList: [
      {
        value: '0',
        text: 'low',
      },
      {
        value: '1',
        text: 'middle',
      },
      {
        value: '2',
        text: 'high',
      },
    ],
  },
  mutations: {
    setPasswordSetting: set('passwordSetting'),
  },
  actions: {
    async getPasswordSetting({ commit }) {
      const result = await this.$systemGet('setting/list');
      if (!result) {
        return;
      }
      const { data } = result;
      if (data) {
        commit('setPasswordSetting', data);
      } else {
        commit('setPasswordSetting', {});
      }
    },
    async updateConfig({ commit }, { payload }) {
      const result = await this.$systemPost('setting/update', payload, 'mock1');
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
