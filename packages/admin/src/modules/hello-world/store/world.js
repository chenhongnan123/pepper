import { set } from '@/utils/store.helper';

export default ({
  state: {
    world: 'world',
  },
  mutations: {
    setWorld: set('world'),
  },
});
