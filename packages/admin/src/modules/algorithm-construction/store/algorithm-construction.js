import { set } from '@/utils/store.helper';

export default ({
  state: {
    algorithmModelList: [],
    bomTreeList: [], // bom树
    dataSourceList: [], // 数据源列表
    dataParamList: [], // 数据源参数列表
    algorithmDetail: {}, // 算法详情
  },
  mutations: {
    setAlgorithmModelList: set('algorithmModelList'),
    setBomTreeList: set('bomTreeList'),
    setDataSourceList: set('dataSourceList'),
    setDataParamList: set('dataParamList'),
    setAlgorithmDetail: set('algorithmDetail'),
  },
  actions: {
    // 获取算法模型列表
    async getAlgorithmModelList({ commit }, needAlert) {
      const result = await this.$basicGet('model/listNew');
      if (!result) {
        return;
      }
      const { rows } = result;
      if (rows?.length) {
        commit('setAlgorithmModelList', rows);
      } else {
        commit('setAlgorithmModelList', []);
      }
      if (needAlert) {
        commit(
          'helper/setAlert',
          {
            show: true,
            type: 'success',
            message: 'successAction',
          },
          { root: true },
        );
      }
    },
    async getBomTree({ commit }) {
      const result = await this.$basicGet('bom/selectBomTree');
      if (!result) {
        return;
      }
      const { rows } = result;
      if (rows?.length) {
        commit('setBomTreeList', rows);
      } else {
        commit('setBomTreeList', []);
      }
    },
    async changeStatus({ commit }, payload) {
      const result = await this.$spcPost('spc/changeActive', payload);
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
    async addAlgorithmModel({ commit }, payload) {
      const result = await this.$basicPost('model/insert', payload);
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
    async editAlgorithmModel({ commit }, payload) {
      const result = await this.$basicPut('model', payload);
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
    async deleteAlgorithmModel({ commit }, ids) {
      const result = await this.$basicDelete(`model/${ids}`);
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
    async getDataSourceList({ commit }) {
      const result = await this.$basicGet('source/list');
      if (!result) {
        return;
      }
      if (result.rows) {
        const list = result.rows.map((item) => {
          const obj = {
            ...item,
            id: item.dataSourceId,
          };
          return obj;
        });
        commit('setDataSourceList', list);
        return;
      }
      commit('setDataSourceList', []);
    },
    async getDataParametersById({ commit }, dataSourceId) {
      const result = await this.$basicGet(`param/list?dataSourceId=${dataSourceId}`);
      if (!result) {
        return [];
      }
      if (result.rows) {
        const list = result.rows.map((item) => {
          const obj = {
            ...item,
            id: item.paramId,
          };
          return obj;
        });
        commit('setDataParamList', list);
        return list;
      }
      return [];
    },
    async getAlgorithmDetailById({ commit }, modelId) {
      console.log(modelId);
      // const result = await this.$basicGet('detail/list');
      const result = await this.$basicGet(`detail/list?modelId=${modelId}`);
      if (!result) {
        return false;
      }
      if (result.rows?.length) {
        commit('setAlgorithmDetail', result.rows[0] || {});
        return result.rows[0];
      }
      commit('setAlgorithmDetail', {});
      return false;
    },
    async getDataList(_, payload) {
      const { collectionName, pageSize } = payload;
      const result = await this.$basicGet(`source/detailsList?collectionName=${collectionName}&&pageNum=1&pageSize=${pageSize}`);
      if (!result) {
        return [];
      }
      if (result.rows) {
        const list = result.rows.map((item) => {
          const obj = {
            ...item,
            // eslint-disable-next-line
            id: item._id,
          };
          return obj;
        });
        return list;
      }
      return [];
    },
    async getDataSourceById(_, dataSourceId) {
      const result = await this.$basicGet(`source/${dataSourceId}`);
      if (!result) {
        return false;
      }
      return result.data || {};
    },
    async addAlgorithDetail({ commit }, payload) {
      const result = await this.$basicPost('detail', payload);
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
    async editAlgorithmDetail({ commit }, payload) {
      const result = await this.$basicPut('detail', payload);
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
  getters: {
    formatBomList: (_, getters) => (bomTreeList) => {
      if (bomTreeList.length === 0) {
        return [];
      }
      const list = bomTreeList;
      for (let i = 0; i < list.length; i += 1) {
        list[i].isKeyDisabled = !list[i].keyPart;
        list[i].isMatainDisabled = !list[i].sparePart;
        list[i].isParent = list[i].bomLevel === '1';
        if (
          list[i].childrenBomList
          && list[i].childrenBomList.length > 0
        ) {
          getters.formatBomList(list[i].childrenBomList);
        }
      }
      return list;
    },
  },
});
