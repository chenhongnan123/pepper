const routes = [
  {
    path: 'machine-type',
    name: 'machineType',
    meta: {
      permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "machineType" */ '@/modules/machine-type/Index.vue'),
    children: [
      {
        path: '',
        name: 'machineType',
        component: () => import(/* webpackChunkName: "machineType" */ '@/modules/machine-type/views/Main.vue'),
      },
    ],
  },
];

export default routes;
