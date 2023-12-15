const routes = [
  {
    path: 'user-role',
    name: 'userRole',
    component: () => import(/* webpackChunkName: "userRole" */ '@/modules/user-role/Index.vue'),
    children: [
      {
        path: '',
        name: 'userRole',
        component: () => import(/* webpackChunkName: "userRole" */ '@/modules/user-role/views/Main.vue'),
        meta: {
          permissionRequired: true,
        },
      },
      {
        path: 'role-detail/:id',
        name: 'roleDetail',
        component: () => import(/* webpackChunkName: "userRole" */ '@/modules/user-role/views/RoleDetail.vue'),
        meta: {
          permissionRequired: true,
        },
      },
    ],
  },
];

export default routes;
