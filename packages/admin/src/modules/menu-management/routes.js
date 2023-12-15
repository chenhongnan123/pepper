const routes = [
  {
    path: 'menu-management',
    name: 'menuManagement',
    component: () => import(/* webpackChunkName: "menuManagement" */ '@/modules/menu-management/Index.vue'),
    children: [
      {
        path: '',
        name: 'menuManagement',
        component: () => import(/* webpackChunkName: "menuManagement" */ '@/modules/menu-management/views/Main.vue'),
        meta: {
          permissionRequired: true,
        },
      },
    ],
  },
];

export default routes;
