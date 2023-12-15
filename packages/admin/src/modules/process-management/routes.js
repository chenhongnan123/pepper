const routes = [
  {
    path: 'process-management',
    name: 'processManagement',
    meta: {
      permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "processManagement" */ '@/modules/process-management/Index.vue'),
    children: [
      {
        path: '',
        name: 'processManagement',
        component: () => import(/* webpackChunkName: "processManagement" */ '@/modules/process-management/views/Main.vue'),
      },
    ],
  },
];

export default routes;
