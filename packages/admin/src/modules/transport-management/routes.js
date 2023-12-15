const routes = [
  {
    path: 'transport-management',
    name: 'transportManagement',
    meta: {
      permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "transportManagement" */ '@/modules/transport-management/Index.vue'),
    children: [
      {
        path: '',
        name: 'transportManagement',
        component: () => import(/* webpackChunkName: "transportManagement" */ '@/modules/transport-management/views/Main.vue'),
      },
      {
        path: 'detail',
        name: 'transportDetail',
        component: () => import(/* webpackChunkName: "transportDetail" */ '@/modules/transport-management/views/Detail.vue'),
      },
    ],
  },
];

export default routes;
