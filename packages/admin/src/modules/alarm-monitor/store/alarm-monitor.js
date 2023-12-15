import { set } from '@/utils/store.helper';

export default {
  state: {
    monitorList: [],
    monitorInfo: {},
    expertiseList: [],
    // bomList: [], // 一级bom
    partList: [], // 零件列表
    videoList: [],
    videoDetail: {},
  },
  mutations: {
    setMonitorList: set('monitorList'),
    setMonitorInfo: set('monitorInfo'),
    setExpertiseList: set('expertiseList'),
    // setBomList: set('bomList'),
    setPartList: set('partList'),
    setVideoList: set('videoList'),
    setVideoDetail: set('videoDetail'),
  },
  actions: {
    async getMonitorList({ commit }, payload) {
      // eslint-disable-next-line prefer-const
      let url = 'monitor/list?';
      // eslint-disable-next-line
      for (const key in payload) {
        if (payload[key] != null) {
          url += `${key}=${payload[key]}&`;
        }
      }
      url = url.slice(0, -1);
      const result = await this.$basicGet(url);
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setMonitorList', result.rows);
      }
    },
    // 获取一级bom列表
    async getBomList() {
      const result = await this.$basicGet('bom/firstFloorlist');
      if (!result) {
        return [];
      }
      return result.rows;
    },
    async getMonitorInfo({ commit }, alarmMonitorId) {
      const result = await this.$basicGet(`monitor/${alarmMonitorId}`);
      if (!result) {
        return;
      }
      if (result.data) {
        commit('setMonitorInfo', result.data);
      }
    },
    // 获取专家经验
    async getExpertiseList({ commit }, payload) {
      let url = 'expertise/selectRelatedlist?';
      // eslint-disable-next-line
      for (const key in payload) {
        if (payload[key] != null) {
          url += `${key}=${payload[key]}&`;
        }
      }
      url = url.slice(0, -1);
      const result = await this.$basicGet(url);
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setExpertiseList', result.rows);
      }
    },
    // 获取零件列表
    async getPartList({ commit }, bomId) {
      const result = await this.$basicGet(`bom/selectNextLevelListByBomId?bomId=${bomId}`);
      if (!result) {
        return;
      }
      if (result.rows) {
        commit('setPartList', result.rows);
      }
    },
    // 生成视频 获取更多时刻视频
    async generateVideo({ commit }, payload) {
      const result = await this.$basicPost('videoRecord/generateVideo', payload);
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
    // 获取视频 获取更多时刻视频
    async getVideoList({ commit }, payload) {
      // eslint-disable-next-line prefer-const, no-unreachable
      let url = 'videoRecord/list?';
      // eslint-disable-next-line
      for (const key in payload) {
        if (payload[key] != null) {
          url += `${key}=${payload[key]}&`;
        }
      }
      url = url.slice(0, -1);
      const result = await this.$basicGet(url);
      if (!result) {
        return false;
      }
      commit('setVideoList', result.rows);
      // commit(
      //   'helper/setAlert',
      //   {
      //     show: true,
      //     type: 'success',
      //     message: 'successAction',
      //   },
      //   { root: true },
      // );
      return true;
    },
    // 重新加载视频 更多时刻视频
    async reloadVideo({ commit }, payload) {
      const result = await this.$basicPost('videoRecord/reloadVideo', payload);
      if (result.code !== 200) {
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
    // 重新加载视频 报警监控CCTV
    async reloadAlarmVideo({ commit }, payload) {
      const result = await this.$basicPost('monitor/monitor/reloadVideo', payload);
      if (result.code !== 200) {
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
    async getVideoById(_, videoRecord) {
      const result = await this.$basicGet(`videoRecord/${videoRecord}`);
      if (!result) {
        return [];
      }
      return result.data;
    },
    // 编辑报警监控
    async editMonitor({ commit }, payload) {
      const result = await this.$basicPut('monitor', payload);
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
  getters: {},
};
