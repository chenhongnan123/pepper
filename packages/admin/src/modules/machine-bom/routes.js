const routes = [
  {
    path: 'machine-bom',
    name: 'machineBom',
    component: () => import(/* webpackChunkName: "machineBom" */ '@/modules/machine-bom/Index.vue'),
    children: [
      {
        path: '',
        name: 'machineBom',
        component: () => import(/* webpackChunkName: "machineBom" */ '@/modules/machine-bom/views/Main.vue'),
      },
      {
        path: 'detail/:id/:name',
        name: 'machineBomDetail',
        component: () => import(/* webpackChunkName: "machineBom" */ '@/modules/machine-bom/views/Detail.vue'),
      },
      {
        path: 'partDetail/:id/:page/:machineId/:machineName',
        name: 'bomPartDetail',
        component: () => import(/* webpackChunkName: "machineBom" */ '@/modules/machine-bom/views/BomPartDetail.vue'),
      },
    ],
  },
];

export default routes;
