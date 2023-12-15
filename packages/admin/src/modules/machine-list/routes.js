const routes = [
  {
    path: 'machine-list',
    name: 'machineList',
    component: () => import(/* webpackChunkName: "machineList" */ '@/modules/machine-list/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'machineList',
        component: () => import(/* webpackChunkName: "machineList" */ '@/modules/machine-list/views/Main.vue'),
      },
      {
        // path: 'detail/:deviceId/:typeId',
        path: 'detail',
        name: 'machineDetail',
        component: () => import(/* webpackChunkName: "machineDetail" */ '@/modules/machine-list/views/Detail.vue'),
      },
    ],
  },
];

export default routes;
