import camelCase from 'lodash.camelcase';
import { storeModules } from '@/modules';

const modules = {};

const modulesKeys = Object.keys(storeModules);
if (modulesKeys.length > 0) {
  for (let i = 0; i < modulesKeys.length; i += 1) {
    storeModules[modulesKeys[i]].keys().forEach((fileName) => {
      if (fileName === './index.js') return;
      const moduleName = camelCase(fileName.replace(/(\.\/|\.js)/g, ''));
      modules[moduleName] = {
        namespaced: true,
        ...storeModules[modulesKeys[i]](fileName).default,
      };
    });
  }
}
export default modules;
