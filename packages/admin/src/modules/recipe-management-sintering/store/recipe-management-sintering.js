export default ({
  actions: {
    async getRecipeList({ commit }, payload) {
      const {
        elementName,
        query,
      } = payload;
      const result = await this.$basicGet(`${elementName}/list${query || ''}`);
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
      return result.rows;
    },
    async getList(_, payload) {
      const {
        elementName,
        query,
      } = payload;
      const result = await this.$basicGet(`${elementName}/list${query || ''}`);
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
    // 导出文件
    async excelExport() {
      const filename = `产品_${new Date().getTime()}.xlsx`;
      const result = await this.$basicExport('product/importTemplate', filename);
      if (!result) {
        return false;
      }
      return true;
    },
    async excelImport(_, payload) {
      const result = await this.$basicPost('/product/importData', payload);
      if (!result) {
        return false;
      }
      return true;
    },
  },
  getters: {
  },
});
