const routes = [
  {
    path: 'role-management',
    name: 'roleManagement',
    meta: {
      permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "roleManagement" */ '@/modules/role-management/Index.vue'),
    children: [
      {
        path: '',
        name: 'roleManagement',
        component: () => import(/* webpackChunkName: "roleManagement" */ '@/modules/role-management/views/Main.vue'),
      },
      {
        path: 'assign-user/:id/:page',
        name: 'assignUser',
        component: () => import(/* webpackChunkName: "roleManagement" */ '@/modules/role-management/views/AssignUser.vue'),
      },
    ],
  },
];

export default routes;
