import { set } from '@/utils/store.helper';

export default ({
  state: {
    multiPageList: [],
    excludePagesList: [],
  },
  mutations: {
    setMultiPageList: set('multiPageList'),
    setExcludePageList: set('excludePagesList'),
  },
  actions: {
  },
  getters: {
  },
});
