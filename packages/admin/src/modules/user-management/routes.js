const routes = [
  {
    path: 'user-management',
    name: 'userManagement',
    component: () => import(/* webpackChunkName: "userManagement" */ '@/modules/user-management/Index.vue'),
    children: [
      {
        path: '',
        name: 'userManagement',
        component: () => import(/* webpackChunkName: "userManagement" */ '@/modules/user-management/views/Main.vue'),
        meta: {
          permissionRequired: true,
        },
      },
    ],
  },
];

export default routes;
