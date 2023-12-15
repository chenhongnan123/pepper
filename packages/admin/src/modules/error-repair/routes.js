const routes = [
  {
    path: 'error-repair',
    name: 'errorRepair',
    component: () => import(/* webpackChunkName: "errorRepair" */ '@/modules/error-repair/Index.vue'),
    children: [
      {
        path: '',
        name: 'errorRepair',
        component: () => import(/* webpackChunkName: "errorRepair" */ '@/modules/error-repair/views/Main.vue'),
      },
      {
        path: 'partDetail/:id/:page',
        name: 'errorRepairPartDetail',
        component: () => import(/* webpackChunkName: "errorRepair" */ '@/modules/error-repair/views/ErrorRepairPartDetail.vue'),
      },
    ],
  },
];

export default routes;
