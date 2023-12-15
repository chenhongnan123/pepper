/**
 * v-hasPermi 操作权限处理
 * Copyright (c) 2019 ruoyi
 */
import store from '@/store';

export default {
  update(el, binding) {
    const { value } = binding;
    const allPermission = '*:*:*';
    const permissions = store.getters && store.getters.permissions;
    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value;
      // eslint-disable-next-line
      const hasPermissions = permissions.some((permission) => {
        return allPermission === permission || permissionFlag.includes(permission);
      });
      if (!hasPermissions) {
        // eslint-disable-next-line
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error('请设置操作权限标签值');
    }
  },
};
