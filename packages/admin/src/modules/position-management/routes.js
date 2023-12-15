const routes = [
  {
    path: 'position-management',
    name: 'positionManagement',
    component: () => import(/* webpackChunkName: "positionManagement" */ '@/modules/position-management/Index.vue'),
    children: [
      {
        path: '',
        name: 'positionManagement',
        component: () => import(/* webpackChunkName: "positionManagement" */ '@/modules/position-management/views/Main.vue'),
        meta: {
          permissionRequired: true,
        },
      },
    ],
  },
];

export default routes;
