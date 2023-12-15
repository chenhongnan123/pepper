import ApiService from '@/services/api.service';

export default ({
  actions: {
    async getBasicList({ commit }, payload) {
      const {
        elementName,
        query,
        disableAlert,
      } = payload;
      const queryParams = `?delFlag=0${query || ''}`;
      const result = await this.$basicGet(`${elementName}/list${queryParams}`);
      if (!result) {
        return false;
      }
      if (disableAlert) {
        return result.rows;
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
      return result.rows;
    },
    async getSystemList(_, payload) {
      const {
        elementName,
        query,
      } = payload;
      const queryParams = `?delFlag=0${query || ''}`;
      const result = await this.$systemGet(`${elementName}/list${queryParams}`);
      if (!result) {
        return false;
      }
      return result.rows;
    },
    async addRecipe({ commit }, payload) {
      const result = await this.$basicPost('recipe', payload);
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
    async editRecipe({ commit }, payload) {
      const result = await this.$basicPut('recipe', payload);
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
    async copyRecipe({ commit }, payload) {
      const result = await this.$basicPost('recipe/copyRecipe', payload);
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
    async deleteRecipe({ commit }, ids) {
      const result = await this.$basicDelete(`recipe/${ids}`);
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
    async changeRecipeActive({ commit }, payload) {
      const result = await this.$basicPost('recipe/activeRecipe', payload);
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
    async getItem({ commit }, payload) {
      const {
        elementName,
        query,
      } = payload;
      const result = await this.$basicGet(`${elementName}${query || ''}`);
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
      return result.data;
    },
    async addRecipeDetail({ commit }, payload) {
      const result = await this.$basicPost('table/save', payload);
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
      return result;
    },
    async getFileJson({ commit }, fileName) {
      const { data } = await ApiService.get(`/${fileName}`);
      if (!data) {
        commit(
          'helper/setAlert',
          {
            show: true,
            type: 'error',
            message: 'SERVERERROR',
          },
          { root: true },
        );
        return false;
      }
      return data.data;
    },
    async uploadRecipe({ commit }, payload) {
      const result = await this.$eaPost('recipe/downloadRecipe', payload);
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
    async getUploadRecipeStatus(_, payload) {
      const result = await this.$eaPost('recipe/downloadRecipeStatus', payload);
      if (!result) {
        return false;
      }
      return result.data;
    },
  },
});
