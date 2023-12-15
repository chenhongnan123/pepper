import { set } from '@/utils/store.helper';

export default ({
  state: {
    deptTree: [], // 部门树形列表
    userList: [], // 用户列表
    userDetail: {},
    positionList: [], // 岗位列表
    roleList: [], // 角色列表
    initPwd: '', // 初始密码
    sexDict: [], // 性别选项列表
    authUserInfo: {}, // 分配角色时的用户信息
    authRoleList: [], // 分配角色时的角色列表
  },
  mutations: {
    setDeptTree: set('deptTree'),
    setUserList: set('userList'),
    setUserDetail: set('userDetail'),
    setPositionList: set('positionList'),
    setRoleList: set('roleList'),
    setInitPwd: set('initPwd'),
    setSexDict: set('sexDict'),
    setAuthUserInfo: set('authUserInfo'),
    setAuthRoleList: set('authRoleList'),
  },
  actions: {
    // 获取部门树
    async getDeptTree({ commit }) {
      const result = await this.$systemGet('/user/deptTree?status=0');
      if (!result) {
        return false;
      }
      const { data } = result;
      if (data?.length) {
        commit('setDeptTree', data);
      } else {
        commit('setDeptTree', []);
      }
      return true;
    },
    // 获取用户列表
    async getUserList({ commit }, deptId) {
      let url = '/user/list';
      if (deptId) {
        url += `?deptId=${deptId}`;
      }
      const result = await this.$systemGet(url);
      if (!result) {
        return false;
      }
      const { rows } = result;
      if (rows?.length) {
        const list = rows.map((item) => {
          const obj = {
            ...item,
            id: item.userId,
          };
          if (item.dept?.deptName) {
            obj.deptName = item.dept.deptName;
          }
          return obj;
        });
        commit('setUserList', list);
      } else {
        commit('setUserList', []);
      }
      return true;
    },
    // 根据用户id获取用户详情
    async getUserDetail({ commit }, userId) {
      let result = null;
      if (userId) {
        result = await this.$systemGet(`/user/${userId}`);
      } else {
        result = await this.$systemGet('/user/');
      } // 没有userId查询结果仅包含岗位列表和角色列表
      if (!result) {
        commit('setUserDetail', {});
        commit('setPositionList', []);
        commit('setRoleList', []);
        return false;
      }
      const {
        data, // 用户详情
        postIds, // 岗位id
        roleIds, // 角色id
        posts, // 岗位列表
        roles, // 角色列表
      } = result;
      if (data) {
        let userDetail = {
          ...data,
        };
        if (data.dept) {
          userDetail = {
            ...userDetail,
            deptName: data.dept.deptName || '',
          }; // 部门名称
        }
        if (postIds) {
          userDetail = {
            ...userDetail,
            postIds,
          };
        }
        if (roleIds) {
          userDetail = {
            ...userDetail,
            roleIds,
          };
        }
        commit('setUserDetail', userDetail);
      } else {
        commit('setUserDetail', {});
      }
      if (posts?.length) {
        const list = posts.map((item) => {
          const obj = {
            ...item,
            disabled: item.status !== '0',
          };
          return obj;
        });
        commit('setPositionList', list);
      } else {
        commit('setPositionList', []);
      }
      if (roles?.length) {
        const list = roles.map((item) => {
          const obj = {
            ...item,
            disabled: item.status !== '0',
          };
          return obj;
        });
        commit('setRoleList', list);
      } else {
        commit('setRoleList', []);
      }
      return true;
    },
    // 获取用户初始化密码
    async getPwdConfig({ commit }) {
      const result = await this.$systemGet('/config/configKey/sys.user.initPassword');
      if (!result) {
        commit('setInitPwd', '');
        return false;
      }
      const { msg } = result;
      if (msg) {
        commit('setInitPwd', msg);
      } else {
        commit('setInitPwd', '');
      }
      return true;
    },
    // 获取性别字典表
    async getSexDict({ commit }) {
      const result = await this.$systemGet('/dict/data/type/sys_user_sex');
      if (!result) {
        commit('setSexDict', []);
        return false;
      }
      const { data } = result;
      if (data) {
        commit('setSexDict', data);
      } else {
        commit('setSexDict', []);
      }
      return true;
    },
    async editUser({ commit }, payload) {
      const result = await this.$systemPut('/user', payload);
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
    async addUser({ commit }, payload) {
      const result = await this.$systemPost('/user', payload);
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
    async deleteUser(_, ids) {
      const result = await this.$systemDelete(`/user/${ids}`);
      if (!result) {
        return false;
      }
      return true;
    },
    // 更改用户状态
    async changeStatus(_, payload) {
      const result = await this.$systemPut('/user/changeStatus', payload);
      if (!result) {
        return false;
      }
      return true;
    },
    // 重置用户密码
    async resetPwd(_, payload) {
      const result = await this.$systemPut('/user/resetPwd', payload);
      if (!result) {
        return false;
      }
      return true;
    },
    async getAuthRole({ commit }, userId) {
      const result = await this.$systemGet(`/user/authRole/${userId}`);
      if (!result) {
        commit('setAuthUserInfo', {});
        commit('setAuthRoleList', []);
        return false;
      }
      const { user, roles } = result;
      if (user) {
        if (user.roles.length) {
          user.roleIds = user.roles.map((item) => item.roleId);
        }
        commit('setAuthUserInfo', user);
      } else {
        commit('setAuthUserInfo', {});
      }
      if (roles?.length) {
        const list = roles.map((item) => {
          const obj = {
            ...item,
            disabled: item.status !== '0',
          };
          return obj;
        });
        commit('setAuthRoleList', list);
      } else {
        commit('setAuthRoleList', []);
      }
      return true;
    },
    // 分配用户角色
    async authRole(_, payload) {
      const { userId, roleIds } = payload;
      const result = await this.$systemPut(`/user/authRole?userId=${userId}&roleIds=${roleIds}`);
      if (!result) {
        return false;
      }
      return true;
    },
    // 导出文件
    async excelExport() {
      const filename = `user_${new Date().getTime()}.xlsx`;
      const result = await this.$systemExport('/user/export', filename);
      if (!result) {
        return false;
      }
      return true;
    },
    // 下载模板文件
    async downloadTemplateFile() {
      const filename = `user_template_${new Date().getTime()}.xlsx`;
      const result = await this.$systemExport('/user/importTemplate', filename);
      if (!result) {
        return false;
      }
      return true;
    },
    // 导入文件
    async excelImport(_, payload) {
      const result = await this.$systemPost('/user/importData', payload);
      if (!result) {
        return false;
      }
      return true;
    },
  },
});
