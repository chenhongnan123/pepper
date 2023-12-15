import { set } from '@/utils/store.helper';

export default ({
  state: {
    machineList: [], // 设备列表
  },
  mutations: {
    setMachineList: set('machineList'),
  },
  actions: {
    async getMachineList({ commit }) {
      const result = await this.$basicGet('device/simple/list?delFlag=0');
      if (!result) {
        return;
      }
      commit('setMachineList', result.rows);
    },
  },
});
