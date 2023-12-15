const routes = [
  {
    path: 'machine-transfer',
    name: 'machineTransfer',
    meta: {
      permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "machineTransfer" */ '@/modules/machine-transfer/Index.vue'),
    children: [
      {
        path: '',
        name: 'machineTransfer',
        component: () => import('./views/Main.vue'),
      },
      {
        path: 'add',
        name: 'addMachineTransfer',
        component: () => import('./views/AddMachineTransfer.vue'),
      },
    ],
  },
];

export default routes;
