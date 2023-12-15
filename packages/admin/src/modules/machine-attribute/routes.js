const routes = [
  {
    path: 'machine-attribute',
    name: 'machineAttribute',
    meta: {
      permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "machineAttribute" */ '@/modules/machine-attribute/Index.vue'),
    children: [
      {
        path: '',
        name: 'machineAttribute',
        component: () => import(/* webpackChunkName: "machineAttribute" */ '@/modules/machine-attribute/views/Main.vue'),
      },
    ],
  },
];

export default routes;
